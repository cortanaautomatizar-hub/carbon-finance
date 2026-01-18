import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const NotificationsMenu = ({ children, items = [] }: { children?: React.ReactNode; items?: Array<{ id: string; title: string; body?: string }> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ?? <Button variant="ghost">Notificações</Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.length === 0 ? (
          <DropdownMenuItem>Nenhuma notificação</DropdownMenuItem>
        ) : (
          items.map((it) => (
            <DropdownMenuItem key={it.id}>
              <div className="flex flex-col">
                <span className="font-medium">{it.title}</span>
                {it.body && <span className="text-sm text-muted-foreground">{it.body}</span>}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
