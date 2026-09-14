/* Main entry point for the application
 * You will see comments recommendations if you fork this project, you can ignore it or implement my recommendations.
 * Made by 7etsukae.Hope you can learn something from this project. If you have any questions, feel free to ask me in the issues section. I will try to answer your questions as soon as possible. Thank you for your support and interest in this project.
 *
 * Note: Im currently switching to Codeberg. So i might not answer your questions in time. But I will try to answer your questions as soon as possible.
 * If you fork this project just credit me for the design/CSS if you don't change it. No need to credit me on the backend side. */

// Import logic from others files.
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

import type { Category, Folder, Todo } from './types/todo'
import { checkHasOverdueTasks, getTodayString } from './utils/date'
import {
  associateTodoWithFolder,
  createFolderElement,
  getFoldersFromStorage,
  removeTodoFromFolders,
  saveFoldersToStorage,
} from './utils/folder'

console.log('Hello from typescript') // Making sure it work.

let todos: Todo[] = []
let categories: Category[] = []
let folders: Folder[] = []
let editingCategoryId: number | null = null

// Get references to the HTML elements
const webTitle = document.querySelector('#web-title') as HTMLHeadingElement

const todoDateInput = document.querySelector(
  '#todo-date-input',
) as HTMLInputElement
const addTodoButton = document.querySelector(
  '#add-todo-button',
) as HTMLButtonElement
const todoInput = document.querySelector('#todo-input') as HTMLInputElement
const todoListContainer = document.querySelector(
  '#todo-elements',
) as HTMLUListElement
const folderListContainer = document.querySelector(
  '#todo-folders',
) as HTMLUListElement
const folderDivider = document.querySelector('#folder-divider') as HTMLHRElement
const errorMessage = document.querySelector(
  '#error-message',
) as HTMLParagraphElement
const errorCategory = document.querySelector(
  '#error-category',
) as HTMLParagraphElement
const deleteAllButton = document.querySelector(
  '#delete-all',
) as HTMLButtonElement

const categoryInput = document.querySelector(
  '#category-name-input',
) as HTMLInputElement
const categoryColor = document.querySelector(
  '#category-color-input',
) as HTMLInputElement
const addCategoryButton = document.querySelector(
  '#add-category-button',
) as HTMLButtonElement
const categoriesContainer = document.querySelector(
  '#categories-elements',
) as HTMLDivElement
const todoAssignmentSelect = document.querySelector(
  '#todo-assignment-select',
) as HTMLSelectElement

const typeSelect = document.querySelector('#type-select') as HTMLSelectElement
const addFolderButton = document.querySelector(
  '#add-folder-button',
) as HTMLButtonElement
const folderInput = document.querySelector('#folder-input') as HTMLInputElement

const categoryFormElements = {
  input: categoryInput,
  colorInput: categoryColor,
  submitButton: addCategoryButton,
}

// Render the options available on the TodosType.
const renderTodoAssignmentOptions = () => {
  const groups = todoAssignmentSelect.querySelectorAll('optgroup')
  const organizerGroup = groups[0]
  const categoryGroup = groups[1]
  const folderGroup = groups[2]

  if (!organizerGroup || !categoryGroup || !folderGroup) return

  organizerGroup.innerHTML = ''
  categoryGroup.innerHTML = ''
  folderGroup.innerHTML = ''

  const noneOption = document.createElement('option')
  noneOption.textContent = 'Choose none'
  noneOption.value = ''
  noneOption.selected = true
  organizerGroup.appendChild(noneOption)

  if (categories.length === 0) {
    const emptyOption = document.createElement('option')
    emptyOption.textContent = 'No categories available'
    emptyOption.value = ''
    emptyOption.disabled = true
    categoryGroup.appendChild(emptyOption)
  } else {
    categories.forEach((category) => {
      const option = document.createElement('option')
      option.value = `category:${category.id}`
      option.textContent = category.title
      categoryGroup.appendChild(option)
    })
  }

  if (folders.length === 0) {
    const emptyOption = document.createElement('option')
    emptyOption.textContent = 'No folders available'
    emptyOption.value = ''
    emptyOption.disabled = true
    folderGroup.appendChild(emptyOption)
  } else {
    folders.forEach((folder) => {
      const option = document.createElement('option')
      option.value = `folder:${folder.id}`
      option.textContent = folder.name
      folderGroup.appendChild(option)
    })
  }

  todoAssignmentSelect.value = ''
}

