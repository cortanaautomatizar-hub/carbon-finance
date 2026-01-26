
import { useState, useMemo, useEffect, useRef } from "react";
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
import { toast } from '@/components/ui/use-toast';
import { getAllSubscriptions, getServiceColors, addSubscription as svcAddSubscription, updateSubscription as svcUpdateSubscription, removeSubscription as svcRemoveSubscription, setServiceColor as svcSetServiceColor, removeServiceColor as svcRemoveServiceColor } from '@/services/subscriptions';

// --- DADOS E FUNÇÕES AUXILIARES ---

const today = new Date();
const initialEnhancedSubscriptions = initialSubscriptions.map(sub => ({
    ...sub,
    renewalDate: add(today, { days: sub.dueDate }).toISOString(),
    card: "Cartão final 8842",
}));

const getInitials = (name: string | undefined): string => {
    if (!name) return "";
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const initialServiceColors: Record<string, string> = {
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

import type { Subscription } from '@/services/subscriptions';

type SubscriptionPayload = {
    name: string;
    amount: number;
    category: string;
    color?: string;
    renewalDate?: string;
};

type AddSubscriptionModalProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAddSubscription?: (payload: SubscriptionPayload) => void;
    initialData?: Subscription | null;
    onSaveSubscription?: (updated: Subscription) => void;
};

const AddSubscriptionModal = ({ open, onOpenChange, onAddSubscription, initialData, onSaveSubscription }: AddSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("#71717A");
    const [renewalDate, setRenewalDate] = useState(""); // format YYYY-MM-DD for input
    const [errors, setErrors] = useState({ name: '', amount: '', category: '', renewalDate: '' });
    const nameRef = useRef<HTMLInputElement | null>(null);
    const amountRef = useRef<HTMLInputElement | null>(null);
    const categoryTriggerId = useRef(`select-trigger-${Math.random().toString(36).slice(2,9)}`);

    const presetColors = ["#E50914", "#1DB954", "#00A8E1", "#F26722", "#FF0000", "#3b5998", "#1da1f2", "#c71610", "#000000", "#71717A"];

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setAmount(initialData.amount != null ? String(initialData.amount) : "");
            setCategory(initialData.category || "");
            setColor(initialData.color || "#71717A");
            try {
                setRenewalDate(initialData.renewalDate ? format(parseISO(initialData.renewalDate), 'yyyy-MM-dd') : format(add(today, { days: 30 }), 'yyyy-MM-dd'));
            } catch (e) {
                // fallback to default if parsing fails
                setRenewalDate(format(add(today, { days: 30 }), 'yyyy-MM-dd'));
            }
        } else {
            setName(""); setAmount(""); setCategory(""); setColor("#71717A");
            setRenewalDate(format(add(today, { days: 30 }), 'yyyy-MM-dd'));
        }
        setErrors({ name: '', amount: '', category: '', renewalDate: '' });
        // focus when modal opens
        if (open) {
            setTimeout(() => {
                try { nameRef.current?.focus(); } catch (e) { /* ignore focus errors */ }
            }, 50);
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        const parsed = parseFloat(amount);
        const nextErrors = { name: '', amount: '', category: '', renewalDate: '' };
        if (!name || !name.trim()) nextErrors.name = 'Nome é obrigatório.';
        if (isNaN(parsed) || parsed <= 0) nextErrors.amount = 'Informe um valor maior que 0.';
        if (!category) nextErrors.category = 'Selecione uma categoria.';
        if (!renewalDate) nextErrors.renewalDate = 'Informe a data de renovação.';
        // validate date >= today
        if (renewalDate) {
            const picked = new Date(renewalDate + 'T00:00:00');
            const t = new Date(); t.setHours(0,0,0,0);
            if (picked < t) nextErrors.renewalDate = 'A data deve ser hoje ou futura.';
        }
        setErrors(nextErrors);
        // focus first invalid
        if (nextErrors.name) { nameRef.current?.focus(); return; }
        if (nextErrors.amount) { amountRef.current?.focus(); return; }
        if (nextErrors.category) { const el = document.getElementById(categoryTriggerId.current); if (el) el.focus(); return; }
        if (nextErrors.renewalDate) { const el = document.getElementById('renewal-date-input'); if (el) (el as HTMLInputElement).focus(); return; }

        const isoDate = new Date(renewalDate + 'T00:00:00').toISOString();
        const payload = { name, amount: parsed, category, color, renewalDate: isoDate };
        if (onSaveSubscription && initialData && initialData.id != null) {
            onSaveSubscription({ id: initialData.id, ...payload });
        } else if (onAddSubscription) {
            onAddSubscription(payload);
        }
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
                        <Input id="name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} className={`col-span-3 ${errors.name ? 'ring-1 ring-red-500' : ''}`} aria-invalid={!!errors.name} />
                        {errors.name && <p className="col-span-3 text-sm text-red-500 mt-1 pl-4">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Valor (R$)</Label>
                        <Input id="amount" ref={amountRef} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`col-span-3 ${errors.amount ? 'ring-1 ring-red-500' : ''}`} aria-invalid={!!errors.amount} />
                        {errors.amount && <p className="col-span-3 text-sm text-red-500 mt-1 pl-4">{errors.amount}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Categoria</Label>
                        <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger id={categoryTriggerId.current} className={`col-span-3 ${errors.category ? 'ring-1 ring-red-500' : ''}`} aria-invalid={!!errors.category}><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="col-span-3 text-sm text-red-500 mt-1 pl-4">{errors.category}</p>}
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="renewal-date-input" className="text-right">Data de Renovação</Label>
                        <Input id="renewal-date-input" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} className={`col-span-3 ${errors.renewalDate ? 'ring-1 ring-red-500' : ''}`} aria-invalid={!!errors.renewalDate} />
                        {errors.renewalDate && <p className="col-span-3 text-sm text-red-500 mt-1 pl-4">{errors.renewalDate}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>{initialData ? 'Salvar Alterações' : 'Adicionar Assinatura'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export const SubscriptionControl = () => {
    const [subscriptions, setSubscriptions] = useState(() => {
        const s = getAllSubscriptions();
        return s && s.length > 0 ? s : initialEnhancedSubscriptions;
    });
    const [serviceColors, setServiceColors] = useState(() => {
        const c = getServiceColors();
        return c && Object.keys(c).length > 0 ? c : initialServiceColors;
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("renewalDate");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

    const handleAddSubscription = (newSub: SubscriptionPayload) => {
        const finalNewSub: Omit<Subscription, 'id'> = {
            name: newSub.name,
            amount: newSub.amount,
            category: newSub.category,
            status: 'active',
            renewalDate: newSub.renewalDate ?? add(today, { days: 30 }).toISOString(),
            card: 'Cartão final 8842'
        };

        const saved = svcAddSubscription(finalNewSub);
        setSubscriptions(prev => [...prev, saved]);
        if (newSub.color) svcSetServiceColor(saved.name, newSub.color);
        setServiceColors(prev => ({ ...prev, [saved.name]: newSub.color ?? prev[saved.name] }));
        setIsModalOpen(false);
        try { toast({ title: 'Assinatura adicionada', description: `${saved.name} foi adicionada.` }); } catch (e) { /* ignore toast failures */ }
    };

    const handleToggleStatus = (id: number) => {
        setSubscriptions(prev => {
            const next = prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s);
            const changed = next.find(s => s.id === id);
            // persist
            if (changed) svcUpdateSubscription(changed);
            try { toast({ title: changed.status === 'active' ? 'Assinatura reativada' : 'Assinatura pausada', description: `${changed.name}` }); } catch (e) { /* ignore toast */ }
            return next;
        });
    };

    const handleSaveSubscription = (updated: Subscription) => {
        setSubscriptions(prev => prev.map(s => s.id === updated.id ? { ...s, name: updated.name, amount: updated.amount, category: updated.category, color: updated.color, renewalDate: updated.renewalDate } : s));
        // update colors mapping, remove old key if name changed
        setServiceColors(prev => {
            const old = prev;
            const existing = subscriptions.find(s => s.id === updated.id);
            const newMap = { ...old, [updated.name]: updated.color };
            if (existing && existing.name && existing.name !== updated.name) {
                delete newMap[existing.name];
            }
            return newMap;
        });
            // persist changes
            try {
                // persist subscription data (color is stored separately via serviceColors)
                svcUpdateSubscription({ id: updated.id, name: updated.name, amount: updated.amount, category: updated.category, renewalDate: updated.renewalDate, status: updated.status ?? 'active', card: updated.card ?? 'Cartão final 8842' });
                svcSetServiceColor(updated.name, updated.color);
                const existing = subscriptions.find(s => s.id === updated.id);
                if (existing && existing.name && existing.name !== updated.name) {
                    svcRemoveServiceColor(existing.name);
                }
            } catch (e) {
                // ignore persistence errors
            }
            setEditingSubscription(null);
    };

    const handleDeleteSubscription = (id: number) => {
        const sub = subscriptions.find(s => s.id === id);
        const name = sub ? sub.name : 'assinatura';
        const removed = svcRemoveSubscription(id);
        // if removed, also remove color mapping
        if (removed && serviceColors[removed.name]) {
            svcRemoveServiceColor(removed.name);
            setServiceColors(prev => {
                const next = { ...prev };
                delete next[removed.name];
                return next;
            });
        }
        setSubscriptions(prev => prev.filter(s => s.id !== id));
        try { toast({ title: 'Assinatura excluída', description: `${name} foi removida.`, variant: 'destructive' }); } catch (e) { /* ignore toast */ }
    };

    const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // persist subscriptions and serviceColors to localStorage
    // persistence handled by service functions called in handlers

    const confirmDelete = () => {
        if (deleteTarget) {
            handleDeleteSubscription(deleteTarget.id);
            setDeleteTarget(null);
        }
        setIsDeleteOpen(false);
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
            <AddSubscriptionModal open={Boolean(editingSubscription)} onOpenChange={(v) => { if (!v) setEditingSubscription(null); }} initialData={editingSubscription} onSaveSubscription={handleSaveSubscription} />

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}>Cancelar</Button>
                        <Button className="bg-red-500 text-white" onClick={confirmDelete}>Excluir</Button>
                    </div>
                </DialogContent>
            </Dialog>
            
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
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(sub.id)}>{sub.status === 'active' ? <><PauseCircle className="mr-2 h-4 w-4" />Pausar</> : <><PlayCircle className="mr-2 h-4 w-4" />Reativar</>}</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingSubscription({ ...sub, color: serviceColors[sub.name] || serviceColors.Default })}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-400" onClick={() => { setDeleteTarget(sub); setIsDeleteOpen(true); }}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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
