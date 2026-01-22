import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/categories - Get all categories with task count
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/categories/:id - Get single category with tasks
router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            status: true,
            priority: true,
            owner: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// POST /api/categories - Create new category
router.post("/", async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Missing required field: name",
      });
    }

    const category = await prisma.category.create({
      data: { name, description, color, icon },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// PUT /api/categories/:id - Update category
router.put("/:id", async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
      },
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete("/:id", async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
