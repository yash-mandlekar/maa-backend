require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { startWhatsAppClient } = require("./utils/whatsapp");

// Import routes
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const admissionRoutes = require("./routes/admission.routes");
const courseRoutes = require("./routes/course.routes");
const staffRoutes = require("./routes/staff.routes");
const universityRoutes = require("./routes/university.routes");
const inquiryRoutes = require("./routes/inquiry.routes");
const feesRoutes = require("./routes/fees.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Initialize WhatsApp client
startWhatsAppClient();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MAA Computer Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});
