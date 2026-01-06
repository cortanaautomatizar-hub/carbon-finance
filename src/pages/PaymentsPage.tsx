
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, DollarSign, PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"


const initialPayments = [
  { id: 1, description: 'Conta de Luz - Eletropaulo', amount: 150.75, date: '2024-07-10', status: 'Pago' },
  { id: 2, description: 'Fatura Cartão Nubank', amount: 850.00, date: '2024-07-08', status: 'Pago' },
  { id: 3, description: 'Aluguel - Mensal', amount: 2200.00, date: '2024-07-05', status: 'Pendente' },
  { id: 4, description: 'Internet - Vivo Fibra', amount: 99.90, date: '2024-07-01', status: 'Atrasado' },
];

type Payment = typeof initialPayments[number];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [status, setStatus] = useState('Pendente');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(undefined);
    setStatus('Pendente');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!description || !amount || !date) {
      toast({ title: 'Erro de Validação', description: 'Por favor, preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingId) {
        setPayments(payments.map(p => p.id === editingId ? { ...p, description, amount: parseFloat(amount), date: format(date, 'yyyy-MM-dd'), status } : p));
        toast({ title: 'Pagamento Atualizado', description: 'O pagamento foi atualizado com sucesso.' });
      } else {
        const newPayment = { id: Date.now(), description, amount: parseFloat(amount), date: format(date, 'yyyy-MM-dd'), status };
        setPayments([newPayment, ...payments]);
        toast({ title: 'Pagamento Registrado', description: 'Seu novo pagamento foi adicionado com sucesso.' });
      }
      resetForm();
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEdit = (payment: Payment) => {
    setEditingId(payment.id);
    setDescription(payment.description);
    setAmount(String(payment.amount));
    setDate(parseISO(payment.date));
    setStatus(payment.status);
  };

  const handleDelete = (ids: number[]) => {
    setDeleteTarget(ids);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setPayments(payments.filter(p => !deleteTarget.includes(p.id)));
      toast({ title: 'Pagamento(s) Excluído(s)', description: 'Os pagamentos selecionados foram excluídos.' });
      setSelectedIds([]);
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-success/20 text-success';
      case 'Pendente': return 'bg-warning/20 text-warning';
      case 'Atrasado': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === payments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payments.map(p => p.id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Registro de Pagamentos</h1>
        <p className="text-muted-foreground">Gerencie e acompanhe todos os seus pagamentos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Edit /> : <PlusCircle />} 
            {editingId ? 'Editar Pagamento' : 'Registrar Novo Pagamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Descrição" className="md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="number" placeholder="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Popover>
                <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Escolha a data</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
            </Popover>
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
            </Select>
            <div className="md:col-span-5 flex justify-end gap-2">
                {editingId && <Button variant="outline" onClick={resetForm}>Cancelar Edição</Button>}
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? (editingId ? 'Salvando...' : 'Registrando...') : (editingId ? 'Salvar Alterações' : 'Registrar Pagamento')}</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className='flex justify-between items-center'>
                <CardTitle>Histórico</CardTitle>
                {selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedIds)}><Trash2 className='mr-2 h-4 w-4' /> Excluir {selectedIds.length} item(s)</Button>}
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[40px]'><Checkbox checked={selectedIds.length === payments.length && payments.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[80px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell><Checkbox checked={selectedIds.includes(payment.id)} onCheckedChange={() => toggleSelect(payment.id)} /></TableCell>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell><span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusClass(payment.status))}>{payment.status}</span></TableCell>
                  <TableCell>{format(parseISO(payment.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(payment)}><Edit className='mr-2 h-4 w-4' /> Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete([payment.id])}><Trash2 className='mr-2 h-4 w-4' /> Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>Essa ação não pode ser desfeita. Isso excluirá permanentemente o(s) pagamento(s) selecionado(s).</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

// A importação do buttonVariants é necessária para usar a variante no AlertDialogAction
import { cva } from "class-variance-authority";
export const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    { variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90" } } }
);
