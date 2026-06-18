import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

export default async function DashboardPage() {
  const [clients, payPeriods, entries] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.payPeriod.findMany({
      include: { client: true, entries: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.entry.findMany({ include: { payPeriod: { include: { client: true } } } }),
  ]);

  const activePeriods = payPeriods.filter((p) => p.status === "active");
  const totalRiders = entries.reduce((sum, e) => sum + e.riders, 0);
  const totalRevenue = entries.reduce((sum, e) => {
    return sum + e.riders * e.payPeriod.client.rate + e.extras;
  }, 0);

  const recentPeriods = payPeriods.slice(0, 5);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your invoicing activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Periods</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePeriods.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Riders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRiders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Pay Periods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentPeriods.length === 0 && (
              <p className="text-sm text-muted-foreground">No pay periods yet.</p>
            )}
            {recentPeriods.map((p) => {
              const total = p.entries.reduce(
                (sum, e) => sum + e.riders * p.client.rate + e.extras,
                0
              );
              return (
                <Link
                  key={p.id}
                  href={`/clients/${p.clientId}/pay-periods/${p.id}`}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{p.client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.startDate).toLocaleDateString()} –{" "}
                      {new Date(p.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${total}</span>
                    <Badge variant={p.status === "active" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {clients.length === 0 && (
              <p className="text-sm text-muted-foreground">No clients yet.</p>
            )}
            {clients.slice(0, 5).map((c) => {
              const clientPeriods = payPeriods.filter((p) => p.clientId === c.id);
              const clientRevenue = clientPeriods.reduce((sum, p) => {
                return sum + p.entries.reduce((s, e) => s + e.riders * c.rate + e.extras, 0);
              }, 0);
              return (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">${c.rate}/rider</p>
                  </div>
                  <span className="text-sm font-semibold">${clientRevenue}</span>
                </Link>
              );
            })}
            <Link
              href="/clients"
              className="block text-xs text-center text-muted-foreground hover:text-foreground pt-2"
            >
              View all clients →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
