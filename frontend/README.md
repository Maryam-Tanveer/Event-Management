# LuxeEvents 🎭

A full-stack event management platform built with React, Node.js, MongoDB Atlas, Stripe, and Cloudinary.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express 5, JWT Auth |
| Database | MongoDB Atlas (Mongoose) |
| Payments | Stripe |
| Image Upload | Cloudinary |
| Email | Nodemailer (Gmail) |

---

## 🚀 Local Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd Event_Management
```

### 2. Backend Setup
```bash
cd backend
npm install

# .env file banao
cp .env.example .env
# .env mein apni real values daalo (MongoDB, Cloudinary, Stripe, etc.)

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# .env file banao
cp .env.example .env
# REACT_APP_STRIPE_PUBLIC_KEY apni Stripe Publishable Key se replace karo

npm start
# App runs on http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string (64+ chars) |
| `FRONTEND_URL` | Frontend URL (for CORS) |
| `NODE_ENV` | `development` or `production` |
| `EMAIL_USER` | Gmail address |
| `EMAIL_PASS` | Gmail App Password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `REACT_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key |

---

## 📦 Features

- ✅ User Authentication (Register, Login, JWT)
- ✅ Forgot/Reset Password (Email)
- ✅ Create & Manage Events
- ✅ Image Upload (Cloudinary)
- ✅ Ticket Booking
- ✅ Stripe Payment Integration
- ✅ Promo Codes
- ✅ QR Code for Tickets
- ✅ My Events Dashboard
- ✅ Profile Management
- ✅ Rate Limiting & Security Headers

---

## 🌐 Deployment

### Backend → Railway / Render
1. Push backend code to GitHub
2. Railway/Render pe new service banao
3. Environment variables set karo (sab .env variables)
4. `npm start` command set karo

### Frontend → Vercel / Netlify
1. Push frontend code to GitHub
2. Vercel/Netlify pe import karo
3. `REACT_APP_STRIPE_PUBLIC_KEY` environment variable set karo
4. Build command: `npm run build`
5. Output directory: `build`

> ⚠️ Production mein backend `.env` mein `NODE_ENV=production` aur `FRONTEND_URL=https://yourdomain.com` set karna na bhulen.

---

## 🔑 Third-party Setup

### Cloudinary (Image Upload)
1. [cloudinary.com](https://cloudinary.com) pe free account banao
2. Dashboard pe jaao → Cloud Name, API Key, API Secret copy karo
3. `.env` mein paste karo

### Stripe (Payments)
1. [dashboard.stripe.com](https://dashboard.stripe.com) pe account banao
2. Developers → API Keys → Secret Key & Publishable Key copy karo
3. Backend `.env` mein Secret Key, Frontend `.env` mein Publishable Key daalo

### Gmail App Password (Emails)
1. Gmail → Google Account → Security → 2-Step Verification ON karo
2. Security → App Passwords → Mail → Generate
3. 16-char password `.env` mein `EMAIL_PASS` mein daalo (bina spaces ke)
