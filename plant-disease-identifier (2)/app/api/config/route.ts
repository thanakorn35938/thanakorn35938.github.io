import { NextResponse } from "next/server"

export async function GET() {
  // This endpoint can be used to check if environment variables are configured
  const requiredEnvVars = ["GITHUB_TOKEN", "GITHUB_REPO", "OPENAI_API_KEY"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return NextResponse.json(
      {
        configured: false,
        missing: missingVars,
        message: "Please configure the missing environment variables",
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    configured: true,
    message: "All environment variables are configured",
  })
}
