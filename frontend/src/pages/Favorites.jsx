import FavoritesList from '../components/FavoritesList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



const FavoritesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow bg-gradient-to-b from-[#f7f2ec] to-[#fcf8f5] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-10 mt-6 md:mt-10">
            <div className="flex items-center gap-3 md:gap-4">
              <h2 className="text-4xl md:text-5xl font-brand font-bold text-[#4a3024] text-center tracking-wide">
                Mis Favoritos
              </h2>
            </div>
            <div className="h-1 w-24 bg-[#d38b5d] mt-6 rounded-full opacity-80"></div>
            <p className="text-gray-600 font-brand mt-4 text-center max-w-md">
              Tus selecciones más dulces, guardadas en un solo lugar listas para vos.
            </p>
          </div>

          <FavoritesList />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;