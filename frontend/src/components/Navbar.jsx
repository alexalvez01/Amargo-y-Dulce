import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
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
  const { user, isAuthenticated, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const menuRef = useRef(null);

  // Función para cerrar sesión correctamente 
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsMenuOpen(false);
  }

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

  const navLinkStyles = ({ isActive }) =>
    `transition-colors hover:text-brand-brownDark ${
      isActive ? "text-brand-brownDark font-semibold" : ""
    }`;

  const menuLinkStyles = "px-6 py-3 hover:bg-brand-brown hover:text-white transition-colors"
  const userMenuLinkStyles = "flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-brown hover:text-white transition-colors";

  return (
    <nav className="fixed flex flex-row w-full z-70 items-center justify-between bg-brand-beige px-3 text-brand-brown lg:px-28">
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
          className="hidden lg:block max-w-28"
        />
      </div>
      <div className="flex justify-center lg:justify-center">
        <img
          src="/images/logo.webp"
          alt="Amargo y dulce"
          className="max-w-24 lg:hidden"
        />

        <div className="hidden lg:flex gap-2.5 font-brand text-sm">
          <NavLink to="/" className={navLinkStyles}>
            Nosotros
          </NavLink>
          <NavLink to="/contact" className={navLinkStyles}>
            Contacto
          </NavLink>
          <NavLink to="/shop" className={navLinkStyles}>
            Tienda
          </NavLink>
          <NavLink to="/promotions" className={navLinkStyles}>
            Promociones
          </NavLink>
        </div>
      </div>
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

            <NavLink
              to="/contact"
              className={menuLinkStyles}
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </NavLink>

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
                  <ShoppingCart size={18} />
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
        {user ? (
          <>
            <NavLink
              to="/cart"
              className={user.rol === "admin" ? "hidden" : "hidden lg:block"}
            >
              <ShoppingCart size={20} />
            </NavLink>

            <NavLink
              to="/favorites"
              className={user.rol === "admin" ? "hidden" : "hidden lg:block"}
            >
              <Heart size={20} />
            </NavLink>
          </>
        ) : null}

        {user && user.rol === "admin" ? (
          <NavLink
            to="/administrator"
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
