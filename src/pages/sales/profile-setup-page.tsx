import SalesProfileSetupForm from "@/components/custom/sales/profile-setup/profile-setup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";

export default function SalesProfileSetupPage() {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-4">
      <a href="/" className="flex items-center gap-2">
        <Icon
          icon="qlementine-icons:wave-16"
          width="50"
          height="50"
          className="text-primary"
        />
        <span className="text-4xl hidden md:flex font-semibold tracking-tight font-primary">
          All Voice AI
        </span>
      </a>
      <Card className="bg-background w-[90%] md:w-[40%]">
        <CardHeader>
          <CardTitle className="text-3xl font-primary">Profile Setup</CardTitle>
          <CardDescription>
            Complete your profile setup to access the sales dashboard.
          </CardDescription>
          <CardContent className="px-0">
            <SalesProfileSetupForm />
            {/* <div className="bg-gradient-to-r from-primary/5 border to-secondary/5 p-4 rounded-2xl">
              <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Permissions Granted:{" "}
              </span>
              <ul className="list-disc leading-loose text-sm pl-4 text-muted-foreground">
                <li>Provision production Twilio numbers.</li>
                <li>Manage all customer onboarding.</li>
                <li>Access all demo and production customers.</li>
                <li>Tear down demo customers.</li>
                <li>Full system administration.</li>
              </ul>
            </div> */}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
