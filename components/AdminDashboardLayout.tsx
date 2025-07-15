"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Inbox,
  Menu,
  NotebookPen,
  Wallet,

  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    path: "/admin/members",
    icon: NotebookPen,
  },
  {
    title: "Quick Loans",
    path: "/admin/quick-loans",
    icon: Inbox,
  },
  {
    title: "Core Loans",
    path: "/admin/core-loans",
    icon: Wallet,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => setIsMobileOpen(false), [pathname]);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const role =
    typeof user?.publicMetadata?.role === "string"
      ? user.publicMetadata.role
      : "Admin";

  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* Mobile Header */}
      <header
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-shadow",
          isScrolled ? "shadow-sm" : ""
        )}>
        <div className='flex items-center justify-between h-16 px-4'>
          <div className='flex items-center gap-3'>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className='rounded-lg p-2 text-slate-600 hover:bg-slate-100'
                  aria-label='Open menu'>
                  <Menu className='h-6 w-6' />
                </button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-[280px] p-0 max-h-screen overflow-y-auto'>
                <div className='flex flex-col h-full'>
                  {/* Mobile Navigation Content */}
                  <div className='flex h-16 items-center gap-3 border-b border-slate-100 px-4'>
                    <Image
                      src='/logo.webp'
                      alt='NFVCB COOP Logo'
                      width={36}
                      height={36}
                      className='rounded-md'
                    />
                    <span className='font-semibold text-slate-800 text-lg'>
                      NFVCB COOP
                    </span>
                  </div>

                  <nav className='flex-1 space-y-1 p-4'>
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                            isActive
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          )}
                          onClick={() => setIsMobileOpen(false)}>
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive ? "text-white" : "text-slate-400"
                            )}
                          />
                          <span className='truncate'>{item.title}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile User Profile */}
                  <div className='border-t border-slate-100 p-4'>
                    {isSignedIn ? (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <UserButton
                            afterSignOutUrl='/'
                            appearance={{
                              elements: {
                                userButtonPopoverCard: "shadow-xl rounded-lg",
                              },
                            }}
                          />
                          <div className='truncate'>
                            <p className='text-sm font-medium truncate capitalize'>
                              {user?.firstName || user?.username || "Admin"}
                            </p>
                            <p className='text-xs text-slate-500 truncate capitalize'>
                              {role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <div className='bg-slate-200 border-2 border-dashed rounded-full w-8 h-8 animate-pulse' />
                        <p className='text-xs italic'>Loading profile...</p>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Image
              src='/logo.webp'
              alt='NFVCB COOP Logo'
              width={32}
              height={32}
              className='rounded-md'
            />
            <span className='font-semibold text-slate-800 text-lg'>
              Dashboard
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:block text-sm text-slate-500 truncate max-w-[120px]'>
              {user?.firstName || "Admin"}
            </div>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-xl rounded-lg mt-2",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar - Collapsed on sm, Expanded on md+ */}
      <aside className='hidden sm:flex flex-col bg-white shadow-lg fixed h-full z-30 transition-all duration-300 w-16 md:w-64'>
        {/* Logo Area */}
        <div className='flex h-16 items-center gap-3 border-b border-slate-100 px-4 overflow-hidden'>
          <Image
            src='/logo.webp'
            alt='NFVCB COOP Logo'
            width={36}
            height={36}
            className='rounded-md min-w-[36px]'
          />
          <span
            className={cn(
              "font-semibold text-slate-800 text-lg whitespace-nowrap transition-opacity",
              "md:opacity-100 opacity-0 duration-300"
            )}>
            NFVCB COOP
          </span>
        </div>

        {/* Navigation Items */}
        <nav className='flex-1 space-y-1 p-2 md:p-4'>
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg p-3 md:px-3 md:py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}>
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                />
                <span
                  className={cn(
                    "truncate transition-opacity duration-300",
                    "md:opacity-100 opacity-0"
                  )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className='border-t border-slate-100 p-4'>
          {isSignedIn ? (
            <div className='flex items-center gap-3 overflow-hidden'>
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    userButtonPopoverCard: "shadow-xl rounded-lg",
                  },
                }}
              />
              <div
                className={cn(
                  "truncate transition-opacity duration-300",
                  "md:opacity-100 opacity-0"
                )}>
                <p className='text-sm font-medium truncate capitalize'>
                  {user?.firstName || user?.username || "Admin"}
                </p>
                <p className='text-xs text-slate-500 truncate capitalize'>
                  {role}
                </p>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <div className='bg-slate-200 border-2 border-dashed rounded-full w-8 h-8 animate-pulse' />
              <div
                className={cn(
                  "transition-opacity duration-300",
                  "md:opacity-100 opacity-0"
                )}>
                <p className='text-xs italic'>Verifying identity...</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 pt-16 sm:pt-0 sm:pl-16 md:pl-64 min-h-screen transition-all'>
        <div className='p-4 sm:p-6'>
          <div className='rounded-xl bg-white p-4 shadow-sm sm:p-6'>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
