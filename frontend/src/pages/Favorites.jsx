import FavoritesList from '../components/FavoritesList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


    
const FavoritesPage = () => {
  return (
    <div>
        <Navbar />
        <div className="min-h-screen bg-[#f7f2ec] pt-10 pb-20 px-4">
            <h2 className="text-4xl md:text-5xl font-brand font-semibold text-brand-brownDark text-center mb-10 mt-10 tracking-wide">
            Favoritos
            </h2>
        <FavoritesList />
        </div>
        <Footer />
    </div>
  );
};

export default FavoritesPage;