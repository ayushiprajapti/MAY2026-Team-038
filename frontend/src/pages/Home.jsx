import Hero from "../components/home/Hero";
import AboutMission from "../components/home/AboutMission";
import ThreePillars from "../components/home/ThreePillars";
import GetInvolved from "../components/home/GetInvolved";
import Education from "../components/home/Education";
import WarsaaTeaser from "../components/home/WarsaaTeaser";

export default function Home() {
  return (
    <main className="flex-grow bg-[#F9EBD4]">
      {/* Hero Banner */}
      <Hero />

      {/* About & Mission Statement */}
      <AboutMission />

      {/* The Three Pillars Focus Areas */}
      <ThreePillars />

      {/* Interactive Engagement & Activities */}
      <GetInvolved />

      {/* Education / Clubs & Quizzes */}
      <Education />

      {/* Warsaa Heritage Shop Feature */}
      <WarsaaTeaser />
    </main>
  );
}
