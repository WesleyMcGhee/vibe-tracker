"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { archivePayPeriod, activatePayPeriod, deletePayPeriod } from "@/app/actions/pay-periods";

interface PayPeriodActionsProps {
  id: string;
  clientId: string;
  status: string;
}

export function PayPeriodActions({ id, clientId, status }: PayPeriodActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending} />}>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "active" ? (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => startTransition(() => archivePayPeriod(id, clientId))}
          >
            <Archive className="h-4 w-4" />
            Archive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => startTransition(() => activatePayPeriod(id, clientId))}
          >
            <ArchiveRestore className="h-4 w-4" />
            Restore
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex items-center gap-2"
          onClick={() => {
            if (confirm("Delete this pay period and all entries?")) {
              startTransition(() => deletePayPeriod(id, clientId));
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
