export class ControladorUsuario {
	constructor({ usuarioModelo }) {
		this.usuarioModelo = usuarioModelo;
	}

	obtenerUsuarios = async (req, res) => {
        const usuarios = await this.usuarioModelo.obtenerUsuarios();
        return res.json(usuarios);
    };

agregarUsuarios = async (req, res) => {
  try {
    const usuario = req.body;
    const resultado = await this.usuarioModelo.agregarUsuarios(usuario);

    // Suponiendo que no lanza errores y se guarda correctamente
    return res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      data: resultado,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al registrar usuario",
      detalles: error.message,
    });
  }
};
  consultarUsuarios = async (req, res) => {
    const usuario = req.body;
    try {
        const usuarios = await this.usuarioModelo.consultarUsuarios(usuario);

        if (
            !usuarios || 
            usuarios.length === 0 || 
            !usuarios[0].id_usuario // protege si devuelve NULL
        ) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        console.log("Usuario desde backend:", usuarios[0]);
        return res.status(200).json(usuarios[0]);
       

    } catch (error) {
        console.error("Error al consultar usuario:", error);
        return res.status(500).json({
            error: "Error al consultar usuario",
            detalles: error.message,
        });
    }
};

    actualizarUsuarios = async (req, res) => {
    const usuario = req.body;
    try {
        const usuarios = await this.usuarioModelo.actualizarUsuarios(usuario);
       return res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        return res.status(400).json({
            error: error.message || "Error actualizando usuario",
        });
    }
};
}
