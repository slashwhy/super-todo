---
applyTo: 'backend/prisma/**'
---

# Prisma Database Development

## Schema Conventions

```prisma
model Task {
  id          String       @id @default(uuid())
  title       String
  description String?
  isVital     Boolean      @default(false)
  dueDate     DateTime?
  
  // Relations with explicit naming
  status      TaskStatus   @relation(fields: [statusId], references: [id])
  statusId    String
  priority    TaskPriority @relation(fields: [priorityId], references: [id])
  priorityId  String
  category    Category?    @relation(fields: [categoryId], references: [id])
  categoryId  String?
  owner       User         @relation("TaskOwner", fields: [ownerId], references: [id])
  ownerId     String
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String?
  
  // Timestamps
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

## Naming Conventions

- **Models:** PascalCase singular (`Task`, `User`, `Category`)
- **Fields:** camelCase (`createdAt`, `statusId`)
- **Relations:** camelCase, named for clarity when multiple relations exist
- **Enums:** PascalCase with SCREAMING_SNAKE values

## Prisma Client Location

Generated to custom path - import from:

```typescript
import { prisma } from "../lib/prisma.js";
```

The singleton is defined in `backend/src/lib/prisma.ts`.

## Migration Workflow

```bash
# After schema changes
npm run db:migrate    # Creates and applies migration

# Reset everything (dev only)
npm run db:reset      # Drops DB, recreates, migrates, seeds

# View data
npm run db:studio     # Opens Prisma Studio GUI
```

## Seeding Best Practices

In `prisma/seed.ts`:

```typescript
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order matters for foreign keys)
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.taskStatus.deleteMany();
  await prisma.taskPriority.deleteMany();

  // Seed in dependency order
  const statuses = await Promise.all([
    prisma.taskStatus.create({ data: { name: "Todo", color: "#6B7280", order: 1 } }),
    prisma.taskStatus.create({ data: { name: "In Progress", color: "#3B82F6", order: 2 } }),
    prisma.taskStatus.create({ data: { name: "Done", color: "#10B981", order: 3 } }),
  ]);

  // Continue with dependent entities...
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Query Patterns

### Always include relations

```typescript
const tasks = await prisma.task.findMany({
  include: { status: true, priority: true, category: true, owner: true },
});
```

### Conditional filtering

```typescript
const where = {
  ...(status && { status: { name: status } }),
  ...(ownerId && { ownerId }),
  ...(isVital !== undefined && { isVital: isVital === "true" }),
};
```

### Transactions for complex operations

```typescript
const [deletedTask, updatedStats] = await prisma.$transaction([
  prisma.task.delete({ where: { id } }),
  prisma.stats.update({ where: { id: 1 }, data: { taskCount: { decrement: 1 } } }),
]);
```

## Schema Design Guidelines

- Use UUID for primary keys (`@id @default(uuid())`)
- Always add `createdAt` and `updatedAt` timestamps
- Make relations explicit with foreign key fields
- Use optional relations (`?`) appropriately
- Add indexes for frequently queried fields
- Use `@unique` for fields that must be unique

## Common Pitfalls

- ❌ Forgetting to run migrations after schema changes → Client out of sync
- ❌ Deleting in wrong order → Foreign key constraint errors
- ❌ Not using transactions for multi-step operations → Data inconsistency
- ❌ Missing `.js` extension in imports → ESM module errors
