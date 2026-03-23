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
import { GlobalSettingsLayout } from "@/pages/global-settings";
import CompanyInfoPage from "@/pages/global-settings/components/CompanyInfoPage";
import SystemFields from "@/pages/global-settings/components/SystemFields";
import AttributeLabel from "@/pages/global-settings/components/AttributeLabel";
import OperationsSettings from "@/pages/global-settings/components/OperationsSettings";
import AlertsPage from "@/pages/global-settings/components/AlertsPage";
import GlobalSettingsUserDetailsPage from "@/pages/global-settings/components/user-mangement/user-details";
import GlobalSettingsListUsersPage from "@/pages/global-settings/components/user-mangement/list-users";
import GlobalSettingsCreateUserPage from "@/pages/global-settings/components/user-mangement/user-actions/create-user";
import GlobalSettingsEditUserPage from "@/pages/global-settings/components/user-mangement/user-actions/edit-user";

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
          {
            path: "global-settings",
            children: [
              {
                element: <GlobalSettingsLayout />,
                children: [
                  { index: true, element: <CompanyInfoPage /> },
                  { path: "system-fields", element: <SystemFields /> },
                  { path: "attributes", element: <AttributeLabel /> },
                  {
                    path: "operations-setting",
                    element: <OperationsSettings />,
                  },
                  { path: "alerts", element: <AlertsPage /> },
                  {
                    path: "users",
                    children: [
                      { index: true, element: <GlobalSettingsListUsersPage /> },
                      { path: "create-user", element: <GlobalSettingsCreateUserPage /> },
                      { path: "edit-user/:userId", element: <GlobalSettingsEditUserPage /> },
                      {
                        path: "user-details/:userId",
                        element: <GlobalSettingsUserDetailsPage />,
                      },
                    ],
                  },
                ],
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
