import Link from 'next/link';
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const SidebarMenuItem = ({
  item,
  isActivePath,
  setIsActivePath,
  isCollapsed,
}: {
  item: {
    label: string;
    path: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  };
  isActivePath: string;
  isCollapsed: boolean;
  setIsActivePath: (path: string) => void;
}) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      className={`mb-2 p-2 flex items-center gap-2 w-full ${
        isActivePath === item.path
          ? "bg-gray-600 text-white font-medium"
          : "hover:bg-gray-500 font-normal"
      }
      ${isCollapsed ? "rounded-full" : "rounded-xl"}
      `}
      onClick={() => setIsActivePath(item.path)}
    >
      <Icon width={16} height={16} />
      {!isCollapsed && <span className="text-white text-sm">{item.label}</span>}
    </Link>
  );
};

export default SidebarMenuItem;
