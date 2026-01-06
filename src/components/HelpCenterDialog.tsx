import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Mail, Phone, FileText } from "lucide-react";

interface HelpTopic {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const HelpCenterDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const helpTopics: HelpTopic[] = [
    {
      icon: <FileText size={20} className="text-primary" />,
      title: "Como usar o simulador?",
      description: "Aprenda a simular empréstimos e entender melhor as condições de crédito.",
    },
    {
      icon: <MessageCircle size={20} className="text-primary" />,
      title: "Dúvidas sobre taxas",
      description: "Conheça como são calculadas as taxas de juros e como economizar.",
    },
    {
      icon: <Phone size={20} className="text-primary" />,
      title: "Contato com especialista",
      description: "Fale com um consultor financeiro para orientações personalizadas.",
    },
    {
      icon: <Mail size={20} className="text-primary" />,
      title: "FAQ - Perguntas Frequentes",
      description: "Encontre respostas para as dúvidas mais comuns sobre empréstimos.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Central de Ajuda - Empréstimos</DialogTitle>
          <DialogDescription>
            Encontre respostas para suas dúvidas sobre gestão de dívidas e crédito
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {helpTopics.map((topic) => (
            <Card key={topic.title} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {topic.icon}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <CardDescription className="text-sm">{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}

          {/* Contato Direto */}
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold mb-3">Não encontrou sua resposta?</p>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Nosso time de especialistas está disponível para ajudá-lo:
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Phone size={14} />
                    0800 123 4567
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Mail size={14} />
                    suporte@carbonfinance.com
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <MessageCircle size={14} />
                    Chat com especialista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
