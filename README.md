# ConversAI

A full-stack ChatGPT-style web app built with React + Express + MongoDB + OpenAI.

## Overview

This project has two apps:

- `Frontend/`: React UI for authentication, chat, thread history, thread switching, deleting chats, and theme switching.
- `Backend/`: Express API with JWT authentication, user-specific thread storage, and OpenAI reply generation.

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
			User.js
		middleware/
			auth.js
		routes/
			auth.js
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
- Register and login with email/password
- Token-based session persistence in frontend (`localStorage`)
- Persist threads and messages in MongoDB
- Scope all threads to the authenticated user
- Dark/Light theme toggle from profile dropdown `Settings`
- Theme preference persistence in frontend (`localStorage`)
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
JWT_SECRET=your_strong_jwt_secret
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

Theme switch path: profile icon -> `Settings` -> choose `Dark` or `Light`.

## API Reference

Base URL: `http://localhost:8080/api`

### POST `/auth/register`

Create a user account.

### POST `/auth/login`

Login and get JWT token.

### GET `/auth/me`

Get currently logged-in user profile.

Requires header:

```text
Authorization: Bearer <token>
```

### POST `/chat`

Send a message and get assistant reply. Creates thread if missing.

Requires header:

```text
Authorization: Bearer <token>
```

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

Requires header: `Authorization: Bearer <token>`

### GET `/thread/:threadId`

Fetch messages for one thread.

Requires header: `Authorization: Bearer <token>`

### DELETE `/thread/:threadId`

Delete one thread.

Requires header: `Authorization: Bearer <token>`

### POST `/test`

Dev test route that inserts a sample thread document.

## Data Model

`Thread` document:

- `userId` (owner user id)
- `threadId` (unique per user)
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

- Frontend API base URL defaults to `http://localhost:8080` unless `VITE_API_BASE_URL` is set.
- No streaming responses from OpenAI.
- No production deployment config yet.

## Author

Built by Sujal Pareek.
