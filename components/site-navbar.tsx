"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

function SiteNavbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/about" className="text-sm font-semibold">
          GreenRide
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div
                className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                title={user?.account ?? "User"}
              >
                {user?.account?.slice(0, 2).toUpperCase() ?? "DU"}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Signup</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export { SiteNavbar };
