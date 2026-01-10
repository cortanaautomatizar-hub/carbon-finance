import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus, QrCode, Copy, Search, ArrowDown, ArrowUp, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allContacts = [
  { id: 1, name: 'Ana Silva', bank: 'C6 Bank', avatar: 'AS', bgColor: 'bg-orange-500', pix: '123.456.789-00', type: 'cpf' },
  { id: 2, name: 'Carlos Souza', bank: 'Bradesco', avatar: 'CS', bgColor: 'bg-blue-500', pix: '(11) 98765-4321', type: 'phone' },
  { id: 3, name: 'Mariana Costa', bank: 'Nubank', avatar: 'MC', bgColor: 'bg-purple-500', pix: 'mariana@email.com', type: 'email' },
  { id: 4, name: 'João Lima', bank: 'Itau', avatar: 'JL', bgColor: 'bg-indigo-500', pix: '550e8400-e29b-41d4-a716-446655440000', type: 'random' },
];

const recentContacts = allContacts.slice(0, 4);

const transferHistory = [
  { id: 1, type: 'sent', description: 'Pix enviado', date: 'Ontem', amount: '-R$ 120,00', color: 'text-red-500' },
  { id: 2, type: 'received', description: 'Pix recebido', date: '12 Out', amount: '+ R$ 5.000,00', color: 'text-green-500' },
];

const banks = [
  { id: '001', name: 'Banco do Brasil' },
  { id: '033', name: 'Santander' },
  { id: '104', name: 'Caixa Econômica' },
  { id: '237', name: 'Bradesco' },
  { id: '341', name: 'Itaú' },
  { id: '740', name: 'Banco de Brasília' },
];

