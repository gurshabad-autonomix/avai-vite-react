import OwnerTabs from "@/components/custom/owner/console/owner-tabs";

export default function OwnerConsolePage() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl md:text-4xl font-primary font-semibold tracking-wide">
            AVAI My Account
          </h1>
          <span className="text-sm md:text-base text-muted-foreground">
            View your organization profile, phone numbers, and call history.
          </span>
        </div>
      </div>
      <OwnerTabs />
    </section>
  );
}
