import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire("Error", "Debes ingresar un correo", "error");
      return;
    }

    if (email.includes("@tendero")) {
      localStorage.setItem("usuarioActivo", email);
      navigate("/tendero");
    } else if (email.includes("@plataforma")) {
      localStorage.setItem("usuarioActivo", email);
      navigate("/plataforma");
    } else if (email.includes("@proveedor")) {
      localStorage.setItem("usuarioActivo", email);
      navigate("/proveedor");
    } else {
      Swal.fire(
        "Usuario inválido",
        "El correo debe contener @tendero, @plataforma o @proveedor",
        "warning"
      );
    }
  };

  const estilos = {
    contenedor: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f3f4f6",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: "360px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    boton: {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#2563eb",
      color: "white",
      cursor: "pointer",
      fontWeight: "500",
      transition: "0.3s",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <form style={estilos.card} onSubmit={handleLogin}>
        <h2 style={{ marginBottom: "20px" }}>Iniciar sesión</h2>

        <input
          style={estilos.input}
          type="email"
          placeholder="Correo (ej: juan@tendero)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={estilos.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={estilos.boton} type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}
