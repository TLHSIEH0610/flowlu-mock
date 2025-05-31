import Image from "next/image";

const Navbar = async () => {
  return (
    <nav className="bg-[#26263E] border-b border-gray-200 px-6 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image
          src="/images/flowlu_logo.svg"
          alt="FlowLu Logo"
          width={102}
          height={22}
          className="object-contain"
        />
      </div>
    </nav>
  );
};

export default Navbar;
