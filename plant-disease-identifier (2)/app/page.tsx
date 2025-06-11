"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Leaf, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AnalysisResult {
  analysis: string
  imageUrl?: string
  uploadedAt?: string
}

export default function PlantDiseaseIdentifier() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("image", selectedFile)

      // Upload to GitHub and analyze
      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const analysisResult = await response.json()
      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">Plant Disease Identifier</h1>
          </div>
          <p className="text-lg text-gray-600">Upload a leaf image to identify plant diseases using AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Leaf Image
              </CardTitle>
              <CardDescription>Select a clear image of a plant leaf for disease analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </label>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}

              <Button onClick={handleUploadAndAnalyze} disabled={!selectedFile || isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Plant Disease"
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Analysis Results
              </CardTitle>
              <CardDescription>AI-powered plant disease identification results</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{result.analysis}</div>
                    </div>
                  </div>

                  {result.uploadedAt && (
                    <div className="text-xs text-gray-500 text-center">
                      Analysis completed on {new Date(result.uploadedAt).toLocaleString()}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setResult(null)
                        setError(null)
                      }}
                    >
                      Analyze Another Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Leaf className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Upload an image to see analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">1. Upload Image</h3>
                <p className="text-sm text-gray-600">Select a clear photo of the affected leaf</p>
              </div>
              <div>
                <Loader2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">2. AI Analysis</h3>
                <p className="text-sm text-gray-600">Our AI analyzes the image for disease patterns</p>
              </div>
              <div>
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">3. Get Results</h3>
                <p className="text-sm text-gray-600">Receive disease identification and treatment advice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
