export async function handleApiError(response: Response) {
    if (!response.ok) {
      const errorText = await response.text()
      console.error("API error:", errorText)
      throw new Error("Failed to fetch from API")
    }
  
    const data = await response.json()
  
    if (data.errors) {
      console.error("API errors:", data.errors)
      throw new Error(data.errors[0].message)
    }
  
    return data
  }
  
  