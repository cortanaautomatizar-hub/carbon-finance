
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider, RequireAuth } from "@/contexts/AuthContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import Index from "./pages/Index";
import CreditCardPage from "./pages/CreditCard";
import CardDetail from "./pages/CardDetail";
import CardsSummaryPage from "./pages/CardsSummary";
import ExtratoPage from "./pages/Extrato";
import { SubscriptionControl } from "./pages/SubscriptionControl";
import FinancialAssistantPage from "./pages/FinancialAssistant";
import PaymentsPage from "./pages/PaymentsPage";
import Investments from "./pages/Investments";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import SettingsPage from "./pages/Settings";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import LoansPage from "./pages/Loans";
import TransfersPage from "./pages/Transfers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TransactionsProvider>
          <BrowserRouter>
            <Routes>
            {/* Rotas sem o layout principal */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

            {/* Rotas com o layout principal (protegidas) */}
            <Route element={<RequireAuth><Layout /></RequireAuth>}>
              <Route path="/" element={<Index />} />
              <Route path="/extrato" element={<ExtratoPage />} />
              <Route path="/cartao" element={<CreditCardPage />} />
              <Route path="/cartao/:id" element={<CardDetail />} />
              <Route path="/resumo-cartoes" element={<CardsSummaryPage />} />
              <Route path="/assistente-ia" element={<FinancialAssistantPage />} />
              <Route path="/emprestimos" element={<LoansPage />} />
              <Route path="/transferencias" element={<TransfersPage />} />
              <Route path="/pagamentos" element={<PaymentsPage />} />
              <Route path="/investimentos" element={<Investments />} />
              <Route path="/assinaturas" element={<SubscriptionControl />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </TransactionsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
