import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateDemoForm from "./create-demo-form";

export default function CreateDemoTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create a new Demo
        </CardTitle>
        <CardDescription>
          Create a demo customer with Twilio phone provisioning.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <CreateDemoForm />
      </CardContent>
    </Card>
  );
}
