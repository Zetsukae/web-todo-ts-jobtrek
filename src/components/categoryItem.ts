import type { Category } from '../types/todo'

interface CategoryCallbacks {
  onEdit: (category: Category) => void
  onDelete: (categoryId: number) => Promise<void>
}

interface CategoryFormElements {
  input: HTMLInputElement
  colorInput: HTMLInputElement
  submitButton: HTMLButtonElement
}

/**
 * Creates a single DOM element for a category item.
 */
export const createCategoryElement = (
  category: Category,
  callbacks: CategoryCallbacks,
): HTMLDivElement => {
  const categoryItem = document.createElement('div')
  categoryItem.className = 'category-item'

  const categoryPill = document.createElement('span')
  categoryPill.className = 'categoryPill'
  categoryPill.textContent = category.title ?? 'Untitled category'
  categoryPill.style.backgroundColor = category.color ?? '#d042ff'
  categoryPill.style.color = '#ffffff'

  const editButton = document.createElement('button')
  editButton.type = 'button'
  editButton.textContent = 'Edit'
  editButton.className = 'category-action-button'
  editButton.addEventListener('click', () => callbacks.onEdit(category))

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.textContent = '✕'
  deleteButton.className = 'delete-btnCat'
  deleteButton.addEventListener('click', async () => {
    if (category.id != null) {
      await callbacks.onDelete(category.id)
    }
  })

  categoryItem.append(categoryPill, editButton, deleteButton)
  return categoryItem
}

/**
 * Resets the category creation/editing form.
 */
export const resetCategoryForm = (
  elements: CategoryFormElements,
): number | null => {
  elements.input.value = ''
  elements.colorInput.value = '#d042ff'
  elements.submitButton.textContent = 'Add Category'
  return null
}

/**
 * Pre-fills the category form for editing.
 */
export const populateCategoryFormForEdit = (
  category: Category,
  elements: CategoryFormElements,
): number | null => {
  elements.input.value = category.title ?? ''
  elements.colorInput.value = category.color ?? '#d042ff'
  elements.submitButton.textContent = 'Save Category'
  return category.id ?? null
}
