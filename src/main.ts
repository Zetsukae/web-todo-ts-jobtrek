import './style.css'

console.log('Hello from typescript')

// Get references to the HTML elements
const todoDateInput = document.getElementById(
  'todo-date-input',
) as HTMLInputElement
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
const deleteAllButton = document.getElementById(
  'delete-all',
) as HTMLButtonElement

// Define the Todo interface (LS)
interface Todo {
  text: string
  completed: boolean
  date: string | null
}

let todos: Todo[] = []
const savedTodos = localStorage.getItem('todos')
if (savedTodos) {
  todos = JSON.parse(savedTodos)
}

// Display the todos on page load
todos.forEach((todo) => {
  const p = document.createElement('p')

  if (todo.date) {
    const timeElement = document.createElement('time')
    timeElement.dateTime = todo.date
    timeElement.textContent = todo.date
    p.appendChild(timeElement)
  } else {
    p.textContent = 'no due date'
  }

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

  // Append elements to the list item and then to the todoElements
  li.appendChild(deleteButton)
  li.appendChild(p)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  todoElements.appendChild(li)

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked
    localStorage.setItem('todos', JSON.stringify(todos))
  })
})

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  const todoDate = todoDateInput.value.trim()
  const today = new Date().toISOString().split('T')[0]

  // Validate the input and add the new todo
  if (todoText) {
    if (todoDate && todoDate < today) {
      errorMessage.textContent =
        "You can't go to the past. . . It would be cool if you could, but you can't. . ."
      errorMessage.classList.add('show', 'shake')
      return
    }

    const finalDate = todoDate !== '' ? todoDate : null

    todos.push({ text: todoText, completed: false, date: finalDate })
    localStorage.setItem('todos', JSON.stringify(todos))

    errorMessage.textContent = ''
    errorMessage.classList.remove('show')
    window.location.reload()
  } else {
    errorMessage.textContent = "Please enter both a to-do and a date. You can't do nothing about your life. . ."
    errorMessage.classList.add('show', 'shake')
  }
})

deleteAllButton.addEventListener('click', () => {
  todos = []

  localStorage.removeItem('todos')

  todoElements.innerHTML = ''
})
// Rasiel was here ;} RK too :]
