"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiderPicker } from "./rider-picker";
import { createEntry } from "@/app/actions/entries";
import { Plus } from "lucide-react";

const EXTRAS_OPTIONS = Array.from({ length: 21 }, (_, i) => i * 2.5);

interface AddEntryDialogProps {
  payPeriodId: string;
  clientId: string;
}

export function AddEntryDialog({ payPeriodId, clientId }: AddEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [riders, setRiders] = useState(1);
  const [shift, setShift] = useState("AM");
  const [extras, setExtras] = useState("0");
  const [customExtras, setCustomExtras] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("riders", riders.toString());
    formData.set("shift", shift);
    formData.set("extras", extras === "custom" ? (customExtras || "0") : extras);

    startTransition(async () => {
      await createEntry(payPeriodId, clientId, formData);
      setOpen(false);
      setRiders(1);
      setShift("AM");
      setExtras("0");
      setCustomExtras("");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4 mr-1" />
        Add Entry
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Entry</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Riders</Label>
            <RiderPicker value={riders} onChange={setRiders} />
          </div>

          <div className="space-y-1.5">
            <Label>Shift</Label>
            <div className="flex gap-2">
              {["AM", "PM"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShift(s)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                    shift === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent border-input"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Extras</Label>
            <Select value={extras} onValueChange={(v) => { setExtras(v ?? "0"); if (v !== "custom") setCustomExtras(""); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXTRAS_OPTIONS.map((amount) => (
                  <SelectItem key={amount} value={amount.toString()}>
                    ${amount % 1 === 0 ? amount : amount.toFixed(2)}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
            {extras === "custom" && (
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={customExtras}
                onChange={(e) => setCustomExtras(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Optional notes..."
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
