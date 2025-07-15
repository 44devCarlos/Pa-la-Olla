import logoPaLaOlla from "../assets/img/logo.png";
function Footer() {
    return (
    <footer className="bg-[#860000] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Columna 1: Logo y descripción */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logoPaLaOlla} alt="Logo" className="w-8 h-8" />
            <h2 className="text-xl font-bold">Pa' la olla</h2>
          </div>
          <p className="text-sm leading-relaxed">
            No lo pienses, no batalles...directo pa la olla sin detalles.
            Tradición culinaria panameña al alcance de todos.
          </p>
        </div>

        {/* Columna 2: Ingredientes */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Ingredientes</h3>
          <ul className="space-y-2 text-sm">
            <li>Recetas con Pollo</li>
            <li>Platos de Carne</li>
            <li>Especialidades de Pescado</li>
            <li>Comida Vegetariana</li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 Ciudad de Panamá</li>
            <li>📞 +507 123-4567</li>
            <li>✉️ info@palaolla.com</li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="my-8 border-white/20" />

      {/* Derechos reservados */}
      <div className="text-center text-sm text-white/80">
        © {new Date().getFullYear()} Pa' la olla. Todos los derechos reservados.
      </div>
    </footer>
  );
}
export default Footer;
