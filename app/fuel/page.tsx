import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFuelDialog } from "@/components/add-fuel-dialog";
import { DeleteFuelButton } from "@/components/delete-fuel-button";

function fmt(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default async function FuelPage() {
  const entries = await prisma.fuelEntry.findMany({
    orderBy: { date: "desc" },
  });

  const totalGallons = entries.reduce((sum, e) => sum + e.gallons, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Fuel Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <AddFuelDialog />
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-xs text-muted-foreground">Total Gallons</p>
              <p className="text-xl font-semibold mt-1">{totalGallons.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-xl font-semibold mt-1">{fmt(totalCost)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No fuel entries yet. Add your first entry above.
            </div>
          ) : (
            <>
              <div className="sm:hidden divide-y">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.gallons.toFixed(2)} gal · {fmt(entry.cost / entry.gallons)}/gal
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground truncate">{entry.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-sm">{fmt(entry.cost)}</span>
                      <DeleteFuelButton id={entry.id} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Gallons</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">$/Gallon</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Cost</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Notes</th>
                      <th className="px-2 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className={`border-b last:border-0 ${idx % 2 === 0 ? "" : "bg-muted/20"}`}
                      >
                        <td className="px-4 py-3">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">{entry.gallons.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{fmt(entry.cost / entry.gallons)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt(entry.cost)}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[240px] truncate">
                          {entry.notes || "—"}
                        </td>
                        <td className="px-2 py-3">
                          <DeleteFuelButton id={entry.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
