// THIS IS A TEMPORARY FILE

export default function DevPage() {
  return (
    <div className="flex flex-col items-center mt-20 gap-8">
      <span className="text-4xl font-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Working Routes
      </span>
      <ul className="list-disc leading-loose pl-5 text-lg text-muted-foreground">
        <li>
          Admin Console:{" "}
          <a
            href="/admin/console"
            className="underline underline-offset-4 hover:underline-offset-8 transition-all text-primary"
          >
            <code>/admin/console</code>
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
      </ul>
    </div>
  );
}
