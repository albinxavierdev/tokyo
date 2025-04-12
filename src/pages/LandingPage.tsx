
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
