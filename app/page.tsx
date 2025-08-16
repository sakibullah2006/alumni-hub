import Image from "next/image";
import HeroSection from "../components/Home/HeroSection";
import MarqueeSection from "../components/Home/Marquee";

export default function Home() {
  return (
    <>
      <div className="contianer w-full relative">
        <HeroSection />
      </div>
      <MarqueeSection />
    </>
  );
}
