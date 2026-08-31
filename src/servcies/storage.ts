import type { Category, Todo } from '../types/todo'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'
const CATEGORIES_API_URL = 'https://api.todos.in.jt-lab.ch/categories'

export type CreateTodoInput = Omit<Todo, 'id'>
export type CreateCategoryInput = Omit<Category, 'id'>

// 1. GET - Receive data
export const getTodosFromApi = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data: Todo[] = await response.json()
    return data
  } catch (error) {
    console.error('Error while trying to receive data:', error)
    throw error
  }
}

export const getCategoriesFromApi = async (): Promise<Category[]> => {
  try {
    const response = await fetch(CATEGORIES_API_URL)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// 2. POST - Create todo
export const createTodoInApi = async (
  newTodoData: CreateTodoInput,
): Promise<Todo> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(newTodoData),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data: Todo[] = await response.json()
    return data[0]
  } catch (error) {
    console.error('Error while creating todo:', error)
    throw error
  }
}

export const createCategoryInApi = async (
  newCategoryData: CreateCategoryInput,
): Promise<Category> => {
  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(newCategoryData),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data: Category[] = await response.json()
    return data[0]
  } catch (error) {
    console.error('Error while creating category:', error)
    throw error
  }
}

export const updateCategoryInApi = async (
  id: number,
  updates: Partial<CreateCategoryInput>,
): Promise<Category> => {
  try {
    const response = await fetch(`${CATEGORIES_API_URL}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data: Category[] = await response.json()
    return data[0]
  } catch (error) {
    console.error(`Error while updating category ${id}:`, error)
    throw error
  }
}

export const deleteCategoryInApi = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${CATEGORIES_API_URL}?id=eq.${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error while deleting category ${id}:`, error)
    throw error
  }
}

// 3. PATCH - Update todo
export const updateTodoInApi = async (
  id: number,
  updates: Partial<Todo>,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error while updating todo ${id}:`, error)
    throw error
  }
}

// 4. DELETE - Delete todo via id
export const deleteTodoInApi = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}?id=eq.${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error while deleting todo ${id}:`, error)
    throw error
  }
}

// 5. DELETE - All todo
export const deleteAllTodosInApi = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  } catch (error) {
    console.error('Error while deleting all todos:', error)
    throw error
  }
}
