
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
      case 'Pago': return 'bg-gray-800 text-green-400 border border-gray-700';
      case 'Pendente': return 'bg-gray-800 text-yellow-400 border border-gray-700';
      case 'Atrasado': return 'bg-gray-800 text-red-400 border border-gray-700';
      default: return 'bg-gray-800 text-gray-400 border border-gray-700';
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
        <Card className="bg-[#1E1E1E] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white mt-1">R$ {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">R$ {payments.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Atrasados</p>
                <p className="text-2xl font-bold text-red-400 mt-1">R$ {payments.filter(p => p.status === 'Atrasado').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pagos</p>
                <p className="text-2xl font-bold text-green-400 mt-1">R$ {payments.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Card */}
      <Card className="border-gray-800 bg-[#1E1E1E]">
        <CardHeader className="bg-black/30 border-b border-gray-800">
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            {editingId ? <Edit className="h-5 w-5 text-yellow-400" /> : <PlusCircle className="h-5 w-5 text-yellow-400" />} 
            {editingId ? 'Editar Pagamento' : 'Registrar Novo Pagamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="md:col-span-2 lg:col-span-2">
              <label className="text-sm font-medium mb-2 block text-gray-300">Descrição</label>
              <Input 
                placeholder="Ex: Conta de Luz" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="h-10 bg-black border-gray-700 text-white"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block text-gray-300">Valor</label>
              <Input 
                type="number" 
                placeholder="0,00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="h-10 bg-black border-gray-700 text-white"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block text-gray-300">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10 bg-black border-gray-700 text-white hover:bg-gray-900 hover:text-white", !date && "text-gray-500")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Escolha a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-gray-800 bg-[#1E1E1E]" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-2 block text-gray-300">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 bg-black border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-gray-700">
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 lg:col-span-5 flex justify-end gap-2 pt-2">
              {editingId && <Button variant="outline" onClick={resetForm} className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white">Cancelar</Button>}
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[200px] bg-yellow-400 text-black hover:bg-yellow-500">
                {isSubmitting ? (editingId ? 'Salvando...' : 'Registrando...') : (editingId ? 'Salvar Alterações' : 'Registrar Pagamento')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Card */}
      <Card className="bg-[#1E1E1E] border-gray-800">
        <CardHeader className="bg-black/30 border-b border-gray-800">
          <div className='flex justify-between items-center'>
            <CardTitle className="text-xl text-white">Histórico de Pagamentos</CardTitle>
            {selectedIds.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(selectedIds)}
                className="gap-2 bg-red-600 hover:bg-red-700"
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
              <p className="text-gray-400">Nenhum pagamento registrado ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-black/30 hover:bg-black/30 border-gray-800">
                    <TableHead className='w-[40px]'>
                      <Checkbox 
                        checked={selectedIds.length === payments.length && payments.length > 0} 
                        onCheckedChange={toggleSelectAll}
                        className="border-gray-600"
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-gray-300">Descrição</TableHead>
                    <TableHead className="font-semibold text-gray-300">Status</TableHead>
                    <TableHead className="font-semibold text-gray-300">Data</TableHead>
                    <TableHead className="text-right font-semibold text-gray-300">Valor</TableHead>
                    <TableHead className="w-[80px] text-center font-semibold text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-black/20 transition-colors border-gray-800">
                      <TableCell>
                        <Checkbox 
                          checked={selectedIds.includes(payment.id)} 
                          onCheckedChange={() => toggleSelect(payment.id)}
                          className="border-gray-600"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-base text-white">{payment.description}</TableCell>
                      <TableCell>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5", getStatusClass(payment.status))}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-300">{format(parseISO(payment.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-right font-semibold text-white">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-gray-700">
                            <DropdownMenuLabel className="text-gray-300">Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(payment)} className="text-gray-200 hover:bg-gray-800">
                              <Edit className='mr-2 h-4 w-4' /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-gray-800" 
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
        <AlertDialogContent className="bg-[#1E1E1E] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir pagamento(s)?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você está prestes a excluir {deleteTarget?.length || 1} pagamento(s). Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className={cn(buttonVariants({ variant: "destructive" }), "bg-red-600 hover:bg-red-700")}
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
