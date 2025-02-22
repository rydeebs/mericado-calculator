export async function classifyProduct(description: string, country: string): Promise<string> {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, country }),
    })
  
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to classify product")
    }
  
    const data = await response.json()
    return data.classification.hsCode
  }
  
  