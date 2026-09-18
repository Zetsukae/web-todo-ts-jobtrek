import type { Category, Todo } from '../types/todo'
import { getDueDateClass } from '../utils/date'

const getTodoCategoryId = (todo: Todo): number | null => {
  const relationCategoryId = todo.categories_todos?.[0]?.category_id
  if (typeof relationCategoryId === 'number') {
    return relationCategoryId
  }

  if (typeof todo.content === 'string') {
    try {
      type TodoContent = { category_id?: number | null }
      const parsed: TodoContent = JSON.parse(todo.content)
      if (typeof parsed.category_id === 'number') {
        return parsed.category_id
      }
    } catch {
      return null
    }
  }

  return null
}

export const createTodoElement = (
  todo: Todo,
  categories: Category[],
  onDelete: (todoId: number) => void,
  onToggle: (todoId: number, done: boolean) => void,
): HTMLLIElement => {
  const li = document.createElement('li')
  const p = document.createElement('p')

  const todoCategoryId = getTodoCategoryId(todo)
  const todoCategory = categories.find(
    (category) => category.id === todoCategoryId,
  )

  const categoryBadge = document.createElement('p')
  categoryBadge.classList.add('todo-category-badge')

  const DEFAULT_COLOR = '#9ca3af' // Default color for category badge and border

  if (todoCategory) {
    categoryBadge.textContent = todoCategory.title ?? 'Category'
    categoryBadge.style.backgroundColor = todoCategory.color ?? DEFAULT_COLOR
    li.style.borderColor = todoCategory.color ?? DEFAULT_COLOR
    li.style.borderWidth = '3px'
  } else {
    categoryBadge.textContent = 'no category'
    categoryBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
    categoryBadge.style.borderColor = DEFAULT_COLOR
  }

  if (todo.due_date) {
    const timeElement = document.createElement('time')
    timeElement.dateTime = todo.due_date
    timeElement.textContent = todo.due_date
    const dueDateClass = getDueDateClass(todo.due_date, todo.done)
    if (dueDateClass) {
      timeElement.classList.add(dueDateClass)
    }
    p.appendChild(timeElement)
  } else {
    p.classList.add('date-no-due')
    p.textContent = 'No due date'
  }

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = todo.done

  const todoSpan = document.createElement('span')
  todoSpan.textContent = todo.title

  const deleteButton = document.createElement('button')
  deleteButton.textContent = '✕'
  deleteButton.classList.add('delete-btn')

  deleteButton.addEventListener('click', () => {
    if (todo.id !== undefined) onDelete(todo.id)
  })

  checkbox.addEventListener('change', () => {
    if (todo.id !== undefined) onToggle(todo.id, checkbox.checked)
  })

  // Here you can change the position of elements.
  li.appendChild(p)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  li.appendChild(categoryBadge)
  li.appendChild(deleteButton)

  return li
}
