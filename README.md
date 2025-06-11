# Plant Disease Identifier

A web application that uses AI to identify plant diseases from leaf images, with automatic upload to GitHub for storage.

## Features

- 📸 Upload leaf images for analysis
- 🤖 AI-powered disease identification using OpenAI's GPT-4 Vision
- 📊 Confidence scoring and severity assessment
- 💾 Automatic image storage on GitHub
- 🩺 Treatment recommendations
- 📱 Responsive design

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# OpenAI API Key for AI analysis
OPENAI_API_KEY=your_openai_api_key_here

# GitHub configuration for image storage
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=username/repository-name

# Optional: Custom GitHub branch (defaults to 'main')
GITHUB_BRANCH=main
\`\`\`

### 2. GitHub Setup

1. Create a GitHub repository for storing plant images
2. Generate a Personal Access Token with `repo` permissions
3. Add the token and repository name to your environment variables

### 3. OpenAI Setup

1. Sign up for an OpenAI account
2. Generate an API key from the OpenAI dashboard
3. Add the API key to your environment variables

## Usage

1. Visit the application in your browser
2. Click "Upload Leaf Image" and select a clear photo of a plant leaf
3. Click "Analyze Plant Disease" to start the AI analysis
4. View the results including:
   - Disease identification
   - Confidence level
   - Severity assessment
   - Treatment recommendations

## Supported Image Formats

- PNG
- JPG/JPEG
- Maximum file size: 10MB

## API Endpoints

- `POST /api/analyze-plant` - Upload and analyze plant images
- `GET /api/config` - Check environment variable configuration

## Technology Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- OpenAI GPT-4 Vision API
- GitHub API for storage
- Shadcn/ui components
