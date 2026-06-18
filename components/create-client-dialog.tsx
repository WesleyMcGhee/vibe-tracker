"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/app/actions/clients";
import { Plus } from "lucide-react";

const RATE_OPTIONS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("5");

  function handleSubmit(formData: FormData) {
    formData.set("rate", rate);
    return createClient(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-1" />
        New Client
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Client</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Client Name</Label>
            <Input id="name" name="name" placeholder="Acme Corp" required />
          </div>
          <div className="space-y-1.5">
            <Label>Rate per Rider</Label>
            <Select value={rate} onValueChange={(v) => setRate(v ?? "5")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    ${r} / rider
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
