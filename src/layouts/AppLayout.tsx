import {
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Menu } from "@/components/Menu/Menu";
import { useRouter } from "next/router";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  useEffect(() => {
    if (mobileOpened) {
      toggleMobile();
    }
  }, [router.pathname]);

  const excludeStartPathname = [
    "/login",
    "/pdf/quotation/[id]",
    "/pdf/boq/[id]",
    "/pdf/summary/[id]",
    "/pdf",
    "/auth/sign-in"
  ];

  if (excludeStartPathname.includes(router.pathname)) {
    return <>{children}</>;
  }

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      classNames={{
        main: 'bg-gray-100'
      }}
    >
      <AppShell.Navbar className="p-0 border-0">
        <Menu
          mobileOpened={mobileOpened}
          desktopOpened={desktopOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}