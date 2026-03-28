# EduPortal - Academic Faculty Management System

EduPortal is a modern, high-performance web application designed for academic institutions to manage their faculty repository with elegance and efficiency. Built on the MERN stack with Supabase PostgreSQL, it features a premium dark-themed UI with fluid animations.

## 🚀 Key Features

- **Teacher Management**: Complete CRUD operations for faculty members.
- **Secure Authentication**: Robust registration and login system with:
  - Real-time password strength evaluation.
  - Form validation for names, emails, and passwords.
  - Interactive password visibility toggles.
- **Modern UI/UX**: 
  - Glassmorphic design and dark mode.
  - Smooth transitions using Framer Motion.
  - Responsive layout for all devices.
- **Data Repository**: Advanced filtering and search capabilities for faculty records.

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (via Supabase).
- **Icons**: Lucide React.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   PORT=5000
   DATABASE_URL=your_supabase_postgres_url
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security Standards
- Password hashing (using bcrypt).
- JWT-based session management.
- Robust form validation to prevent malformed data entry.
- Real-time password complexity enforcement.

## 📜 License
This project is licensed under the MIT License.
