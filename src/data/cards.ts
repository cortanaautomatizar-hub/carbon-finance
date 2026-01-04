import { CreditCardProps } from "@/components/CreditCard";

export const cards: CreditCardProps[] = [
  {
    id: 1,
    name: "Nubank",
    number: "**** **** **** 1234",
    expiry: "12/28",
    cvv: "123",
    brand: "mastercard",
    limit: 15000,
    used: 3250,
    color: "#8A05BE",
    textColor: "#FFFFFF",
    dueDay: 10,
    closingDay: 1,
    transactions: [
        { id: 1, description: "Uber", amount: 25.00, date: "2024-07-28" },
        { id: 2, description: "iFood", amount: 85.50, date: "2024-07-27" },
        { id: 3, description: "Amazon", amount: 150.00, date: "2024-07-26" },
    ],
    invoice: {
        total: 3250.00,
        dueDate: "10/01/2025",
        history: [
            { month: "Dezembro 2024", value: 3250.00, status: "aberta" },
            { month: "Novembro 2024", value: 4120.50, status: "paga" },
        ]
    }
  },
  {
    id: 2,
    name: "Inter",
    number: "**** **** **** 5678",
    expiry: "10/27",
    cvv: "456",
    brand: "visa",
    limit: 10000,
    used: 1500,
    color: "#FF7A00",
    textColor: "#000000",
    dueDay: 15,
    closingDay: 5,
    transactions: [
        { id: 1, description: "Netflix", amount: 39.90, date: "2024-07-25" },
    ],
    invoice: {
        total: 1500.00,
        dueDate: "15/01/2025",
        history: [
            { month: "Dezembro 2024", value: 1500.00, status: "aberta" },
            { month: "Novembro 2024", value: 1800.75, status: "paga" },
        ]
    }
  },
  {
    id: 3,
    name: "C6 Bank",
    number: "**** **** **** 9876",
    expiry: "08/29",
    cvv: "789",
    brand: "mastercard",
    limit: 8000,
    used: 2500,
    color: "#262626",
    textColor: "#FFFFFF",
    dueDay: 5,
    closingDay: 25,
    transactions: [],
    invoice: {
        total: 2500.00,
        dueDate: "05/01/2025",
        history: []
    }
  },
  {
    id: 4,
    name: "Bradesco",
    number: "**** **** **** 5432",
    expiry: "05/26",
    cvv: "321",
    brand: "visa",
    limit: 20000,
    used: 12000,
    color: "#CC092F",
    textColor: "#FFFFFF",
    dueDay: 20,
    closingDay: 10,
    transactions: [],
    invoice: {
        total: 12000.00,
        dueDate: "20/01/2025",
        history: []
    }
  },
  {
    id: 5,
    name: "Santander",
    number: "**** **** **** 1122",
    expiry: "03/30",
    cvv: "654",
    brand: "amex",
    limit: 12000,
    used: 500,
    color: "#E00000",
    textColor: "#FFFFFF",
    dueDay: 25,
    closingDay: 15,
    transactions: [],
    invoice: {
        total: 500.00,
        dueDate: "25/01/2025",
        history: []
    }
  }
];
