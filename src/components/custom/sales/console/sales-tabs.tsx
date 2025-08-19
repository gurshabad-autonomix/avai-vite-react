import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OverviewTab from "./tabs/overview-tab";
import DemoManagementTab from "./tabs/demo-tab";
import CreateDemoTab from "./tabs/create-demo-tab";

export default function SalesTabs() {
  return (
    <Tabs defaultValue="overview" className="w-[90%] md:w-[70%] ">
      <TabsList className="bg-background w-full h-[3rem] my-4 border p-0">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="demoManagement">Demo Customers</TabsTrigger>
        <TabsTrigger value="newDemo">New Demo</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="demoManagement">
        <DemoManagementTab />
      </TabsContent>
      <TabsContent value="newDemo">
        <CreateDemoTab />
      </TabsContent>
    </Tabs>
  );
}
