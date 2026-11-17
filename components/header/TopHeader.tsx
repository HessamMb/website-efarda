const TopHeader = () => {
  return (
    <header className="flex h-[36px] bg-surface-mint text-text-secondary px-[128px]">
      <ul className="flex flex-row gap-[30px] py-[8px]">
        <li>ارتباط فردا</li>
        <li>فرصت‌های شغلی</li>
        <li>تماس با ما</li>
      </ul>
      <ul className="gap-[18px] flex mr-auto py-[8px]">
        <li>دسترسی آسان</li>
        <span>{"|"}</span>
        <li>En</li>
      </ul>
    </header>
  );
};
export default TopHeader;
