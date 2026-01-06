
import { useEffect, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ChevronDown, Eye, Flag, Plus, RefreshCw, Star } from "lucide-react";

// TradingView Widget Component
const TradingViewWidget = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const container = containerRef.current;
        if (!container || container.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.type = 'text/javascript';
        script.innerHTML = JSON.stringify({
          "colorTheme": "dark",
          "dateRange": "12M",
          "showChart": true,
          "locale": "br",
          "largeChartUrl": "",
          "isTransparent": true,
          "showSymbolLogo": true,
          "showFloatingTooltip": false,
          "width": "100%",
          "height": "550",
          "tabs": [
            {"title": "Principais Índices", "symbols": [{"s": "BMFBOVESPA:IBOV", "d": "Ibovespa"}, {"s": "FOREXCOM:SPXUSD", "d": "S&P 500"}, {"s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100"}, {"s": "BITSTAMP:BTCUSD", "d": "Bitcoin"}], "originalTitle": "Indices"},
            {"title": "Ações Brasileiras", "symbols": [{"s": "BMFBOVESPA:PETR4", "d": "Petrobras"}, {"s": "BMFBOVESPA:VALE3", "d": "Vale"}, {"s": "BMFBOVESPA:ITUB4", "d": "Itaú Unibanco"}, {"s": "BMFBOVESPA:BBDC4", "d": "Bradesco"}, {"s": "BMFBOVESPA:MGLU3", "d": "Magazine Luiza"}, {"s": "BMFBOVESPA:WEGE3", "d": "WEG"}], "originalTitle": "Stocks"},
            {"title": "Fundos Imobiliários", "symbols": [{"s": "BMFBOVESPA:MXRF11", "d": "Maxi Renda"}, {"s": "BMFBOVESPA:HGLG11", "d": "CSHG Logística"}, {"s": "BMFBOVESPA:KNRI11", "d": "Kinea Renda"}, {"s": "BMFBOVESPA:BTCI11", "d": "BTG Crédito Imob."}, {"s": "BMFBOVESPA:XPLG11", "d": "XP Log"}, {"s": "BMFBOVESPA:VISC11", "d": "Vinci Shopping"}], "originalTitle": "FIIs"}
          ]
        });
        
        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        }
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: '550px', width: '100%' }}>
            <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
        </div>
    );
});


// Mock Data based on the image
const assetAllocation = [
  { name: "Renda Fixa", value: 65, color: "bg-yellow-400" },
  { name: "Fundos", value: 20, color: "bg-blue-400" },
  { name: "Ações", value: 10, color: "bg-purple-400" },
  { name: "Outros", value: 5, color: "bg-gray-400" },
];

const myProducts = [
  { icon: "CDB", type: "CDB Carbon Pós-Fixado", category: "Renda Fixa", balance: "R$ 45.200,00", rentability: "+1.12%", expiry: "12/12/2025" },
  { icon: "FCT", type: "Fundo Carbon Tech", category: "Multimercado", balance: "R$ 22.150,00", rentability: "+3.45%", expiry: "D+30" },
  { icon: "TS", type: "Tesouro Selic 2027", category: "Tesouro Direto", balance: "R$ 15.000,00", rentability: "+0.98%", expiry: "01/03/2027" },
  { icon: "P", type: "PETR4", category: "Ações", balance: "R$ 8.430,00", rentability: "-1.20%", expiry: "-" },
];

const evolutionData = [
    { month: "Jan", value: 40 },
    { month: "Fev", value: 60 },
    { month: "Mar", value: 50 },
    { month: "Abr", value: 75 },
    { month: "Mai", value: 85 },
    { month: "Jun", value: 100 },
];

const recentActivity = [
    { type: "Aporte CDB", date: "Ontem", amount: "R$ 500,00", icon: <ArrowDown className="text-green-500"/>, status: "credit" },
    { type: "Rebalanceamento", date: "20 Mai", status: "Finalizado", icon: <RefreshCw className="text-yellow-500"/> },
    { type: "Dividendos FII", date: "15 Mai", amount: "R$ 124,50", icon: <ArrowDown className="text-green-500"/>, status: "credit" },
];

