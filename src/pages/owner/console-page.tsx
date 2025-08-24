import OrgOwnerReports from "@/pages/owner/reports-page.tsx";

export default function OwnerConsolePage() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl md:text-4xl font-primary font-semibold tracking-wide">
            AVAI Owner Console
          </h1>
          <span className="text-sm md:text-base text-muted-foreground">
            Reports and insights for your organization
          </span>
        </div>
      </div>
      <OrgOwnerReports />
    </section>
  );
}
