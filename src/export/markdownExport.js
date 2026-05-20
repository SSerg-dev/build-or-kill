const sectionMap = [
  ["Key Strengths", "key_strengths"],
  ["Key Risks", "key_risks"],
  ["MVP Scope", "mvp_scope"],
  ["Validation Experiments", "validation_experiments"],
  ["Recommended Next Actions", "recommended_next_actions"]
];

export function resultToMarkdown(result) {
  const lines = [
    "# Build or Kill Result",
    "",
    `## Verdict: ${result.verdict}`,
    "",
    `**Confidence:** ${result.confidence_score}/100`,
    "",
    `**Reason:** ${result.verdict_reason}`,
    "",
    "## Role Analyses",
    ""
  ];

  for (const role of result.role_analyses || []) {
    lines.push(`### ${role.role}`, "");
    lines.push(`**Focus:** ${role.focus}`, "");
    for (const bullet of role.bullets || []) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  for (const [title, key] of sectionMap) {
    lines.push(`## ${title}`, "");
    for (const item of result[key] || []) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  lines.push("## Advisory Disclaimer", "", result.advisory_disclaimer || "");

  return lines.join("\n").trim() + "\n";
}
