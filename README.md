# MAA Computer Backend API

A modern REST API built with Express.js and MongoDB, featuring JWT authentication for the MAA Computer Institute management system.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👨‍🎓 **Student Management** - CRUD operations for diploma students
- 📚 **Admission Management** - Handle short course admissions
- 💰 **Fee Management** - Track payments with PDF invoice generation
- 📄 **PDF Invoices** - Automated invoice generation
- 📱 **WhatsApp Integration** - Send invoices via WhatsApp
- 📊 **Dashboard Statistics** - Real-time analytics
- 🔍 **Search & Pagination** - Efficient data retrieval
- ✅ **Error Handling** - Comprehensive error management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **PDF Generation:** PDFKit
- **WhatsApp:** whatsapp-web.js

## Installation

1. **Clone the repository**

   ```bash
   cd maa-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Update the following in `.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**

   Development mode:

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Students

- `GET /api/students` - Get all students (with pagination & search)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Admissions

- `GET /api/admissions` - Get all admissions
- `GET /api/admissions/:id` - Get admission by ID
- `POST /api/admissions` - Create new admission
- `PUT /api/admissions/:id` - Update admission
- `DELETE /api/admissions/:id` - Delete admission

### Courses

- `GET /api/courses` - Get all diploma courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/short` - Get all short courses
- `POST /api/courses/short` - Create short course

### Fees

- `GET /api/fees` - Get all fees
- `GET /api/fees/:id` - Get fee by ID
- `POST /api/fees` - Create new fee
- `PUT /api/fees/:id` - Update fee
- `DELETE /api/fees/:id` - Delete fee
- `GET /api/fees/:id/invoice/download` - Download PDF invoice
- `POST /api/fees/:id/invoice/send` - Send invoice via WhatsApp

### Staff

- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Universities

- `GET /api/universities` - Get all universities
- `POST /api/universities` - Create university

### Inquiries

- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get inquiry by ID
- `POST /api/inquiries` - Create inquiry
- `PATCH /api/inquiries/:id/accept` - Accept inquiry
- `PATCH /api/inquiries/:id/reject` - Reject inquiry

### Dashboard

- `GET /api/dashboard` - Get dashboard statistics

### Health Check

- `GET /api/health` - API health status

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

## WhatsApp Integration

To enable WhatsApp invoice sending:

1. Uncomment the WhatsApp client initialization in `server.js`:

   ```javascript
   startWhatsAppClient();
   ```

2. On first run, scan the QR code with WhatsApp to authenticate

3. The session will be saved for future use

## Project Structure

```
maa-backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── jwt.js            # JWT utilities
├── controllers/          # Business logic
├── middleware/           # Custom middleware
├── models/              # Mongoose schemas
├── routes/              # API routes
├── utils/               # Helper functions
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js            # Entry point
```

## Development

```bash
# Install nodemon for development
npm install -D nodemon

# Run in development mode
npm run dev
```

## License

ISC

## Support

For support, email mceiindia229@gmail.com
