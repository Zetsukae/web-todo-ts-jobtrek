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

let todos: string[] = []
const savedTodos = localStorage.getItem('todos')
if (savedTodos) {
  todos = JSON.parse(savedTodos)
}

todos.forEach((todoText) => {
  const li = document.createElement('li')
  li.textContent = todoText
  todoElements.appendChild(li)
})

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim()
  if (todoText) {
    const li = document.createElement('li')
    li.textContent = todoText
    todoElements.appendChild(li)
    todos.push(todoText)
    localStorage.setItem('todos', JSON.stringify(todos))

    todoInput.value = ''
    errorMessage.textContent = ''
  } else {
    errorMessage.textContent = 'Please enter something to-do.'
  }
})
