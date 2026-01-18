import React from "react";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

export const NotificationsMenu = ({ children, items = [] }: { children?: React.ReactNode; items?: Array<{ id: string; title: string; body?: string }> }) => {
  return (
    <Menu>
      <MenuTrigger asChild>
        {children ?? <Button variant="ghost">Notificações</Button>}
      </MenuTrigger>
      <MenuContent>
        {items.length === 0 ? (
          <MenuItem>Nenhuma notificação</MenuItem>
        ) : (
          items.map((it) => (
            <MenuItem key={it.id}>
              <div className="flex flex-col">
                <span className="font-medium">{it.title}</span>
                {it.body && <span className="text-sm text-muted-foreground">{it.body}</span>}
              </div>
            </MenuItem>
          ))
        )}
      </MenuContent>
    </Menu>
  );
};

export default NotificationsMenu;
