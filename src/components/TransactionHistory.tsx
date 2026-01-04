
import { Transaction } from "@/components/CreditCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TransactionHistoryProps {
    transactions: Transaction[];
    onRemove?: (txId: number) => void;
}
export function TransactionHistory({ transactions, onRemove }: TransactionHistoryProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-semibold">R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                {onRemove && (
                                    <Button variant="ghost" size="icon" onClick={() => onRemove(transaction.id)}>
                                        <Trash2 size={16} className="text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}