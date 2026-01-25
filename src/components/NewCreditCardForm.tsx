
'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const FormSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    brand: z.enum(["mastercard", "visa", "elo", "american express"], { required_error: "Você precisa selecionar uma bandeira." }),
    number: z.string().min(16, { message: "O número do cartão deve ter 16 caracteres." }),
    expiry: z.string().min(5, { message: "A data de validade deve estar no formato MM/AA." }),
    cvv: z.string().min(3, { message: "O CVV deve ter 3 caracteres." }),
    limit: z.coerce.number().min(1, { message: "O limite deve ser maior que 0." }),
    dueDay: z.date({ required_error: "Selecione o dia de vencimento." }),
    closingDay: z.date({ required_error: "Selecione o dia de fechamento." }),
    color: z.string().min(4, { message: "A cor deve ser um hexadecimal válido." }),
    textColor: z.string().min(4, { message: "A cor do texto deve ser um hexadecimal válido." }),
});

import type { CreditCardProps } from '@/components/CreditCard';

export function NewCreditCardForm({ onSave }: { onSave: (data: Omit<CreditCardProps, 'id' | 'transactions' | 'invoice'> & { invoice?: CreditCardProps['invoice'] }) => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            number: "",
            expiry: "",
            cvv: "",
            limit: 0,
            dueDay: new Date(2026, 0, 10), // Default: dia 10
            closingDay: new Date(2026, 0, 1), // Default: dia 1
            color: "#000000",
            textColor: "#FFFFFF",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // Extract day from dates
        const formattedData = {
            ...data,
            dueDay: data.dueDay.getDate(),
            closingDay: data.closingDay.getDate(),
        };
        onSave(formattedData);
        toast({ title: "Cartão adicionado com sucesso!" });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Cartão</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Nubank" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bandeira</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a bandeira" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="mastercard">Mastercard</SelectItem>
                                    <SelectItem value="visa">Visa</SelectItem>
                                    <SelectItem value="elo">Elo</SelectItem>
                                    <SelectItem value="american express">American Express</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número do Cartão</FormLabel>
                            <FormControl>
                                <Input placeholder="**** **** **** 1234" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Validade</FormLabel>
                                <FormControl>
                                    <Input placeholder="MM/AA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                    <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Limite</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="R$ 5.000,00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dueDay"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Dia do Vencimento</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "dd") : <span>Dia</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="closingDay"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Dia do Fechamento</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "dd") : <span>Dia</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-slate-800 bg-slate-900" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor do Cartão</FormLabel>
                                <FormControl>
                                    <Input type="color" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor do Texto</FormLabel>
                                <FormControl>
                                    <Input type="color" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">Salvar</Button>
            </form>
        </Form>
    );
}
