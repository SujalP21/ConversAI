# ConversAI

A full-stack ChatGPT-style web app built with React + Express + MongoDB + OpenAI.

## Overview

This project has two apps:

- `Frontend/`: React UI for chat, thread history, thread switching, and deleting chats.
- `Backend/`: Express API that stores chats in MongoDB and generates assistant replies using OpenAI.

## Tech Stack

- Frontend: React, CSS
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB
- AI: OpenAI (`gpt-5-mini`)

## Project Structure

```text
GPT/
	Backend/
		models/
			Thread.js
		routes/
			chat.js
		utils/
			openai.js
		server.js
		package.json
	Frontend/
		src/
			App.jsx
			Sidebar.jsx
			ChatWindow.jsx
			Chat.jsx
			MyContext.jsx
		index.html
		package.json
	README.md
```

## Features

- Create a new chat thread automatically on first message
- Persist threads and messages in MongoDB
- View all threads in sidebar
- Re-open an old thread and load full message history
- Delete thread from sidebar
- Markdown and code-block rendering for assistant replies
- Typing-like reveal animation for latest assistant response

## Environment Variables

Create `Backend/.env` with:

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
```

Notes:

- Use a MongoDB Atlas connection string in `MONGODB_URI`.
- If your DB password contains special characters (`@`, `#`, `%`, `:`), URL-encode it.
- Do not commit real secrets.

## Installation

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

## Run Locally

Start backend:

```bash
cd Backend
node server.js
```

Start frontend:

```bash
cd Frontend
npm run dev
```

Then open the URL shown by Vite (typically `http://localhost:5173`).

Backend runs on `http://localhost:8080`.

## API Reference

Base URL: `http://localhost:8080/api`

### POST `/chat`

Send a message and get assistant reply. Creates thread if missing.

Request body:

```json
{
	"threadId": "uuid-string",
	"message": "Explain quicksort in simple terms"
}
```

Response:

```json
{
	"reply": "...assistant text..."
}
```

### GET `/thread`

Fetch all threads sorted by latest `updatedAt`.

### GET `/thread/:threadId`

Fetch messages for one thread.

### DELETE `/thread/:threadId`

Delete one thread.

### POST `/test`

Dev test route that inserts a sample thread document.

## Data Model

`Thread` document:

- `threadId` (unique string)
- `title` (string)
- `messages` (array)
	- `role`: `user` or `assistant`
	- `content`: string
	- `timestamp`: date
- `createdAt`
- `updatedAt`

## Troubleshooting

### MongoDB Atlas connection failure

If you get `MongooseServerSelectionError`:

1. Add your current public IP in Atlas `Network Access`.
2. Verify DB user/password in Atlas `Database Access`.
3. Verify `MONGODB_URI` is correct.

For quick dev testing only, you can temporarily allow `0.0.0.0/0` in Atlas.

### Backend starts but DB is not connected

Current backend logs DB connection errors to terminal. Confirm `.env` is loaded in `Backend/` and `MONGODB_URI` is valid.

### Frontend cannot reach backend

Ensure backend is running on port `8080` and frontend is using `http://localhost:8080/api/...` URLs.

## Current Limitations

- Frontend API URLs are hardcoded to `http://localhost:8080`.
- No auth/session management.
- No streaming responses from OpenAI.
- No production deployment config yet.

## Author

Built by Sujal Pareek.
