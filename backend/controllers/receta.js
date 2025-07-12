export class ControladorReceta {
	constructor({ recetaModelo }) {
		this.recetaModelo = recetaModelo;
	}
	 obtenerRecetasPrincipales = async (req, res) => {
        const recetas = await this.recetaModelo.ObtenerRecetasPrincipales();
        return res.json(recetas);
    };

	obtenerIngredientesPrincipales = async (req, res) => {
        const recetas = await this.recetaModelo.ObtenerIngredientesPrincipales();
        return res.json(recetas);
    };

    obtenerTodasLasRecetas = async (req, res) => {
        const recetas = await this.recetaModelo.ObtenerTodasLasRecetas();
        return res.json(recetas);
    };

    filtrarPorIngrediente = async (req, res) => {
        const { ingrediente } = req.query;

        if (!ingrediente) {
            return res.status(400).json({ error: "Ingrediente requerido" });
        }

        const recetas = await this.recetaModelo.FiltrarPorIngrediente(ingrediente);
        return res.json(recetas);
  };
	
}
