import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Direction, SortBy } from "../../const/sort";
// @ts-ignore
import { enviarNoti, typeToast } from "../../util/notificacionToast";
import { SearchOfertas } from "../../modelos/Ofertas";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";
import { backCaido } from "../../servicios/Axios/http-axios";

function Menu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [results, setResults] = useState<SearchOfertas | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (avatarRef.current && !avatarRef.current.contains(target)) {
        setAvatarOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if(backCaido) return

    const query = searchQuery.trim();

    if (query.length < 3) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(() => {
      ServicioOfertas.getOfertasBuscador(query)
        .then((res) => {
          setResults(res.data);
          setShowDropdown(true);
        })
        .catch(() => {
          setResults(null);
          setShowDropdown(false);
        })
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleLogout = async () => {
    await signOut();
    setAvatarOpen(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    let buscar: string = searchQuery.trim();
    if (buscar !== "") {
      if (buscar.length < 3)
        enviarNoti(
          typeToast.WARN,
          "Petición inválida",
          "Para buscar necesito 3 chars minimo",
        );
      else navigate(`/ofertas?titulo=${buscar}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="hdr">
      <nav className="hdr__nav">
        <div className="logo-container">
          <Link to="/" className="hdr__logo">
            <img
              src="/Imagenes/Logo.png"
              alt="Quest-Hub"
              className="hdr__logo-img"
            />
          </Link>
        </div>

        <div className="hdr__links">
          <Link
            to={`/ofertas?sortBy=${SortBy.RATING}&direction=${Direction.DESC}`}
            className="hdr__link hdr__link-btn"
          >
            Tendencias
          </Link>
          <Link
            to={`/ofertas?sortBy=${SortBy.AHORRO}&direction=${Direction.DESC}`}
            className="hdr__link hdr__link-btn"
          >
            Irresistibles
          </Link>
          <Link
            to={`/ofertas?sortBy=${SortBy.RECIENTE}&direction=${Direction.DESC}`}
            className="hdr__link hdr__link-btn"
          >
            Novedades
          </Link>
        </div>

        {/* ── RIGHT: Search + Auth ── */}
        <div className="hdr__right">
          <form onSubmit={handleSearch}>
            <div className="hdr__search" ref={searchRef}>
              <input
                className="hdr__search-input"
                id="buscador"
                type="text"
                placeholder="Que juegos buscas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if ((results?.ofertas?.length ?? 0) > 0)
                    setShowDropdown(true);
                }}
              />

              <button type="submit" className="hdr__search-btn">
                <SearchIcon />
              </button>

              {showDropdown && (
                <div className="hdr__search-dropdown">
                  {results?.ofertas?.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="hdr__search-option"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigate(`/juego/${item.id}`, {
                          replace: true,
                        });
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                    >
                      <img src={item.imagen} className="hdr__search-img" />

                      <div className="hdr__search-middle">
                        <span className="hdr__search-title">{item.titulo}</span>
                      </div>
                    </div>
                  ))}
                  {(results?.ofertas?.length ?? 0) > 0 ? (
                    <div
                      className="hdr__search-option-total"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigate(`/ofertas?titulo=${searchQuery}`, {
                          replace: true,
                        });
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                    >
                      Ofertas encontradas: {results?.totalOfertas ?? 0}
                    </div>
                  ):
                  (<div
                      className="hdr__search-option-total"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                    >
                      No se ha encontrado nada
                    </div>)}
                </div>
              )}
            </div>
          </form>

          <div className="hdr__avatar-wrap" ref={avatarRef}>
            <button
              className={`hdr__avatar${avatarOpen ? " hdr__avatar--active" : ""}`}
              onClick={() => setAvatarOpen((v) => !v)}
            >
              <AvatarIcon />
            </button>

            {avatarOpen && (
              <div className="hdr__avatar-dropdown">
                {user ? (
                  <>
                    <Link
                      to="/wishlist"
                      className="hdr__avatar-dropdown-btn"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Ver WishList
                    </Link>
                    <Link
                      to="/cuenta"
                      className="hdr__avatar-dropdown-btn"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Ver Cuenta
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="hdr__avatar-dropdown-logout"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hdr__avatar-dropdown-btn"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ── SVG Icons ── */
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.017-.984zm-5.44 1.406a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
      />
    </svg>
  );
}

export default Menu;
