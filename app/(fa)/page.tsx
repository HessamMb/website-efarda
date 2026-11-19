import HomePage from "@/components/home-page";
import { getNewsCards } from "@/server/posts";

export default async function Page() {
  const news = await getNewsCards("fa");
  return <HomePage locale="fa" news={news} />;
}
