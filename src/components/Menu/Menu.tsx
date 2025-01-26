import {
  IconLogout,
  IconLogin2,
  IconBriefcase,
  IconBox,
  IconUser,
  type IconProps,
  type Icon,
  IconTruck,
  IconBuilding,
  IconChevronRight,
} from "@tabler/icons-react";
import { Burger, Group } from "@mantine/core";
import { useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

type MenuProps = {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
};

type MenuList = {
  link?: string;
  label: string;
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  children?: MenuList[];
};

const menuList: MenuList[] = [
  { link: "/project", label: "โครงการ", icon: IconBriefcase },
  { link: "/client", label: "ลูกค้า", icon: IconUser },
  { link: "/supplier", label: "ซัพพลายเออร์", icon: IconTruck },
  { link: "/job", label: "งาน", icon: IconBriefcase },
  { link: "/material", label: "วัสดุ", icon: IconBox },
  { link: "/company", label: "บริษัท", icon: IconBuilding },
];

function Menu({ mobileOpened, desktopOpened, toggleMobile, toggleDesktop }: MenuProps) {
  const pathname = usePathname();
  const navigate = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isCurrentPath = (link: string) => {
    return pathname.startsWith(link) || pathname === link;
  };

  const MenuLink = ({ item }: { item: MenuList }) => {
    const isActive = isCurrentPath(item.link ?? "");
    const isHovered = hoveredItem === item.link;
    const IconComponent = item.icon;

    return (
      <div
        className={`group relative flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ease-in-out cursor-pointer
          ${isActive ? 'bg-blue-950 text-white' : 'hover:bg-slate-950'}
        `}
        onClick={(e) => {
          e.preventDefault();
          if (item.link) {
            navigate.push(item.link);
          }
        }}
        onMouseEnter={() => setHoveredItem(item.link ?? null)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {IconComponent && (
          <div className={`mr-3 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}>
            <IconComponent
              size={20}
              stroke={1.5}
              className={isActive ? 'text-white' : 'text-gray-400'}
            />
          </div>
        )}

        <span className={`flex-grow font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {item.label}
        </span>

        {item.children && (
          <IconChevronRight
            size={18}
            className={`ml-2 transition-transform duration-200 ${isActive ? 'rotate-90' : ''} 
              ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        )}

        <div className={`absolute left-0 w-1 h-full rounded-r-full bg-blue-500 transition-all duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    );
  };

  const UserSection = () => {
    if (sessionStatus !== "authenticated") {
      return (
        <Link href="/auth/sign-in" className="block mt-8">
          <button className="w-full px-4 py-2 text-sm font-medium text-gray-300 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors duration-200 flex items-center justify-center group">
            <IconLogin2
              stroke={1.5}
              size={18}
              className="mr-2 group-hover:scale-110 transition-transform duration-200"
            />
            เข้าสู่ระบบ
          </button>
        </Link>
      );
    }

    return (
      <div className="mt-8 space-y-4">
        <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
          <p className="text-sm text-gray-300 truncate">
            {session.user.email}
          </p>
        </div>

        <button
          onClick={() => void signOut()}
          className="w-full px-4 py-2 text-sm font-medium text-red-400 bg-slate-950 border border-red-950 rounded-lg hover:bg-red-950 hover:text-red-200 transition-colors duration-200 flex items-center group"
        >
          <IconLogout
            stroke={1.5}
            size={18}
            className="mr-2 group-hover:scale-110 transition-transform duration-200"
          />
          ออกจากระบบ
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="h-[60px] border-b border-slate-800 px-4 flex items-center">
        <Group>

          <Link href="/" className="flex items-center">
            <div className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              BuildWise
            </div>
          </Link>
        </Group>
      </div>

      <div className="flex-1 p-4">
        {sessionStatus === "authenticated" && (
          <div className="space-y-1 mb-8">
            {menuList.map((item) => (
              <MenuLink key={item.link} item={item} />
            ))}
          </div>
        )}

        <UserSection />
      </div>
    </div>
  );
}

export { Menu };