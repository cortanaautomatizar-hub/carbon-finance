
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, User, CreditCard, Palette, Shield } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e dados da conta.</p>
        </header>

        <div className="space-y-8">
          {/* Perfil Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-3" /> Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Nome</label>
                <Input id="name" defaultValue="Nome do Usuário" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" defaultValue="usuario@email.com" />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>

          {/* Notificações Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-3" /> Notificações</CardTitle>
              <CardDescription>Escolha como você quer ser notificado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="fatura-notif">Fatura próxima do vencimento</label>
                <Switch id="fatura-notif" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="limite-notif">Alerta de limite de gasto</label>
                <Switch id="limite-notif" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          {/* Segurança Section */}
          <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center"><Shield className="mr-3" /> Segurança</CardTitle>
                <CardDescription>Gerencie suas configurações de segurança.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive">Desconectar de todos os dispositivos</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
