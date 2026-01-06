
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    // Lógica de redefinição de senha aqui
    console.log("Solicitação de redefinição de senha enviada!");
    // Poderia mostrar uma mensagem de sucesso e depois redirecionar
    alert("Um link de redefinição de senha foi enviado para o seu e-mail.");
    navigate("/login");
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

          <h1 className="text-3xl font-bold mb-2">Recupere sua senha</h1>
          <p className="text-gray-400 mb-8">Não se preocupe, acontece! Digite seu e-mail para receber o link de redefinição.</p>

          <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">E-mail ou Telefone</label>
              <div className="relative">
                <Input
                    type="text"
                    placeholder="Digite seu e-mail ou telefone cadastrado"
                    className="bg-[#1E1E1E] border-gray-700 h-12 rounded-lg pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              </div>
            </div>

            <Button type="submit" className="w-full bg-yellow-400 text-black h-12 rounded-lg font-bold text-base hover:bg-yellow-500 mt-6">
              Enviar link de recuperação <ArrowRight className="ml-2" size={20}/>
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">Lembrou da senha? </span>
            <a href="/login" className="font-semibold text-yellow-400 hover:underline">Voltar para o login</a>
          </div>
        </div>
      </div>

      {/* Lado Direito - Branding (o mesmo das outras páginas) */}
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

export default ForgotPasswordPage;
