import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
// import { SmoothCursor } from "@/components/ui/smooth-cursor";
import ImagesSliderSection from "@/components/images-slider-section";
import ProjectsSection from "@/components/projects-section";
import TestimonialsSection from "@/components/testimonials-section";
import ExperienceSection from "@/components/experience-section";
import AboutSection from "@/components/about-section";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div className="flex flex-col bg-myBackground relative">
      {/* <SmoothCursor /> */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,#dee2e6_1px,transparent_1px),linear-gradient(to_bottom,#dee2e6_1px,transparent_1px)] bg-[size:45px_44px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_50%,transparent_100%)]" />
      <Navbar />
      <HeroSection />
      <ImagesSliderSection />
      <ExperienceSection />
      <ProjectsSection />

      {/* ==========================================================================
         NEW: MONOSPACE PAPERS & ARTICLES SECTION
         ========================================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto w-full px-6 my-16 font-mono">

      </section>
      {/* ========================================================================== */}

      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;