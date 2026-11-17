import Image from "next/image";
import Logo from "@/public/images/header/logo.png";
import { ArrowDown, ArrowLeft, Search } from "lucide-react";
const MainHeader = () => {
  return (
    <header className="px-[128px]">
      <section className="flex flex-row py-[9px]">
        <Image
          src={Logo}
          className="h-[53px] w-[200px]"
          alt="logo"
          loading="eager"
        />
        <div className="flex mr-auto h-[40px] justify-center items-center border-[--border-default] border rounded-sm py-[11px] px-[14px]">
          <input
            type="input"
            placeholder="جستجو در ارتباط فردا"
            className="mr-auto"
          />
          <Search size={20} className="text-brand-primary" />
        </div>
        <button className="mr-[12px] inline-flex h-[40px] items-center gap-2 whitespace-nowrap rounded-sm bg-brand-primary px-[22px] text-text-inverse">
          <span>محصولات ما</span>
          <ArrowLeft size={20} />
        </button>
      </section>
      {/* section 2 */}
      <section className="py-[9px]">
        <ul className="flex flex-row gap-[34px]">
          <li>خانه</li>
          <li className="flex items-center justify-center">
            محصولات
            <ArrowDown size={12} />
          </li>
          <li className="flex items-center justify-center">
            راهکارها
            <ArrowDown size={12} />
          </li>
          <li>همکاری با ما</li>
          <li>مجله فردا</li>
          <li>ارتباط با ما</li>
        </ul>
      </section>
    </header>
  );
};
export default MainHeader;
