import { QrCode, Send, Receipt, Smartphone, Plus } from "lucide-react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all duration-200 group"
  >
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      <span className="text-primary">{icon}</span>
    </div>
    <span className="text-sm font-medium text-foreground">{label}</span>
  </button>
);

export const QuickActions = () => {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Ações rápidas</h2>
      <div className="grid grid-cols-5 gap-3">
        <ActionButton icon={<QrCode size={24} />} label="Pix" />
        <ActionButton icon={<Send size={24} />} label="Transferir" />
        <ActionButton icon={<Receipt size={24} />} label="Pagar" />
        <ActionButton icon={<Smartphone size={24} />} label="Recarga" />
        <ActionButton icon={<Plus size={24} />} label="Mais" />
      </div>
    </div>
  );
};
