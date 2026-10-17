# 🏫 CM HelpHub

> **An AI-Integrated Web-Based Student Assistance and Campus Information System for the College of Maasin**

---

## 👥 Development Team — GROUP 2

* **LAYO, MEGAN**
* **CALAPRE, JOSH**
* **GOZO, ERICK**
* **BAGUMBARAN, JHEHANNIFAH**

**Institution:** College of Maasin  
**Academic Year:** 2026  

---

## 📌 Executive Summary

**CM HelpHub** is a full-stack, AI-enhanced campus information management portal engineered specifically for the students, faculty, and administrative staff of the **College of Maasin**. 

The portal serves as a unified digital ecosystem designed to streamline administrative inquiries, increase accessibility to academic resources, automate student concern submission and tracking, and provide verified automated assistance through a grounded AI helper system.

---

## ✨ Key Features

### 🏢 1. Campus Office Directory
* Complete directory of all administrative offices (Registrar, Cashier, Guidance, Library, IT Services, etc.).
* Displays official office hours, building locations, primary contact emails, phone numbers, and list of offered services.
* Instant real-time search filtering.

### ❓ 2. Verified Campus FAQs
* Categorized answers regarding academic rules, TOR processing, tuition payment channels, Wi-Fi connectivity, and general campus policies.
* Search by keywords, category pills, or search terms.

### 📢 3. Announcements & Campus Bulletins
* Live stream of official school notices, examination deadlines, intramural celebrations, and upcoming events with venue and schedule details.

### 📨 4. Student Concern Submission & Reference Tracking System
* Students can submit official inquiries or reports directly to designated departments without needing an account.
* Auto-generates a unique tracking reference number (e.g., `CM-CON-2026-8921`).
* Real-time status lookup (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`) with staff response notes.

### 🤖 5. CM AI Grounded Assistant
* Intelligent Q&A assistant trained to answer queries based strictly on verified MongoDB records.
* Prevents hallucination by citing verified sources (e.g., FAQ records or Office Directory details).
* Directs unverified queries to relevant department contact channels.

### 🔐 6. Protected Admin Management Dashboard
* Restricted access secured by an administrative passcode (`admin123`).
* **Full CRUD Functionality:** Add, Edit, and Delete live records for Offices, FAQs, Bulletins, and Events in MongoDB.
* **Concern Management:** Department heads can review student submissions, change status tags, and attach staff resolution notes.
* **One-Click Database Seed:** Built-in seed and sync functionality to populate MongoDB collections with initial campus data.
* **Persistent Admin Session:** Logged-in admin sessions persist across page refreshes via `localStorage`.

---

## 🛠️ Technology Stack

| Tier | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React.js (v18) | Component-driven user interface |
| **Build Tool** | Vite | Ultra-fast frontend bundling and dev environment |
| **Styling** | Tailwind CSS | Utility-first responsive design framework |
| **Backend** | Node.js & Express.js | Modular RESTful API server |
| **Database** | MongoDB Atlas / Mongoose | Cloud NoSQL document database and schema modeling |
| **Security & Auth** | Custom Passcode Headers / `dotenv` | Protected admin routes and environment isolation |

---

## 📁 Project Architecture

```text
cm-helphub/
├── client/                      # React Frontend Application (Vite)
│   ├── src/
│   │   ├── App.jsx              # Main App Component, Views & Admin Panel
│   │   ├── main.jsx             # React DOM Root Entry point
│   │   └── index.css            # Tailwind directives and styling
│   ├── index.html               # HTML5 Template
│   ├── vite.config.js           # Vite development proxy configuration
│   └── package.json             # Frontend dependencies
│
├── server/                      # Express REST API Server
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose connection driver
│   ├── controllers/
│   │   └── helphubController.js # API Controller business logic
│   ├── models/
│   │   └── schemas.js           # Mongoose schemas (Office, Faq, Concern, etc.)
│   ├── routes/
│   │   └── helphubRoutes.js     # Express Router mapping endpoints
│   ├── .env                     # Private connection strings and secrets
│   ├── server.js                # Server entry point
│   └── package.json             # Backend dependencies
│
├── .gitignore                   # Excluded environment and dependency files
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [Git](https://git-scm.com/)
* [MongoDB Atlas Account](https://cloud.mongodb.com/) (or local MongoDB instance)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_ORGANIZATION/cm-helphub.git
cd cm-helphub
```

---

### Step 2: Configure Backend Environment Variables
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/cm_helphub?retryWrites=true&w=majority
ADMIN_PASSCODE=admin123
```

---

### Step 3: Install Dependencies & Run Server

#### 1. Start the Express Backend Server:
```bash
cd server
npm install
npm run dev
```
*The backend API server will launch at `http://localhost:5000`*

#### 2. Start the React Frontend Client:
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
*The React client will launch at `http://localhost:5173`*

---

## 🔗 REST API Endpoint Reference

### Public Endpoints
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/helphub/health` | `GET` | Health check and server status |
| `/api/helphub/offices` | `GET` | Fetch all published offices (supports `?search=`) |
| `/api/helphub/faqs` | `GET` | Fetch published FAQs (supports `?category=` and `?search=`) |
| `/api/helphub/announcements` | `GET` | Fetch active campus bulletins |
| `/api/helphub/events` | `GET` | Fetch upcoming campus events |
| `/api/helphub/concerns` | `POST` | Submit a new student concern |
| `/api/helphub/concerns/track/:refNum` | `GET` | Lookup concern status by reference code |
| `/api/helphub/assistant/ask` | `POST` | Submit a prompt to the Grounded AI Assistant |

### Admin Protected Endpoints (`x-admin-passcode` required)
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/helphub/admin/offices` | `POST` / `PUT` / `DELETE` | CRUD operations for office records |
| `/api/helphub/admin/faqs` | `POST` / `PUT` / `DELETE` | CRUD operations for FAQ records |
| `/api/helphub/admin/announcements` | `POST` / `PUT` / `DELETE` | CRUD operations for bulletins |
| `/api/helphub/admin/events` | `POST` / `PUT` / `DELETE` | CRUD operations for events |
| `/api/helphub/admin/concerns` | `GET` / `PATCH` | Manage student submissions and status responses |
| `/api/helphub/admin/seed` | `POST` | Reset & seed database with standard College of Maasin records |

---

## 🔑 Admin Access Information

* **Default Passcode:** `admin123`
* **Accessing Dashboard:** Click **Admin Login** in the top right header navigation bar, input the passcode, and access the live database administration suite.

---

## 📄 License

This project is developed as an academic capstone activity for the **College of Maasin**. All rights reserved © 2026.