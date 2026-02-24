import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import GlobalToast from "./components/common/GlobalToast";
import MainLayout from "./layouts/MainLayout";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import ScenarioBuilderPage from "./pages/scenario-builder";
import UserManagementListUsersPage from "./pages/user-management/list-users";
import CreateUserPage from "./pages/user-management/user-actions/create-user";
import EditUserPage from "./pages/user-management/user-actions/edit-user";
import UserDetailsPage from "./pages/user-management/user-details";
import { theme } from "./theme/theme";
import ItemsMasterPage from "./pages/items-master";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sign-in" replace />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "scenario-builder",
        element: <ScenarioBuilderPage />,
      },
      {
        path: "user-management",
        children: [
          {
            path: "list-users",
            element: <UserManagementListUsersPage />,
          },
          {
            path: "create-user",
            element: <CreateUserPage />,
          },
          {
            path: "edit-user/:userId",
            element: <EditUserPage />,
          },
          {
            path: "user-details/:userId",
            element: <UserDetailsPage />,
          },
        ],
      },
       {
        path: "items-master",
        element: <ItemsMasterPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalToast />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
