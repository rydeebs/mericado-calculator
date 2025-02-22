import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { htsCode, country } = req.body

  if (!htsCode || !country) {
    return res.status(400).json({ error: "Missing required parameters" })
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not configured" })
  }

  try {
    const model = openai("gpt-4", {
      apiKey: OPENAI_API_KEY,
    })

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

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 50,
    })

    const percentageMatch = text.match(/(\d+(\.\d+)?%)/)
    if (percentageMatch) {
      return res.status(200).json({ dutyRate: percentageMatch[0] })
    } else {
      return res.status(500).json({ error: "Unable to calculate duty rate" })
    }
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ error: "An error occurred while calculating the duty rate" })
  }
}

