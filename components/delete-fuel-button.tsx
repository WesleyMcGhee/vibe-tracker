"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteFuelEntry } from "@/app/actions/fuel";

interface DeleteFuelButtonProps {
  id: string;
}

export function DeleteFuelButton({ id }: DeleteFuelButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-destructive hover:text-destructive"
      disabled={isPending}
      onClick={() => startTransition(() => deleteFuelEntry(id))}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
