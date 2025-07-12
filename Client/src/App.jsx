import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/layout/Root.jsx";
import UserSignUp from "./components/pages/Auth/UserSignUp.jsx";
import UserSignIn from "./components/pages/Auth/UserSignIn.jsx";
import OtpVerify from "./components/pages/Auth/OtpVerify.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import { AuthRouter } from "./middleware/AuthRouter.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/pages/Auth/Profile.jsx";
import ProfileUpdate from "./components/pages/Auth/ProfileUpdate.jsx";
import PasswordUpdate from "./components/pages/Auth/PasswordUpdate.jsx";
import ForgotPasswordLink from "./components/pages/Auth/ForgotPasswordLink.jsx";
import ResetPassword from "./components/pages/Auth/ResetPassword.jsx";

import Contact from "./components/pages/Contact.jsx";
import PricingPage from "./components/pages/PricingPage.jsx";
import TermsOfUsePrivacyPage from "./components/pages/TermsOfUsePrivacyPage.jsx";
import Expenses from "./components/pages/Expenses.jsx";
import Budgets from "./components/pages/Budgets.jsx";
import ExpenseForm from "./components/pages/Expense/ExpenseForm.jsx";
import BudgetForm from "./components/pages/Budgets/BudgetForm.jsx";
import BudgetEditForm from "./components/pages/Budgets/BudgetEditForm.jsx";
import Categories from "./components/pages/Categories/Categories.jsx";
import CategoriesEditForm from "./components/pages/Categories/CategoriesEditForm.jsx";
import ExpenseTable from "./components/pages/Expense/ExpenseTable.jsx";
import Blogs from "./components/pages/Blogs.jsx";
import BlogsForm from "./components/pages/Blogs/BlogsForm.jsx";
import BlogDetails from "./components/pages/Blogs/BlogDetails.jsx";
import BlogEditForm from "./components/pages/Blogs/BlogEditForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/signup",
        element: <UserSignUp />,
      },
      {
        path: "/signin",
        element: <UserSignIn />,
      },
      {
        path: "/otpverify",
        element: <OtpVerify />,
      },
      {
        path: "/reset-password-link",
        element: <ForgotPasswordLink />,
      },
      {
        path: "/account/reset-password/:id/:token",
        element: <ResetPassword />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/termsofuse",
        element: <TermsOfUsePrivacyPage />,
      },
      {
        element: <AuthRouter />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/edit-user/:id",
            element: <ProfileUpdate />,
          },
          {
            path: "/update-password",
            element: <PasswordUpdate />,
          },
          {
            path: "/expenses",
            element: <Expenses />,
          },
          {
            path: "/create-expense",
            element: <ExpenseForm />,
          },
          {
            path: "/expense-details",
            element: <ExpenseTable />,
          },
          {
            path: "/budgets",
            element: <Budgets />,
          },
          {
            path: "/create-budget",
            element: <BudgetForm />,
          },
          {
            path: "/get-budget/:id",
            element: <BudgetEditForm />,
          },
          {
            path: "/categories",
            element: <Categories />,
          },
          {
            path: "/get-category/:id",
            element: <CategoriesEditForm />,
          },
          {
            path: "/blogs",
            element: <Blogs />,
          },
          {
            path: "/create-blog",
            element: <BlogsForm />,
          },
          {
            path: "/blog-details/:id",
            element: <BlogDetails />,
          },
          {
            path: "/blog-update/:id",
            element: <BlogEditForm />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
