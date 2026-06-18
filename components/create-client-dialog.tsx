"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RateInput } from "@/components/rate-input";
import { createClient } from "@/app/actions/clients";
import { Plus } from "lucide-react";

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
          <RateInput value={rate} onChange={setRate} />
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
