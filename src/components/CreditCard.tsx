import { Wifi } from "lucide-react";

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    category?: "alimentação" | "transporte" | "saúde" | "diversão" | "educação" | "compras" | "outros";
}

export interface CreditCardProps {
    id: number;
    name: string;
    number: string;
    expiry: string;
    cvv: string;
    brand?: string;
    limit: number;
    used: number;
    color: string;
    textColor: string;
    dueDay?: number;
    closingDay?: number;
    monthlyBudget?: number;
    transactions?: Transaction[];
    invoice: {
        total: number;
        dueDate: string;
        history: {
            month: string;
            value: number;
            status: string;
        }[];
    };
}

export const CreditCard = ({ name, number, expiry, color, textColor, brand }: CreditCardProps) => {
    return (
        <div
            className="w-96 h-60 max-w-[95vw] mx-auto rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
            style={{ backgroundColor: color, color: textColor }}
        >
            <div className="flex justify-between items-start">
                <span className="text-2xl font-bold">{name}</span>
                <Wifi size={28} className="rotate-90" />
            </div>

            <div>
                <div 
                    className="w-12 h-9 rounded-md mb-3"
                    style={{ background: 'linear-gradient(135deg, #d6c694, #a3905b)' }}
                />
                <span className="text-2xl font-mono tracking-widest">{`**** **** **** ${number.slice(-4)}`}</span>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <span className="text-xs uppercase font-light">Card Holder</span>
                    <p className="font-semibold tracking-wider">Carbon User</p>
                </div>
                <div className="flex items-end gap-4">
                    <div className="text-right">
                        <span className="text-xs uppercase font-light">Expires</span>
                        <p className="font-semibold tracking-wider">{expiry}</p>
                    </div>
                    {brand && (
                        <div>
                            <span className="text-lg font-bold uppercase">{brand}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
