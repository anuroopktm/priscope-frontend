import { createBrowserRouter, Navigate } from "react-router-dom";
// layouts
import MainLayout from "@/layouts/MainLayout";
// guards
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
// components
import {
  CreateUserPage,
  EditUserPage,
  ItemsMasterPage,
  ScenarioBuilderPage,
  SignInPage,
  SignUpPage,
  UserDetailsPage,
  UserManagementListUsersPage,
} from "./elements";

export const routes = [
  {
    path: "auth",
    element: <GuestGuard />,
    children: [
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { element: <Navigate to="/scenario-builder" replace />, index: true },
          { path: "scenario-builder", element: <ScenarioBuilderPage /> },
          {
            path: "user-management",
            children: [
              { path: "list-users", element: <UserManagementListUsersPage /> },
              { path: "create-user", element: <CreateUserPage /> },
              { path: "edit-user/:userId", element: <EditUserPage /> },
              { path: "user-details/:userId", element: <UserDetailsPage /> },
            ],
          },
          { path: "items-master", element: <ItemsMasterPage /> },
        ],
      },
    ],
  },
  // { path: "*", element: <Navigate to="/404" replace /> },
];

export const router = createBrowserRouter(routes);
