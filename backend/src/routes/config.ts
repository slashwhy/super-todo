import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// ============ TASK STATUSES ============

// GET /api/config/statuses - Get all task statuses
router.get("/statuses", async (req, res) => {
  try {
    const statuses = await prisma.taskStatus.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { order: "asc" },
    });

    res.json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
});

// POST /api/config/statuses - Create new status
router.post("/statuses", async (req, res) => {
  try {
    const { name, color, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const status = await prisma.taskStatus.create({
      data: { name, color, order },
    });

    res.status(201).json(status);
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ error: "Failed to create status" });
  }
});

// PUT /api/config/statuses/:id - Update status
router.put("/statuses/:id", async (req, res) => {
  try {
    const { name, color, order } = req.body;

    const status = await prisma.taskStatus.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(status);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// DELETE /api/config/statuses/:id - Delete status
router.delete("/statuses/:id", async (req, res) => {
  try {
    // Check if status is in use
    const tasksUsingStatus = await prisma.task.count({
      where: { statusId: req.params.id },
    });

    if (tasksUsingStatus > 0) {
      return res.status(400).json({
        error: `Cannot delete status: ${tasksUsingStatus} tasks are using it`,
      });
    }

    await prisma.taskStatus.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ error: "Failed to delete status" });
  }
});

// ============ TASK PRIORITIES ============

// GET /api/config/priorities - Get all task priorities
router.get("/priorities", async (req, res) => {
  try {
    const priorities = await prisma.taskPriority.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { order: "asc" },
    });

    res.json(priorities);
  } catch (error) {
    console.error("Error fetching priorities:", error);
    res.status(500).json({ error: "Failed to fetch priorities" });
  }
});

// POST /api/config/priorities - Create new priority
router.post("/priorities", async (req, res) => {
  try {
    const { name, color, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const priority = await prisma.taskPriority.create({
      data: { name, color, order },
    });

    res.status(201).json(priority);
  } catch (error) {
    console.error("Error creating priority:", error);
    res.status(500).json({ error: "Failed to create priority" });
  }
});

// PUT /api/config/priorities/:id - Update priority
router.put("/priorities/:id", async (req, res) => {
  try {
    const { name, color, order } = req.body;

    const priority = await prisma.taskPriority.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(priority);
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ error: "Failed to update priority" });
  }
});

// DELETE /api/config/priorities/:id - Delete priority
router.delete("/priorities/:id", async (req, res) => {
  try {
    // Check if priority is in use
    const tasksUsingPriority = await prisma.task.count({
      where: { priorityId: req.params.id },
    });

    if (tasksUsingPriority > 0) {
      return res.status(400).json({
        error: `Cannot delete priority: ${tasksUsingPriority} tasks are using it`,
      });
    }

    await prisma.taskPriority.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting priority:", error);
    res.status(500).json({ error: "Failed to delete priority" });
  }
});

export default router;
