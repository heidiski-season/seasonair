import Hero from "@/components/home/hero";
import MissionStrip from "@/components/home/mission-strip";
import Chamonix from "@/components/home/chamonix";
import HowItWorks from "@/components/home/how-it-works";
import FounderQuote from "@/components/home/founder-quote";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionStrip />
      <Chamonix />
      <HowItWorks />
      <FounderQuote />
    </>
  );
}