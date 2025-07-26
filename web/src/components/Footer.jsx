import { Link } from "react-router-dom";
import logoPaLaOlla from "../assets/img/logo.png";

function Footer() {
  return (
    <footer className="bg-[#860000] px-6 py-8 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <img src={logoPaLaOlla} alt="Logo" className="h-8 w-8" />
            <h2 className="text-xl font-bold">Pa' la olla</h2>
          </div>
          <p className="text-sm leading-relaxed">
            No lo pienses, no batalles...directo pa la olla sin detalles.
            Tradición culinaria panameña al alcance de todos.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Sabor Pa' la Olla</h3>
          <ul className="space-y-2 text-sm">
            <li>Recetas Típicas</li>
            <li>Platos de Carne</li>
            <li>Próximamente especialidades de Pescado</li>
            <li>Recetas con Pollo</li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 Ciudad de Panamá</li>
            <li>📞 +507 6845-2603</li>
            <li>✉️ info@palaolla.com</li>
          </ul>
        </div>
      </div>

      <hr className="my-6 border-white/20" />

      <div className="text-center text-sm text-white/80">
        <div className="mt-4 flex justify-center gap-x-6">
          <Link to="/terminos-y-condiciones" className="hover:underline">
            Términos y Condiciones
          </Link>
          <Link to="/politica-de-privacidad" className="hover:underline">
            Política de Privacidad
          </Link>
        </div>
        <p>
          © {new Date().getFullYear()} Pa' la olla. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
