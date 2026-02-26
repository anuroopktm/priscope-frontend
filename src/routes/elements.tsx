import { lazy } from "react";

export const SignInPage = lazy(() => import("@/pages/auth/sign-in"));
export const SignUpPage = lazy(() => import("@/pages/auth/sign-up"));
export const OtpPage = lazy(() => import("@/pages/auth/otp"));
export const ScenarioBuilderPage = lazy(
  () => import("@/pages/scenario-builder/list-scenarios"),
);
export const ScenarioBuilderDetailsPage = lazy(
  () => import("@/pages/scenario-builder/scenario-details"),
);
export const UserManagementListUsersPage = lazy(
  () => import("@/pages/user-management/list-users"),
);
export const CreateUserPage = lazy(
  () => import("@/pages/user-management/user-actions/create-user"),
);
export const EditUserPage = lazy(
  () => import("@/pages/user-management/user-actions/edit-user"),
);
export const UserDetailsPage = lazy(
  () => import("@/pages/user-management/user-details"),
);
export const ItemsMasterPage = lazy(() => import("@/pages/items-master"));
