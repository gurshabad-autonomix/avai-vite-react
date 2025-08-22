import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            27
          </CardTitle>
          <CardDescription>listed oganizations</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            4
          </CardTitle>
          <CardDescription>active demos</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            12
          </CardTitle>
          <CardDescription>total customer numbers</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
