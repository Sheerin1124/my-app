# AI Meeting-to-Action Intelligence Agent

An AI-powered meeting assistant that converts meeting transcripts or uploaded meeting recordings into structured, actionable information.

The application is designed to help users quickly understand what happened during a meeting by extracting:

* 📝 Meeting Summary
* ✅ Key Decisions
* 📌 Action Items

## 🚀 Features

### 1. Paste Meeting Transcript

Users can paste a meeting transcript into the application.

### 2. Upload Meeting Recording

Users can upload a meeting video or audio file.

Supported input types:

* Video files
* Audio files

### 3. Meeting Analysis

Clicking **Analyze Meeting** processes the provided meeting input.

> **Current status:** The AI/backend is not connected yet. The application currently displays test data after a short loading period.

### 4. Structured Results

The interface displays the analysis in three sections:

#### Summary

Provides a short overview of the meeting.

#### Key Decisions

Displays important decisions made during the meeting.

#### Action Items

Displays tasks that need to be completed.

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **React Hooks**

## 📁 Project Structure

```text
project/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

You can check your versions with:

```bash
node --version
npm --version
```

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd <your-project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🖥️ How to Use

### Transcript Mode

1. Open the application.
2. Select **Paste Transcript**.
3. Paste your meeting transcript.
4. Click **Analyze Meeting**.
5. The application will display the summary, decisions, and action items.

### Video/Audio Mode

1. Select **Upload Meeting Video**.
2. Choose a video or audio file.
3. Click **Analyze Meeting**.
4. The selected file is currently accepted by the frontend, but actual transcription and AI processing still need to be implemented.

## 🔌 Backend Integration

The current frontend uses mock data:

```text
Meeting Input
     ↓
Analyze Meeting
     ↓
Mock Processing
     ↓
Summary
Decisions
Action Items
```

The planned architecture is:

```text
Meeting Transcript / Video
            ↓
     Speech-to-Text
            ↓
        AI Model
            ↓
   Structured JSON Result
            ↓
         Frontend
            ↓
 ┌──────────┼──────────┐
 ↓          ↓          ↓
Summary  Decisions  Action Items
```

A future backend API could return data in a structure such as:

```json
{
  "summary": "The team discussed the upcoming product launch.",
  "decisions": [
    "Launch date will be finalized this week.",
    "Marketing will prepare the campaign."
  ],
  "actionItems": [
    "Prepare the marketing campaign",
    "Finalize the launch date"
  ]
}
```

## 🔮 Future Improvements

Possible future features include:

* AI-powered transcript summarization
* Automatic audio/video transcription
* Speaker identification
* Action-item owner detection
* Due-date extraction
* Meeting topic extraction
* Priority detection
* Export results as PDF
* Download meeting notes
* Search through previous meetings
* Meeting history
* Calendar integration
* Email/Slack notifications
* Authentication and user accounts
* Persistent database storage

## 🎯 Project Goal

The goal of this project is to transform unstructured meeting conversations into useful, structured information.

Instead of manually reviewing an entire meeting, users should be able to quickly see:

> **What was discussed?**

> **What was decided?**

> **What needs to be done next?**

## 📌 Current Limitations

This is currently a frontend prototype.

The following functionality has not yet been connected:

* Backend API
* Real AI model
* Speech-to-text processing
* Video/audio processing
* Database
* User authentication
* Persistent meeting storage

The application currently uses test data to demonstrate the user interface and workflow.

## 📄 License

This project is available for educational and development purposes. Add your preferred license here before publishing the project publicly.
