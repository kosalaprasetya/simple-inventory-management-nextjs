"use client";

import {
  ChevronLeft,
  ChevronRight,
  House,
  LayersPlus,
  Package,
  SquareUserRound,
  User,
} from "lucide-react";
import { useState } from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: House },
  { label: "Category", path: "/category", icon: LayersPlus },
  { label: "Items", path: "/items", icon: Package },
  { label: "Users", path: "/users", icon: SquareUserRound },
];

const SidebarAdmin = ({
  role,
  name,
  email,
}: {
  role?: string;
  name?: string;
  email?: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isActivePath, setIsActivePath] = useState("/dashboard");
  return (
    <aside
      className={`bg-slate-800 ${isCollapsed ? "w-16" : "w-64"} transition-width relative flex h-screen flex-col justify-between duration-300`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-12 right-0 translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-slate-500 p-2"
      >
        {isCollapsed ? (
          <ChevronLeft
            width={"16px"}
            height={"16px"}
            className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        ) : (
          <ChevronRight
            width={"16px"}
            height={"16px"}
            className={`transition-transform ${isCollapsed ? "" : "rotate-180"}`}
          />
        )}
      </button>
      <nav className="mt-16 flex-1 overflow-y-auto p-4">
        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isActivePath={isActivePath}
              setIsActivePath={setIsActivePath}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      <div
        id="profile"
        className={`mb-4 flex items-center p-4 ${isCollapsed ? "justify-center" : "justify-start"}`}
      >
        <div
          className={`w-8 rounded-full bg-gray-600 p-2 font-medium text-white`}
        >
          <Link href="/profile">
            <User width={16} height={16} className="" />
          </Link>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="ml-2 text-xs font-bold text-white uppercase">
              {name}
            </span>
            <span className="ml-2 text-xs text-white">{email}</span>
            <span className="ml-2 text-xs font-thin text-white italic">
              {role}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarAdmin;
