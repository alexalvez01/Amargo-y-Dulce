import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink,useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Heart,
  Settings2,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // Función para cerrar sesión correctamente 
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsMenuOpen(false);
  }

  // Efecto para cerrar los menús al hacer clic fuera de ellos
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      setIsCartAnimating(true);
      // Apagamos la animación a los 400ms para que pueda volver a saltar si agregan otro
      setTimeout(() => setIsCartAnimating(false), 400); 
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const navLinkStyles = ({ isActive }) =>
    `transition-colors hover:text-brand-brownDark ${
      isActive ? "text-brand-brownDark font-semibold" : ""
    }`;

  const menuLinkStyles = "px-6 py-3 hover:bg-brand-brown hover:text-white transition-colors"
  const userMenuLinkStyles = "flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-brown hover:text-white transition-colors";

  return (
    <nav className="fixed flex flex-row w-full z-70 items-center justify-between bg-brand-beige px-3 text-brand-brown lg:px-28">

      {/* --- LOGO Y BOTÓN PARA MOBILE --- */}
      <div className="flex items-center">
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <img
          src="/images/logo.webp"
          alt="Amargo y dulce"
          className="hidden lg:block max-w-28 cursor-pointer"
          onClick={() => {navigate("/")}}
        />
      </div>
      <div className="flex justify-center lg:justify-center">
        <img
          src="/images/logo.webp"
          alt="Amargo y dulce"
          className="max-w-24 lg:hidden cursor-pointer"
          onClick={() => {navigate("/")}}
        />

        {/* --- MENÚ PRINCIPAL PARA DESKTOP --- */}
        <div className="hidden lg:flex gap-2.5 font-brand text-sm">
          <NavLink to="/" className={navLinkStyles}>
            Nosotros
          </NavLink>
          <button
            className={navLinkStyles({ isActive: false }) + " bg-transparent border-none outline-none cursor-pointer"}
            id="contact"
            onClick={() => {
              const footer = document.getElementById("footer");
              if (footer) {
                footer.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#footer";
              }
            }}
          >
            Contacto
          </button>
          <NavLink to="/shop" className={navLinkStyles}>
            Tienda
          </NavLink>
          <NavLink to="/promotions" className={navLinkStyles}>
            Promociones
          </NavLink>
        </div>
      </div>
      {/* --- MENÚ PRINCIPAL PARA MOBILE (se muestra al hacer clic en el botón) --- */}
        <div
          className={`
          lg:hidden absolute top-full left-0 w-full bg-brand-beige 
          border-t border-brand-brown/20 
          transform transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          ref={menuRef}
        >
          <div className="flex flex-col py-4">
            <NavLink
              to="/"
              className={menuLinkStyles}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </NavLink>

            <button
              className={menuLinkStyles + " bg-transparent border-none outline-none text-left w-full"}
              style={{ background: "none" }}
              onClick={() => {
                setIsMenuOpen(false);
                const footer = document.getElementById("footer");
                if (footer) {
                  footer.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#footer";
                }
              }}
            >
              Contacto
            </button>

            <NavLink
              to="/shop"
              className={menuLinkStyles}
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </NavLink>

            <NavLink
              to="/promotions"
              className={menuLinkStyles}
              onClick={() => setIsMenuOpen(false)}
            >
              Promociones
            </NavLink>
          </div>
        </div>
      
      
      {/* --- ICONO Y NOMBRE DE USUARIO O INICIAR SESIÓN--- */}
      <div className="flex items-center gap-6">
        <div
          className="relative flex items-end  gap-2 cursor-pointer font-brand text-sm "
          ref={userMenuRef}
        >
          <User size={20} />

          {user ? (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 cursor-pointer font-brand text-sm hover:text-brand-brownDark transition-colors"
            >
              <span>
                {user.rol === "admin" ? `${user.nombre} (Admin)` : user.nombre}
              </span>
            </div>
          ) : (
            <NavLink to="/login" className="mr-6 lg:mr-0">
              Iniciar Sesión
            </NavLink>
          )}


            {/* --- MENÚ DE USUARIO (se muestra al hacer clic en el nombre) --- */}
            <div className={`absolute top-8  right-0 w-44 z-10 bg-brand-beige shadow-lg  py-2 border border-brand-brown/20 lg:left-0 lg:w-56
            transform transition-all duration-300 ease-in-out
            ${isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"}
            `}>
              <div className={user && user.rol === "admin" ? "" : "lg:hidden"}>
                {user && user.rol === "admin" ? (
                  <NavLink
                    to="/administrator"
                    className={`${userMenuLinkStyles} lg:hidden`}
                  >
                    <Settings2 size={18} />
                    Panel
                  </NavLink>
                ) : null} 

                <NavLink
                  to="/cart"
                  className={userMenuLinkStyles}
                >
                  <ShoppingCart size={18} className={`transition-all duration-300 ${isCartAnimating ? 'animate-cart-bump text-[#4CAF50]' : ''}`} />
                  Carrito
                </NavLink>

                <NavLink
                  to="/favorites"
                  className={userMenuLinkStyles}
                >
                  <Heart size={18} />
                  Favoritos
                </NavLink>
              </div>

              <NavLink
                to="/history"
                className={userMenuLinkStyles}
              >
                <ShoppingBag size={18} />
                Historial de compras
              </NavLink>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className={`${userMenuLinkStyles} w-full `}
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          
        </div>
        {/* --- ICONOS DE CARRITO Y FAVORITOS (solo para usuarios normales en desktop) --- */}
        {user ? (
          <>
            <NavLink
              to="/cart"
              className={user.rol === "admin" ? "hidden" : "hidden lg:block"}
            >
            <div className="relative inline-flex items-center">
              <ShoppingCart size={20} className= {`mt-2 transition-all duration-500 ${isCartAnimating ? 'animate-cart-bump text-[#4CAF50]' : "transition-colors text-brand-brown hover:text-brand-brownDark"}`} />
              {isCartAnimating && (
                <span className="animate-fade-up top-10 -right-3 text-sm font-black text-[#4CAF50] pointer-events-none">
                  +1
                </span>
              )}
            </div>
            </NavLink>

            <NavLink
              to="/favorites"
              className={user.rol === "admin" ? "hidden" : "hidden lg:block"}
            >
              <Heart size={20} />
            </NavLink>
          </>
        ) : null}

        
        {/* --- BOTÓN DE PANEL DE ADMINISTRACIÓN (solo para admins) --- */}
        {user && user.rol === "admin" ? (
          <NavLink
            to="/admin-panel"
            className="lg:flex hidden  items-center gap-2 border border-brand-brown px-3 py-1.5 rounded-lg text-sm font-brand hover:bg-brand-brown hover:text-white transition-colors"
          >
            <Settings2 size={18} />
            Panel
          </NavLink>
        ) : null}
      </div>
    </nav>
  );
}
