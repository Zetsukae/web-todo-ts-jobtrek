import './style.css'

console.log('Hello from typescript')

const addTodoButton = document.getElementById(
  'add-todo-button',
) as HTMLButtonElement
const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoElements = document.getElementById(
  'todo-elements',
) as HTMLUListElement

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  const errorMessage = document.getElementById(
    'error-message',
  ) as HTMLParagraphElement
  if (todoText) {
    const li = document.createElement('li')
    li.textContent = todoText
    todoElements.appendChild(li)
    todoInput.value = ''
    errorMessage.textContent = ''
  }
  if (!todoText) {
    errorMessage.textContent = 'Please enter something to-do.'
  }
})
