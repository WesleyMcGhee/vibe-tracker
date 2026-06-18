import { getSettings, saveSettings } from "@/app/actions/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure your business info that appears on invoices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Header</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveSettings} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                defaultValue={settings.businessName ?? ""}
                placeholder="My Ride Service"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessAddress">Address</Label>
              <Input
                id="businessAddress"
                name="businessAddress"
                defaultValue={settings.businessAddress ?? ""}
                placeholder="123 Main St, City, ST 00000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessPhone">Phone</Label>
              <Input
                id="businessPhone"
                name="businessPhone"
                defaultValue={settings.businessPhone ?? ""}
                placeholder="(555) 000-0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                name="businessEmail"
                type="email"
                defaultValue={settings.businessEmail ?? ""}
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/40">
        <CardContent className="py-4 px-5">
          <p className="text-xs text-muted-foreground">
            These details appear at the top of every PDF invoice you export.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
