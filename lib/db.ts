/**
 * Database abstraction layer.
 *
 * This provides a lightweight in-memory store for development/demo purposes.
 * Replace with a real database integration (Supabase, Neon, etc.) for production.
 */

interface User {
  id: string
  username: string
  password: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory store for demo purposes
const users: User[] = []

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export const db = {
  users: {
    findUnique: async ({ where }: { where: Partial<User> }) => {
      return users.find((u) => {
        if (where.username && u.username === where.username) return true
        if (where.email && u.email === where.email) return true
        if (where.id && u.id === where.id) return true
        return false
      }) || null
    },

    findMany: async () => {
      return users.map(({ password: _, ...user }) => user)
    },

    create: async ({ data }: { data: Omit<User, "id"> }) => {
      const newUser: User = {
        id: generateId(),
        ...data,
      }
      users.push(newUser)
      return newUser
    },

    update: async ({ where, data }: { where: { id?: string; username?: string }; data: Partial<User> }) => {
      const index = users.findIndex((u) => {
        if (where.id && u.id === where.id) return true
        if (where.username && u.username === where.username) return true
        return false
      })
      if (index === -1) return null
      users[index] = { ...users[index], ...data, updatedAt: new Date() }
      return users[index]
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const index = users.findIndex((u) => u.id === where.id)
      if (index === -1) return null
      const [deleted] = users.splice(index, 1)
      return deleted
    },
  },
}

/**
 * Check whether the database connection is healthy.
 * For the in-memory store this always returns true.
 * Replace with a real connection check for production databases.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // In-memory store is always available
    return true
  } catch {
    return false
  }
}
