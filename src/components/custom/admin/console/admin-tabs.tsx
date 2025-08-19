import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/overview-tab";
import CustomersTab from "./tabs/customers-tab";
import OnboardingTab from "./tabs/onboarding-tab";
import DemoManagementTab from "./tabs/demo-tab";

export default function AdminTabs() {
  return (
    <Tabs defaultValue="overview" className="w-[90%] md:w-[70%] ">
      <TabsList className="bg-background w-full h-[3rem] my-4 border p-0">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="customerOnboarding">Onboarding</TabsTrigger>
        <TabsTrigger value="demoManagement">Demo Management</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="customers">
        <CustomersTab />
      </TabsContent>
      <TabsContent value="customerOnboarding">
        <OnboardingTab />
      </TabsContent>
      <TabsContent value="demoManagement">
        <DemoManagementTab />
      </TabsContent>
    </Tabs>
  );
}
