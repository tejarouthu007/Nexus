# Nexus - Live Code Editor 💻⚡

Nexus is a real-time collaborative code editor that allows multiple users to edit code, chat, and run programs live — all from the browser.

## ✨ Features

- 🧑‍💻 **Live Code Collaboration** – Real-time code syncing across multiple users in the same room.
- 💾 **Multi-language Support** – Choose from popular languages like JavaScript, Python, C++, etc.
- 💬 **Integrated Chat** – Talk to your teammates while you code.
- ⚙️ **Code Execution** – Run code directly in the browser (coming soon).

## 🚀 Tech Stack

### Frontend
- React + Vite
- Socket.IO Client
- CodeMirror (Editor)
- Tailwind CSS

### Backend
- Node.js + Express
- Socket.IO Server

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/tejarouthu007/nexus.git
cd nexus
```

### 2. Install dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### 3. Setup environment variables

#### Backend (`backend/.env`)
```
PORT=5000
```

#### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start the application

In two terminals:

```bash
# Terminal 1: Backend
cd backend
node index.js

# Terminal 2: Frontend
cd frontend
npm run dev
```

Now open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
nexus-editor/
├── backend/
│   ├── index.js
│   ├── events/
│   └── ...
├── frontend/
│   ├── src/
│   ├── App.jsx
│   └── ...
```

---

## 🛡️ Security & Deployment

- [ ] Rate limiting & validation
- [ ] HTTPS (for production)
- [ ] JWT/Auth support (future)
- [ ] Docker containerization (optional)

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).
