"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set in the environment variables. Some features may not work.")
}

// Create a function to get the OpenAI model
const getOpenAIModel = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in the environment variables.")
    throw new Error("OPENAI_API_KEY is not set. Please set it in your environment variables or .env.local file.")
  }

  try {
    // Using the model without additional settings
    return openai("gpt-3.5-turbo-instruct")
  } catch (error) {
    console.error("Error initializing OpenAI model:", error)
    throw new Error("Failed to initialize OpenAI model. Please check your API key and try again.")
  }
}

export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const model = getOpenAIModel()
    const result = await generateText({
      model,
      prompt: "This is a test prompt.",
    })
    return true
  } catch (error) {
    console.error("Error testing OpenAI connection:", error)
    return false
  }
}

export async function classifyProduct(description: string, country: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Classification feature is unavailable.")
  }

  const prompt = `Given the following product description and country of origin, determine the most accurate 10-digit HTS code (Harmonized Tariff Schedule of the United States - HTSUS) based on the latest U.S. tariff classification database. Provide ONLY the 10-digit HTS code as the response, with no additional text or explanation.

Product Description: ${description}
Country of Origin: ${country}`

  try {
    const model = getOpenAIModel()
    console.log("Sending request to OpenAI with prompt:", prompt)
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 20,
    })

    console.log("Received response from OpenAI:", text)
    const htsCode = text.trim().replace(/\./g, "")
    if (!/^\d{10}$/.test(htsCode)) {
      throw new Error(`No valid 10-digit HTS code found in the response. Received: ${text}`)
    }
    return htsCode
  } catch (error) {
    console.error("Error in classifyProduct:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to classify product: ${error.message}`)
    } else {
      throw new Error("An unexpected error occurred during classification.")
    }
  }
}

export async function calculateDutyRate(htsCode: string, country: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Duty rate calculation feature is unavailable.")
  }

  const prompt = `Calculate the total applicable U.S. import duty rate for importing a product into the United States of America with the following details:

Input:
- HTS Code: ${htsCode}
- Country of Origin: ${country}

Instructions:
1. Use the most recent Harmonized Tariff Schedule of the United States (HTSUS) data.
2. Determine the general ad valorem duty rate for the given HTS code for imports into the USA.
3. Consider the Country of Origin and identify any applicable:
   - Preferential duty rates (e.g., free trade agreements)
   - Special tariffs
   - Anti-dumping duties
   - Countervailing duties
   - Section 301 tariffs (especially for China)
   - Any other country-specific duties or tariffs that apply to imports from ${country} to the USA
4. Sum up the general duty rate and all applicable additional duties.
5. Provide the TOTAL combined duty rate as a single percentage for importing this product from ${country} into the USA.

Required format:
[X.X]%

IMPORTANT: Your response must ONLY contain a single percentage value followed by the % symbol, representing the total combined duty rate. If duty-free, respond with 0%. Do not include any additional text, explanations, or breakdowns of the calculation.`

  try {
    const model = getOpenAIModel()
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 50,
    })

    const percentageMatch = text.match(/(\d+(\.\d+)?%)/)
    if (percentageMatch) {
      return percentageMatch[0]
    } else {
      throw new Error("No valid percentage found in the response")
    }
  } catch (error) {
    console.error("Error in calculateDutyRate:", error)
    throw new Error("Failed to calculate duty rate. Please try again later.")
  }
}

