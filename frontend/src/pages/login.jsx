import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
      return;
    }

    localStorage.setItem("usuarioActivo", email);

    if (email.includes("@tendero")) navigate("/tendero");
    else if (email.includes("@plataforma")) navigate("/plataforma");
    else if (email.includes("@proveedor")) navigate("/proveedor");
    else Swal.fire("Error", "Correo no válido para ningún rol.", "error");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
        className="login-card"
      >
        <h2
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#fff",
              marginBottom: "12px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#fff",
              marginBottom: "20px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "linear-gradient(135deg, #16a34a, #15803d)")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "linear-gradient(135deg, #22c55e, #16a34a)")
            }
          >
            Ingresar
          </button>
        </form>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            fontSize: "14px",
            marginTop: "20px",
          }}
        >
          Accede según tu rol: <br />
          <span style={{ color: "#38bdf8" }}>@tendero</span>,{" "}
          <span style={{ color: "#38bdf8" }}>@plataforma</span>,{" "}
          <span style={{ color: "#38bdf8" }}>@proveedor</span>
        </p>
      </div>
    </div>
  );
}
