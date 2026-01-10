
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, DollarSign, PlusCircle, MoreHorizontal, Trash2, Edit, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cva } from "class-variance-authority";


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
      case 'Pago': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Pendente': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Atrasado': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago': return <CheckCircle className='h-4 w-4' />;
      case 'Atrasado': return <AlertCircle className='h-4 w-4' />;
      default: return <TrendingUp className='h-4 w-4' />;
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
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Registro de Pagamentos</h1>
        <p className="text-lg text-muted-foreground">Gerencie e acompanhe todos os seus pagamentos em um só lugar</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">R$ {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Pendentes</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">R$ {payments.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-900 mt-1">R$ {payments.filter(p => p.status === 'Atrasado').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Pagos</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">R$ {payments.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            {editingId ? <Edit className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />} 
            {editingId ? 'Editar Pagamento' : 'Registrar Novo Pagamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="md:col-span-2 lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Input 
                placeholder="Ex: Conta de Luz" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="h-10"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block">Valor</label>
              <Input 
                type="number" 
                placeholder="0,00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="h-10"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Escolha a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 lg:col-span-5 flex justify-end gap-2 pt-2">
              {editingId && <Button variant="outline" onClick={resetForm}>Cancelar</Button>}
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? (editingId ? 'Salvando...' : 'Registrando...') : (editingId ? 'Salvar Alterações' : 'Registrar Pagamento')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <div className='flex justify-between items-center'>
            <CardTitle className="text-xl">Histórico de Pagamentos</CardTitle>
            {selectedIds.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(selectedIds)}
                className="gap-2"
              >
                <Trash2 className='h-4 w-4' /> 
                Excluir {selectedIds.length}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pagamento registrado ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className='w-[40px]'>
                      <Checkbox 
                        checked={selectedIds.length === payments.length && payments.length > 0} 
                        onCheckedChange={toggleSelectAll} 
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="text-right font-semibold">Valor</TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <Checkbox 
                          checked={selectedIds.includes(payment.id)} 
                          onCheckedChange={() => toggleSelect(payment.id)} 
                        />
                      </TableCell>
                      <TableCell className="font-medium text-base">{payment.description}</TableCell>
                      <TableCell>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5", getStatusClass(payment.status))}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{format(parseISO(payment.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-right font-semibold">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(payment)}>
                              <Edit className='mr-2 h-4 w-4' /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDelete([payment.id])}
                            >
                              <Trash2 className='mr-2 h-4 w-4' /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pagamento(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir {deleteTarget?.length || 1} pagamento(s). Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Button variants helper
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      }
    }
  }
);
