import CompanyGroupPage, { companyGroupTitles } from "@/components/company-group-page";

export const metadata = { title: companyGroupTitles.fa };

export default function Page() {
  return <CompanyGroupPage locale="fa" />;
}
