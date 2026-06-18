import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPayPeriod } from "@/app/actions/pay-periods";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const DURATION_OPTIONS = [
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "1_month", label: "1 Month" },
];

export default async function NewPayPeriodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  const today = new Date().toISOString().split("T")[0];

  async function handleCreate(formData: FormData) {
    "use server";
    await createPayPeriod(id, formData);
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/clients" className="hover:text-foreground">Clients</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/clients/${id}`} className="hover:text-foreground">{client.name}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">New Pay Period</span>
        </div>
        <h1 className="text-2xl font-bold">New Pay Period</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pay Period Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={today}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Select name="duration" defaultValue="2_weeks">
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" render={<Link href={`/clients/${id}`} />}>
                Cancel
              </Button>
              <Button type="submit">Create Pay Period</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
