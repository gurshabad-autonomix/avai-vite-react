import AdminTabs from "@/components/custom/admin/console/admin-tabs";

export default function ConsolePage() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl md:text-4xl font-primary font-semibold tracking-wide">
            AVAI Admin Console
          </h1>
          <span className="text-sm md:text-base text-muted-foreground">
            Full system administration & customer management
          </span>
        </div>
      </div>
      <AdminTabs />
    </section>
  );
}
