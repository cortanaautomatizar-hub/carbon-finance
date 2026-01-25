
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/auth";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";

// Credenciais demo
const DEMO_USER = {
  id: 1,
  name: "Demo User",
  email: "demo@carbonfinance.com",
  phone: "+55 11 99999-9999",
};

const DEMO_TOKEN = "demo_token_123456789";

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const auth = useAuth();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      // Se os campos estiverem vazios, usar credenciais demo
      if (!email && !password) {
        auth.login(DEMO_USER, DEMO_TOKEN);
        navigate("/");
        return;
      }

      const res = await authService.login(email, password);
      auth.login(res.user, res.token);
      type LoginState = { from?: { pathname?: string } } | null;
      const from = ((location.state as unknown as LoginState)?.from?.pathname) || "/";
      navigate(from);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: 'Erro no login', description: msg || 'Falha ao autenticar' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white grid grid-cols-1 lg:grid-cols-2">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <Logo variant="light" className="h-10" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400 mb-8">Digite suas credenciais para acessar sua conta.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-5">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">E-mail ou Telefone</label>
              <Input
                    type="text"
                    placeholder="Digite seu e-mail ou telefone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1E1E1E] border-gray-700 h-12 rounded-lg"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha de 6 dígitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1E1E1E] border-gray-700 h-12 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <a href="/recuperar-senha" className="text-sm text-yellow-400 hover:underline mb-6 block text-right">Esqueci minha senha</a>

              <Button type="submit" className="w-full bg-yellow-400 text-black h-12 rounded-lg font-bold text-base hover:bg-yellow-500">
              Entrar <ArrowRight className="ml-2" size={20}/>
            </Button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700"/>
            <span className="mx-4 text-sm text-gray-500">ou continue com</span>
            <hr className="flex-grow border-gray-700"/>
          </div>

          <Button variant="outline" className="w-full bg-transparent border-gray-700 h-12 rounded-lg hover:bg-[#1E1E1E] hover:text-white">
            <FcGoogle className="mr-3" size={24}/>
            Entrar com Google
          </Button>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">Ainda não tem conta no Carbon Finance? </span>
            <a href="/cadastro" className="font-semibold text-yellow-400 hover:underline">Abrir conta gratuita</a>
          </div>
        </div>
      </div>

      {/* Lado Direito - Branding */}
      <div className="hidden lg:flex flex-col items-start justify-center p-12 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1685362333758-3935b8635543?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}>
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
            <div className="inline-block bg-gray-800 bg-opacity-70 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block mr-2"></span>
                CARBON EXPERIENCE
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Sua vida financeira, organizada e ao seu alcance.</h2>
            <p className="text-gray-300 text-lg">Invista com inteligência, alcance seus objetivos. Segurança e tecnologia para suas transações.</p>
            <div className="flex gap-2 mt-8">
                <div className="h-1 w-8 bg-yellow-400 rounded-full"></div>
                <div className="h-1 w-8 bg-gray-600 rounded-full"></div>
                <div className="h-1 w-8 bg-gray-600 rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
