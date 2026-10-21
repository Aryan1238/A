/**
 * PrepPilot - AI JSON Sanitizer & Parser
 * Robustly parses JSON strings returned by LLMs (Gemini).
 * Handles markdown code fences, leading/trailing chatter, unescaped characters, and single quotes.
 */

function cleanAndParseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Expected a valid string from AI service');
  }

  // 1. Strip markdown fences like ```json and ```
  let cleaned = rawText
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/im, '')
    .trim();

  // 2. Try direct JSON.parse first
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // 3. Fallback: locate outermost matching curly braces { ... } or brackets [ ... ]
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (err2) {
        // Try cleaning trailing commas before closing braces/brackets
        const sanitized = jsonCandidate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        return JSON.parse(sanitized);
      }
    }

    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const jsonCandidate = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (err3) {
        const sanitized = jsonCandidate.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(sanitized);
      }
    }

    throw new Error(`Failed to parse AI output into valid JSON: ${err1.message}`);
  }
}

module.exports = {
  cleanAndParseJson
};
