
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Definição da interface completa de uma assinatura
interface Subscription {
  id: number;
  name: string;
  amount: number;
  paymentMethod: string;
  dueDate: number;
  status: "active" | "paused";
  category: string;
}

// Dados para salvar (pode ser uma nova ou uma edição)
interface SaveData {
  name: string;
  amount: number;
  paymentMethod: string;
  dueDate: number;
  category: string;
}

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SaveData) => void;
  subscriptionToEdit?: Subscription | null; // Assinatura a ser editada
}

export const SubscriptionForm = ({ isOpen, onClose, onSave, subscriptionToEdit }: SubscriptionFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");

  // Preenche o formulário ao editar ou limpa ao adicionar
  useEffect(() => {
    if (isOpen) {
      if (subscriptionToEdit) {
        setName(subscriptionToEdit.name);
        setAmount(String(subscriptionToEdit.amount));
        // Cria uma data usando o dia de vencimento
        const date = new Date(2026, 0, subscriptionToEdit.dueDate);
        setDueDate(date);
        setPaymentMethod(subscriptionToEdit.paymentMethod);
        setCategory(subscriptionToEdit.category);
      } else {
        setName("");
        setAmount("");
        setDueDate(undefined);
        setPaymentMethod("");
        setCategory("");
      }
    }
  }, [isOpen, subscriptionToEdit]);

  const handleSubmit = () => {
    if (name && amount && dueDate && paymentMethod && category) {
      onSave({
        name,
        amount: parseFloat(amount),
        dueDate: dueDate.getDate(),
        paymentMethod,
        category,
      });
      onClose();
    }
  };

  const dialogTitle = subscriptionToEdit ? "Editar Assinatura" : "Adicionar Assinatura";
  const dialogDescription = subscriptionToEdit
    ? "Atualize os detalhes da sua assinatura."
    : "Preencha os detalhes da sua nova assinatura.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Spotify..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Valor</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="29.90" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd 'de' MMMM") : <span>Escolha o dia</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">Pagamento</Label>
            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Débito Automático">Débito Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoria</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Streaming, Música..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
