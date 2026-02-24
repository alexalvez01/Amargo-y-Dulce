import FavoritesList from '../components/FavoritesList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


    
const FavoritesPage = () => {
  return (
    <div>
        <Navbar />
        <div className="min-h-screen bg-[#EBEBEB] pt-10 pb-20 px-4">
            <h1 className="text-4xl md:text-5xl font-brand font-semibold text-[#6B4C3A] text-center mb-10 mt-10 tracking-wide">
            Favoritos
            </h1>
        <FavoritesList />
        </div>
        <Footer />
    </div>
  );
};

export default FavoritesPage;