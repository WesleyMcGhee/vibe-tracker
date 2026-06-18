"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateClient, deleteClient } from "@/app/actions/clients";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { use } from "react";
import { toast } from "sonner";

const RATE_OPTIONS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

export default function ClientSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("5");
  const [clientName, setClientName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setRate(data.rate.toString());
        setClientName(data.name);
      });
  }, [id]);

  function handleSave(formData: FormData) {
    formData.set("name", name);
    formData.set("rate", rate);
    startTransition(async () => {
      await updateClient(id, formData);
      setClientName(name);
      toast.success("Client updated");
    });
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/clients" className="hover:text-foreground">Clients</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/clients/${id}`} className="hover:text-foreground">{clientName}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Settings</span>
        </div>
        <h1 className="text-2xl font-bold">Client Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Permanently delete this client and all their pay periods.
          </p>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => {
              if (confirm("Delete this client and all data? This cannot be undone.")) {
                startDelete(() => deleteClient(id));
              }
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Client"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
