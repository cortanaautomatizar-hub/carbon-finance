
'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    brand: z.enum(["mastercard", "visa", "elo", "american express"], { required_error: "Você precisa selecionar uma bandeira." }),
    number: z.string().min(16, { message: "O número do cartão deve ter 16 caracteres." }),
    expiry: z.string().min(5, { message: "A data de validade deve estar no formato MM/AA." }),
    cvv: z.string().min(3, { message: "O CVV deve ter 3 caracteres." }),
    limit: z.coerce.number().min(1, { message: "O limite deve ser maior que 0." }),
    dueDay: z.coerce.number().min(1, { message: "O dia de vencimento deve ser maior que 0." }).max(31, { message: "O dia de vencimento deve ser menor que 31." }),
    closingDay: z.coerce.number().min(1, { message: "O dia de fechamento deve ser maior que 0." }).max(31, { message: "O dia de fechamento deve ser menor que 31." }),
    color: z.string().min(4, { message: "A cor deve ser um hexadecimal válido." }),
    textColor: z.string().min(4, { message: "A cor do texto deve ser um hexadecimal válido." }),
});

export function NewCreditCardForm({ onSave }: { onSave: (data: z.infer<typeof FormSchema>) => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            number: "",
            expiry: "",
            cvv: "",
            limit: 0,
            dueDay: 1,
            closingDay: 1,
            color: "#000000",
            textColor: "#FFFFFF",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        onSave(data);
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
                            <FormItem>
                                <FormLabel>Dia do Vencimento</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="closingDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dia do Fechamento</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1" {...field} />
                                </FormControl>
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
