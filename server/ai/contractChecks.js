import { readFile } from "node:fs/promises";
import { analyzeWithMock } from "./mockAdvisor.js";
import { detectForbiddenClaims, validateAdvisorResult } from "./schemas.js";

const fixtures = JSON.parse(await readFile("evals/fixtures.json", "utf8"));
let failures = 0;

for (const fixture of fixtures) {
  const result = analyzeWithMock({
    input: fixture.input,
    forceFinal: fixture.expected_result_type === "final_result"
  });
  const validation = validateAdvisorResult(result);
  const forbidden = detectForbiddenClaims(result);
  const routeMatches = result.result_type === fixture.expected_result_type;

  if (!validation.valid || forbidden || !routeMatches) {
    failures += 1;
    console.error(`FAIL ${fixture.id}`);
    if (!routeMatches) console.error(`  expected ${fixture.expected_result_type}, got ${result.result_type}`);
    if (!validation.valid) console.error(`  schema: ${validation.message}`);
    if (forbidden) console.error(`  forbidden: ${forbidden}`);
  } else {
    console.log(`PASS ${fixture.id}: ${result.result_type}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`PASS ${fixtures.length} mock contract fixtures`);
}
