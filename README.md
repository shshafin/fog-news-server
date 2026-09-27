# Fog News Server

A TypeScript Express backend powering a digital news platform with content management, auth, and supporting modules.

## Overview

This API supports the full news product ecosystem, including:
- articles and categories
- comments and polls
- e-paper sections
- jobs and applications
- multimedia blocks
- newsletters and settings
- user authentication and profiles
- payment and subscription-related flows

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Bcrypt
- Multer + Cloudinary
- Nodemailer
- Stripe
- Winston logger
- Node-cron

## Features

- modular backend structure
- production-ready validation and error handling
- secure auth flows
- media upload support
- scheduled background tasks
- organized logging and monitoring

## Run Locally

```bash
git clone https://github.com/shshafin/fog-news-server.git
cd fog-news-server
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint:check
npm run lint:fix
npm run prettier:fix
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Related

- Client: https://github.com/shshafin/fog-news-client
- Portfolio: https://shafinsadnan.com

## Author

Shafin Sadnan

GitHub: https://github.com/shshafin
