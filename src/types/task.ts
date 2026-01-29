// Task-related TypeScript interfaces

export interface TaskStatus {
  id: string
  name: string
  color: string
  order: number
}

export interface TaskPriority {
  id: string
  name: string
  color: string
  order: number
}

export interface Category {
  id: string
  name: string
  description: string | null
  color: string
  icon: string | null
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
}

export interface Task {
  id: string
  title: string
  description: string | null
  image: string | null
  isVital: boolean
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  statusId: string
  priorityId: string
  categoryId: string | null
  ownerId: string
  assigneeId: string | null
  status: TaskStatus
  priority: TaskPriority
  category: Category | null
  owner: User
  assignee: User | null
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  vital: number
  completedPercentage: number
  inProgressPercentage: number
  notStartedPercentage: number
}

export interface TaskFilters {
  status?: string
  priority?: string
  category?: string
  isVital?: string
  ownerId?: string
}
