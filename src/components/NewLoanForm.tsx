import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface NewLoanFormProps {
  onSubmit?: (data: NewLoanData) => void;
}

export interface NewLoanData {
  title: string;
  amount: number;
  interestRate: number;
  installments: number;
  category: string;
}

export const NewLoanForm = ({ onSubmit }: NewLoanFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewLoanData>({
    title: "",
    amount: 0,
    interestRate: 0,
    installments: 12,
    category: "personal",
  });

  const categories = [
    { value: "personal", label: "Crédito Pessoal" },
    { value: "vehicle", label: "Financiamento Veículo" },
    { value: "home", label: "Financiamento Imóvel" },
    { value: "education", label: "Empréstimo para Educação" },
    { value: "reform", label: "Crédito para Reforma" },
    { value: "other", label: "Outro" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0) {
      alert("Preencha todos os campos corretamente");
      return;
    }
    onSubmit?.(formData);
    setFormData({
      title: "",
      amount: 0,
      interestRate: 0,
      installments: 12,
      category: "personal",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus size={16} />
          Adicionar Tipo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria de empréstimo com os detalhes principais.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Tipo de Empréstimo</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Nome do Empréstimo</Label>
            <Input
              id="title"
              placeholder="Ex: Crédito para Reforma"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Taxa de Juros (%)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="0,00"
                step="0.01"
                value={formData.interestRate || ""}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              placeholder="12"
              value={formData.installments || ""}
              onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) || 12 })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="gold" className="flex-1">
              Criar Empréstimo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
