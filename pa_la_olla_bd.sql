-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para pa_la_olla
CREATE DATABASE IF NOT EXISTS `pa_la_olla` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `pa_la_olla`;

-- Volcando estructura para procedimiento pa_la_olla.actualizar_usuario
DELIMITER //
CREATE PROCEDURE `actualizar_usuario`(
    IN p_id_usuario INT,
    IN p_nombre_usuario VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_direccion VARCHAR(255)
)
BEGIN
    DECLARE email_existe INT;
    
    IF p_email != (SELECT email FROM usuarios WHERE id_usuario = p_id_usuario) THEN
        SELECT COUNT(*) INTO email_existe FROM usuarios WHERE email = p_email AND id_usuario != p_id_usuario;
        
        IF email_existe > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este email ya está registrado por otro usuario';
        END IF;
    END IF;
    
    UPDATE usuarios
    SET nombre_usuario = p_nombre_usuario,
        email = p_email,
        telefono = p_telefono,
        direccion = p_direccion
    WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.agregar_comentario
DELIMITER //
CREATE PROCEDURE `agregar_comentario`(
    IN p_id_usuario INT,
    IN p_id_receta INT,
    IN p_descripcion TEXT
)
BEGIN
    DECLARE comentario_existe INT;
    
    SELECT COUNT(*) INTO comentario_existe 
    FROM comentario
    WHERE id_usuario = p_id_usuario AND id_receta = p_id_receta;
    
    IF comentario_existe > 0 THEN
        -- Actualizamos el comentario existente
        UPDATE comentario
        SET comentario = p_comentario,
            fecha_comentario = CURRENT_TIMESTAMP
        WHERE id_usuario = p_id_usuario AND id_receta = p_id_receta;
    ELSE
        -- Insertamos un nuevo comentario
        INSERT INTO comentario (id_usuario, id_receta, descripcion, fecha_comentario)
        VALUES (p_id_usuario, p_id_receta, p_descripcion, CURRENT_TIMESTAMP);
    END IF;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.agregar_especificacion
DELIMITER //
CREATE PROCEDURE `agregar_especificacion`(
    IN p_id_receta INT,
    IN p_id_nivel INT,
    IN p_cant_personas INT,
    IN p_ingredientes TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_preparacion TEXT,
    IN p_video VARCHAR(255),
    IN p_tiempo VARCHAR(255)
)
BEGIN
    INSERT INTO especificaciones (id_receta, id_nivel, cant_personas, ingredientes, precio, preparacion, video, tiempo)
    VALUES (p_id_receta, p_id_nivel , p_cant_personas , p_ingredientes, p_precio, p_preparacion, p_video, p_tiempo);
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.agregar_favorito
DELIMITER //
CREATE PROCEDURE `agregar_favorito`(
    IN p_id_usuario INT,
    IN p_id_receta INT
)
BEGIN
    DECLARE favorito_existe INT;
    
    SELECT COUNT(*) INTO favorito_existe FROM favoritos 
    WHERE id_usuario = p_id_usuario AND id_receta = p_id_receta;
    
    IF favorito_existe > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esta receta ya está en favoritos';
    ELSE
        INSERT INTO favoritos (id_usuario, id_receta, fecha_agregado)
        VALUES (p_id_usuario, p_id_receta, CURRENT_TIMESTAMP);
    END IF;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.cambiar_contrasena
DELIMITER //
CREATE PROCEDURE `cambiar_contrasena`(
    IN p_id_usuario INT,
    IN p_contrasena_actual VARCHAR(255),
    IN p_contrasena_nueva VARCHAR(255)
)
BEGIN
    DECLARE contrasena_correcta INT;
    
    SELECT COUNT(*) INTO contrasena_correcta 
    FROM usuarios 
    WHERE id_usuario = p_id_usuario AND contrasena = SHA2(p_contrasena_actual, 256);
    
    IF contrasena_correcta = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña actual es incorrecta';
    ELSE
        UPDATE usuarios
        SET contrasena = SHA2(p_contrasena_nueva, 256)
        WHERE id_usuario = p_id_usuario;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para tabla pa_la_olla.comentario
