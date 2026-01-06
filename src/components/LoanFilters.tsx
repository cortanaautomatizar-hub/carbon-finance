import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoanFilterTag {
  id: string;
  label: string;
  value: string;
}

interface LoanFiltersProps {
  filters: LoanFilterTag[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const LoanFilters = ({ filters, activeFilter, onFilterChange }: LoanFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full px-4",
            activeFilter === filter.id && "bg-primary text-primary-foreground shadow-gold"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
