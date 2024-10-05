import { GoogleGenerativeAI } from '@google/generative-ai';

// Create the configuration with your API key
const configuration = new GoogleGenerativeAI("AIzaSyBQY5mIxY-LkbSCS2BP1tuhcqg9kW8bJXw"); // Ensure your API key is set in your environment variables
const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });

// These arrays are to maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];

// Preprompt for Gemini
const preprompt = [
  { role: "user", parts: [{ text: "You are a helpful assistant bot named ramani assigned for a platform named AgriCare. You can answer questions by mentoning that, your role is to provide information, and assist with queries and concerns of farmers." }] },
  { role: "user", parts: [{ text: "You are knowledgeable about a wide range of topics related to farming practices and plant diseases." }] },
  { role: "user", parts: [{ text: "You are friendly and approachable, Also person approaching you may be illiterate or so, so consider their partial english too and avoid complex english words. also you should provide you name in conversation only not as in brackets" }] },
];

// Function to call Gemini API
export const callGeminiAPI = async (message) => {
  try {
    // Initialize currentMessages array
    currentMessages.length = 0;

    // Add preprompt to currentMessages array
    currentMessages.push(...preprompt);

    // Restore the previous context
    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", parts: [{ text: inputText }] }); // Each message should be an object with a parts property
      currentMessages.push({ role: "model", parts: [{ text: responseText }] }); // Each message should be an object with a parts property
    }

    // Add the new user message to the currentMessages array
    currentMessages.push({ role: "user", parts: [{ text: message }] });

    // Start a new chat session
    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    // Store the conversation
    conversationContext.push([message, responseText]);
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error('Unable to connect to API');
  }
};