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
          <DialogTitle>Nova empresa</DialogTitle>
          <DialogDescription>
            Adicione uma nova empresa para gerenciar agendamentos.
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

            <div className="space-y-4">
              <h4 className="text-muted-foreground -mb-2 text-sm text-slate-500 ">
                Endereço
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="zipcode">CEP</Label>
                  <Input id="zipcode" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="plan">Estado</Label>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {brazilianStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_100px] gap-4">
                <div className="space-y-1">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" />
                </div>

                <div className=" space-y-1">
                  <Label htmlFor="number">Numero</Label>
                  <Input id="number" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onChangeVisibility(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCompanyModal;
