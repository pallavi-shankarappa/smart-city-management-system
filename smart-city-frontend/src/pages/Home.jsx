import HeroSection from "../components/HeroSection";
import ServiceCards from "../components/ServiceCards";
import AnimatedStats from "../components/AnimatedStats";
import ImageGallery from "../components/ImageGallery";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <HeroSection />
      <AnimatedStats />
      <ServiceCards />
      <ImageGallery />
    </div>
  );
}

export default Home;

