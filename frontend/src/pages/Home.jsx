import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopularProducts from "../components/PopularProducts";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      
      <main className="flex-grow">
          <PopularProducts />
      </main>
      
      <Footer />
    </div>
  )
}