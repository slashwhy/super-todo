import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/tasks - Get all tasks with relations
router.get("/", async (req, res) => {
  try {
    const { status, priority, category, isVital, ownerId } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: { name: status as string } }),
        ...(priority && { priority: { name: priority as string } }),
        ...(category && { category: { name: category as string } }),
        ...(isVital && { isVital: isVital === "true" }),
        ...(ownerId && { ownerId: ownerId as string }),
      },
      include: {
        status: true,
        priority: true,
        category: true,
        owner: true,
        assignee: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id - Get single task
router.get("/:id", async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        status: true,
        priority: true,
        category: true,
        owner: true,
        assignee: true,
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST /api/tasks - Create new task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      isVital,
      dueDate,
      statusId,
      priorityId,
      categoryId,
      ownerId,
      assigneeId,
    } = req.body;

    if (!title || !statusId || !priorityId || !ownerId) {
      return res.status(400).json({
        error: "Missing required fields: title, statusId, priorityId, ownerId",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        image,
        isVital: isVital ?? false,
        dueDate: dueDate ? new Date(dueDate) : null,
        statusId,
        priorityId,
        categoryId,
        ownerId,
        assigneeId,
      },
      include: {
        status: true,
        priority: true,
        category: true,
        owner: true,
        assignee: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id - Update task
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      isVital,
      dueDate,
      completedAt,
      statusId,
      priorityId,
      categoryId,
      assigneeId,
    } = req.body;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(isVital !== undefined && { isVital }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
        ...(statusId !== undefined && { statusId }),
        ...(priorityId !== undefined && { priorityId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: {
        status: true,
        priority: true,
        category: true,
        owner: true,
        assignee: true,
      },
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// GET /api/tasks/stats/summary - Get task statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const [total, completed, inProgress, notStarted, vital] = await Promise.all(
      [
        prisma.task.count(),
        prisma.task.count({ where: { status: { name: "Completed" } } }),
        prisma.task.count({ where: { status: { name: "In Progress" } } }),
        prisma.task.count({ where: { status: { name: "Not Started" } } }),
        prisma.task.count({ where: { isVital: true } }),
      ]
    );

    res.json({
      total,
      completed,
      inProgress,
      notStarted,
      vital,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      inProgressPercentage:
        total > 0 ? Math.round((inProgress / total) * 100) : 0,
      notStartedPercentage:
        total > 0 ? Math.round((notStarted / total) * 100) : 0,
    });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    res.status(500).json({ error: "Failed to fetch task statistics" });
  }
});

export default router;
