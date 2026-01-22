import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Get single user with their tasks
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            status: true,
            priority: true,
            category: true,
          },
          orderBy: { createdAt: "desc" },
        },
        assignedTasks: {
          include: {
            status: true,
            priority: true,
            category: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users - Create new user
router.post("/", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields: name, email",
      });
    }

    const user = await prisma.user.create({
      data: { name, email, avatar },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(avatar !== undefined && { avatar }),
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
