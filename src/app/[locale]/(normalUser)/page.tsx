import { getTranslations } from "next-intl/server";

import HeroSection from "@/components/Home/HeroSection";
import NewsletterSignUp from "@/components/Home/NewsLetterSignUp";
import PopularBadmintonPlaces from "@/components/Home/PopularBadmintonPlaces";
import TopArticles from "@/components/Home/TopArticles";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "Index",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function Index() {
  return (
    <div>
      <HeroSection />
      <PopularBadmintonPlaces />
      <TopArticles />
      <NewsletterSignUp />
    </div>
  );
}
