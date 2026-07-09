# TeamPulse — Weekly Report Generator & Team Dashboard

This repository contains the source code for the "Weekly Report Generator & Team Dashboard" technical assignment for Sisenco Digital (Pvt) Ltd. 

TeamPulse is a comprehensive, full-stack application that enables team members to submit weekly progress reports and managers to gain actionable insights into team productivity through an interactive dashboard.

## Tech Stack

* **Backend:** Spring Boot 3, Java 21, PostgreSQL, JWT Authentication, Spring Data JPA.
* **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Recharts, Lucide React, Axios.
* **AI Integration:** OpenAI API (GPT-4o-mini) via Spring WebClient/RestClient.

## Prerequisites

* Java 17 or higher
* Node.js v18 or higher
* PostgreSQL database

## Setup Instructions

### 1. Database Configuration
Create a PostgreSQL database named `report_app`. The application uses Flyway for migrations, so tables will be created automatically on startup.

### 2. Backend Setup
Navigate to the `backend` directory.

You must set the OpenAI API Key as an environment variable for the AI features to work.
```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="your-api-key-here"

# Mac/Linux
export OPENAI_API_KEY="your-api-key-here"
```

Start the Spring Boot application using Maven:
```bash
./mvnw spring-boot:run
```
The backend will be available at `http://localhost:8080`. API documentation (Swagger) is available at `http://localhost:8080/swagger-ui/index.html`.

### 3. Frontend Setup
Navigate to the `report-app-frontend` directory.

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## Features
* **Role-Based Access Control:** Secure JWT authentication for `MEMBER` and `MANAGER` roles. Route protection is handled seamlessly via Next.js middleware.
* **Member Portal:** Dedicated workflows for members to draft, edit, and submit weekly reports (tasks completed, blockers, hours worked).
* **Manager Dashboard:** Real-time analytics, compliance rate tracking, hours-by-project bar charts, and a team activity feed.
* **AI Assistant:** An integrated GPT-4o-mini chatbot for managers to query team productivity and report insights.
* **Premium UI/UX:** A stunning interface built entirely from scratch with raw Tailwind v4 (glassmorphism, vibrant dark mode, and micro-animations).

## Deliverables
- **ER Diagram:** Included in the presentation / documentation.
- **Video Demo:** [Insert Google Drive Link Here]
- **Presentation:** [Insert Google Slides Link Here]
