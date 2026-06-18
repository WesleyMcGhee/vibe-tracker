import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddEntryDialog } from "@/components/add-entry-dialog";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { ExportPdfButton } from "@/components/export-pdf-button";
import { PayPeriodActions } from "@/components/pay-period-actions";
import { getSettings } from "@/app/actions/settings";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function fmt(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default async function PayPeriodPage({
  params,
}: {
  params: Promise<{ id: string; periodId: string }>;
}) {
  const { id, periodId } = await params;

  const [period, settings] = await Promise.all([
    prisma.payPeriod.findUnique({
      where: { id: periodId },
      include: {
        client: true,
        entries: { orderBy: { date: "asc" } },
      },
    }),
    getSettings(),
  ]);

  if (!period || period.clientId !== id) notFound();

  const rate = period.client.rate;
  const grandTotal = period.entries.reduce(
    (sum, e) => sum + e.riders * rate + e.extras,
    0
  );

  const serializedEntries = period.entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    riders: e.riders,
    shift: e.shift,
    extras: e.extras,
    notes: e.notes,
  }));

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/clients" className="hover:text-foreground">Clients</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/clients/${id}`} className="hover:text-foreground">{period.client.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">
              {new Date(period.startDate).toLocaleDateString()} – {new Date(period.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">
              {new Date(period.startDate).toLocaleDateString()} – {new Date(period.endDate).toLocaleDateString()}
            </h1>
            <Badge variant={period.status === "active" ? "default" : "secondary"}>
              {period.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            {period.client.name} · ${rate}/rider
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <ExportPdfButton
            clientName={period.client.name}
            rate={rate}
            startDate={period.startDate.toISOString()}
            endDate={period.endDate.toISOString()}
            entries={serializedEntries}
            settings={settings}
          />
          <AddEntryDialog payPeriodId={periodId} clientId={id} />
          <PayPeriodActions id={periodId} clientId={id} status={period.status} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {period.entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No entries yet. Add your first entry above.
            </div>
          ) : (
            <>
              <div className="sm:hidden divide-y">
                {period.entries.map((entry) => {
                  const riderTotal = entry.riders * rate;
                  const dayTotal = riderTotal + entry.extras;
                  return (
                    <div key={entry.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="text-xs">{entry.shift}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {entry.riders} rider{entry.riders !== 1 ? "s" : ""} · {fmt(riderTotal)}
                          {entry.extras > 0 ? ` · +${fmt(entry.extras)} extras` : ""}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground truncate">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-sm">{fmt(dayTotal)}</span>
                        <DeleteEntryButton id={entry.id} payPeriodId={periodId} clientId={id} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                    <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Shift</th>
                    <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Riders</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Rider Total</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Extras</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Notes</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                    <th className="px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {period.entries.map((entry, idx) => {
                    const riderTotal = entry.riders * rate;
                    const dayTotal = riderTotal + entry.extras;
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b last:border-0 ${idx % 2 === 0 ? "" : "bg-muted/20"}`}
                      >
                        <td className="px-4 py-3">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="text-xs">{entry.shift}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{entry.riders}</td>
                        <td className="px-4 py-3 text-right">{fmt(riderTotal)}</td>
                        <td className="px-4 py-3 text-right">
                          {entry.extras > 0 ? fmt(entry.extras) : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                          {entry.notes || "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt(dayTotal)}</td>
                        <td className="px-2 py-3">
                          <DeleteEntryButton id={entry.id} payPeriodId={periodId} clientId={id} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {period.entries.length > 0 && (
        <div className="flex justify-end">
          <Card className="w-full sm:w-64">
            <CardContent className="py-4 px-5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rider charges</span>
                <span>{fmt(period.entries.reduce((s, e) => s + e.riders * rate, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extras</span>
                <span>{fmt(period.entries.reduce((s, e) => s + e.extras, 0))}</span>
              </div>
              <div className="border-t pt-1.5 flex justify-between font-semibold">
                <span>Total Due</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
