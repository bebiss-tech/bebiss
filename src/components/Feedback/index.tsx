"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

const Feedback = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <MessageSquare size={16} /> Feedback
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" className="flex  flex-col items-end gap-2">
      <Textarea
        className="h-32 w-64 resize-none"
        placeholder="Novas ideias, reporte bugs, melhoreis..."
      />
      <Button size="sm">Enviar</Button>
    </PopoverContent>
  </Popover>
);

export default Feedback;
