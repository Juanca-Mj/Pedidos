import { Link, useLocation } from "react-router-dom";

export default function NavBar({ isTendero, isPlataforma, isProveedor }) {
  const location = useLocation();

  const buttonStyle = (active) => ({
    backgroundColor: active ? "#14532d" : "#1f2937",
    color: "white",
    border: "none",
    padding: "6px 12px",
    margin: "4px",
    borderRadius: "6px",
    cursor: "pointer",
  });

  return (
    <nav style={{ marginBottom: "16px" }}>
      {isTendero && (
        <Link to="/tendero">
          <button style={buttonStyle(location.pathname === "/tendero")}>
            Tendero
          </button>
        </Link>
      )}

      {isPlataforma && (
        <Link to="/plataforma">
          <button style={buttonStyle(location.pathname === "/plataforma")}>
            Plataforma
          </button>
        </Link>
      )}

      {isProveedor && (
        <Link to="/proveedor">
          <button style={buttonStyle(location.pathname === "/proveedor")}>
            Proveedor
          </button>
        </Link>
      )}
    </nav>
  );
}
