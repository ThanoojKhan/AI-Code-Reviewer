const responseSchema = {
  summary: 'string',
  bugs: [{ line: 'number', description: 'string' }],
  performance: [{ suggestion: 'string' }],
  security: [{ issue: 'string' }],
};

export const buildReviewPrompt = ({ language, code, maxIssues = 5, retry = false }) => {
  const retryInstruction = retry
    ? 'Your previous response could not be parsed. Return only strict JSON with double-quoted keys and strings, no markdown, no trailing commas, and all required keys.'
    : 'Return only strict JSON with double-quoted keys and strings, no markdown, and no commentary.';

  return `You are a senior software reviewer focused on bugs, performance, and security.\nAnalyze the provided ${language} code and produce a concise, actionable review.\n${retryInstruction}\n\nConstraints:\n- Use this exact JSON schema: ${JSON.stringify(responseSchema)}\n- Keep arrays empty when there are no findings.\n- Report at most ${maxIssues} bug findings.\n- Line numbers should be 1-based and refer to the submitted code when possible.\n- Summary must be 1 to 3 sentences.\n- Do not include fields outside the schema.\n- Output exactly one JSON object.\n\nSource code (${language}):\n\"\"\"\n${code}\n\"\"\"`;
};
