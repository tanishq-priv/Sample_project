# React + Django + PostgreSQL Full-Stack Task Manager

A clean, beginner-friendly full-stack web application designed for learning local development and practicing cloud deployment using **React (Vite), Django REST Framework, PostgreSQL, Docker, Vercel, and Render**.

---

## 1. Project Structure

```text
task-manager/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tasks/
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks/` | Fetch list of all tasks |
| `POST` | `/api/tasks/` | Create a new task |
| `PUT` | `/api/tasks/<id>/` | Update/toggle task completion status |
| `DELETE` | `/api/tasks/<id>/` | Delete a task |

---

## 3. Local Development Setup

### A. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux / macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```
   *(Note: If `DATABASE_URL` is not provided in `.env`, the project automatically falls back to local SQLite for easy zero-config testing).*

6. Start Django development server:
   ```bash
   python manage.py runserver
   ```
   Backend will run on `http://localhost:8000/`.

---

### B. Configuring Local PostgreSQL (Optional)

To test locally with PostgreSQL instead of SQLite:

1. Install and start PostgreSQL on your machine.
2. Create a local database and user via `psql` or pgAdmin:
   ```sql
   CREATE DATABASE taskdb;
   CREATE USER taskuser WITH PASSWORD 'taskpassword';
   GRANT ALL PRIVILEGES ON DATABASE taskdb TO taskuser;
   ```
3. Update `backend/.env` with your PostgreSQL connection URL:
   ```env
   DATABASE_URL=postgresql://taskuser:taskpassword@localhost:5432/taskdb
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```

---

### C. Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173/`.

---

## 4. Docker Deployment Setup (Backend)

The project includes a production-grade `Dockerfile` in `backend/` with detailed explanations in comments.

### Building & Running with Docker Locally

1. Build the Docker image:
   ```bash
   docker build -t task-manager-backend ./backend
   ```

2. Run the container with environment variables:
   ```bash
   docker run -p 8000:8000 \
     -e SECRET_KEY="your-production-secret-key" \
     -e DEBUG="False" \
     -e ALLOWED_HOSTS="*" \
     -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
     task-manager-backend
   ```

---

## 5. Cloud Deployment Guide

### Deploy Backend & PostgreSQL on Render

1. **Create PostgreSQL Database on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **PostgreSQL**.
   - Note down the **Internal Database URL** or **External Database URL**.

2. **Deploy Django Web Service on Render**:
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
   - Set **Root Directory** to `backend`.
   - Choose **Docker** as the Runtime (Render will auto-detect `Dockerfile`).
   - Add Environment Variables:
     - `SECRET_KEY`: Generate a random secure key.
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `.onrender.com,your-custom-domain.com`
     - `DATABASE_URL`: Your Render PostgreSQL database URL.
     - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`

3. **Run Migrations on Render**:
   - Open your Web Service shell on Render and run:
     ```bash
     python manage.py migrate
     ```

---

### Deploy Frontend on Vercel

1. Push code to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository and select `frontend` as the **Root Directory**.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com` (Your live Render backend URL).
6. Click **Deploy**.
