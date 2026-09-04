import './styles/style.css'
import {
  createCategoryElement,
  populateCategoryFormForEdit,
  resetCategoryForm,
} from './components/categoryItem'
import { createTodoElement } from './components/todoItem'
import {
  assignCategoryToTodo,
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
const todoCategorySelect = document.getElementById(
  'todo-category-select',
) as HTMLSelectElement

const categoryFormElements = {
  input: categoryInput,
  colorInput: categoryColor,
  submitButton: addCategoryButton,
}

const renderTodoCategoryOptions = () => {
  const categoryGroup = todoCategorySelect.querySelector('optgroup')

  if (!categoryGroup) return

  categoryGroup.innerHTML = ''

  if (categories.length === 0) {
    const emptyOption = document.createElement('option')
    emptyOption.textContent = 'No categories available'
    emptyOption.value = ''
    emptyOption.disabled = true
    emptyOption.selected = true
    categoryGroup.appendChild(emptyOption)
    return
  }

  const noneOption = document.createElement('option')
  noneOption.textContent = 'Choose none'
  noneOption.value = ''
  categoryGroup.appendChild(noneOption)

  const separator = document.createElement('hr')
  categoryGroup.appendChild(separator)

  categories.forEach((category) => {
    const option = document.createElement('option')
    option.value = String(category.id ?? '')
    option.textContent = category.title ?? 'Untitled category'
    categoryGroup.appendChild(option)
  })

  todoCategorySelect.value = ''
}

const updateOverdueMessage = () => {
  const hasOverdue = checkHasOverdueTasks(todos)

  if (hasOverdue) {
    errorMessage.textContent =
      'Please do the overdue task(s)! Use your time wisely. . .'
    errorMessage.classList.add('show', 'shake')
  } else {
    errorMessage.textContent = ''
    errorMessage.classList.remove('show', 'shake')
  }
}

const loadingSpinners =
  document.querySelectorAll<HTMLElement>('.loading-spinner')

const showLoading = () => {
  loadingSpinners.forEach((spinner) => {
    spinner.style.display = 'block'
  })
}

const hideLoading = () => {
  loadingSpinners.forEach((spinner) => {
    spinner.style.display = 'none'
  })
}

const renderTodos = () => {
  todoListContainer.innerHTML = ''

  todos.forEach((todo) => {
    const todoElement = createTodoElement(
      todo,
      categories,
      async (idToDelete) => {
        showLoading()
        try {
          await deleteTodoInApi(idToDelete)
          todos = todos.filter((todoItem) => todoItem.id !== idToDelete)
          renderTodos()
        } finally {
          hideLoading()
        }
      },
      async (idToToggle, done) => {
        const target = todos.find((t) => t.id === idToToggle)
        if (target) {
          showLoading()
          try {
            await updateTodoInApi(idToToggle, { done })
            target.done = done
            renderTodos()
          } finally {
            hideLoading()
          }
        }
      },
    )
    todoListContainer.appendChild(todoElement)
  })

  updateOverdueMessage()
}

const renderCategories = () => {
  categoriesContainer.innerHTML = ''

  categories.forEach((category) => {
    const categoryElement = createCategoryElement(category, {
      onEdit: (catToEdit) => {
        editingCategoryId = populateCategoryFormForEdit(
          catToEdit,
          categoryFormElements,
        )
      },
      onDelete: async (idToDelete) => {
        showLoading()
        try {
          await deleteCategoryInApi(idToDelete)
          categories = categories.filter((item) => item.id !== idToDelete)
          renderCategories()
          renderTodos()

          if (editingCategoryId === idToDelete) {
            editingCategoryId = resetCategoryForm(categoryFormElements)
          }
        } finally {
          hideLoading()
        }
      },
    })

    categoriesContainer.appendChild(categoryElement)
  })

  renderTodoCategoryOptions()
}

const loadData = async () => {
  showLoading()
  try {
    const [loadedTodos, loadedCategories] = await Promise.all([
      getTodosFromApi(),
      getCategoriesFromApi(),
    ])

    todos = loadedTodos
    categories = loadedCategories
    renderCategories()
    renderTodos()
  } finally {
    hideLoading()
  }
}

const addTodoAction = async () => {
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
    const selectedCategoryId =
      todoCategorySelect.value === '' ? null : Number(todoCategorySelect.value)
    const todoContent =
      selectedCategoryId !== null
        ? JSON.stringify({ category_id: selectedCategoryId })
        : null

    showLoading()
    try {
      const newTodoFromApi = await createTodoInApi({
        title: todoText,
        content: todoContent,
        due_date: finalDate,
        done: false,
      })

      if (selectedCategoryId !== null) {
        await assignCategoryToTodo(newTodoFromApi.id, selectedCategoryId)
      }

      todos.push(newTodoFromApi)
      renderTodos()

      todoInput.value = ''
      todoDateInput.value = ''
      todoCategorySelect.value = ''
      errorMessage.textContent = ''
      errorMessage.classList.remove('show')
    } finally {
      hideLoading()
    }
  } else {
    errorMessage.textContent =
      "Please enter both a to-do and a date. You can't do nothing about your life. . ."
    errorMessage.classList.add('show', 'shake')
  }
}

// Add Events
addTodoButton.addEventListener('click', () => {
  addTodoAction()
})

todoInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addTodoAction()
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
    renderTodos()
    editingCategoryId = resetCategoryForm(categoryFormElements)
  } catch (error) {
    console.error('Failed to save category:', error)
    errorCategory.textContent = 'Unable to save the category. Please try again.'
    errorCategory.classList.add('show', 'shake')
  } finally {
    hideLoading()
  }
})

deleteAllButton.addEventListener('click', async () => {
  showLoading()
  try {
    await deleteAllTodosInApi()
    todos = []
    renderTodos()
  } finally {
    hideLoading()
  }
})

void loadData()
