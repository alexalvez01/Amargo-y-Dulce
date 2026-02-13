import { useState } from "react";
import { User, ShoppingCart, Heart, Settings2 } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState({name: "Usuario", rol:"admin"}); 
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyles = ({ isActive }) =>
  `transition-colors hover:text-brand-brownDark ${
    isActive ? "text-brand-brownDark font-semibold" : ""
  }`;
  return (
    <nav className="flex flex-row w-full items-center justify-between px-32 bg-brand-beige text-brand-brown">
        <img
          src="/images/logo.webp"
          alt="Company logo"
          className="max-w-28"
        />

        <div className="flex gap-2.5 font-brand text-sm">
          <NavLink
            to="/"
            className={navLinkStyles}
          >
            Nosotros
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkStyles}
          >
            Contacto
          </NavLink>
          <NavLink
            to="/shop"
            className={navLinkStyles}
          >
            Tienda
          </NavLink>
          <NavLink
            to="/promotions"
            className={navLinkStyles}
          >
            Promociones
          </NavLink>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer font-brand text-sm">
            <User size={20} />

          {user ? (
              <span>
                {user.rol === "admin" ? (
                  `${user.name} (Admin)`
                ) : `${user.name}`}
              </span>
            ) : (
              <NavLink to="/login">Iniciar Sesión</NavLink>
            )}
          </div>

          <NavLink to="/cart">
            <ShoppingCart size={20} />
          </NavLink>

          <NavLink to="/favorites">
            <Heart size={20} />
          </NavLink>

          {user.rol === "admin"? (
            <NavLink
                to="/administrator"
                className="flex items-center gap-2 border border-brand-brown px-3 py-1.5 rounded-lg text-sm font-brand hover:bg-brand-brown hover:text-white transition-colors"
            >
                <Settings2 size={18} />
                Panel
            </NavLink>
            ): null}
        </div>
    </nav>
  );
}
