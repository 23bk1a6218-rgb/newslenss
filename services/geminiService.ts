
import { GoogleGenAI, Type as GenAIType } from "@google/genai";
// FIX: Imported InputType to use in the function signature.
import { AnalysisResult, InputType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an advanced AI assistant, "VeriNews", designed to detect fake news.
Analyze the user-provided text based on its type (Headline, Short article, or Long article).
Your analysis must identify markers of misinformation such as sensationalism, emotional language, lack of sources, logical fallacies, and loaded questions.
Provide a clear verdict, a probability score (0-100) of the text being FAKE, and actionable next steps.
The highlights must be direct quotes from the text, and each must have a brief, clear rationale explaining why it's a red flag (e.g., "Sensational Language", "Unverified Claim", "Ad Hominem Attack").
The final verdict must be based on the score: 0-33 is 'Likely Real', 34-66 is 'Possibly False', 67-100 is 'Likely Fake'.
Respond ONLY with a valid JSON object matching the provided schema. Do not add any extra text or commentary.`;

const RESPONSE_SCHEMA = {
  type: GenAIType.OBJECT,
  properties: {
    "score": { "type": GenAIType.NUMBER, "description": "A probability score from 0 to 100 indicating the likelihood of the text being FAKE news. 0 is likely real, 100 is likely fake." },
    "verdict": { "type": GenAIType.STRING, "enum": ["Likely Real", "Possibly False", "Likely Fake"], "description": "The final verdict based on the score." },
    "highlights": {
      "type": GenAIType.ARRAY,
      "items": { 
          "type": GenAIType.OBJECT,
          "properties": {
              "text": { "type": GenAIType.STRING, "description": "A direct quote from the article that is a strong indicator."},
              "rationale": { "type": GenAIType.STRING, "description": "A brief explanation for why this text is an indicator (e.g., 'Sensational Language')."}
          },
          "required": ["text", "rationale"]
      },
      "description": "The top 3 most indicative phrases or sentences from the text that contributed to the verdict."
    },
    "confidence": { "type": GenAIType.NUMBER, "description": "A confidence score between 0.0 and 1.0 representing the model's certainty in its analysis." },
    "summary": { "type": GenAIType.STRING, "description": "A 1-2 sentence summary explaining the reasoning behind the verdict, referencing the highlights." },
    "nextSteps": {
        "type": GenAIType.ARRAY,
        "items": {
            "type": GenAIType.OBJECT,
            "properties": {
                "name": { "type": GenAIType.STRING },
                "url": { "type": GenAIType.STRING }
            },
            "required": ["name", "url"]
        },
        "description": "An array of 2-3 suggested next steps, like links to reputable fact-checking websites (Snopes, PolitiFact, AP Fact Check)."
    }
  },
  required: ["score", "verdict", "highlights", "confidence", "summary", "nextSteps"]
};

// FIX: Updated inputType parameter to use the specific InputType for type safety.
export async function generateAnalysis(newsText: string, inputType: InputType): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `Analyze the following '${inputType}': "${newsText}"` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }
    const resultData = JSON.parse(jsonText);
    
    // Add metadata for history feature
    return {
      ...resultData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      inputText: newsText,
      inputType: inputType,
    };

  } catch (error) {
    console.error("Error in generateAnalysis:", error);
    throw new Error("Failed to generate analysis. The API returned an invalid response.");
  }
}
