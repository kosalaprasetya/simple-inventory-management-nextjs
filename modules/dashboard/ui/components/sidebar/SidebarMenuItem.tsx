import Link from 'next/link';
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type MenuItem = {
  label: string;
  path: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const SidebarMenuItem = ({
  item,
  activePath,
  isCollapsed,
}: {
  item: MenuItem;
  activePath: string;
  isCollapsed: boolean;
}) => {
  const Icon = item.icon;
  const isActive = activePath === item.path;
  return (
    <Link
      href={item.path}
      className={`mb-2 p-2 flex items-center gap-2 w-full ${
        isActive
          ? "bg-gray-600 text-white font-medium"
          : "hover:bg-gray-500 font-normal"
      }
      ${isCollapsed ? "rounded-full" : "rounded-xl"}
      `}
    >
      <Icon width={16} height={16} />
      {!isCollapsed && <span className="text-white text-sm">{item.label}</span>}
    </Link>
  );
};

export default SidebarMenuItem;
