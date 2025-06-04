import Image from "next/image";
import UserIcon from "./navbar-user";
import { getCurrentUser } from "@/lib/auth";

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
          className="object-contain"
        />
      </div>

      {/* Profile Avatar and Dropdown */}
      {user && <UserIcon user={user} />}
    </nav>
  );
};

export default Navbar;
