import type { Todo } from '../types/todo'
import { getDueDateClass } from '../utils/date'

export const createTodoElement = (
  todo: Todo,
  onDelete: (todoId: string) => void,
  onToggle: (todoId: string, completed: boolean) => void,
): HTMLLIElement => {
  const li = document.createElement('li')
  const p = document.createElement('p')

  if (todo.date) {
    const timeElement = document.createElement('time')
    timeElement.dateTime = todo.date
    timeElement.textContent = todo.date
    const dueDateClass = getDueDateClass(todo.date, todo.completed)
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
  checkbox.checked = todo.completed

  const todoSpan = document.createElement('span')
  todoSpan.textContent = todo.text

  const deleteButton = document.createElement('button')
  deleteButton.textContent = '✕'
  deleteButton.classList.add('delete-btn')

  deleteButton.addEventListener('click', () => {
    onDelete(todo.id)
  })

  checkbox.addEventListener('change', () => {
    onToggle(todo.id, checkbox.checked)
  })

  li.appendChild(p)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  li.appendChild(deleteButton)

  return li
}
