"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

function isClassroomPath(pathname: string) {
  return /\/classroom(\/|$)/.test(pathname);
}

function ClassroomSidebarSync() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const isClassroom = isClassroomPath(pathname);

  useEffect(() => {
    if (isClassroom) {
      setOpen(false);
    }
  }, [isClassroom, setOpen]);

  return null;
}

export function DashboardSidebarProvider({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const pathname = usePathname();
  const isClassroom = isClassroomPath(pathname);

  return (
    <SidebarProvider defaultOpen={!isClassroom} style={style}>
      <ClassroomSidebarSync />
      {children}
    </SidebarProvider>
  );
}
