// La URL base de tu backend.
// ¡IMPORTANTE! Reemplaza 'http://localhost:3305' con la dirección correcta.
//
// - Si usas un emulador de Android: usa 'http://10.0.2.2:3305'
// - Si usas un emulador de iOS: 'http://localhost:3305' debería funcionar.
// - Si usas un dispositivo físico: usa la IP de tu computadora en la red local.
//   (Ej: 'http://192.168.1.10:3305')
const API_URL = "http://10.0.2.2:3305";

//Usuario AUTH


export const fetchRecipeRatings = async (recipeId) => {
    try {
        const response = await fetch(`${API_URL}/receta/calificaciones/${recipeId}`);
        if (!response.ok) throw new Error('Error al obtener las calificaciones');
        const data = await response.json();
        return data[0] || {}; // Devuelve el objeto de calificaciones o uno vacío
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchRecipeComments = async (recipeId) => {
    try {
        const response = await fetch(`${API_URL}/receta/comentarios/${recipeId}`);
        if (!response.ok) throw new Error('Error al obtener los comentarios');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const postRecipeComment = async (commentData) => {
    try {
        const response = await fetch(`${API_URL}/receta/agregarComentario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al publicar el comentario');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};




export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/usuario/agregarUsuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al registrar el usuario');
        return data;
    } catch (error) {
        console.error('API Error en registro:', error);
        throw error;
    }
};
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/usuario/consultarUsuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verifica el correo o la contraseña');
        return data;
    } catch (error) {
        console.error('API Error en login:', error);
        throw error;
    }
};
export const fetchOrderCount = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/pedido/pedidos/${userId}`);
        if (!response.ok) throw new Error('Error al obtener la cantidad de pedidos');
        const data = await response.json();
        return data?.[0]?.total_pedidos || 0;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
export const fetchCommentCount = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/usuario/comentarios/${userId}`);
        if (!response.ok) throw new Error('Error al obtener la cantidad de comentarios');
        const data = await response.json();
        return data?.[0]?.total_comentarios || 0;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
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
export const fetchPopularRecipes = async () => {
    try {
        const response = await fetch(`${API_URL}/receta/recetasPopulares`);
        if (!response.ok) throw new Error('Error al obtener recetas populares');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
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
