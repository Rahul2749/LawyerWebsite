import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import AboutPreview from "@/components/home/AboutPreview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PracticeAreasSection from "@/components/home/PracticeAreasSection";
import InsightsPreview from "@/components/home/InsightsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationCTA from "@/components/home/ConsultationCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <AboutPreview />
      <WhyChooseUs />
      <PracticeAreasSection />
      <InsightsPreview />
      <TestimonialsSection />
      <ConsultationCTA />
    </>
  );
}