CREATE TABLE IF NOT EXISTS `comentario` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `id_receta` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `descripcion` tinytext DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `fecha_comentario` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `id_receta` (`id_receta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `FK__receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comentario_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.comentario: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.complejidad
CREATE TABLE IF NOT EXISTS `complejidad` (
  `id_nivel` int(11) NOT NULL AUTO_INCREMENT,
  `nivel` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_nivel`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.complejidad: ~3 rows (aproximadamente)
INSERT INTO `complejidad` (`id_nivel`, `nivel`) VALUES
	(1, 'Principiante'),
	(2, 'Intermedio'),
	(3, 'Avanzado');

-- Volcando estructura para procedimiento pa_la_olla.editar_especificacion
DELIMITER //
CREATE PROCEDURE `editar_especificacion`(
    IN p_id_espec INT,
    IN p_id_receta INT,
    IN p_id_nivel INT,
    IN p_cant_personas INT, 
    IN p_ingredientes TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_preparacion TEXT,
    IN p_video TEXT,
    IN p_tiempo VARCHAR(100)
)
BEGIN
    UPDATE especificaciones
    SET cant_personas = p_cant_personas,
        ingredientes = p_ingredientes,
        precio = p_precio,
        preparacion = p_preparacion,
        video = p_video,
        tiempo = p_tiempo
    WHERE id_espec = p_id_espec;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.eliminar_favorito
DELIMITER //
CREATE PROCEDURE `eliminar_favorito`(
    IN p_id_usuario INT,
    IN p_id_receta INT
)
BEGIN
    DECLARE favorito_existe INT;
    
    SELECT COUNT(*) INTO favorito_existe FROM favoritos 
    WHERE id_usuario = p_id_usuario AND id_receta = p_id_receta;
    
    IF favorito_existe = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esta receta no está en favoritos';
    ELSE
        DELETE FROM favoritos 
        WHERE id_usuario = p_id_usuario AND id_receta = p_id_receta;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para tabla pa_la_olla.especificaciones
CREATE TABLE IF NOT EXISTS `especificaciones` (
  `id_espec` int(11) NOT NULL AUTO_INCREMENT,
  `id_receta` int(11) DEFAULT NULL,
  `id_nivel` int(11) DEFAULT NULL,
  `cant_personas` int(11) DEFAULT NULL,
  `ingredientes` text DEFAULT NULL,
  `precio` decimal(20,6) DEFAULT NULL,
  `preparacion` text DEFAULT NULL,
  `video` text DEFAULT NULL,
  `tiempo` text DEFAULT NULL,
  PRIMARY KEY (`id_espec`),
  KEY `id_receta` (`id_receta`),
  KEY `id_nivel` (`id_nivel`),
  CONSTRAINT `FK_especificaciones_complejidad` FOREIGN KEY (`id_nivel`) REFERENCES `complejidad` (`id_nivel`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_especificaciones_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.especificaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.favorito
CREATE TABLE IF NOT EXISTS `favorito` (
  `id_favorito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_receta` int(11) DEFAULT NULL,
  `fecha_agregado` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_favorito`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_receta` (`id_receta`),
  CONSTRAINT `FK__usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_favorito_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.favorito: ~0 rows (aproximadamente)

-- Volcando estructura para procedimiento pa_la_olla.obtener_detalles_pedido
DELIMITER //
CREATE PROCEDURE `obtener_detalles_pedido`(
	IN `p_id_usuario` INT,
	IN `p_id_pedido` INT
)
BEGIN
    SELECT *
    FROM pedido p
    JOIN especificaciones e ON p.id_espec = e.id_espec
    JOIN receta r ON e.id_receta = r.id_receta
    WHERE id_pedido = p_id_pedido AND p.id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_favoritos_usuario
DELIMITER //
CREATE PROCEDURE `obtener_favoritos_usuario`(
    IN p_id_usuario INT
)
BEGIN
    SELECT f.id_favorito, r.id_receta, r.nombre_receta, r.descripcion, 
           r.imagen_receta, r.ingrediente_principal,
           f.fecha_agregado
    FROM favorito f
    JOIN receta r ON f.id_receta = r.id_receta
    WHERE f.id_usuario = p_id_usuario
    ORDER BY f.fecha_agregado DESC;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_pedidos_por_fecha
DELIMITER //
CREATE PROCEDURE `obtener_pedidos_por_fecha`(
    IN p_id_usuario INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT p.id_pedido, p.precio, p.fecha_pedido, p.direccion,
           COUNT(pd.id_receta) AS cantidad_recetas
    FROM pedidos p
    WHERE p.id_usuario = p_id_usuario
      AND DATE(p.fecha_pedido) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY p.id_pedido
    ORDER BY p.fecha_pedido DESC;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_todas_las_recetas
DELIMITER //
CREATE PROCEDURE `obtener_todas_las_recetas`()
BEGIN
		SELECT * 
		FROM receta r
		JOIN especificaciones e ON r.id_receta = e.id_receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_comentarios_receta
DELIMITER //
CREATE PROCEDURE `obtener_total_comentarios_receta`(
	IN `p_id_receta` INT
)
BEGIN
	SELECT COUNT(*) AS cantidad_comentarios
	WHERE id_receta = p_id_receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_favoritos_usuario
DELIMITER //
CREATE PROCEDURE `obtener_total_favoritos_usuario`(
    IN p_id_usuario INT
)
BEGIN
    SELECT COUNT(*) AS total_favoritos
    FROM favoritos
    WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_pedidos_usuario
DELIMITER //
CREATE PROCEDURE `obtener_total_pedidos_usuario`(
    IN p_id_usuario INT
)
BEGIN
    SELECT COUNT(*) AS total_pedidos
    FROM pedidos
    WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para tabla pa_la_olla.pago
CREATE TABLE IF NOT EXISTS `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `monto` int(11) DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `FK_pago_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pago: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.pedido
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_espec` int(11) DEFAULT NULL,
  `precio` decimal(20,6) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_pedido` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_espec` (`id_espec`),
  CONSTRAINT `FK_pedido_especificaciones` FOREIGN KEY (`id_espec`) REFERENCES `especificaciones` (`id_espec`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_pedido_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pedido: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.receta
CREATE TABLE IF NOT EXISTS `receta` (
  `id_receta` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_receta` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_receta` text DEFAULT NULL,
  `ingrediente_principal` text DEFAULT NULL,
  `alergenos_receta` text DEFAULT NULL,
  `rango_tiempo` text DEFAULT NULL,
  `rango_personas` text DEFAULT NULL,
  `rango_precio` text DEFAULT NULL,
  PRIMARY KEY (`id_receta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.receta: ~0 rows (aproximadamente)

-- Volcando estructura para procedimiento pa_la_olla.registrar_receta
DELIMITER //
CREATE PROCEDURE `registrar_receta`(
    IN p_nombre_receta VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_imagen_receta TEXT,
    IN p_ingrediente_principal INT,
    IN p_alergenos_receta TEXT,
    IN p_rango_receta VARCHAR(255),
    IN p_rango_personas VARCHAR(255),
    IN p_rango_precio VARCHAR(255)
)
BEGIN
    INSERT INTO recetas (nombre_receta, descripcion, imagen_receta, ingrediente_principal, alergenos_receta, rango_receta, rango_personas, rango_precio)
    VALUES (p_nombre_receta, p_descripcion, p_imagen_receta, p_ingrediente_principal, p_alergenos_receta, p_rango_receta, p_rango_personas, p_rango_precio);
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.registrar_usuario
DELIMITER //
CREATE PROCEDURE `registrar_usuario`(
	IN `p_nombre_usuario` VARCHAR(100),
	IN `p_email` VARCHAR(255),
	IN `p_contrasena` VARCHAR(255),
	IN `p_telefono` VARCHAR(20),
	IN `p_direccion` VARCHAR(255)
)
BEGIN
    -- Primero verificamos si el correo ya existe
    DECLARE email_existe INT;
    SELECT COUNT(*) INTO email_existe FROM usuarios WHERE email = p_email;
    
    IF email_existe > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este email ya está registrado';
    ELSE
        -- Insertamos el nuevo usuario
        INSERT INTO usuarios (nombre_usuario, email, contrasena, telefono, direccion)
        VALUES (p_nombre_usuario, p_email, SHA2(p_contrasena, 256), p_telefono, p_direccion);
    END IF;
END//
DELIMITER ;

-- Volcando estructura para tabla pa_la_olla.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.usuarios: ~0 rows (aproximadamente)

-- Volcando estructura para procedimiento pa_la_olla.verificar_usuario
DELIMITER //
CREATE PROCEDURE `verificar_usuario`(
    IN p_email VARCHAR(255)
)
BEGIN
    DECLARE usuario_existe INT;
    
    SELECT COUNT(*) INTO usuario_existe FROM usuarios WHERE email = p_email;
    
    IF usuario_existe > 0 THEN
        SELECT id_usuario, nombre_usuario, email FROM usuarios WHERE email = p_email;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario no existe';
    END IF;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
