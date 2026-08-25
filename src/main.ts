import './styles/style.css'
import { createTodoElement } from './components/todoItem'
import {
  createTodoInApi,
  deleteAllTodosInApi,
  deleteTodoInApi,
  getTodosFromApi,
  updateTodoInApi,
} from './servcies/storage'
import { setupTodoPlaceholderAnimation } from './styles/styles'
import type { Todo } from './types/todo'
import { checkHasOverdueTasks, getTodayString } from './utils/date'

console.log('Hello from typescript')

let todos: Todo[] = []
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
const overdueMessage = document.getElementById(
  'overdue-message',
) as HTMLParagraphElement
const deleteAllButton = document.getElementById(
  'delete-all',
) as HTMLButtonElement

setupTodoPlaceholderAnimation(todoInput)

const updateOverdueMessage = () => {
  overdueMessage.textContent = checkHasOverdueTasks(todos)
    ? 'Please do the overdue task(s)! Use your time wisely. . .'
    : ''
}

const loadingSpinner = document.getElementById('loading-spinner') as HTMLElement

const showLoading = () => {
  if (loadingSpinner) loadingSpinner.style.display = 'block'
}

const hideLoading = () => {
  if (loadingSpinner) loadingSpinner.style.display = 'none'
}

const renderTodos = () => {
  todoListContainer.innerHTML = ''

  todos.forEach((todo) => {
    const todoElement = createTodoElement(
      todo,
      async (idToDelete) => {
        showLoading()
        await deleteTodoInApi(idToDelete)
        todos = todos.filter((todoItem) => todoItem.id !== idToDelete)
        renderTodos()
        hideLoading()
      },
      async (idToToggle, done) => {
        const target = todos.find((t) => t.id === idToToggle)
        if (target) {
          showLoading()
          await updateTodoInApi(idToToggle, { done })
          target.done = done
          renderTodos()
          hideLoading()
        }
      },
    )
    todoListContainer.appendChild(todoElement)
  })

  updateOverdueMessage()
}

const loadTodos = async () => {
  showLoading()
  try {
    todos = await getTodosFromApi()
    renderTodos()
  } finally {
    hideLoading()
  }
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

    const newTodoFromApi = await createTodoInApi({
      title: todoText,
      due_date: finalDate,
      done: false,
    })

    todos.push(newTodoFromApi)
    renderTodos()

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
  void deleteAllTodosInApi().then(() => {
    todos = []
    renderTodos()
  })
})

void loadTodos()
