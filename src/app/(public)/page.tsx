import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import AboutSection from "@/components/home/AboutSection";
import PracticeAreasSection from "@/components/home/PracticeAreasSection";
import PhotoGallerySection from "@/components/home/PhotoGallerySection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import InsightsPreview from "@/components/home/InsightsPreview";
import VideosPreview from "@/components/home/VideosPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationCTA from "@/components/home/ConsultationCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <AboutSection />
      <PracticeAreasSection />
      <PhotoGallerySection />
      <WhyChooseUs />
      <InsightsPreview />
      <VideosPreview />
      <TestimonialsSection />
      <ConsultationCTA />
    </>
  );
}
