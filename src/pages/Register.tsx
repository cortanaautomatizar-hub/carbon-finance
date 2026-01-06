
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/auth";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("55");
  const [phoneArea, setPhoneArea] = useState("11");
  const [phoneNumber, setPhoneNumber] = useState("");
  const auth = useAuth();

  const countries = [
    { iso: 'BR', name: 'Brasil', dial: '55', tw: '1f1e7-1f1f7' },
    { iso: 'US', name: 'Estados Unidos', dial: '1', tw: '1f1fa-1f1f8' },
    { iso: 'PT', name: 'Portugal', dial: '351', tw: '1f1f5-1f1f9' },
    { iso: 'ES', name: 'Espanha', dial: '34', tw: '1f1ea-1f1f8' },
    { iso: 'FR', name: 'França', dial: '33', tw: '1f1eb-1f1f7' },
    { iso: 'GB', name: 'Reino Unido', dial: '44', tw: '1f1ec-1f1e7' },
  ];

  const handleRegister = () => {
    try {
      // normalize phone: remove non-digits and ensure leading +
      const raw = `${phoneCountry}${phoneArea}${phoneNumber}`.replace(/\D/g, "");
      const phone = raw ? `+${raw}` : undefined;
      const res = authService.register({ name, email, phone, password });
      auth.login(res.user, res.token);
      navigate("/");
    } catch (e: any) {
      toast({ title: 'Erro no cadastro', description: e.message || 'Falha ao cadastrar' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white grid grid-cols-1 lg:grid-cols-2">
      {/* Lado Esquerdo - Formulário de Cadastro */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <Logo variant="light" className="h-10" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
          <p className="text-gray-400 mb-8">Preencha os dados para começar a organizar sua vida financeira.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Nome completo</label>
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1E1E1E] border-gray-700 h-12 rounded-lg"
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Telefone</label>
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#1E1E1E] rounded-lg overflow-hidden p-1">
                    {(() => {
                      const c = countries.find((c) => c.dial === phoneCountry);
                      if (!c) return null;
                      const src = `https://twemoji.maxcdn.com/v/latest/72x72/${c.tw}.png`;
                      return <img src={src} alt={`${c.name} flag`} className="w-6 h-6 object-contain" />;
                    })()}
                  </div>
                  <select
                    aria-label="Código do país"
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value.replace(/\D/g, ''))}
                    className="w-36 bg-[#1E1E1E] border-gray-700 h-12 rounded-lg px-2 text-white"
                  >
                    {countries.map((c) => (
                      <option key={c.dial} value={c.dial} className="bg-[#1E1E1E] text-black">
                        {`${c.name} (+${c.dial})`}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    aria-label="DDD"
                    value={phoneArea}
                    onChange={(e) => setPhoneArea(e.target.value.replace(/\D/g, ''))}
                    className="w-20 bg-[#1E1E1E] border-gray-700 h-12 rounded-lg"
                  />
                  <Input
                    type="tel"
                    placeholder="999999999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#1E1E1E] border-gray-700 h-12 rounded-lg"
                  />
                </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">E-mail</label>
              <Input
                type="email"
                placeholder="Digite seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E1E1E] border-gray-700 h-12 rounded-lg"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Crie sua senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha de 6 dígitos"
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

            <Button type="submit" className="w-full bg-yellow-400 text-black h-12 rounded-lg font-bold text-base hover:bg-yellow-500 mt-4">
              Criar minha conta <ArrowRight className="ml-2" size={20}/>
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">Já tem uma conta? </span>
            <a href="/login" className="font-semibold text-yellow-400 hover:underline">Acesse sua conta</a>
          </div>
        </div>
      </div>

      {/* Lado Direito - Branding (o mesmo da tela de login) */}
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

export default RegisterPage;
