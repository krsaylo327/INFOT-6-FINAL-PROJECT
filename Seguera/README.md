# ClickAndCare Booking Website

A modern web application for scheduling and managing appointments.

## Features

- User authentication (signup/login)
- Appointment scheduling
- Calendar view
- Admin dashboard
- Email notifications
- Responsive design

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Styling: Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/appointment-db
     JWT_SECRET=your-secret-key
     PORT=5000
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## Project Structure

```
appointment-website/
├── frontend/           # React frontend
├── backend/           # Node.js backend
└── README.md
```

## License

MIT 