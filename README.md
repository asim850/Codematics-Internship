📚 Library Management System

A professional, full-stack library management application featuring a modern UI, dark mode toggle, and secure user authentication.

---

## 🚀 Project Setup Steps

Follow these steps to get the project running locally on your machine.

### 1. Prerequisites

* **Node.js** installed (v16 or higher recommended)
* **MongoDB** (Local or Atlas)
* **Git**

### 2. Backend Setup

```bash
cd library-system/backend
npm install
# Create a .env file and add your MONGO_URI and PORT
npm start

```

### 3. Frontend Setup

```bash
cd library-system/frontend
npm install
npm run dev  # or 'npm start' if using CRA

```

*The application should now be running at `http://localhost:5173` (Vite) or `http://localhost:3000`.*

---

## ✨ Features Implemented

* **Professional UI/UX:** Clean, modern interface designed for ease of use.
* **Dark Mode Support:** Toggle between light and dark themes for a personalized experience.
* **User Authentication:** Secure login and registration system for library members and admins.
* **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
* **CRUD Operations:** Manage books and users effectively through the backend API.

---

## 🛠 Technologies Used

### Frontend

* **React.js:** For building the interactive user interface.
* **Tailwind CSS:** For professional styling and responsive layouts.
* **Lucide React:** For clean, modern iconography.

### Backend

* **Node.js & Express:** Providing a robust RESTful API.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** For elegant MongoDB object modeling.
* **JWT:** Secure JSON Web Token-based authentication.

---

## 📁 Project Structure

```text
library-system/
├── backend/           # Express server and Database models
├── frontend/          # React application (Vite/CRA)
└── Pictures/          # Project screenshots and diagrams
