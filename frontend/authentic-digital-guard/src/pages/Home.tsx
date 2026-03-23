import PageTransition from '@/components/PageTransition';
import HeroSection from '@/components/HeroSection';
import ScrollStory from '@/components/ScrollStory';
import FeaturesSection from '@/components/FeaturesSection';
import TechSection from '@/components/TechSection';
import PipelineSection from '@/components/PipelineSection';
import Footer from '@/components/Footer';

const Home = () => (
  <PageTransition>
    <HeroSection />
    <ScrollStory />
    <FeaturesSection />
    <TechSection />
    <PipelineSection />
    <div className="section-padding text-center">
      <h2 className="font-display text-3xl font-bold gradient-text mb-6">Ready to Protect Digital Trust?</h2>
      <a href="/image-detection" className="glow-button inline-block">Get Started</a>
    </div>
    <Footer />
  </PageTransition>
);

export default Home;
