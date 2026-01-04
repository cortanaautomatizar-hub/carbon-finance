
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const FormSchema = z.object({
    description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres." }),
    amount: z.coerce.number().min(0.01, { message: "O valor deve ser maior que 0." }),
    date: z.string(),
});

export function NewTransactionForm({ onSave, onDone }: { onSave: (data: z.infer<typeof FormSchema>) => void, onDone?: () => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onChange',
        defaultValues: {
            description: "",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        form.setFocus("description");
    }, [form.setFocus]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        onSave(data);
        toast({ title: "Transação adicionada com sucesso!" });
        form.reset();
        onDone?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Uber" {...field} aria-invalid={!!form.formState.errors.description} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="25,00" {...field} aria-invalid={!!form.formState.errors.amount} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} aria-invalid={!!form.formState.errors.date} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={!form.formState.isValid}>Salvar</Button>
            </form>
        </Form>
    );
}
