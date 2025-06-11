import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function uploadToGitHub(imageBuffer: Buffer, filename: string) {
  const githubToken = process.env.GITHUB_TOKEN
  const githubRepo = process.env.GITHUB_REPO // format: "username/repository"
  const githubPath = `plant-images/${filename}`

  if (!githubToken || !githubRepo) {
    throw new Error("GitHub configuration missing")
  }

  const base64Content = imageBuffer.toString("base64")

  const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${githubPath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Upload plant image: ${filename}`,
      content: base64Content,
      branch: "main",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to upload to GitHub")
  }

  const result = await response.json()
  return result.content.download_url
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer())

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${image.name}`

    // Upload to GitHub
    const imageUrl = await uploadToGitHub(imageBuffer, filename)

    // Convert image to base64 for AI analysis
    const base64Image = imageBuffer.toString("base64")
    const mimeType = image.type

    // Analyze with AI using generateText for natural text response
    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this plant leaf image for diseases. Please provide a comprehensive analysis including:

1. **Disease Identification**: What disease(s) do you see, if any?
2. **Confidence Level**: How confident are you in this diagnosis?
3. **Severity Assessment**: How severe is the condition?
4. **Symptoms Description**: What specific symptoms are visible?
5. **Treatment Recommendations**: What should be done to treat this condition?
6. **Prevention Tips**: How to prevent this disease in the future?

If the plant appears healthy, please indicate that and provide general care tips. Format your response in a clear, readable manner with proper headings and bullet points where appropriate.`,
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
    })

    // Log the upload for tracking
    console.log(`Image uploaded to GitHub: ${imageUrl}`)
    console.log(`Analysis completed for: ${filename}`)

    return NextResponse.json({
      analysis,
      imageUrl,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
