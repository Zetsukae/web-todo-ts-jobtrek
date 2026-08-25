import type { Todo } from '../types/todo'
import { getDueDateClass } from '../utils/date'

export const createTodoElement = (
  todo: Todo,
  onDelete: (todoId: number) => void,
  onToggle: (todoId: number, done: boolean) => void,
): HTMLLIElement => {
  const li = document.createElement('li')
  const p = document.createElement('p')

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

  li.appendChild(p)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  li.appendChild(deleteButton)

  return li
}
