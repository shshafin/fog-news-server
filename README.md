# Fog News — API Server

TypeScript Express API that powers Fog News: articles and categories, e-paper, jobs and applications, media blocks, auth, and supporting content modules backed by MongoDB.

| | |
| --- | --- |
| **Client repo** | [fog-news-client](https://github.com/shshafin/fog-news-client) |
| **Client demo** | [fog-news-client.vercel.app](https://fog-news-client.vercel.app) |
| **Portfolio** | [shafinsadnan.com](https://shafinsadnan.com) |

---

## What this repo is

A modular REST backend for a news product. Routes and domain modules live under `src/app/modules` with central registration in `src/app/routes`.

## Core modules

- News, categories, comments, and polls
- E-paper
- Jobs and job applications
- Video / multimedia blocks
- Auth and users
- Newsletter, advertisements, donations, quizzes, settings, and social media helpers

## Tech stack

- **Node.js** + **TypeScript**
- **Express**
- **MongoDB** / Mongoose
- JWT auth helpers, multer uploads, Winston logging
- Dotenv-based configuration

## Run locally

Prerequisites: Node.js and a MongoDB instance.

```bash
git clone https://github.com/shshafin/fog-news-server.git
cd fog-news-server
npm install
```

Create a `.env` with the variables your local setup needs (MongoDB URI, JWT secret, mail/upload settings as required). **Do not commit secrets.**

```bash
npm run dev
```

Production-style run:

```bash
npm run build
npm start
```

## Related

- Frontend: https://github.com/shshafin/fog-news-client
- Live client demo: https://fog-news-client.vercel.app
- Portfolio: https://shafinsadnan.com
