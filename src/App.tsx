import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import ShoppingList from "./pages/ShoppingList";
import SupportNetwork from "./pages/SupportNetwork";
import MyChildren from "./pages/MyChildren";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Theme from "./pages/Theme";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/lista" element={<ShoppingList />} />
              <Route path="/rede-apoio" element={<SupportNetwork />} />
              <Route path="/filhos" element={<MyChildren />} />
              <Route path="/lembretes" element={<Reminders />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/theme" element={<Theme />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
