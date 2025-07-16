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
        const usuarios = await this.usuarioModelo.consultarUsuarios(usuario);
        return res.json(usuarios);
    };

    actualizarUsuarios = async (req, res) => {
        const usuario = req.body;
        try {
            const usuarios =
                await this.usuarioModelo.actualizarUsuarios(usuario);
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({
                error: "Error actualizando usuario",
                details: error.message,
            });
        }
    };
}
