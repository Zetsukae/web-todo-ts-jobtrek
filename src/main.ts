import './style.css'
import { createTodoElement } from './components/todoItem'
import {
  createTodoInApi,
  deleteAllTodosInApi,
  deleteTodoInApi,
  getTodosFromApi,
  updateTodoInApi,
} from './servcies/storage'
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
let todos: Todo[] = []

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
      [], // Emplacement pour les catégories dans les versions futures
      async (idToDelete) => {
        await deleteTodoInApi(idToDelete)
        todos = todos.filter((t) => t.id !== idToDelete)
        renderTodos()
      },
      async (idToToggle, done) => {
        const target = todos.find((t) => t.id === idToToggle)
        if (target) {
          await updateTodoInApi(idToToggle, { done })
          target.done = done
          renderTodos()
        }
      },
    )
    todoListContainer.appendChild(todoElement)
  })

  updateOverdueMessage()
}

// Add events
addTodoButton.addEventListener('click', async () => {
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

    const newTodo = await createTodoInApi({
      title: todoText,
      content: null,
      due_date: finalDate,
      done: false,
    })

    todos.push(newTodo)

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

deleteAllButton.addEventListener('click', async () => {
  await deleteAllTodosInApi()
  todos = []
  renderTodos()
})

// Initial Load
const loadInitialData = async () => {
  todos = await getTodosFromApi()
  renderTodos()
}

void loadInitialData()