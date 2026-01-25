import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const SearchDialog = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim().length === 0) return;
    // Navigate to the subscriptions page search for now
    navigate(`/assinaturas?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <span />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar</DialogTitle>
          <DialogDescription>Pesquise transações, cartões ou assinaturas</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="mt-4">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
