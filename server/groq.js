import Groq from "groq-sdk";

// Load the API key from an environment variable
const apiKey = "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";

if (!apiKey) {
  console.error(
    "API key is not set. Please set GROQ_API_KEY in your environment variables.",
  );
  process.exit(1);
}

const groq = new Groq({ apiKey });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

// Run the main function
main().catch((error) => {
  console.error("Error:", error);
});
