const placeholderMessages = [
  'Enter a new to-do!',
  'What needs doing?',
  'Make it to the peak!',
  'You should try my games!',
]

export const setupTodoPlaceholderAnimation = (todoInput: HTMLInputElement) => {
  let placeholderTimer: ReturnType<typeof setTimeout> | undefined
  let placeholderMessageIndex = 0
  let placeholderCharacterIndex = 0
  let isDeletingPlaceholder = false

  const animateTodoPlaceholder = () => {
    const message = placeholderMessages[placeholderMessageIndex]
    if (!message) return

    todoInput.placeholder = message.slice(0, placeholderCharacterIndex)

    if (!isDeletingPlaceholder && placeholderCharacterIndex < message.length) {
      placeholderCharacterIndex += 1
      placeholderTimer = setTimeout(animateTodoPlaceholder, 90)
      return
    }

    if (!isDeletingPlaceholder) {
      isDeletingPlaceholder = true
      placeholderTimer = setTimeout(animateTodoPlaceholder, 1800)
      return
    }

    if (placeholderCharacterIndex > 0) {
      placeholderCharacterIndex -= 1
      placeholderTimer = setTimeout(animateTodoPlaceholder, 45)
      return
    }

    isDeletingPlaceholder = false
    placeholderMessageIndex =
      (placeholderMessageIndex + 1) % placeholderMessages.length
    placeholderTimer = setTimeout(animateTodoPlaceholder, 350)
  }

  const startPlaceholderAnimation = () => {
    if (placeholderTimer === undefined) {
      placeholderTimer = setTimeout(animateTodoPlaceholder, 350)
    }
  }

  const stopPlaceholderAnimation = () => {
    if (placeholderTimer !== undefined) {
      clearTimeout(placeholderTimer)
      placeholderTimer = undefined
    }
    todoInput.placeholder = ''
  }

  todoInput.addEventListener('focus', stopPlaceholderAnimation)
  todoInput.addEventListener('blur', startPlaceholderAnimation)
  startPlaceholderAnimation()
}
