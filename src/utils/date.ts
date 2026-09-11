import type { Todo } from '../types/todo'

export const getTodayString = (): string => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .split('T')[0]
}

export const checkHasOverdueTasks = (todos: Todo[]): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return todos.some((todo) => {
    if (!todo.date || todo.completed) return false
    const dueDate = new Date(`${todo.date}T00:00:00`)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() < today.getTime()
  })
}

export const getDueDateClass = (
  dateString: string,
  completed: boolean,
): string | null => {
  if (completed) return 'date-no-due'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${dateString}T00:00:00`)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'date-overdue'
  if (diffDays === 0) return 'date-today'
  if (diffDays >= 1 && diffDays <= 4) return 'date-this-week'
  if (diffDays > 4) return 'date-future'

  return null
}
// What's a nice date to meet Leax!
