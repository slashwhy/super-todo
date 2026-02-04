import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.taskPriority.deleteMany();
  await prisma.taskStatus.deleteMany();
  await prisma.user.deleteMany();

  console.log("📝 Creating task statuses...");
  const statusNotStarted = await prisma.taskStatus.create({
    data: { name: "Not Started", color: "#ef4444", order: 1 },
  });
  const statusInProgress = await prisma.taskStatus.create({
    data: { name: "In Progress", color: "#3b82f6", order: 2 },
  });
  const statusCompleted = await prisma.taskStatus.create({
    data: { name: "Completed", color: "#22c55e", order: 3 },
  });

  console.log("⚡ Creating task priorities...");
  const priorityExtreme = await prisma.taskPriority.create({
    data: { name: "Extreme", color: "#ef4444", order: 1 },
  });
  const priorityModerate = await prisma.taskPriority.create({
    data: { name: "Moderate", color: "#f97316", order: 2 },
  });
  const priorityLow = await prisma.taskPriority.create({
    data: { name: "Low", color: "#22c55e", order: 3 },
  });

  console.log("📁 Creating categories...");
  const categoryPersonal = await prisma.category.create({
    data: { name: "Personal", color: "#8b5cf6", icon: "user" },
  });
  const categoryWork = await prisma.category.create({
    data: { name: "Work", color: "#3b82f6", icon: "briefcase" },
  });
  const categoryHealth = await prisma.category.create({
    data: { name: "Health", color: "#22c55e", icon: "heart" },
  });
  const categoryFamily = await prisma.category.create({
    data: { name: "Family", color: "#ec4899", icon: "home" },
  });

  console.log("👤 Creating users...");
  const sundar = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  });

  const teamMember1 = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  });

  const teamMember2 = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "mike.chen@example.com",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
  });

  console.log("✅ Creating tasks...");

  // Task 1: Birthday Party (from mockup)
  await prisma.task.create({
    data: {
      title: "Attend Nischal's Birthday Party",
      description: `Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)

1. A cake, with candles to blow out. (Layer cake, cupcake, flat sheet cake)
2. The birthday song.
3. A place to collect gifts.

**Optional:**
- Paper cone-shaped party hats, paper whistles that unroll.
- Games, activities (carry an object with your knees, then drop it into a milk bottle.)
- Lunch: sandwich halves, or pizza slices, juice, pretzels, potato chips...THEN cake & candles and the song.`,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
      isVital: false,
      statusId: statusNotStarted.id,
      priorityId: priorityModerate.id,
      categoryId: categoryPersonal.id,
      ownerId: sundar.id,
      createdAt: new Date("2023-06-20"),
    },
  });

  // Task 2: Landing Page Design
  await prisma.task.create({
    data: {
      title: "Landing Page Design for TravelDays",
      description:
        "Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
      isVital: false,
      statusId: statusInProgress.id,
      priorityId: priorityModerate.id,
      categoryId: categoryWork.id,
      ownerId: sundar.id,
      assigneeId: teamMember1.id,
      createdAt: new Date("2023-06-20"),
    },
  });

  // Task 3: Presentation (from mockup)
  await prisma.task.create({
    data: {
      title: "Presentation on Final Product",
      description:
        "Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
      isVital: false,
      statusId: statusInProgress.id,
      priorityId: priorityModerate.id,
      categoryId: categoryWork.id,
      ownerId: sundar.id,
      createdAt: new Date("2023-06-19"),
    },
  });

  // Task 4: Walk the dog (Vital task from mockup)
  await prisma.task.create({
    data: {
      title: "Walk the dog",
      description: `Take the dog to the park and bring treats as well.

Take Luffy and Jiro for a leisurely stroll around the neighborhood. Enjoy the fresh air and give them the exercise and mental stimulation they need for a happy and healthy day. Don't forget to bring along squeaky and fluffy for some extra fun along the way!

1. Listen to a podcast or audiobook
2. Practice mindfulness or meditation
3. Take photos of interesting sights along the way
4. Practice obedience training with your dog
5. Chat with neighbors or other dog walkers
6. Listen to music or an upbeat playlist`,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
      isVital: true,
      statusId: statusNotStarted.id,
      priorityId: priorityExtreme.id,
      categoryId: categoryPersonal.id,
      ownerId: sundar.id,
      createdAt: new Date("2023-06-20"),
    },
  });

  // Task 5: Take grandma to hospital (Vital task)
  await prisma.task.create({
    data: {
      title: "Take grandma to hospital",
      description: "Go back home and take grandma to the hosp....",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
      isVital: true,
      statusId: statusInProgress.id,
      priorityId: priorityModerate.id,
      categoryId: categoryFamily.id,
      ownerId: sundar.id,
      createdAt: new Date("2023-06-20"),
    },
  });

  // Task 6: Conduct meeting (Completed)
  await prisma.task.create({
    data: {
      title: "Conduct meeting",
      description: "Meet with the client and finalize requirements.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400",
      isVital: false,
      statusId: statusCompleted.id,
      priorityId: priorityModerate.id,
      categoryId: categoryWork.id,
      ownerId: sundar.id,
      completedAt: new Date("2023-06-18"),
      createdAt: new Date("2023-06-15"),
    },
  });

  // Task 7: Exercise routine
  await prisma.task.create({
    data: {
      title: "Morning Exercise Routine",
      description: "30 minutes cardio + 20 minutes strength training",
      isVital: false,
      statusId: statusCompleted.id,
      priorityId: priorityLow.id,
      categoryId: categoryHealth.id,
      ownerId: sundar.id,
      completedAt: new Date("2023-06-20"),
      createdAt: new Date("2023-06-20"),
    },
  });

  // Task 8: Team sync
  await prisma.task.create({
    data: {
      title: "Weekly Team Sync",
      description: "Discuss project progress and blockers with the team",
      isVital: false,
      statusId: statusNotStarted.id,
      priorityId: priorityModerate.id,
      categoryId: categoryWork.id,
      ownerId: sundar.id,
      assigneeId: teamMember2.id,
      dueDate: new Date("2023-06-25"),
      createdAt: new Date("2023-06-20"),
    },
  });

  console.log("✨ Seed completed successfully!");

  // Print summary
  const taskCount = await prisma.task.count();
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();

  console.log(`
📊 Database Summary:
   - Users: ${userCount}
   - Tasks: ${taskCount}
   - Categories: ${categoryCount}
   - Statuses: 3
   - Priorities: 3
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