export default function Transfers() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTab, setSelectedTab] = useState('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPixCopyModal, setShowPixCopyModal] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const availableBalance = 12450.00;

  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [agencyNumber, setAgencyNumber] = useState('');
  const [accountType, setAccountType] = useState('corrente');
  const [recipientCPF, setRecipientCPF] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [newTransferName, setNewTransferName] = useState('');
  const [newTransferCPF, setNewTransferCPF] = useState('');
  const [newTransferBank, setNewTransferBank] = useState('');

  const filteredContacts = useMemo(() => {
    if (!recipient) return [];
    return allContacts.filter(c => 
      c.name.toLowerCase().includes(recipient.toLowerCase()) ||
      c.pix.toLowerCase().includes(recipient.toLowerCase())
    ).slice(0, 5);
  }, [recipient]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = (parseInt(value || '0') / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setAmount(formatted);
  };

  const handleSelectContact = (contact: typeof allContacts[0]) => {
    setRecipient(contact.name);
    setAmount('');
    setDate(undefined);
    toast({
      title: 'Contato Selecionado',
      description: `${contact.name} (${contact.bank})`,
    });
  };

  const handleNewTransferSubmit = () => {
    if (!newTransferName || !newTransferCPF) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, preencha nome e CPF.',
        variant: 'destructive',
      });
      return;
    }
    setRecipient(newTransferName);
    setShowNewTransferModal(false);
    setNewTransferName('');
    setNewTransferCPF('');
    setNewTransferBank('');
    toast({
      title: 'Contato Adicionado',
      description: `${newTransferName} foi adicionado aos seus contatos.`,
    });
  };

  const handlePixCodePaste = () => {
    if (!pixCode) {
      toast({
        title: 'Código Vazio',
        description: 'Por favor, cole um código Pix válido.',
        variant: 'destructive',
      });
      return;
    }
    setRecipient(pixCode);
    setShowPixCopyModal(false);
    setPixCode('');
    toast({
      title: 'Código Pix Lido',
      description: 'Prossiga com o valor e data da transferência.',
    });
  };

  const handleQRCode = () => {
    const simulatedQR = '00020126580014br.gov.bcb.pix123456789012345';
    setRecipient(simulatedQR);
    setShowQRModal(false);
    toast({
      title: 'QR Code Lido',
      description: 'Insira o valor e confirme a transferência.',
    });
  };

  const handleSubmit = () => {
    if (selectedTab === 'pix') {
      if (!recipient || !amount || !date) {
        toast({
          title: 'Erro de Validação',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
    } else if (selectedTab === 'ted') {
      if (!recipientName || !recipientCPF || !bankCode || !agencyNumber || !accountNumber || !amount || !date) {
        toast({
          title: 'Erro de Validação',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
    } else if (selectedTab === 'account') {
      if (!targetAccount || !amount || !date) {
        toast({
          title: 'Erro de Validação',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: 'Transferência Realizada',
        description: `Transferência de R$ ${amount} iniciada com sucesso.`,
      });
      setRecipient('');
      setAmount('');
      setDate(undefined);
      setRecipientName('');
      setRecipientCPF('');
      setBankCode('');
      setAgencyNumber('');
      setAccountNumber('');
      setTargetAccount('');
      setShowConfirmation(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix123456789012345');
    toast({
      title: 'Código Copiado',
      description: 'Código Pix copiado para a área de transferência.',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 justify-between md:flex-row md:items-start">
        <div>
          <h1 className="text-3xl font-semibold">Transferências</h1>
          <p className="text-muted-foreground">Escolha como você quer transferir hoje. Envie dinheiro via Pix, TED/DOC ou entre suas contas.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={() => setShowNewTransferModal(true)}>
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/15 p-3 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Nova Transferência</h3>
                  <p className="text-sm text-muted-foreground">Para novos contatos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </button>

        <button onClick={() => setShowPixCopyModal(true)}>
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/15 p-3 rounded-lg">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Pix Copia e Cola</h3>
                  <p className="text-sm text-muted-foreground">Cole o código aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </button>

        <button onClick={() => setShowQRModal(true)}>
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/15 p-3 rounded-lg">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Ler QR Code</h3>
                  <p className="text-sm text-muted-foreground">Pagar com câmera</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="pix" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pix">Pix</TabsTrigger>
                  <TabsTrigger value="ted">TED/DOC</TabsTrigger>
                  <TabsTrigger value="account">Entre Contas</TabsTrigger>
                </TabsList>
              </Tabs>

              {selectedTab === 'pix' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Quem vai receber?</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Nome, CPF ou Chave Pix"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="pl-10"
                      />
                      {filteredContacts.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50">
                          {filteredContacts.map((contact) => (
                            <button
                              key={contact.id}
                              onClick={() => handleSelectContact(contact)}
                              className="w-full px-4 py-2 text-left hover:bg-accent border-b last:border-b-0 flex items-center gap-3"
                            >
                              <div className={`${contact.bgColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                                {contact.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{contact.name}</p>
                                <p className="text-xs text-muted-foreground">{contact.bank}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Qual o valor?</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                        <Input
                          placeholder="0,00"
                          value={amount}
                          onChange={handleAmountChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Quando?</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'mm/dd/yyyy'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'ted' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Nome do Recebedor</label>
                    <Input
                      placeholder="Nome completo"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">CPF/CNPJ</label>
                    <Input
                      placeholder="000.000.000-00"
                      value={recipientCPF}
                      onChange={(e) => setRecipientCPF(formatCPF(e.target.value))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Banco</label>
                      <Select value={bankCode} onValueChange={setBankCode}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Agência</label>
                      <Input
                        placeholder="0000"
                        value={agencyNumber}
                        onChange={(e) => setAgencyNumber(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Conta</label>
                      <Input
                        placeholder="00000000"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Tipo de Conta</label>
                      <Select value={accountType} onValueChange={setAccountType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corrente">Conta Corrente</SelectItem>
                          <SelectItem value="poupanca">Poupança</SelectItem>
                          <SelectItem value="salario">Conta Salário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Qual o valor?</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                        <Input
                          placeholder="0,00"
                          value={amount}
                          onChange={handleAmountChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Quando?</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'mm/dd/yyyy'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'account' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Conta de Destino</label>
                    <Select value={targetAccount} onValueChange={setTargetAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poupanca">Conta Poupança - 123456-7</SelectItem>
                        <SelectItem value="investimento">Conta Investimento - 654321-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Qual o valor?</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                        <Input
                          placeholder="0,00"
                          value={amount}
                          onChange={handleAmountChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Quando?</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'mm/dd/yyyy'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Saldo disponível</p>
                <p className="text-3xl font-semibold">
                  R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full text-lg py-6"
              >
                Continuar →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Recentes</CardTitle>
              <button onClick={() => setShowAllContacts(true)} className="text-primary text-sm hover:underline">Ver todos</button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className={`${contact.bgColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {contact.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.bank}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transferHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                      {item.type === 'sent' ? (
                        <ArrowUp className="w-4 h-4 text-red-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${item.color}`}>{item.amount}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showNewTransferModal} onOpenChange={setShowNewTransferModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transferência</DialogTitle>
            <DialogDescription>
              Adicione um novo contato para transferência
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-sm">Nome Completo</label>
              <Input
                placeholder="Digite o nome completo"
                value={newTransferName}
                onChange={(e) => setNewTransferName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-sm">CPF</label>
              <Input
                placeholder="000.000.000-00"
                value={newTransferCPF}
                onChange={(e) => setNewTransferCPF(formatCPF(e.target.value))}
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-sm">Banco (Opcional)</label>
              <Input
                placeholder="Banco do contato"
                value={newTransferBank}
                onChange={(e) => setNewTransferBank(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTransferModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewTransferSubmit}>
              Adicionar Contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPixCopyModal} onOpenChange={setShowPixCopyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pix Copia e Cola</DialogTitle>
            <DialogDescription>
              Cole o código Pix recebido aqui
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-sm">Código Pix</label>
              <Input
                placeholder="Cole o código Pix aqui"
                value={pixCode}
                onChange={(e) => setPixCode(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCopyPix}
              className="w-full"
              variant="secondary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código Exemplo
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPixCopyModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePixCodePaste}>
              Usar Código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ler QR Code</DialogTitle>
            <DialogDescription>
              Aponte a câmera para o QR Code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <QrCode className="w-16 h-16 mx-auto text-primary mb-4" />
              <p className="text-muted-foreground mb-4">Câmera disponível</p>
              <Button onClick={handleQRCode} className="w-full">
                Simular Leitura QR Code
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAllContacts} onOpenChange={setShowAllContacts}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Todos os Contatos</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {allContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  handleSelectContact(contact);
                  setShowAllContacts(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
              >
                <div className={`${contact.bgColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}>
                  {contact.avatar}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.bank}</p>
                  <p className="text-xs text-muted-foreground">{contact.pix}</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllContacts(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Confirmar Transferência
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recebedor:</span>
                <span className="font-medium">{recipient || recipientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-bold">R$ {amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium">
                  {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-muted-foreground">Método:</span>
                <span className="font-medium capitalize">
                  {selectedTab === 'pix' ? 'Pix' : selectedTab === 'ted' ? 'TED/DOC' : 'Entre Contas'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Voltar
            </Button>
            <Button
              onClick={confirmTransfer}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Transferência'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
