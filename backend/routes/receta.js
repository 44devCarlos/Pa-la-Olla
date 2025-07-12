import { Router } from "express";
import { ControladorReceta } from "../controllers/receta.js";

export const crearRecetaRouter = ({ recetaModelo }) => {
    const router = Router();

    const recetaControlador = new ControladorReceta({ recetaModelo });

    router.get("/recetasPrincipales", recetaControlador.obtenerRecetasPrincipales);
    router.get("/ingredientesPrincipales", recetaControlador.obtenerIngredientesPrincipales);
    router.get("/filtrarPorIngrediente", recetaControlador.filtrarPorIngrediente);
    router.get("/todas", recetaControlador.obtenerTodasLasRecetas);
    

    return router;
};
