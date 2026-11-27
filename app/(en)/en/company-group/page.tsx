import CompanyGroupPage, { companyGroupTitles } from "@/components/company-group-page";

export const metadata = { title: companyGroupTitles.en };

export default function Page() {
  return <CompanyGroupPage locale="en" />;
}
