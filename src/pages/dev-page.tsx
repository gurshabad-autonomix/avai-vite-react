// THIS IS A TEMPORARY FILE

export default function DevPage() {
  return (
    <div className="flex flex-col items-center mt-20 gap-8">
      <span className="text-4xl font-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Working Routes
      </span>
      <ul className="list-disc leading-loose pl-5 text-lg text-muted-foreground">
        <li>
          Welcome:{" "}
          <a
            href="/welcome"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/welcome</code>
          </a>
        </li>
        <li>
          Admin Console:{" "}
          <a
            href="/admin/console"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/admin/console</code>
          </a>
        </li>
        {/* org owner */}
        <li>
          Owner Console:{" "}
          <a
            href="/owner/console"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/owner/console</code>
          </a>
        </li>
        <li>
          Admin Profile Setup:{" "}
          <a
            href="/admin/profile-setup"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/admin/profile-setup</code>
          </a>
        </li>
        <li>
          Auth Portal:{" "}
          <a
            href="/"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/auth</code>
          </a>
        </li>
        <li>
          Sales Console:{" "}
          <a
            href="/sales/console"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/sales/console</code>
          </a>
        </li>
        <li>
          Sales Profile Setup:{" "}
          <a
            href="/sales/profile-setup"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/sales/profile-setup</code>
          </a>
        </li>
        <li>
          Knowledge Base Demo:{" "}
          <a
            href="/knowledge-base"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/knowledge-base</code>
          </a>
        </li>
      </ul>
    </div>
  );
}
