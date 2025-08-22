import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DemoManagementTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Demo Management
        </CardTitle>
        <CardDescription>
          Monitor and manage demo customers (24-hour auto-expiry)
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