// Get the current Type selected
const getTypeSelectValue = (): 'To-do' | 'Folder' => {
  const selectedValue = typeSelect.value
  if (selectedValue === 'To-do' || selectedValue === 'Folder') {
    return selectedValue
  }
  return 'To-do'
}

// const to if it should be invisible or not when the Type's Selected.
const updateTypeVisibility = () => {
  const selectedType = getTypeSelectValue()
  if (selectedType === 'To-do') {
    webTitle.textContent = 'Todos'
    todoInput.style.display = 'inline-block'
    folderInput.style.display = 'none'
    todoAssignmentSelect.style.display = 'inline-block'
    addTodoButton.style.display = 'inline-block'
    addFolderButton.style.display = 'none'
    todoDateInput.style.display = 'inline-block'
  } else {
    webTitle.textContent = 'Folders'
    todoInput.style.display = 'none'
    folderInput.style.display = 'inline-block'
    todoAssignmentSelect.style.display = 'none'
    addTodoButton.style.display = 'none'
    addFolderButton.style.display = 'inline-block'
    todoDateInput.style.display = 'none'
  }
}

// Events on the TypeSelect
typeSelect.addEventListener('change', updateTypeVisibility)
updateTypeVisibility()

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

// Will render the created todo.
const createRenderedTodoElement = (todo: Todo): HTMLLIElement =>
  createTodoElement(
    todo,
    categories,
    async (idToDelete) => {
      showLoading()
      try {
        await deleteTodoInApi(idToDelete)
        todos = todos.filter((todoItem) => todoItem.id !== idToDelete)
        folders = removeTodoFromFolders(folders, idToDelete)
        saveFoldersToStorage(folders)
        renderTodos()
        renderFolders()
      } finally {
        hideLoading()
        console.log('> Successful: Deleted Todo.')
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
          renderFolders()
        } finally {
          hideLoading()
          console.log("> Successful: To-do's action[checkbox].")
        }
      }
    },
  )

// Will render all the Todos.
const renderTodos = () => {
  todoListContainer.innerHTML = ''

  todos
    .filter(
      (todo) => !folders.some((folder) => folder.todoIds.includes(todo.id)),
    )
    .forEach((todo) => {
      todoListContainer.appendChild(createRenderedTodoElement(todo))
    })

  updateOverdueMessage()
}

// Will render all the Categories.
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

  renderTodoAssignmentOptions()
}

// Will render all the Folders in the Front-end.
const renderFolders = () => {
  folderListContainer.innerHTML = ''
  folderDivider.hidden = folders.length === 0

  folders.forEach((folder) => {
    const folderElement = createFolderElement(
      folder,
      todos,
      async (idToDelete) => {
        const folderToDelete = folders.find((item) => item.id === idToDelete)
        if (!folderToDelete) return

        showLoading()
        try {
          await Promise.all(
            folderToDelete.todoIds.map((todoId) => deleteTodoInApi(todoId)),
          )

          const deletedTodoIds = new Set(folderToDelete.todoIds)
          todos = todos.filter((todo) => !deletedTodoIds.has(todo.id))
          folders = folders.filter((item) => item.id !== idToDelete)
          saveFoldersToStorage(folders)
          renderTodos()
          renderFolders()
        } finally {
          hideLoading()
        }
      },
      (id, isCollapsed) => {
        folders = folders.map((folder) =>
          folder.id === id ? { ...folder, isCollapsed } : folder,
        )
        saveFoldersToStorage(folders)
      },
      createRenderedTodoElement,
    )
    folderListContainer.appendChild(folderElement)
  })

  renderTodoAssignmentOptions()
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
    folders = getFoldersFromStorage()
    renderCategories()
    renderTodos()
    renderFolders()
  } catch (error) {
    console.log("Failed to load initial data:", error)
    errorCategory.textContent = 'Failed to load data. Please check your connection.'
    errorCategory?.classList.add('show', 'shake')
  } finally {
    hideLoading()
    console.log('> Successful: Data has been loaded.')
  }
}

