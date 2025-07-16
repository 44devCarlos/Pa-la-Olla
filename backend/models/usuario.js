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

    static async agregarUsuarios(usuario) {
        // eslint-disable-next-line no-unused-vars
        const [result] = await connection.query(
            "Call registrar_usuario(?, ?, ?, ?, ?)",
            [usuario.nombre, usuario.email, usuario.password, usuario.telefono, usuario.direccion],
        );
        return result[0];
    }


    static async consultarUsuarios(usuario) {
        // eslint-disable-next-line no-unused-vars
        const [result] = await connection.query("Call VerificarUsuario(?, ?)", [
            usuario.email,
            usuario.contrasena,
        ]);
        return result[0];
    }

    static async actualizarUsuarios(usuario) {
        console.log(usuario);
        // eslint-disable-next-line no-unused-vars
        const [result] = await connection.query(
            "Call ActualizarUsuario(?, ?, ?)",
            [usuario.nombre, usuario.contrasena, usuario.email],
        );
        return result[0];
    }
}
