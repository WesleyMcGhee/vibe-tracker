import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PayPeriodActions } from "@/components/pay-period-actions";
import Link from "next/link";
import { Settings, Plus, ChevronRight } from "lucide-react";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      payPeriods: {
        include: { entries: true },
        orderBy: { startDate: "desc" },
      },
    },
  });

  if (!client) notFound();

  const activePeriods = client.payPeriods.filter((p) => p.status === "active");
  const archivedPeriods = client.payPeriods.filter((p) => p.status === "archived");

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/clients" className="hover:text-foreground">Clients</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{client.name}</span>
          </div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">${client.rate}/rider</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" render={<Link href={`/clients/${id}/settings`} />}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" render={<Link href={`/clients/${id}/pay-periods/new`} />}>
            <Plus className="h-4 w-4 mr-1" />
            New Pay Period
          </Button>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Active Periods
        </h2>
        {activePeriods.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No active pay periods.</p>
            </CardContent>
          </Card>
        )}
        {activePeriods.map((period) => {
          const total = period.entries.reduce(
            (sum, e) => sum + e.riders * client.rate + e.extras,
            0
          );
          return (
            <Card key={period.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between gap-3 py-4 px-4 sm:px-5">
                <Link href={`/clients/${id}/pay-periods/${period.id}`} className="flex-1 min-w-0">
                  <p className="font-medium">
                    {new Date(period.startDate).toLocaleDateString()} –{" "}
                    {new Date(period.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {period.entries.length} entries · ${total} total
                  </p>
                </Link>
                <div className="flex items-center gap-2">
                  <Badge>active</Badge>
                  <PayPeriodActions id={period.id} clientId={id} status={period.status} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {archivedPeriods.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Archived Periods
          </h2>
          {archivedPeriods.map((period) => {
            const total = period.entries.reduce(
              (sum, e) => sum + e.riders * client.rate + e.extras,
              0
            );
            return (
              <Card key={period.id} className="opacity-70 hover:opacity-100 transition-opacity">
                <CardContent className="flex items-center justify-between gap-3 py-4 px-4 sm:px-5">
                  <Link href={`/clients/${id}/pay-periods/${period.id}`} className="flex-1 min-w-0">
                    <p className="font-medium">
                      {new Date(period.startDate).toLocaleDateString()} –{" "}
                      {new Date(period.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {period.entries.length} entries · ${total} total
                    </p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">archived</Badge>
                    <PayPeriodActions id={period.id} clientId={id} status={period.status} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
