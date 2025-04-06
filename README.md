# TeachAssist

An AI-powered grading assistant that helps teachers mark student papers efficiently and helps students understand their performance through detailed feedback.

## Features

- Upload marking scheme PDFs for automated key extraction
- Process student answer PDFs against marking schemes
- Automated marking and feedback generation
- Real-time scoring breakdown
- Easy-to-use interface
- Detailed feedback on each answer
- Clear breakdown of marks per question
- Improvement suggestions for students
- Performance analytics and weak area identification

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## For Teachers

1. Upload a marking scheme PDF using the Key Uploader
2. Wait for the key extraction to complete
3. Upload student answer PDFs to get automated marking results
4. Review the generated scores and feedback

## For Students

- Get detailed feedback on your answers
- Understand where marks were lost
- Receive specific improvement suggestions
- Track your progress across assessments
- Identify areas needing more focus

## How to Use

1. Upload a marking scheme PDF using the Key Uploader
2. Wait for the key extraction to complete
3. Upload student answer PDFs to get automated marking results
4. Review the generated scores and feedback
5. Students can view:
   - Question-by-question breakdown
   - Detailed feedback for each answer
   - Suggestions for improvement
   - Overall performance analytics

## Technical Stack

- Next.js 14
- Google Gemini AI
- Firebase