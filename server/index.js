import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { analyzeIdea } from "./ai/advisorClient.js";
import { validateIdeaInput } from "./ai/schemas.js";

const PORT = Number(process.env.PORT || 5173);
const publicRoot = resolve("src");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/analyze") {
      await handleAnalyze(request, response);
      return;
    }

    if (request.method === "GET") {
      await serveStatic(request, response);
      return;
    }

    sendJson(response, 405, { error: "Method not allowed." });
  } catch {
    sendJson(response, 500, { error: "Unexpected server error." });
  }
});

server.listen(PORT, () => {
  console.log(`Build or Kill running at http://localhost:${PORT}`);
});

async function handleAnalyze(request, response) {
  const body = await readJsonBody(request);
  const input = body?.input;
  const clarificationAnswers = Array.isArray(body?.clarificationAnswers)
    ? body.clarificationAnswers
    : [];
  const mode = body?.mode === "final" ? "final" : "initial";
  const validation = validateIdeaInput(input);

  if (!validation.valid) {
    sendJson(response, 400, { error: validation.message });
    return;
  }

  if (mode === "final" && clarificationAnswers.some((answer) => !String(answer || "").trim())) {
    sendJson(response, 400, { error: "Fill every clarification answer before final analysis." });
    return;
  }

  const result = await analyzeIdea({
    input: validation.input,
    clarificationAnswers,
    forceFinal: mode === "final",
    env: process.env
  });

  sendJson(response, 200, result);
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://localhost:${PORT}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(publicRoot, requestedPath));

  if (!filePath.startsWith(publicRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) {
        request.destroy();
        rejectBody(new Error("Request body too large."));
      }
    });
    request.on("end", () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
      } catch {
        rejectBody(new Error("Invalid JSON."));
      }
    });
    request.on("error", rejectBody);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
