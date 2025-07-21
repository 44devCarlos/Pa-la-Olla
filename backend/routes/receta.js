import { Router } from "express";
import { ControladorReceta } from "../controllers/receta.js";

export const crearRecetaRouter = ({ recetaModelo }) => {
    const router = Router();

    const recetaControlador = new ControladorReceta({ recetaModelo });

    router.get("/recetasPrincipales", recetaControlador.obtenerRecetasPrincipales);
    router.get("/ingredientesPrincipales", recetaControlador.obtenerIngredientesPrincipales);
    router.get("/filtrarPorIngrediente", recetaControlador.filtrarPorIngrediente);
    router.get("/todas", recetaControlador.obtenerTodasLasRecetas);
    router.get("/calificaciones/:id_receta", recetaControlador.obtenerCalificacionesPorReceta);
    router.get("/comentarios/:id_receta", recetaControlador.obtenerComentariosReceta);
    router.post("/agregarComentario", recetaControlador.agregarComentario);
    router.get("/precio/:id_receta", recetaControlador.obtenerPrecioPorNiveles);
    router.get("/verReceta/:id_receta", recetaControlador.verReceta);
    

    return router;
};
