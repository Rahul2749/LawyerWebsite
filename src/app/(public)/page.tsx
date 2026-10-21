import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import PracticeAreasSection from "@/components/home/PracticeAreasSection";
import ServicesSection from "@/components/home/ServicesSection";
import PhotoGallerySection from "@/components/home/PhotoGallerySection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
// Hidden per request (code kept for future restoration)
// import InsightsPreview from "@/components/home/InsightsPreview";
// import VideosPreview from "@/components/home/VideosPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import { pageMetadata } from "@/lib/seo";

const homeTitle = "Nyaysaathi | Legal Services & Online Lawyer Consultation";
const homeMetadata = pageMetadata(
  "Legal Services & Online Lawyer Consultation",
  "Nyaysaathi (Nyaysathi) offers legal consultancy across India. Consult our advocates for property, criminal, family, civil and business matters.",
  "/",
);

export const metadata = {
  ...homeMetadata,
  title: { absolute: homeTitle },
  openGraph: { ...homeMetadata.openGraph, title: homeTitle },
  twitter: { ...homeMetadata.twitter, title: homeTitle },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PracticeAreasSection />
      <PhotoGallerySection />
      <WhyChooseUs />
      {/* Hidden per request (code kept for future restoration) */}
      {/* <InsightsPreview /> */}
      {/* <VideosPreview /> */}
      <TestimonialsSection />
      <ConsultationCTA />
    </>
  );
}

