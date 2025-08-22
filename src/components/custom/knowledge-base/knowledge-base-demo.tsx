import { KnowledgeBaseManager } from ".";

export default function KnowledgeBaseDemo() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl md:text-4xl font-primary font-semibold tracking-wide">
            AVAI Knowledge Base Demo
          </h1>
          <span className="text-sm md:text-base text-muted-foreground">
            Create and manage demo customers for sales presentations
          </span>
        </div>
      </div>
      <KnowledgeBaseManager orgId="1" locationId="1" />
    </section>
  );
}
