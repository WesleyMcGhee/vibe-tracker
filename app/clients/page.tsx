import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateClientDialog } from "@/components/create-client-dialog";
import { ClientKebabMenu } from "@/components/client-kebab-menu";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { payPeriods: { include: { entries: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <CreateClientDialog />
      </div>

      {clients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-sm">No clients yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Create your first client to get started.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {clients.map((client) => {
          const activePeriods = client.payPeriods.filter((p) => p.status === "active");
          const totalRevenue = client.payPeriods.reduce((sum, p) => {
            return sum + p.entries.reduce((s, e) => s + e.riders * client.rate + e.extras, 0);
          }, 0);

          return (
            <Card key={client.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between py-4 px-5">
                <Link href={`/clients/${client.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {client.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">${client.rate}/rider</p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">total revenue</p>
                  </div>
                  {activePeriods.length > 0 && (
                    <Badge variant="default" className="hidden sm:inline-flex">
                      {activePeriods.length} active
                    </Badge>
                  )}
                  <ClientKebabMenu clientId={client.id} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
