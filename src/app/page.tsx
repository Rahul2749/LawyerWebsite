import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import PracticeAreasSection from "@/components/home/PracticeAreasSection";
import InsightsPreview from "@/components/home/InsightsPreview";
import VideosPreview from "@/components/home/VideosPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationCTA from "@/components/home/ConsultationCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <PracticeAreasSection />
      <InsightsPreview />
      <VideosPreview />
      <TestimonialsSection />
      <ConsultationCTA />
    </>
  );
}
