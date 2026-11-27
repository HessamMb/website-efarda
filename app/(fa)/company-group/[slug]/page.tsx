import { CompanyProfile, companyMetadata, companyStaticParams, type CompanyRouteProps } from "@/components/company-profile";

export function generateStaticParams() {
  return companyStaticParams();
}

export function generateMetadata(props: CompanyRouteProps) {
  return companyMetadata(props, "fa");
}

export default function Page(props: CompanyRouteProps) {
  return <CompanyProfile {...props} locale="fa" />;
}
