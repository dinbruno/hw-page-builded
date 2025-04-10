import LanguageSwitcher from "@/hooks/useChangeLanguage";
import { ModeToggle } from "./mode-toggle";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import { AuthProvider } from "@/context/auth-context/auth-context";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur bg-white dark:bg-zinc-900">
        <div className="mx-4 sm:mx-8 flex h-14 items-center">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <SheetMenu />
          </div>
          <div className="flex flex-1 items-center justify-end">
            <LanguageSwitcher />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
    </header>
  );
}
