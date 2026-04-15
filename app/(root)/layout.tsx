import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import UserProfileDropdown from "@/components/UserProfileDropdown";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();
  const userInterviews = await getInterviewsByUserId(user?.id || "");

  const interviews = (userInterviews || []).map((i) => ({
    id: i.id,
    role: i.role,
    type: i.type,
    createdAt: i.createdAt,
  }));

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">IntPrep Ai</h2>
        </Link>

        <UserProfileDropdown user={user} interviews={interviews} />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