// This func add a todo when the button is pressed (Add To-do)
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
    const [selectedType, selectedId] = todoAssignmentSelect.value.split(':')
    const selectedCategoryId =
      selectedType === 'category' && selectedId ? Number(selectedId) : null
    const selectedFolderId =
      selectedType === 'folder' && selectedId ? selectedId : null
    const todoContent =
      selectedCategoryId !== null
        ? JSON.stringify({ category_id: selectedCategoryId })
        : selectedFolderId !== null
          ? JSON.stringify({ folder_id: selectedFolderId })
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

      if (selectedFolderId !== null) {
        folders = associateTodoWithFolder(
          folders,
          selectedFolderId,
          newTodoFromApi.id,
        )
        saveFoldersToStorage(folders)
      }

      todos.push(newTodoFromApi)
      renderTodos()
      renderFolders()

      todoInput.value = ''
      todoDateInput.value = ''
      todoAssignmentSelect.value = ''
      errorMessage.textContent = ''
      errorMessage.classList.remove('show')
    } finally {
      console.log('> Successful: To-dos loaded.')
      hideLoading()
    }
  } else {
    errorMessage.textContent =
      "Please enter both a to-do and a date. You can't do nothing about your life. . ."
    errorMessage.classList.add('show', 'shake')
  }
}

//Note: To add a Category on a todo inside a folder, you need to add a edit function, take example on the category edit function. Make sure to add compatibility between folders and categories. Or you can add a Folder section to make it more simple.
// This func add a Folder when the button is pressed (Add Folder)
const addFolderAction = () => {
  const folderText = folderInput.value.trim()

  if (!folderText) {
    errorMessage.textContent =
      'Please enter a folder name. Need inspiration? Try OneShot!'
    errorMessage.classList.add('show', 'shake')
    return
  }

  const newFolder: Folder = {
    id: crypto.randomUUID(),
    name: folderText,
    todoIds: [],
    isCollapsed: false,
  }

  folders.push(newFolder)
  saveFoldersToStorage(folders)
  renderFolders()
  folderInput.value = ''
  errorMessage.textContent = ''
  errorMessage.classList.remove('show', 'shake')
}

// Action to add the category.
const addCategoryAction = async () => {
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
      errorCategory?.classList.remove('show')
    } else {
      const newCategory = await createCategoryInApi({
        title: categoryText,
        color: categoryChoiceColor,
      })
      categories.push(newCategory)
      errorCategory.textContent = ''
      errorCategory?.classList.remove('show')
    }

    renderCategories()
    renderTodos()
    editingCategoryId = resetCategoryForm(categoryFormElements)
  } catch (error) {
    console.error('Failed to save category:', error)
    errorCategory.textContent = 'Unable to save the category. Please try again.'
    errorCategory?.classList.add('show', 'shake')
  } finally {
    hideLoading()
    console.log('> Successful: Categories loaded.')
  }
}

//Note: We don't use 'keyup' there, because keydown's when this is pressed, keyup's when this is released.
// Add Events on 'Enter' Pressed.
folderInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addFolderAction()
  }
})

todoInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addTodoAction()
  }
})

categoryInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addCategoryAction()
  }
})

// Add Events on 'LMB' Pressed.
// Action to add the todo.
addTodoButton.addEventListener('click', () => {
  addTodoAction()
})

// Action to add the folder.
addFolderButton.addEventListener('click', () => {
  addFolderAction()
})

addCategoryButton.addEventListener('click', () => {
  addCategoryAction()
})

// When pressed, delete everything. Cannot be undone. Use with caution.
deleteAllButton.addEventListener('click', async () => {
  showLoading()
  try {
    await deleteAllTodosInApi()
    await Promise.all(
      categories.map((category) => deleteCategoryInApi(category.id)),
    )
    todos = []
    categories = []
    folders = []
    saveFoldersToStorage(folders)
    renderTodos()
    renderCategories()
    renderFolders()
  } finally {
    hideLoading()
    console.log('> Successful: Deleted in LocalStorage & DB')
  }
})

void loadData()
