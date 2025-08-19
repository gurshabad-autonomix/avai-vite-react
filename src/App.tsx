import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router";
import AppShell from "@/pages/app-shell";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppShell />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
