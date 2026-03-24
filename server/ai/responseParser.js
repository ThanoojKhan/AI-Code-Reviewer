const ensureArray = (value) => (Array.isArray(value) ? value : []);

const extractJsonObject = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end < start) {
    return text;
  }

  return text.slice(start, end + 1);
};

export const parseReviewResponse = (rawText) => {
  const trimmed = String(rawText || '').trim();
  const sanitized = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .replace(/^json\s*/i, '')
    .trim();
  const jsonCandidate = extractJsonObject(sanitized);

  let parsed;

  try {
    parsed = JSON.parse(jsonCandidate);
  } catch (error) {
    error.name = 'AIResponseParseError';
    error.rawText = trimmed;
    throw error;
  }

  return {
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    bugs: ensureArray(parsed.bugs)
      .map((item) => ({
        line: Number.isFinite(Number(item?.line)) ? Number(item.line) : null,
        description: typeof item?.description === 'string' ? item.description : '',
      }))
      .filter((item) => item.description),
    performance: ensureArray(parsed.performance)
      .map((item) => ({ suggestion: typeof item?.suggestion === 'string' ? item.suggestion : '' }))
      .filter((item) => item.suggestion),
    security: ensureArray(parsed.security)
      .map((item) => ({ issue: typeof item?.issue === 'string' ? item.issue : '' }))
      .filter((item) => item.issue),
  };
};
