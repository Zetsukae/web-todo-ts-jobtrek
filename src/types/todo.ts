export interface Todo {
  id: number
  title: string
  content: string | null
  due_date: string | null
  done: boolean
  categories_todos?: CategoriesTodos[]
}

export interface Category {
  id: number
  title: string
  color: string
}

export interface CategoriesTodos {
  category_id: number
  todo_id: number
  categories?: Category
}
