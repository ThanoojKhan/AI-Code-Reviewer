const GEMINI_FLASH_PRICING = {
  promptPer1kTokens: 0.000075,
  completionPer1kTokens: 0.0003,
};

const roundCurrency = (value) => Number(value.toFixed(6));

export const estimateReviewCost = ({ promptTokens = 0, completionTokens = 0 }) => {
  const promptCost = (promptTokens / 1000) * GEMINI_FLASH_PRICING.promptPer1kTokens;
  const completionCost = (completionTokens / 1000) * GEMINI_FLASH_PRICING.completionPer1kTokens;
  const totalCost = promptCost + completionCost;

  return {
    promptCostUsd: roundCurrency(promptCost),
    completionCostUsd: roundCurrency(completionCost),
    totalCostUsd: roundCurrency(totalCost),
  };
};
