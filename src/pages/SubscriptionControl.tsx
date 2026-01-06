
import { useState, useMemo } from "react";
import { subscriptions as initialSubscriptions } from "@/data/subscriptions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Bell, Calendar, CheckCircle, Search, Filter, Trash2, Edit, PauseCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { add, format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- DADOS E FUNÇÕES AUXILIARES ---

const today = new Date();
const initialEnhancedSubscriptions = initialSubscriptions.map(sub => ({
    ...sub,
    renewalDate: add(today, { days: sub.dueDate }).toISOString(),
    card: "Cartão final 8842",
}));

const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const initialServiceColors = {
    "Netflix": "#E50914",
    "Spotify": "#1DB954",
    "Amazon Prime": "#00A8E1",
    "Gympass": "#F26722",
    "Adobe Creative Cloud": "#FF0000",
    "Default": "#71717A"
};

const categoryColors = {
    Streaming: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Música: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Trabalho: "bg-green-500/10 text-green-400 border-green-500/20",
    Compras: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Saúde: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Software: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};
const categories = Object.keys(categoryColors);

// --- COMPONENTE DO MODAL ---

const AddSubscriptionModal = ({ open, onOpenChange, onAddSubscription }) => {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("#71717A");

    const presetColors = ["#E50914", "#1DB954", "#00A8E1", "#F26722", "#FF0000", "#3b5998", "#1da1f2", "#c71610", "#000000", "#71717A"];

    const handleSubmit = () => {
        onAddSubscription({ name, amount: parseFloat(amount), category, color });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Assinatura</DialogTitle>
                    <DialogDescription>Preencha os detalhes do novo serviço.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Serviço</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Valor (R$)</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Categoria</Label>
                        <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Cor</Label>
                        <div className="col-span-3 flex flex-wrap items-center gap-2">
                            {presetColors.map((preset) => (
                                <button key={preset} type="button" style={{ backgroundColor: preset }} className={`h-7 w-7 rounded-full border-2 transition-transform ${color === preset ? 'border-primary scale-110' : 'border-transparent'}`} onClick={() => setColor(preset)} />
                            ))}
                            <Input value={color} onChange={(e) => setColor(e.target.value)} className="w-24" placeholder="#121212" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Adicionar Assinatura</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export const SubscriptionControl = () => {
    const [subscriptions, setSubscriptions] = useState(initialEnhancedSubscriptions);
    const [serviceColors, setServiceColors] = useState(initialServiceColors);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("renewalDate");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddSubscription = (newSub) => {
        const newId = subscriptions.length > 0 ? Math.max(...subscriptions.map(s => s.id)) + 1 : 1;
        
        const finalNewSub = {
            id: newId,
            name: newSub.name,
            amount: newSub.amount,
            category: newSub.category,
            status: 'active',
            renewalDate: add(today, { days: 30 }).toISOString(),
            card: 'Cartão final 8842'
        };

        setSubscriptions(prevSubs => [...prevSubs, finalNewSub]);
        setServiceColors(prevColors => ({ ...prevColors, [newSub.name]: newSub.color }));
        setIsModalOpen(false);
    };

    const filteredSubscriptions = useMemo(() => {
        return [...subscriptions]
            .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter === 'all' || sub.status === statusFilter) && (categoryFilter === 'all' || sub.category === categoryFilter))
            .sort((a, b) => {
                if (sortOrder === 'renewalDate') return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
                if (sortOrder === 'value_desc') return b.amount - a.amount;
                if (sortOrder === 'value_asc') return a.amount - b.amount;
                return 0;
            });
    }, [subscriptions, searchTerm, statusFilter, categoryFilter, sortOrder]);

    const totalMonthly = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const inactiveCount = subscriptions.filter(s => s.status !== 'active').length;
    const nextRenewal = filteredSubscriptions.find(s => new Date(s.renewalDate) >= today) || null;
    const upcomingRenewal = useMemo(() => [...subscriptions].filter(s => s.status === 'active').sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())[0], [subscriptions]);
    const daysToRenewal = upcomingRenewal ? differenceInDays(parseISO(upcomingRenewal.renewalDate), today) : 0;

    return (
        <div className="space-y-8">
            <AddSubscriptionModal open={isModalOpen} onOpenChange={setIsModalOpen} onAddSubscription={handleAddSubscription} />
            
            <div>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold">Controle de Assinaturas</h1>
                        <p className="text-muted-foreground">Gerencie seus pagamentos recorrentes e serviços contratados</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Assinatura
                    </Button>
                </div>

                {upcomingRenewal && daysToRenewal <= 5 && daysToRenewal >= 0 && (
                    <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 flex justify-between items-center mb-8 shadow-lg">
                        <div className="flex items-center"><Bell className="text-primary mr-4" size={24} />
                            <div>
                                <h3 className="font-semibold text-primary flex items-center gap-2">Renovação Próxima <Badge variant="default" className="bg-primary/10 text-primary">ATENÇÃO</Badge></h3>
                                <p className="text-sm">Sua assinatura <span className="font-semibold">{upcomingRenewal.name}</span> será renovada em <span className="font-semibold">{daysToRenewal} dias</span>.</p>
                            </div>
                        </div>
                    </div>
                )}

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <Card className="p-5"><div className="flex items-center text-muted-foreground mb-2 text-sm font-medium uppercase tracking-wider"><Calendar size={16} className="mr-2" /><span>TOTAL MENSAL</span></div><p className="text-3xl font-semibold">R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></Card>
                    <Card className="p-5"><div className="flex items-center text-muted-foreground mb-2 text-sm font-medium uppercase tracking-wider"><Calendar size={16} className="mr-2" /><span>PRÓXIMA COBRANÇA</span></div>{nextRenewal ? (<><p className="text-3xl font-semibold">{format(parseISO(nextRenewal.renewalDate), 'd MMM', { locale: ptBR })}</p><p className="text-muted-foreground text-sm">{nextRenewal.name} - R$ {nextRenewal.amount.toFixed(2)}</p></>) : <p className="text-muted-foreground text-2xl font-semibold">Nenhuma</p>}</Card>
                    <Card className="p-5"><div className="flex items-center text-muted-foreground mb-2 text-sm font-medium uppercase tracking-wider"><CheckCircle size={16} className="mr-2" /><span>SERVIÇOS ATIVOS</span></div><p className="text-3xl font-semibold">{activeCount}</p><p className="text-muted-foreground text-sm">{inactiveCount} inativos</p></Card>
                </section>

                <Card className="p-4">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="relative flex-grow sm:flex-grow-0"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} /><Input placeholder="Buscar serviço..." className="pl-10 w-full sm:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                        <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Ordenar por:</span><DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm">{sortOrder === 'renewalDate' ? 'Data de Renovação' : 'Valor'}</Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSortOrder('renewalDate')}>Data de Renovação</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('value_desc')}>Valor (Maior)</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('value_asc')}>Valor (Menor)</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu></div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="border-b"><tr className="text-left text-xs text-muted-foreground uppercase"><th className="py-3 px-4">Serviço</th><th className="py-3 px-4">Categoria</th><th className="py-3 px-4">Valor</th><th className="py-3 px-4">Renovação</th><th className="py-3 px-4">Status</th><th className="py-3 px-4 text-right">Ações</th></tr></thead>
                            <tbody>{filteredSubscriptions.map(sub => {
                                    const daysLeft = differenceInDays(parseISO(sub.renewalDate), today);
                                    const bgColor = serviceColors[sub.name] || serviceColors.Default;
                                    return (<tr key={sub.id} className="border-b hover:bg-accent/50">
                                            <td className="py-4 px-4 flex items-center gap-4">
                                                <div style={{ backgroundColor: bgColor, color: 'white' }} className={'h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-sm'}>{getInitials(sub.name)}</div>
                                                <div><p className="font-semibold">{sub.name}</p><p className="text-sm text-muted-foreground">{sub.card}</p></div>
                                            </td>
                                            <td className="py-4 px-4"><Badge variant="outline" className={categoryColors[sub.category] || ''}>{sub.category}</Badge></td>
                                            <td className="py-4 px-4 font-medium">R$ {sub.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                            <td className="py-4 px-4"><p>{format(parseISO(sub.renewalDate), 'dd MMM yyyy', { locale: ptBR })}</p><p className={`text-sm ${daysLeft <= 3 && daysLeft >= 0 ? 'text-primary' : 'text-muted-foreground'}`}>Em {daysLeft} dias</p></td>
                                            <td className="py-4 px-4"><Badge className={`${sub.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'} border-0`}>{sub.status === 'active' ? 'Ativa' : 'Pausada'}</Badge></td>
                                            <td className="py-4 px-4 text-right"><DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>{sub.status === 'active' ? <><PauseCircle className="mr-2 h-4 w-4" />Pausar</> : <><PlayCircle className="mr-2 h-4 w-4" />Reativar</>}</DropdownMenuItem>
                                                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-400"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu></td>
                                        </tr>);})}</tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};
