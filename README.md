# Privacy Guard
### Explainable Application Privacy & Permission Analyzer

**Privacy Guard** is a privacy analysis platform designed to identify potentially risky Android application permissions and inconsistencies between declared permissions and privacy policies.

It analyzes an Android application's `AndroidManifest.xml` alongside its privacy policy text to help users understand what information an application may access, identify potential privacy concerns, and make more informed decisions.

---

## Project Overview

Mobile applications often request permissions that may expose sensitive user information, including contacts, location, camera, microphone, and messages.

Understanding whether these permissions are necessary is not always easy for ordinary users.

Privacy Guard aims to simplify this process by providing an explainable analysis of:

- Android application permissions.
- Sensitive data access.
- Privacy policy statements.
- Permission-policy inconsistencies.
- Potential security and privacy concerns.

The goal is not simply to detect permissions, but to explain **why a permission may be risky and what users should investigate.**

## Key Features

### 1. Android Permission Analysis
- Parses Android `AndroidManifest.xml`.
- Identifies declared application permissions.
- Categorizes permissions according to their privacy sensitivity.
- Highlights potentially unnecessary permissions.

### 2. Privacy Policy Analysis
- Accepts plain-text privacy policies.
- Identifies important data collection and sharing statements.
- Examines statements about sensitive user information.
- Highlights potentially concerning privacy practices.

### 3. Permission & Policy Comparison
- Compares declared Android permissions with privacy policy statements.
- Detects potential inconsistencies.
- Highlights permissions that appear unrelated to the application's stated purpose.
- Provides understandable explanations of identified concerns.

### 4. Explainable Risk Assessment
- Identifies potential privacy and security risks.
- Provides explanations for flagged permissions.
- Offers recommendations for improving privacy awareness.
- Helps users understand the analysis rather than relying only on a numerical score.

### 5. Web-Based Interface
- Dark-themed interface.
- Application name input.
- AndroidManifest XML input.
- Privacy policy text input.
- Integrated analysis workflow.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and backend framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Interface styling |
| PostgreSQL | Database |
| Drizzle ORM | Database interaction |
| OpenAI API | AI-powered analysis |
| Vercel | Deployment |

---

## Project Architecture

```text
Privacy Guard
│
├── Frontend
│   ├── Application Input
│   ├── Manifest Input
│   ├── Privacy Policy Input
│   └── Analysis Results
│
├── Backend
│   ├── Manifest Processing
│   ├── Permission Analysis
│   ├── Privacy Policy Analysis
│   └── Risk Assessment
│
├── AI Analysis
│   ├── Policy Interpretation
│   ├── Permission-Policy Comparison
│   └── Explainable Recommendations
│
└── Database
    └── PostgreSQL
```

---

## Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- Git
- A PostgreSQL database
- An OpenAI API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd Privacy-Guard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root directory.

```env
DATABASE_URL="your_postgresql_connection_string"

OPENAI_API_KEY="your_openai_api_key"
```

Replace the placeholder values with your actual credentials.

**Important:** Never commit `.env.local` or expose your API keys in a public repository.

### 5. Configure the database

Set up your PostgreSQL database and apply the Drizzle migrations required by the project.

Check the available database scripts in `package.json` before running migrations.

### 6. Start the development server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

---

## How to Use

1. Open the Privacy Guard website.
2. Enter the Android application's name.
3. Paste its `AndroidManifest.xml` content.
4. Paste the application's privacy policy text.
5. Click **Analyze Risk**.
6. Review the detected permissions and privacy concerns.
7. Examine the explanations and recommendations.

---

## Testing

Privacy Guard can be tested using different Android application scenarios:

| Test Scenario | Purpose |
|---|---|
| Calculator Application | Test low-risk permissions |
| Photo Editor | Test feature-related permissions |
| Weather Application | Test location permissions |
| Flashlight Application | Test permission-policy mismatches |
| Message Backup Utility | Test sensitive permissions |
| Network-Based Application | Test network security concerns |
| Offline Application | Test minimal permissions |
| Invalid XML | Test input validation and error handling |

---

## Security & Privacy Considerations

- API keys must remain on the server side.
- Environment variables must not be exposed to the frontend.
- Database credentials must never be committed to GitHub.
- User-provided XML and policy text should be validated.
- AI-generated findings should be treated as assessments, not definitive security verdicts.

**Important limitation:** A permission declared in an Android manifest does not prove that the application actually uses that permission at runtime. A complete security assessment may require APK inspection, source-code analysis, and runtime testing.

---

## Deployment

Privacy Guard can be deployed using [Vercel](https://vercel.com/).

Deployment requirements:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure `DATABASE_URL` and `OPENAI_API_KEY` in Vercel Environment Variables.
4. Ensure the production database is accessible.
5. Apply the required
