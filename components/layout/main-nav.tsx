"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Film, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth, getRedirectPath } from "@/lib/auth";
import { useState } from "react";
import { UserRole } from "@/types";

interface MainNavProps {
  role: UserRole;
}

export function MainNav({ role }: MainNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  let navItems = [];

  if (role === "admin") {
    navItems = [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/movies", label: "Movies" },
    ];
  } else if (role === "vendor") {
    navItems = [
      { href: "/vendor/dashboard", label: "Dashboard" },
      { href: "/vendor/company", label: "Company" },
      { href: "/vendor/schedule", label: "Schedules" },
    ];
  } else {
    navItems = [
      { href: "/movies", label: "Movies" },
      { href: "/bookings", label: "My Bookings" },
    ];
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="px-4 md:mx-32 flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link
            href={getRedirectPath(role)}
            className="flex items-center space-x-2"
          >
            <Film className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">CinemaSeats</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex">
            {user ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-base font-normal"
              >
                Logout
              </Button>
            ) : (
              <div className="space-x-5">
                <Link href="/login">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0 sm:max-w-xs">
              <div className="px-7">
                <Link
                  href={getRedirectPath(role)}
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Film className="h-6 w-6" />
                  <span className="font-bold">CinemaSeats</span>
                </Link>
                <nav className="mt-10 flex flex-col gap-6">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-base transition-colors hover:text-foreground/80",
                        pathname === item.href
                          ? "text-foreground font-medium"
                          : "text-foreground/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="justify-start px-0 text-base font-normal"
                  >
                    Sign Out
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
