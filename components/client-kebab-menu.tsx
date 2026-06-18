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
import { MoreVertical, Settings, Trash2 } from "lucide-react";
import { deleteClient } from "@/app/actions/clients";
import Link from "next/link";

interface ClientKebabMenuProps {
  clientId: string;
}

export function ClientKebabMenu({ clientId }: ClientKebabMenuProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/clients/${clientId}/settings`} />}>
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex items-center gap-2"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this client and all their data?")) {
              startTransition(() => deleteClient(clientId));
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
