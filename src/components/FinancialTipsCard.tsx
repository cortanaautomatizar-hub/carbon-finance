import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink } from "lucide-react";
import { HelpCenterDialog } from "@/components/HelpCenterDialog";

interface FinancialTip {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FinancialTipsCardProps {
  tips: FinancialTip[];
  onHelpClick?: () => void;
}

export const FinancialTipsCard = ({ tips, onHelpClick }: FinancialTipsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-400" />
          <div>
            <CardTitle className="text-lg">Dicas Financeiras</CardTitle>
            <CardDescription>Estratégias para economizar com juros</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip) => (
          <div key={tip.id} className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-start gap-2 flex-1">
              <span className="mt-1 inline-block size-1.5 rounded-full bg-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <HelpCenterDialog 
          trigger={
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={onHelpClick}
            >
              <ExternalLink size={14} />
              Ir para central de ajuda
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};
