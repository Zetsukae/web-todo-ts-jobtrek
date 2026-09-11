import type { Todo } from '../types/todo'

const STORAGE_KEY = 'todos'

export const getStoredTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem(STORAGE_KEY)
  return savedTodos ? JSON.parse(savedTodos) : []
}

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export const clearStoredTodos = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
