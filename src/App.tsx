import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import GlobalToast from "./components/common/GlobalToast";
import LoadingPage from "./pages/loading-page";
import { router } from "./routes/route";
import { theme } from "./theme/theme";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalToast />
        <Suspense fallback={<LoadingPage />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
