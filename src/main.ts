import './style.css'

console.log('Hello from typescript')

const addTodoButton = document.getElementById(
  'add-todo-button',
) as HTMLButtonElement
const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoElements = document.getElementById(
  'todo-elements',
) as HTMLUListElement
const errorMessage = document.getElementById(
  'error-message',
) as HTMLParagraphElement
const deleteAllButton = document.getElementById('delete-all') as HTMLButtonElement

interface Todo {
  text: string
  completed: boolean
}

let todos: Todo[] = []
const savedTodos = localStorage.getItem('todos')
if (savedTodos) {
  todos = JSON.parse(savedTodos)
}

todos.forEach((todo) => {
  const li = document.createElement('li')
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  const todoSpan = document.createElement('span')
  todoSpan.textContent = todo.text
  const deleteButton = document.createElement('button')
  deleteButton.textContent = '✕'
  deleteButton.classList.add('delete-btn')
  deleteButton.addEventListener('click', () => {
    todos = todos.filter((t) => t !== todo)
    localStorage.setItem('todos', JSON.stringify(todos))
    li.remove()
  })

  checkbox.checked = todo.completed

  li.appendChild(deleteButton)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  todoElements.appendChild(li)

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked
    localStorage.setItem('todos', JSON.stringify(todos))
  }) // [75] Bug IK : When create a todo and check it, and refresh, it doesn't save the state. We need to reload, recheck it and then it saves :ü
})

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  if (todoText) {
    const li = document.createElement('li')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    const todoSpan = document.createElement('span')
    todoSpan.textContent = todoText

    li.appendChild(checkbox)
    li.appendChild(todoSpan)
    todoElements.appendChild(li)

    todoInput.value = ''

    errorMessage.textContent = ''
    errorMessage.classList.remove('show')

    todos.push({ text: todoText, completed: false })
    localStorage.setItem('todos', JSON.stringify(todos))
    window.location.reload() // [52] temporary fix for the bug, will be fixed in the next update
  } else {
    errorMessage.textContent =
      "Please enter something to-do. You can't do nothing about your life. . ."
    errorMessage.classList.add('show')
    errorMessage.classList.remove('shake')
    errorMessage.offsetWidth
    errorMessage.classList.add('shake')
  }
})

deleteAllButton.addEventListener('click', () => {
  todos = []
  localStorage.removeItem('todos')
  todoElements.innerHTML = ''
})
// Rasiel was here ;} RK too :]
