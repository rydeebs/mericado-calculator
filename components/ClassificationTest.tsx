"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Classification {
  hsCode: string
  description: string
  confidence: number
}

export default function ClassificationTest() {
  const [description, setDescription] = useState("")
  const [result, setResult] = useState<Classification | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTest = async () => {
    if (!description.trim()) {
      setError("Product description is required")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to classify product")
      }

      setResult(data.classification)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test Product Classification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Product Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="mt-1"
            />
          </div>
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? "Classifying..." : "Test Classification"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-2">
                <div>
                  <p className="font-bold">HS Code: {result.hsCode}</p>
                  <p className="text-sm text-gray-600">Confidence: {Math.round(result.confidence * 100)}%</p>
                </div>
                <div>
                  <p className="font-semibold">Description:</p>
                  <p className="text-sm">{result.description}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

