"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteEntry } from "@/app/actions/entries";

interface DeleteEntryButtonProps {
  id: string;
  payPeriodId: string;
  clientId: string;
}

export function DeleteEntryButton({ id, payPeriodId, clientId }: DeleteEntryButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-destructive hover:text-destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(() => deleteEntry(id, payPeriodId, clientId))
      }
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