const Investments = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Investimentos</h1>
        <p className="text-muted-foreground">Acompanhe e gerencie seu portfólio de investimentos</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patrimônio Total */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-2">
                Patrimônio Total <Eye size={16} className="inline-block"/>
              </CardTitle>
              <div className="text-sm text-green-500 bg-green-500/10 px-2 py-1 rounded-md flex items-center">
                <ArrowUp size={14} className="mr-1"/>
                +2.4% este mês
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">R$ 154.230,00</p>
              <p className="text-muted-foreground text-sm">Rendimento total: + R$ 3.420,12</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {assetAllocation.map((asset) => (
                  <div key={asset.name}>
                    <div className="flex justify-between text-sm">
                      <span>{asset.name}</span>
                      <span className="font-semibold">{asset.value}%</span>
                    </div>
                    <Progress value={asset.value} className={`h-1.5 mt-1 ${asset.color}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Button className="w-full h-20 text-lg font-semibold flex justify-between items-center">
              Investir
              <span className="bg-primary-foreground/10 rounded-full p-2"><Plus/></span>
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="h-20 text-md font-semibold flex flex-col gap-1">
                <RefreshCw/>
                Resgatar
              </Button>
              <Button variant="secondary" className="h-20 text-md font-semibold flex flex-col gap-1">
                <Flag/>
                Metas
              </Button>
            </div>
          </div>
        </div>

        {/* Oportunidade do Dia */}
        <Card className="border-primary/50 flex items-center justify-between p-4">
            <div className="flex items-center">
                <div className="bg-primary/20 text-primary p-2 rounded-full mr-4">
                    <Star/>
                </div>
                <div>
                    <h3 className="font-semibold">Oportunidade do Dia: CDB Carbon Pós-fixado</h3>
                    <p className="text-sm text-muted-foreground">Rentabilidade de <span className="text-primary font-semibold">110% do CDI</span> com liquidez diária.</p>
                </div>
            </div>
            <Button variant="outline">Ver detalhes</Button>
        </Card>

        {/* Visão Geral do Mercado */}
         <Card>
            <CardHeader>
                <CardTitle>Visão Geral do Mercado</CardTitle>
            </CardHeader>
            <CardContent>
                <TradingViewWidget />
            </CardContent>
        </Card>
        
        {/* Meus Produtos & Evolução */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Meus Produtos</h2>
                    <a href="#" className="text-primary text-sm font-semibold hover:underline">Ver todos</a>
                </div>
                <Card>
                    <CardContent className="p-0">
                       <div className="overflow-x-auto">
                         <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-transparent">
                                    <TableHead className="text-gray-400">Produto</TableHead>
                                    <TableHead className="text-gray-400">Saldo Atual</TableHead>
                                    <TableHead className="text-gray-400">Rentabilidade</TableHead>
                                    <TableHead className="text-gray-400">Vencimento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myProducts.map(prod => (
                                    <TableRow key={prod.type} className="border-gray-700">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-xs font-bold">{prod.icon}</div>
                                                <div>
                                                    <p className="font-bold">{prod.type}</p>
                                                    <p className="text-xs text-gray-400">{prod.category}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">{prod.balance}</TableCell>
                                        <TableCell className={`${prod.rentability.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{prod.rentability}</TableCell>
                                        <TableCell>{prod.expiry}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                       </div>
                        <div className="text-center p-4 border-t">
                            <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center justify-center">Carregar mais <ChevronDown size={16} className="ml-1"/></a>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Evolução */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Evolução</h2>
                 <Card>
                     <CardHeader>
                        <div className="bg-accent p-1 rounded-md flex">
                            <Button size="sm" className="flex-1 h-8">6M</Button>
                            <Button size="sm" variant="ghost" className="flex-1 h-8">1A</Button>
                            <Button size="sm" variant="ghost" className="flex-1 h-8">YTD</Button>
                        </div>
                     </CardHeader>
                     <CardContent className="h-60 flex items-end justify-between px-4">
                        {evolutionData.map(d => (
                            <div key={d.month} className="flex flex-col items-center gap-2 w-1/6">
                                <div className="w-full h-full flex items-end">
                                    <div className="bg-primary w-full rounded-t-sm" style={{ height: `${d.value}%`}}></div>
                                </div>
                                <span className="text-xs text-muted-foreground">{d.month}</span>
                            </div>
                        ))}
                     </CardContent>
                 </Card>
            </div>
        </div>

        {/* Atividade Recente */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {recentActivity.map((item, index) =>(
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-3">{item.icon}</div>
                                <div>
                                    <p className="font-semibold">{item.type}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                            </div>
                            <div className={`font-semibold ${item.status === "credit" && "text-green-500"}`}>
                               {item.amount ? item.amount : item.status}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Investments;
