import WelcomeSection from "../components/WelcomeSection";
import ContentStats from "../components/ContentStats";
import PublicationActivity from "../components/PublicationActivity";
import NextSteps from "../components/NextSteps";
import OverviewFooter from "../components/OverviewFooter";

export default function OverviewPage({ admin }) {
  return (
    <>
      <WelcomeSection admin={admin} />
      <ContentStats />

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <PublicationActivity />
        <NextSteps />
      </section>

      <OverviewFooter />
    </>
  );
}
