import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, RefreshCw, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VirtualCard {
  number: string;
  cvv: string;
  expiry: string;
  limit: number;
  name: string;
}

// Função para gerar número de cartão virtual
const generateVirtualCardNumber = (): VirtualCard => {
  // Formato: 4xxx-xxxx-xxxx-xxxx (Visa)
  const bin = "4532"; // Bank Identification Number (Visa)
  const random1 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const random2 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const random3 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const number = `${bin}-${random1}-${random2}-${random3}`;
  
  const cvv = Math.floor(Math.random() * 900 + 100).toString();
  const month = String((Math.floor(Math.random() * 12) + 1)).padStart(2, "0");
  const year = String(new Date().getFullYear() + 3).slice(-2);
  const expiry = `${month}/${year}`;
  
  const limits = [500, 1000, 2000, 5000];
  const limit = limits[Math.floor(Math.random() * limits.length)];
  
  return {
    number,
    cvv,
    expiry,
    limit,
    name: `Virtual-${random1}`,
  };
};

export const VirtualCardGenerator = () => {
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    const newCard = generateVirtualCardNumber();
    setVirtualCard(newCard);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado!` });
  };

  const handleClose = () => {
    setIsOpen(false);
    setVirtualCard(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <CreditCard className="mr-2 w-4 h-4" />
          Gerar Cartão Virtual
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cartão Virtual Único</DialogTitle>
        </DialogHeader>

        {!virtualCard ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gere um número de cartão virtual único para fazer compras online com segurança.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Tipo</p>
                <p className="font-semibold">Visa</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Duração</p>
                <p className="font-semibold">3 Anos</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Limite</p>
                <p className="font-semibold">Até R$ 5.000</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Segurança</p>
                <p className="font-semibold">CVV Único</p>
              </div>
            </div>
            <Button onClick={handleGenerate} className="w-full bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="mr-2 w-4 h-4" />
              Gerar Agora
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cartão Visual */}
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs opacity-80">Cartão Virtual</p>
                    <p className="text-sm font-semibold mt-1">{virtualCard.name}</p>
                  </div>
                  <CreditCard className="w-8 h-8 opacity-80" />
                </div>

                <div>
                  <p className="text-xs opacity-80 mb-2">Número</p>
                  <p className="text-2xl font-mono font-bold tracking-widest">
                    {virtualCard.number}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs opacity-80">CVV</p>
                    <p className="text-lg font-mono font-bold mt-1">{virtualCard.cvv}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Validade</p>
                    <p className="text-lg font-mono font-bold mt-1">{virtualCard.expiry}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Limite</p>
                    <p className="text-lg font-bold mt-1">R$ {virtualCard.limit}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Botões para Copiar */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleCopy(virtualCard.number, "Número")}
              >
                <span>Copiar Número</span>
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleCopy(virtualCard.cvv, "CVV")}
              >
                <span>Copiar CVV</span>
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleCopy(virtualCard.expiry, "Validade")}
              >
                <span>Copiar Validade</span>
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Button onClick={handleGenerate} variant="outline" className="flex-1">
                <RefreshCw className="mr-2 w-4 h-4" />
                Gerar Outro
              </Button>
              <Button onClick={handleClose} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
