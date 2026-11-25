import HomePage from "@/components/home-page";
import { getNewsCards } from "@/data/published-news";

export default function Page() {
  const news = getNewsCards("en");
  return <HomePage locale="en" news={news} />;
}
