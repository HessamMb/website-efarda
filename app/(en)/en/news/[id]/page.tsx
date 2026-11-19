import {
  NewsDetailRoute,
  newsMetadata,
  type NewsRouteProps,
} from "@/components/journal/news-detail-route";

export function generateMetadata(props: NewsRouteProps) {
  return newsMetadata(props, "en");
}

export default function Page({ params }: NewsRouteProps) {
  return <NewsDetailRoute params={params} locale="en" />;
}
