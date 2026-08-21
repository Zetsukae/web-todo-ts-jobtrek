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

// Function to manage the global display of the overdue message
const updateOverdueMessage = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const hasOverdueTasks = todos.some((todo) => {
    if (!todo.date || todo.completed) return false
    const dueDate = new Date(`${todo.date}T00:00:00`)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() < today.getTime()
  })

  if (hasOverdueTasks) {
    errorMessagePriority.classList.add('show', 'overdue-message')
    errorMessagePriority.textContent =
      'Please do the overdue task(s)! Use your time wisely. . .'
  } else {
    errorMessagePriority.classList.remove('show', 'overdue-message')
    errorMessagePriority.textContent = ''
  }
}

// change color on due date
const getDueDateClass = (
  dateString: string,
  completed: boolean,
): string | null => {
  if (completed) {
    return 'date-no-due'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${dateString}T00:00:00`)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'date-overdue'
  }

  if (diffDays === 0) {
    return 'date-today'
  }

  if (diffDays >= 2 && diffDays <= 4) {
    return 'date-this-week'
  }

  if (diffDays > 4) {
    return 'date-future'
  }

  return null
}

// Display the todos on page load
todos.forEach((todo) => {
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
    updateOverdueMessage() // Update the message instantly when a task is deleted
  })

  checkbox.checked = todo.completed

  // Append elements to the list item and then to the todoElements
  li.appendChild(p)
  li.appendChild(checkbox)
  li.appendChild(todoSpan)
  li.appendChild(deleteButton)
  todoListContainer.appendChild(li)

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked
    localStorage.setItem('todos', JSON.stringify(todos))
    const timeElement = li.querySelector('time')
    if (timeElement && todo.date) {
      timeElement.className = getDueDateClass(todo.date, todo.completed) ?? ''
    }
    updateOverdueMessage() // Update the message instantly when a task is checked/unchecked
  })
})

// Initial check on page load
updateOverdueMessage()

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  const todoDate = todoDateInput.value.trim()
  const now = new Date()
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .split('T')[0]

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
    errorMessage.textContent =
      "Please enter both a to-do and a date. You can't do nothing about your life. . ."
    errorMessage.classList.add('show', 'shake')
  }
})

deleteAllButton.addEventListener('click', () => {
  todos = []
  localStorage.removeItem('todos')
  todoListContainer.innerHTML = ''
  updateOverdueMessage() // Update the message instantly when all tasks are deleted
})
// Rasiel was here ;} RK too :]
