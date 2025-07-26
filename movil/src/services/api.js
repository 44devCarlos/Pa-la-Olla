// La URL base de tu backend.
// ¡IMPORTANTE! Reemplaza 'http://localhost:3305' con la dirección correcta.
//
// - Si usas un emulador de Android: usa 'http://10.0.2.2:3305'
// - Si usas un emulador de iOS: 'http://localhost:3305' debería funcionar.
// - Si usas un dispositivo físico: usa la IP de tu computadora en la red local.
//   (Ej: 'http://192.168.1.10:3305')
export const API_URL = "http://10.0.2.2:3305";

export const registerUser = async (userData) => {
	try {
		const response = await fetch(`${API_URL}/usuario/agregarUsuarios`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});
		const data = await response.json();
		if (!response.ok)
			throw new Error(data.error || "Error al registrar el usuario");
		return data;
	} catch (error) {
		console.error("API Error en registro:", error);
		throw error;
	}
};
export const loginUser = async (email, password) => {
	try {
		const response = await fetch(`${API_URL}/usuario/consultarUsuarios`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await response.json();
		if (!response.ok)
			throw new Error(data.error || "Verifica el correo o la contraseña");
		return data;
	} catch (error) {
		console.error("API Error en login:", error);
		throw error;
	}
};
export const fetchOrderCount = async (userId) => {
	try {
		const response = await fetch(`${API_URL}/pedido/pedidos/${userId}`);
		if (!response.ok)
			throw new Error("Error al obtener la cantidad de pedidos");
		const data = await response.json();
		return data?.[0]?.total_pedidos || 0;
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
export const fetchCommentCount = async (userId) => {
	try {
		const response = await fetch(
			`${API_URL}/usuario/comentarios/${userId}`
		);
		if (!response.ok)
			throw new Error("Error al obtener la cantidad de comentarios");
		const data = await response.json();
		return data?.[0]?.total_comentarios || 0;
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
export const fetchAllRecipes = async () => {
	try {
		const response = await fetch(`${API_URL}/receta/todas`);
		if (!response.ok) throw new Error("Error al obtener todas las recetas");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
export const fetchPopularRecipes = async () => {
	try {
		const response = await fetch(`${API_URL}/receta/recetasPopulares`);
		if (!response.ok) throw new Error("Error al obtener recetas populares");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
export const fetchMainIngredients = async () => {
	try {
		const response = await fetch(
			`${API_URL}/receta/ingredientesPrincipales`
		);
		if (!response.ok) throw new Error("Error al obtener ingredientes");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};
export const fetchRecipesByIngredient = async (ingredient) => {
	try {
		const response = await fetch(
			`${API_URL}/receta/filtrarPorIngrediente?ingrediente=${ingredient}`
		);
		if (!response.ok) throw new Error("Error al filtrar recetas");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

export const fetchRecipeRatings = async (recipeId) => {
	try {
		const response = await fetch(
			`${API_URL}/receta/calificaciones/${recipeId}`
		);
		if (!response.ok)
			throw new Error("Error al obtener calificaciones de la receta");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

export const fetchRecipeComments = async (recipeId) => {
	try {
		const response = await fetch(
			`${API_URL}/receta/comentarios/${recipeId}`
		);
		if (!response.ok)
			throw new Error("Error al obtener comentarios de la receta");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

export const postRecipeComment = async (commentData) => {
	try {
		const response = await fetch(`${API_URL}/receta/agregarComentario`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(commentData),
		});
		if (!response.ok) throw new Error("Error al publicar el comentario");
		return;
	} catch (error) {
		console.error("API Error al publicar comentario:", error);
		throw error;
	}
};

export const updateUser = async (userData) => {
  try {
    // Se usa la ruta '/usuario/actualizarUsuarios' de tu ejemplo y la variable API_URL
    const response = await fetch(`${API_URL}/usuario/actualizarUsuarios`, {
      method: "POST", // O 'PUT'/'PATCH' si tu API lo requiere para actualizar
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {

      throw new Error(data.message || "Error al actualizar los datos.");
    } 

    return data.usuarioActualizado || data;
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};

export const fetchPrices = async (recipeId) => {
	try {
		const response = await fetch(`${API_URL}/receta/precio/${recipeId}`);
		if (!response.ok) throw new Error("Error al obtener precios");
		return await response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
};

export const createOrder = async (orderData) => {
	try {
		const response = await fetch(`${API_URL}/pedido/crearOrdenPaypal`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(orderData),
		});
		if (!response.ok) throw new Error("Error al crear la orden");
		const data = await response.json();
		return data.order;
	} catch (error) {
		console.error("API Error al crear orden:", error);
		throw error;
	}
};

export const fetchOrdersByUser = async (id_usuario) => {
    try {
        const response = await fetch(`${API_URL}/pedido/todosLosPedidos/${id_usuario}`);
        if (!response.ok) throw new Error('Error al obtener pedidos');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const captureOrder = async (orderData) => {
	try {
		const response = await fetch(
			`${API_URL}/pedido/capturarOrdenPaypal?token=${orderData.orden_paypal}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(orderData),
			}
		);
		if (!response.ok) throw new Error("Error al capturar la orden");
		return await response.json();
	} catch (error) {
		console.error("API Error al capturar orden:", error);
		throw error;
	}
}