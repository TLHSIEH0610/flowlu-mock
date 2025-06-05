import Image from "next/image";
import UserIcon from "./navbar-user";
import { getCurrentUser } from "@/lib/auth";
import { logoutUser } from "@/actions/auth.actions";
import Calender from "@/components/navbar-calender";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className="bg-[#26263E] border-b border-gray-200 px-6 py-2 flex justify-between items-center relative">
      <div className="flex items-center gap-2">
        <Image
          src="/images/flowlu_logo.svg"
          alt="FlowLu Logo"
          width={102}
          height={22}
          priority
          className="object-contain"
        />
      </div>
      <div className="flex justify-center items-center gap-2">
        <Calender />
        {user && <UserIcon user={user} logout={logoutUser} />}
      </div>
      {/* Profile Avatar and Dropdown */}
    </nav>
  );
};

export default Navbar;
