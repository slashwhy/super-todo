import express from "express";
import cors from "cors";

import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import categoriesRouter from "./routes/categories.js";
import configRouter from "./routes/config.js";

// dotenv 17+ auto-loads .env files

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/config", configRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Todo App Backend is running!

   Local:    http://localhost:${PORT}
   Health:   http://localhost:${PORT}/health

📚 API Endpoints:
   GET    /api/tasks          - List all tasks
   GET    /api/tasks/:id      - Get task by ID
   POST   /api/tasks          - Create task
   PUT    /api/tasks/:id      - Update task
   DELETE /api/tasks/:id      - Delete task
   GET    /api/tasks/stats/summary - Task statistics

   GET    /api/users          - List all users
   GET    /api/users/:id      - Get user by ID
   POST   /api/users          - Create user
   PUT    /api/users/:id      - Update user
   DELETE /api/users/:id      - Delete user

   GET    /api/categories     - List all categories
   GET    /api/categories/:id - Get category by ID
   POST   /api/categories     - Create category
   PUT    /api/categories/:id - Update category
   DELETE /api/categories/:id - Delete category

   GET    /api/config/statuses   - List task statuses
   POST   /api/config/statuses   - Create status
   PUT    /api/config/statuses/:id - Update status
   DELETE /api/config/statuses/:id - Delete status

   GET    /api/config/priorities   - List task priorities
   POST   /api/config/priorities   - Create priority
   PUT    /api/config/priorities/:id - Update priority
   DELETE /api/config/priorities/:id - Delete priority
  `);
});

export default app;
