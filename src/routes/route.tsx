import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  CreateUserPage,
  EditUserPage,
  ItemsMasterPage,
  OtpPage,
  ScenarioBuilderDetailsPage,
  ScenarioBuilderPage,
  SignInPage,
  SignUpPage,
  UserDetailsPage,
  UserManagementListUsersPage,
} from "./elements";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

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
      {
        path: "otp",
        element: <OtpPage />,
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
          { index: true, element: <Navigate to="/scenario-builder" replace /> },
          {
            path: "scenario-builder",
            children: [
              { index: true, element: <ScenarioBuilderPage /> },
              {
                path: "details/:id",
                element: <ScenarioBuilderDetailsPage />,
              },
            ],
          },
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
