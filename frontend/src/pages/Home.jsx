import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopularProducts from "../components/PopularProducts";
import Hero from "../components/Hero";
import ServiceSection from "../components/ServiceSection";
import AboutSection from "../components/AboutSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      <Hero />
      <main className="grow">
          <AboutSection />
          <ServiceSection />
          <PopularProducts />
      </main>
      
      <Footer />
    </div>
  )
}