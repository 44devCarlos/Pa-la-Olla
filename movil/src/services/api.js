// La URL base de tu backend.
// ¡IMPORTANTE! Reemplaza 'http://localhost:3305' con la dirección correcta.
//
// - Si usas un emulador de Android: usa 'http://10.0.2.2:3305'
// - Si usas un emulador de iOS: 'http://localhost:3305' debería funcionar.
// - Si usas un dispositivo físico: usa la IP de tu computadora en la red local.
//   (Ej: 'http://192.168.1.10:3305')
const API_URL = 'http://10.0.2.2:3305';

/**
 * Busca todas las recetas en el backend.
 */
export const fetchAllRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/receta/todas`);
    if (!response.ok) throw new Error('Error al obtener todas las recetas');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Busca las recetas populares/principales.
 */
export const fetchPopularRecipes = async () => {
    try {
        const response = await fetch(`${API_URL}/receta/recetasPrincipales`);
        if (!response.ok) throw new Error('Error al obtener recetas populares');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * Obtiene la lista de ingredientes principales para los filtros.
 */
export const fetchMainIngredients = async () => {
    try {
        const response = await fetch(`${API_URL}/receta/ingredientesPrincipales`);
        if (!response.ok) throw new Error('Error al obtener ingredientes');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * Filtra las recetas por un ingrediente específico.
 */
export const fetchRecipesByIngredient = async (ingredient) => {
    try {
        const response = await fetch(`${API_URL}/receta/filtrarPorIngrediente?ingrediente=${ingredient}`);
        if (!response.ok) throw new Error('Error al filtrar recetas');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

