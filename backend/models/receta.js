import { connection } from "./configDB.js";
// File: backend/models/receta.js

export class ModeloReceta {
    static async ObtenerRecetasPrincipales(){
        const [recetas] = await connection.query(`Call obtener_recetas_principales()`)
    return recetas[0]
    }

    static async ObtenerIngredientesPrincipales(){
        const [ingredientes] = await connection.query(`Call obtener_ingredientes_principales()`)
    return ingredientes[0]
    }

     static async ObtenerTodasLasRecetas(){
        const [recetas] = await connection.query(`Call obtener_todas_las_recetas()`)
    return recetas[0]
    }

      static async FiltrarPorIngrediente(ingrediente){
        const [recetas] = await connection.query(`Call obtener_receta_por_filtro(?)`,[ingrediente])
    return recetas[0]
    }
}
