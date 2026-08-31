import './style.css'
import { createTodoElement } from './components/todoItem'
import { clearStoredTodos, getStoredTodos, saveTodos } from './servcies/storage'
import type { Todo } from './types/todo'
import { checkHasOverdueTasks, getTodayString } from './utils/date'

console.log('Hello from typescript')

// Get references to the HTML elements
const todoDateInput = document.getElementById(
  'todo-date-input',
) as HTMLInputElement
const addTodoButton = document.getElementById(
  'add-todo-button',
) as HTMLButtonElement
const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoListContainer = document.getElementById(
  'todo-elements',
) as HTMLUListElement
const errorMessage = document.getElementById(
  'error-message',
) as HTMLParagraphElement
const errorMessagePriority = document.getElementById(
  'overdue-message',
) as HTMLParagraphElement
const deleteAllButton = document.getElementById(
  'delete-all',
) as HTMLButtonElement

// Local State
let todos: Todo[] = getStoredTodos()

const updateOverdueMessage = () => {
  if (checkHasOverdueTasks(todos)) {
    errorMessagePriority.classList.add('show', 'overdue-message')
    errorMessagePriority.textContent =
      'Please do the overdue task(s)! Use your time wisely. . .'
  } else {
    errorMessagePriority.classList.remove('show', 'overdue-message')
    errorMessagePriority.textContent = ''
  }
}

const renderTodos = () => {
  todoListContainer.innerHTML = ''

  todos.forEach((todo) => {
    const todoElement = createTodoElement(
      todo,
      (idToDelete) => {
        todos = todos.filter((t) => t.id !== idToDelete)
        saveTodos(todos)
        renderTodos()
      },
      (idToToggle, completed) => {
        const target = todos.find((t) => t.id === idToToggle)
        if (target) {
          target.completed = completed
          saveTodos(todos)
          renderTodos()
        }
      },
    )
    todoListContainer.appendChild(todoElement)
  })

  updateOverdueMessage()
}

// Add events
addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  const todoDate = todoDateInput.value.trim()
  const today = getTodayString()

  if (todoText) {
    if (todoDate && todoDate < today) {
      errorMessage.textContent =
        "You can't go to the past. . . It would be cool if you could, but you can't. . ."
      errorMessage.classList.add('show', 'shake')
      return
    }

    const finalDate = todoDate !== '' ? todoDate : null

    todos.push({
      id: crypto.randomUUID(),
      text: todoText,
      completed: false,
      date: finalDate,
    })

    saveTodos(todos)

    todoInput.value = ''
    todoDateInput.value = ''
    errorMessage.textContent = ''
    errorMessage.classList.remove('show')

    renderTodos()
  } else {
    errorMessage.textContent =
      "Please enter both a to-do and a date. You can't do nothing about your life. . ."
    errorMessage.classList.add('show', 'shake')
  }
})

deleteAllButton.addEventListener('click', () => {
  todos = []
  clearStoredTodos()
  renderTodos()
})

// Initial Load
renderTodos()
