import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            12
          </CardTitle>
          <CardDescription>demo customers</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            4
          </CardTitle>
          <CardDescription>demos ready</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            10
          </CardTitle>
          <CardDescription>total demo pool</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
