
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { cards } from "@/data/cards";
import { subscriptions } from "@/data/subscriptions";

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

// Função para gerar a análise financeira
const generateFinancialAnalysis = () => {
  // Análise dos Cartões
  const totalCardSpending = cards.reduce((sum, card) => sum + card.used, 0);
  const totalCardLimit = cards.reduce((sum, card) => sum + card.limit, 0);
  const cardUsagePercentage = totalCardLimit > 0 ? (totalCardSpending / totalCardLimit) * 100 : 0;
  const cardWithHighestUsage = cards.length > 0 ? cards.reduce((max, card) => card.used > max.used ? card : max, cards[0]) : null;

  // Análise das Assinaturas
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const pausedSubscriptions = subscriptions.filter(s => s.status === 'paused');
  const totalSubscriptionCost = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const savingsFromPaused = pausedSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  // Construindo a resposta da IA
  let analysis = `Analisando suas finanças...

**Resumo dos Cartões de Crédito:**
`;
  analysis += `*   **Gasto Total:** R$ ${totalCardSpending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
`;
  analysis += `*   **Uso do Limite:** Você utilizou **${cardUsagePercentage.toFixed(1)}%** do seu limite total de R$ ${totalCardLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
`;
  if (cardWithHighestUsage) {
    analysis += `*   **Principal Cartão:** O **${cardWithHighestUsage.name}** é seu cartão mais utilizado, com um gasto de R$ ${cardWithHighestUsage.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.

`;
  }

  analysis += `**Resumo das Assinaturas:**
`;
  analysis += `*   **Custo Mensal:** Você gasta R$ ${totalSubscriptionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês com **${activeSubscriptions.length} assinaturas** ativas.
`;
  if (savingsFromPaused > 0) {
    analysis += `*   **Economia Inteligente:** Você está economizando **R$ ${savingsFromPaused.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês** com ${pausedSubscriptions.length} assinaturas pausadas. Excelente!

`;
  }

  analysis += `**Oportunidades e Dicas:**
`;
  if (cardUsagePercentage > 70) {
    analysis += `*   **Alerta de Limite:** Seu gasto total nos cartões ultrapassou 70% do limite. É um bom momento para revisar as despesas e evitar juros.
`;
  } else {
    analysis += `*   **Gestão de Limite:** Você está gerenciando bem o limite dos seus cartões. Continue assim para manter uma boa saúde financeira.
`;
  }
  analysis += `*   **Centralize para Ganhar:** Já que o cartão **${cardWithHighestUsage?.name}** é o mais usado, verifique se ele oferece o melhor programa de benefícios (pontos ou cashback). Centralizar seus gastos pode acelerar seus ganhos.
`;
  analysis += `*   **Revise seus Serviços:** Que tal dar uma olhada nas suas ${activeSubscriptions.length} assinaturas? Verifique se todos os serviços ainda são essenciais. Um ou dois cancelamentos podem fazer a diferença no fim do mês.

`;

  analysis += `Estou aqui para ajudar a otimizar ainda mais. Continue me consultando!`;

  return analysis;
};


export default function FinancialAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const analysisText = generateFinancialAnalysis();
      const assistantResponse: Message = {
        sender: 'assistant',
        text: analysisText
      };
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto bg-[#121212] text-white">
      <header className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-3xl font-bold">Seu Assistente Financeiro</h1>
        </div>
        <p className="text-gray-400 mt-2">
            Converse com seu assistente para dicas personalizadas e inteligentes sobre suas finanças.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-500">
                <p>Faça uma pergunta para iniciar a análise.</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-2xl ${msg.sender === 'user' ? 'bg-yellow-400 text-black' : 'bg-[#1C1C1C]'}`}>
              <CardContent className="p-4 whitespace-pre-wrap font-sans">
                <p>{msg.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-lg bg-[#1C1C1C]">
              <CardContent className="p-3">
                <p className="animate-pulse">Analisando seus dados...</p>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-gray-700">
        <div className="relative">
          <Textarea
            placeholder="Ex: Analise minhas finanças..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            rows={1}
            className="bg-[#1C1C1C] border-gray-600 pr-12 resize-none focus:ring-yellow-400"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="absolute right-2.5 bottom-1/2 translate-y-1/2 h-8 w-8 bg-yellow-400 hover:bg-yellow-500" size="icon">
            <Send size={16} className="text-black"/>
          </Button>
        </div>
      </footer>
    </div>
  );
}
