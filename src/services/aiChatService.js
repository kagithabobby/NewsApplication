import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDAc-szncFY8ZF6WFlZysdysHcAYPoNPSg';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response. Please try again later.');
  }
};

export const generateNewsSummary = async (article) => {
  try {
    const prompt = `Please provide a brief summary of this news article in 2-3 sentences: ${article.title}. ${article.description || ''}`;
    return await generateResponse(prompt);
  } catch (error) {
    console.error('Error generating news summary:', error);
    return 'Unable to generate summary at this time.';
  }
}; 