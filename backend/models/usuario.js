import { connection } from "./configDB.js";
// File: backend/models/usuario.js

export class ModeloUsuario {
    static async obtenerUsuarios() {
        // eslint-disable-next-line no-unused-vars
        const [usuarios, info] = await connection.query(
            "SELECT idUsuario, nombre, email, rol FROM usuarios",
        );
        return usuarios;
    }

      static async obtenerCantidadComentarios(id_usuario) {
        const [resultado] = await connection.query(
			`Call obtener_total_comentarios_usuario(?)`,
			[id_usuario]
		);
		return resultado[0];
    }

    static async agregarUsuarios(usuario) {
        // eslint-disable-next-line no-unused-vars
        const [result] = await connection.query(
            "Call registrar_usuario(?, ?, ?, ?)",
            [usuario.nombre, usuario.email, usuario.password, usuario.telefono],
        );
        return result[0];
    }


    static async consultarUsuarios(usuario) {
        // eslint-disable-next-line no-unused-vars
        const [result] = await connection.query("Call verificar_usuario(?, ?)", [
            usuario.email,
            usuario.password,
        ]);
        return result[0];
    }

   static async actualizarUsuarios(usuario) {
    console.log(usuario);

    // Si la contraseña está vacía, enviamos NULL
    const password = usuario.password?.trim() === "" ? null : usuario.password;

    const [result] = await connection.query(
        "CALL actualizar_usuario(?, ?, ?, ?, ?)",
        [
            usuario.id_usuario,
            usuario.nombre,
            usuario.email,
            usuario.telefono,
            password,
        ]
    );

    // Devuelve el primer resultado
    return result[0];
  }
}
