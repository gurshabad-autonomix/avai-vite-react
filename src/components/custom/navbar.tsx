import { useCognitoAuth } from "@/hooks/useCognitoAuth";
import { Icon } from "@iconify-icon/react";
import { Button } from "../ui/button";

export default function Navbar() {
  const { signOut } = useCognitoAuth();
  return (
    <div className="fixed w-full h-16 z-10 flex items-center justify-center">
      <div className="border rounded-full bg-white/5 backdrop-blur-lg border-white/10 flex items-center w-[90%] md:w-[70%] mt-10 h-full justify-between p-2 px-8">
        <a href="/" className="flex items-center gap-2">
          <Icon
            icon="qlementine-icons:wave-16"
            width="32"
            height="32"
            className="text-primary"
          />
          <span className="text-2xl hidden md:flex font-semibold tracking-tight font-primary">
            All Voice AI
          </span>
        </a>
        <div className="flex items-center gap-8">
          <a
            className="text-white hover:bg-gradient-to-r from-primary to-secondary bg-clip-text hover:text-transparent"
            href="#"
          >
            Dashboard
          </a>
          <a
            className="text-white hover:bg-gradient-to-r from-primary to-secondary bg-clip-text hover:text-transparent"
            href="#"
          >
            Settings
          </a>
          <Button variant="link" onClick={() => signOut()} className="px-0">Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
