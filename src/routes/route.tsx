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
import BulkInsertPage from "@/pages/items-master-refactor/Pages/bulk-insert";
import Onboarding from "@/pages/onboarding";
import TenantSignUp from "@/pages/auth/tenent-sign-up";
import TenantOtpPage from "@/pages/auth/tenent-otp-page";
import TenantSignInPage from "@/pages/auth/tenant-sign-in";

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
      {
        path: "tenant-sign-up",
        element: <TenantSignUp />,
      },
      {
        path: "tenant-otp",
        element: <TenantOtpPage />,
      },
      {
        path: "tenant-sign-in",
        element: <TenantSignInPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      { path: "onboarding", element: <Onboarding /> },
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
          {
            path: "items-master",
            children: [
              { index: true, element: <ItemsMasterPage /> },
              {
                path: "bulk-insert",
                element: <BulkInsertPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  // { path: "*", element: <Navigate to="/404" replace /> },
];

export const router = createBrowserRouter(routes);
