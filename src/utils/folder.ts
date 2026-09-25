import type { Folder, Todo } from '../types/todo'

const FOLDERS_STORAGE_KEY = 'todo-folders'

const FOLDER_ICONS = {
  COLLAPSED: '⮟',
  EXPANDED: '⮝',
} as const

export const getFoldersFromStorage = (): Folder[] => {
  const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY)

  if (!storedFolders) return []

  try {
    const parsed: unknown = JSON.parse(storedFolders)

    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((folder): Folder[] => {
      if (
        typeof folder !== 'object' ||
        folder === null ||
        !('id' in folder) ||
        typeof folder.id !== 'string' ||
        !('name' in folder) ||
        typeof folder.name !== 'string'
      ) {
        return []
      }

      const candidate = folder as {
        id: string
        name: string
        todoIds?: number[]
        isCollapsed?: boolean
      }

      const todoIds = Array.isArray(candidate.todoIds)
        ? candidate.todoIds.filter((id): id is number => typeof id === 'number')
        : []
      const isCollapsed = candidate.isCollapsed === true

      return [{ id: candidate.id, name: candidate.name, todoIds, isCollapsed }]
    })
  } catch {
    return []
  }
}

export const saveFoldersToStorage = (folders: Folder[]): void => {
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
}

export const associateTodoWithFolder = (
  folders: Folder[],
  folderId: string,
  todoId: number,
): Folder[] =>
  folders.map((folder) =>
    folder.id === folderId && !folder.todoIds.includes(todoId)
      ? { ...folder, todoIds: [...folder.todoIds, todoId] }
      : folder,
  )

export const removeTodoFromFolders = (
  folders: Folder[],
  todoId: number,
): Folder[] =>
  folders.map((folder) => ({
    ...folder,
    todoIds: folder.todoIds.filter((id) => id !== todoId),
  }))

export const createFolderElement = (
  folder: Folder,
  todos: Todo[],
  onDelete: (id: string) => void,
  onToggle: (id: string, isCollapsed: boolean) => void,
  createTodoElement: (todo: Todo) => HTMLLIElement,
): HTMLLIElement => {
  const li = document.createElement('li')
  const folderElement = document.createElement('span')
  folderElement.textContent = folder.name
  folderElement.className = 'folder-name'

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.textContent = '✕'
  deleteButton.className = 'delete-btnFolder'
  deleteButton.addEventListener('click', () => {
    onDelete(folder.id)
  })

  const folderDropdown = document.createElement('button')
  folderDropdown.type = 'button'
  folderDropdown.textContent = folder.isCollapsed
    ? FOLDER_ICONS.COLLAPSED
    : FOLDER_ICONS.EXPANDED
  folderDropdown.className = 'folder-dropdown-btn'
  const folderContainerTodos = document.createElement('div')
  folderContainerTodos.className = 'folder-todos'
  folderContainerTodos.style.display = folder.isCollapsed ? 'none' : 'flex'

  folderDropdown.addEventListener('click', () => {
    const isCollapsed = folderContainerTodos.style.display === 'none'
    folderDropdown.textContent = isCollapsed
      ? FOLDER_ICONS.EXPANDED
      : FOLDER_ICONS.COLLAPSED
    folderContainerTodos.style.display = isCollapsed ? 'flex' : 'none'
    onToggle(folder.id, !isCollapsed)
  })

  const numberOfTodos = document.createElement('span')
  numberOfTodos.className = 'number-of-todos'
  const folderTodos = todos.filter((todo) => folder.todoIds.includes(todo.id))
  const completedTodos = folderTodos.filter((todo) => todo.done).length
  folderElement.classList.toggle(
    'folder-name-completed',
    folderTodos.length > 0 && completedTodos === folderTodos.length,
  )
  numberOfTodos.textContent = `${completedTodos}/${folderTodos.length}`

  folderTodos.forEach((todo) => {
    folderContainerTodos.appendChild(createTodoElement(todo))
  })

  li.appendChild(folderDropdown)
  li.appendChild(numberOfTodos)
  li.appendChild(folderElement)
  li.appendChild(deleteButton)
  li.appendChild(folderContainerTodos)
  return li
}
