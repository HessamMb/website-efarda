import HomePage from "@/components/home-page";
import { getNewsCards } from "@/data/published-news";

export default function Page() {
  const news = getNewsCards("fa");
  return <HomePage locale="fa" news={news} />;
}
