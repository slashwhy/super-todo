---
name: prisma-database
description: 'Prisma schema conventions, migrations, seeding, and query patterns. Use when modifying database schema, creating migrations, or writing complex queries.'
---

# Prisma Database Skill

Patterns for Prisma schema design, migrations, and database queries.

## When to Use This Skill

- Modifying the database schema
- Creating new migrations
- Writing seed data
- Building complex queries
- Managing relations

## Reference Documentation

For detailed patterns and conventions, see:
- [Prisma Database Instructions](../../instructions/prisma-database.instructions.md)

## Quick Reference

### Schema Conventions

```prisma
// backend/prisma/schema.prisma

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  isVital     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  status      TaskStatus  @relation(fields: [statusId], references: [id])
  statusId    String
  
  priority    TaskPriority @relation(fields: [priorityId], references: [id])
  priorityId  String
  
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  
  owner       User      @relation("TaskOwner", fields: [ownerId], references: [id])
  ownerId     String
  
  assignee    User?     @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String?

  @@index([statusId])
  @@index([priorityId])
  @@index([ownerId])
}

model TaskStatus {
  id    String @id @default(cuid())
  name  String @unique
  color String
  order Int

  tasks Task[]
}
```

### Critical Rules

1. **Use `cuid()` for IDs** – not UUID or auto-increment
2. **Always add `createdAt` and `updatedAt`**
3. **Index foreign keys** for query performance
4. **Use explicit relation names** for multiple relations to same model
5. **Order matters** – put scalar fields before relations

### Migration Commands

```bash
# Create migration after schema changes
npm run db:migrate

# Reset database (dev only)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Generate Prisma Client
npx prisma generate
```

### Query Patterns

#### Include Relations

```typescript
// Always include needed relations
const task = await prisma.task.findUnique({
  where: { id },
  include: {
    status: true,
    priority: true,
    category: true,
    owner: true,
    assignee: true
  }
})
```

#### Filtered Queries

```typescript
const tasks = await prisma.task.findMany({
  where: {
    status: { name: 'Todo' },
    isVital: true,
    ownerId: userId
  },
  include: {
    status: true,
    priority: true
  },
  orderBy: [
    { priority: { order: 'asc' } },
    { createdAt: 'desc' }
  ]
})
```

#### Create with Relations

```typescript
const task = await prisma.task.create({
  data: {
    title: 'New Task',
    status: { connect: { id: statusId } },
    priority: { connect: { id: priorityId } },
    owner: { connect: { id: userId } }
  },
  include: {
    status: true,
    priority: true
  }
})
```

#### Update with Relations

```typescript
const task = await prisma.task.update({
  where: { id },
  data: {
    title: 'Updated Title',
    status: { connect: { id: newStatusId } }
  },
  include: {
    status: true,
    priority: true
  }
})
```

### Seed Data

```typescript
// backend/prisma/seed.ts
import { prisma } from '../src/lib/prisma.js'

async function main() {
  // Create statuses
  const statuses = await Promise.all([
    prisma.taskStatus.upsert({
      where: { name: 'Todo' },
      update: {},
      create: { name: 'Todo', color: '#6B7280', order: 1 }
    }),
    prisma.taskStatus.upsert({
      where: { name: 'In Progress' },
      update: {},
      create: { name: 'In Progress', color: '#3B82F6', order: 2 }
    }),
    prisma.taskStatus.upsert({
      where: { name: 'Done' },
      update: {},
      create: { name: 'Done', color: '#10B981', order: 3 }
    })
  ])
  
  console.log('Seeded statuses:', statuses.length)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## File Locations

- Schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Seed: `backend/prisma/seed.ts`
- Prisma Client: `backend/src/lib/prisma.ts`
