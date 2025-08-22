import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OnboardingForm from "./onboarding-form";

export default function OnboardingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Customer Onboarding
        </CardTitle>
        <CardDescription>
          Create new production customers with full Twilio integration and phone
          number provisioning.
        </CardDescription>
        <CardContent className="p-4">
          <OnboardingForm />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
