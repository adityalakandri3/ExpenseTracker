export const baseURL = "http://localhost:3006";

export const endPoints = {
  user: {
    signup: "/create-user",
    login: "/login-user",
    verifyOTP: "/verify-otp",
    sendResetLink: "/reset-password-link",
    resetpass: (id, token) => `/reset-password/${id}/${token}`,
    dashboard: "/user-dashboard",
    updatePassword: "/update-password",
    editUser: (id) => `/edit-user/${id}`,
    updateUser: (id) => `/update-user/${id}`,
    resetData:"/reset-data"
  },
  expense: {
    createExpense: "/create-expense",
    getExpenses: "/get-expenses",
    getExpensesById: (id) => `/get-expense/${id}`,
    updateExpenses: (id) => `/update-expense/${id}`,
    deleteExpenses: (id) => `/delete-expense/${id}`,
    filterExpense: "/filter-expense",
  },
  budget: {
    createBudget: "/create-budget",
    getBudgets: "/get-budgets",
    getBudgetsById: (id) => `/get-budget/${id}`,
    updateBudgets: (id) => `/update-budget/${id}`,
    deleteBudgets: (id) => `/delete-budget/${id}`,
    getBudgetSummary:'/getbudgetsummary'
  },
  category:{
    createCategory:"/user/create-category",
    getcategories:"/user/get-categories",
    getCategoriesById:(id)=>`/user/get-category-by-id/${id}`,
    updateCategory: (id) => `/user/update-catgory-by-id/${id}`,
    deleteCategory: (id) => `/user/delete-category/${id}`,
  },
  blog:{
    createpost:"/create-post",
    getpost:"/get-post",
    getPostById:(id)=>`/get-post-by-id/${id}`,
    updatepost: (id) => `/update-post/${id}`,
    deletepost: (id) => `/delete-post/${id}`,
  },
  blogCategory:{
    getBlogCategory:"/get-blog-categories",
    filterBlogCategory:"/filter-by-category"
  },
  dashboard: {
    stats: "/stats",
  },
  contact: {
    sendmessage: "/contact-message",
  },
  comment:{
    create:(postId)=>`/create-comment/${postId}`,
    getComments:(postId)=>`/get-comments/${postId}`
  }
};
