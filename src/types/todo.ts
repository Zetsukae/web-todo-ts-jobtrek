export interface Todo {
  id?: number
  title: string
  content?: string | null
  due_date?: string | null
  done: boolean
}

export interface Category {
  id?: number
  title?: string
  color?: string
}
