import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely. If no key is present, we handle it in the methods.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getDailyCryptoWisdom = async (streak: number): Promise<string> => {
  if (!ai) return "Daily wisdom requires an API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, motivational, and fun "Crypto Fortune Cookie" style quote for a user who has just checked in to their wallet app. 
      Their current check-in streak is (hypothetically) ${streak} days. 
      Keep it under 30 words. No financial advice, just fun vibes about holding, saving, or mooning.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep building your stack, one day at a time!";
  }
};

export const analyzeWalletActivity = async (transactions: Transaction[], balance: number): Promise<string> => {
  if (!ai) return "AI analysis unavailable without API Key.";

  // Simplify data for the prompt to save tokens
  const recentTx = transactions.slice(0, 10).map(t => 
    `${t.type} of ${t.amount} tokens on ${new Date(t.timestamp).toLocaleDateString()}`
  ).join('\n');

  const prompt = `
    You are a witty AI Wallet Assistant.
    Current Balance: ${balance} STX (Simulated).
    Recent Activity:
    ${recentTx}

    Analyze the user's recent behavior in 2 sentences. 
    If they are saving (more deposits/check-ins), praise them. 
    If they are spending (withdrawals), give a playful warning or spending tip.
    Output plain text only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Your wallet looks active! Keep managing your assets wiseley.";
  }
};