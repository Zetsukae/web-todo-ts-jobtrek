import './styles/style.css'
import { createTodoElement } from './components/todoItem'
import {
  createCategoryInApi,
  createTodoInApi,
  deleteAllTodosInApi,
  deleteCategoryInApi,
  deleteTodoInApi,
  getCategoriesFromApi,
  getTodosFromApi,
  updateCategoryInApi,
  updateTodoInApi,
} from './servcies/storage'
import { setupTodoPlaceholderAnimation } from './styles/styles'
import type { Category, Todo } from './types/todo'
import { checkHasOverdueTasks, getTodayString } from './utils/date'

console.log('Hello from typescript')

let todos: Todo[] = []
let categories: Category[] = []
let editingCategoryId: number | null = null

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
const errorCategory = document.getElementById(
  'error-category',
) as HTMLParagraphElement
const overdueMessage = document.getElementById(
  'overdue-message',
) as HTMLParagraphElement
const deleteAllButton = document.getElementById(
  'delete-all',
) as HTMLButtonElement

const categoryInput = document.getElementById(
  'category-name-input',
) as HTMLInputElement
const categoryColor = document.getElementById(
  'category-color-input',
) as HTMLInputElement
const addCategoryButton = document.getElementById(
  'add-category-button',
) as HTMLButtonElement
const categoriesContainer = document.getElementById(
  'categories-elements',
) as HTMLDivElement

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

const resetCategoryForm = () => {
  categoryInput.value = ''
  categoryColor.value = '#22c55e'
  editingCategoryId = null
  addCategoryButton.textContent = 'Add Category'
}

const renderCategories = () => {
  categoriesContainer.innerHTML = ''

  categories.forEach((category) => {
    const categoryItem = document.createElement('div')
    categoryItem.className = 'category-item'

    const categoryPill = document.createElement('span')
    categoryPill.className = 'categoryPill'
    categoryPill.textContent = category.title ?? 'Untitled category'
    categoryPill.style.backgroundColor = category.color ?? '#22c55e'
    categoryPill.style.color = '#ffffff'

    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.textContent = 'Edit'
    editButton.className = 'category-action-button'
    editButton.addEventListener('click', () => {
      categoryInput.value = category.title ?? ''
      categoryColor.value = category.color ?? '#22c55e'
      editingCategoryId = category.id ?? null
      addCategoryButton.textContent = 'Save Category'
    })

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.textContent = '✕'
    deleteButton.className = 'delete-btn'
    deleteButton.addEventListener('click', async () => {
      if (category.id == null) return

      showLoading()
      try {
        await deleteCategoryInApi(category.id)
        categories = categories.filter((item) => item.id !== category.id)
        renderCategories()

        if (editingCategoryId === category.id) {
          resetCategoryForm()
        }
      } finally {
        hideLoading()
      }
    })

    categoryItem.append(categoryPill, editButton, deleteButton)
    categoriesContainer.appendChild(categoryItem)
  })
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

const loadCategories = async () => {
  showLoading()
  try {
    categories = await getCategoriesFromApi()
    renderCategories()
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

addCategoryButton.addEventListener('click', async () => {
  const categoryText = categoryInput.value.trim()
  const categoryChoiceColor = categoryColor.value

  if (!categoryText) {
    errorCategory.textContent = 'Please enter a category name.'
    errorCategory.classList.add('show', 'shake')
    return
  }

  showLoading()

  try {
    if (editingCategoryId !== null) {
      const updatedCategory = await updateCategoryInApi(editingCategoryId, {
        title: categoryText,
        color: categoryChoiceColor,
      })

      categories = categories.map((category) =>
        category.id === editingCategoryId ? updatedCategory : category,
      )
      errorCategory.textContent = ''
      errorCategory.classList.remove('show')
    } else {
      const newCategory = await createCategoryInApi({
        title: categoryText,
        color: categoryChoiceColor,
      })
      categories.push(newCategory)
      errorCategory.textContent = ''
      errorCategory.classList.remove('show')
    }

    renderCategories()
    resetCategoryForm()
  } catch (error) {
    console.error('Failed to save category:', error)
    errorCategory.textContent = 'Unable to save the category. Please try again.'
    errorCategory.classList.add('show', 'shake')
  } finally {
    hideLoading()
  }
})

deleteAllButton.addEventListener('click', () => {
  void deleteAllTodosInApi().then(() => {
    todos = []
    renderTodos()
  })
})

void loadTodos()
void loadCategories()
