"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brazilianStates } from "@/utils/brazilian-states";

type NewCompanyModalProps = {
  onChangeVisibility: (open: boolean) => void;
  open: boolean;
};

const NewCompanyModal = ({
  onChangeVisibility,
  open,
}: NewCompanyModalProps) => {
  const { toast } = useToast();

  const handleCreate = () => {
    // TODO: Change {empresa} to the company name
    toast({
      title: `{empresa} criada com sucesso!`,
      description: "Agora você pode realizar agendamentos para a {empresa}.",
    });

    onChangeVisibility(false);
  };

  return (
    <Dialog open={open} onOpenChange={onChangeVisibility}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar acesso</DialogTitle>
          <DialogDescription>
            Descubra como economizar tempo e dinheiro com a Bebiss.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Bebiss" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(61) 99999-9999" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCompanyModal;
