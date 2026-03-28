# EduPortal - Academic Faculty Management System 🎓

EduPortal is a premium, high-performance web application designed for academic institutions to manage their faculty repository with elegance and efficiency. Originally migrated from a CodeIgniter architecture, it now leverages the modern **MERN stack** (Node.js, Express, React) with **Supabase PostgreSQL** for a robust, scalable backend.

Featuring a stunning glassmorphic UI, fluid animations, and a secure authentication suite, EduPortal provides a state-of-the-art experience for both administrators and faculty members.

---

## ✨ Features

- **🚀 Faculty Repository**: Comprehensive management (CRUD) of teacher profiles and academic records.
- **🔐 Secure Authentication Suite**:
  - Robust Registration & Login with JWT-based sessions.
  - **Dynamic Password Strength**: Real-time evaluation of password complexity.
  - **Email Recovery**: Forgot/Reset password flow integrated with **SendGrid**.
  - Interactive UI with password visibility toggles and form validation.
- **💎 Premium UI/UX**:
  - **Glassmorphism Design**: Sleek, modern aesthetic with consistent dark mode.
  - **Fluid Animations**: Powered by `Framer Motion` for a responsive, "alive" feel.
  - **Mobile-First**: Fully responsive layout optimized for all screen sizes.
- **📊 Real-time Dashboard**: Quick access to faculty statistics and management tools.
- **📬 Integrated Notifications**: Automated email delivery for account security and updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (v19)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Sequelize](https://sequelize.org/)
- **Security**: [Bcryptjs](https://www.npmjs.com/package/bcryptjs) & [JSON Web Tokens](https://jwt.io/)
- **Email Service**: [@sendgrid/mail](https://sendgrid.com/)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase project (for PostgreSQL)
- A SendGrid account (for emails)

### 1. Repository Setup
```bash
git clone <your-repo-url>
cd codeigniter-application
```

### 2. Backend Configuration
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
   DATABASE_URL=your_supabase_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
   SENDGRID_API_KEY=your_sendgrid_key
   EMAIL_FROM=your_verified_sender_email
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure client environment:
   Update `src/api/axios.js` or create a `.env` file with:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Security Standards
- **Data Protection**: Industry-standard password hashing using `bcryptjs`.
- **Session Integrity**: Secure JWT implementation for stateless authentication.
- **Input Sanitization**: Robust form validation to prevent malformed data.
- **Complexity Enforcement**: Real-time password criteria checking for enhanced security.

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
*Created with ❤️ by the EduPortal Team.*
