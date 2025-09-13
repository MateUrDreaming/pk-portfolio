import parinKasabia from "@/assets/parinkasabia.png";
import { ModeToggle } from "@/components/mode-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import { get } from "http";
import Image from "next/image";
import Link from "next/link";

export async function Navbar() {

  const session = await getServerSession(); 
  const user = session?.user;
  
  if (!user) return null;

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Image
            src={parinKasabia}
            alt="parinKasabia logo"
            width={32}
            height={32}
            className="border-muted rounded-full border"
          />
          portfolio
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserDropdown user={user}/>
        </div>
      </div>
    </header>
  );
}
