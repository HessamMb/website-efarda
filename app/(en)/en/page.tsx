import HomePage from "@/components/home-page";
import { getNewsCards } from "@/server/posts";

export default async function Page() {
  const news = await getNewsCards("en");
  return <HomePage locale="en" news={news} />;
}
