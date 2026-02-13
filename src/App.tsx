import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "@/contexts/SessionContext";
import { RequireState } from "@/components/RequireState";
import { AppLayout } from "@/layouts/AppLayout";
import { FullScreenLoader } from "@/components/FullScreenLoader";

// Public routes (static imports for critical path)
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import OAuthCallback from "./pages/OAuthCallback";
import BemVinda from "./pages/BemVinda";

// Protected routes (lazy loaded)
const Home = lazy(() => import("./pages/Home"));
const Agenda = lazy(() => import("./pages/Agenda"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const SupportNetwork = lazy(() => import("./pages/SupportNetwork"));
const MyChildren = lazy(() => import("./pages/MyChildren"));
const Reminders = lazy(() => import("./pages/Reminders"));
const Memory = lazy(() => import("./pages/Memory"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Theme = lazy(() => import("./pages/Theme"));

// Legal pages (lazy loaded)
const Privacy = lazy(() => import("./pages/_legacy/Privacy"));
const Terms = lazy(() => import("./pages/_legacy/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Monna App
const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<FullScreenLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/cookies" element={<Cookies />} />

              {/* Onboarding — only ONBOARDING state */}
              <Route path="/bem-vinda" element={
                <RequireState allowed={['ONBOARDING']}>
                  <BemVinda />
                </RequireState>
              } />

              {/* Protected routes — only READY state */}
              <Route element={
                <RequireState allowed={['READY']}>
                  <AppLayout />
                </RequireState>
              }>
                <Route path="/home" element={<Home />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/lista" element={<ShoppingList />} />
                <Route path="/rede-apoio" element={<SupportNetwork />} />
                <Route path="/filhos" element={<MyChildren />} />
                <Route path="/lembretes" element={<Reminders />} />
                <Route path="/memoria" element={<Memory />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/theme" element={<Theme />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
