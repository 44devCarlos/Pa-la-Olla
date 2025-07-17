-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         9.3.0 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
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
DROP DATABASE IF EXISTS `pa_la_olla`;
CREATE DATABASE IF NOT EXISTS `pa_la_olla` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pa_la_olla`;

-- Volcando estructura para procedimiento pa_la_olla.actualizar_usuario
DROP PROCEDURE IF EXISTS `actualizar_usuario`;
DELIMITER //
CREATE PROCEDURE `actualizar_usuario`(
	IN `p_id_usuario` INT,
	IN `p_nombre_usuario` VARCHAR(100),
	IN `p_email` VARCHAR(255),
	IN `p_telefono` VARCHAR(20),
	IN `p_direccion` VARCHAR(255),
	IN `p_contrasena` VARCHAR(225)
)
BEGIN
    DECLARE email_actual VARCHAR(100);
    DECLARE email_existe INT;

    -- Obtener el email actual
    SELECT email INTO email_actual FROM usuarios WHERE id_usuario = p_id_usuario;

    -- Verificar si se intenta cambiar el email
    IF p_email IS NOT NULL AND p_email != email_actual THEN
        SELECT COUNT(*) INTO email_existe
        FROM usuarios
        WHERE email = p_email AND id_usuario != p_id_usuario;

        IF email_existe > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este email ya está registrado por otro usuario';
        END IF;
    END IF;

    -- Si se proporciona una nueva contraseña, se actualiza con ella
    IF p_contrasena IS NOT NULL AND p_contrasena != '' THEN
        UPDATE usuarios
        SET nombre_usuario = p_nombre_usuario,
            email = IF(p_email IS NOT NULL AND p_email != '', p_email, email_actual),
            telefono = p_telefono,
            direccion = p_direccion,
            contrasena = SHA2(p_contrasena, 256)
        WHERE id_usuario = p_id_usuario;
    ELSE
        UPDATE usuarios
        SET nombre_usuario = p_nombre_usuario,
            email = IF(p_email IS NOT NULL AND p_email != '', p_email, email_actual),
            telefono = p_telefono,
            direccion = p_direccion
        WHERE id_usuario = p_id_usuario;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.agregar_comentario
DROP PROCEDURE IF EXISTS `agregar_comentario`;
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
DROP PROCEDURE IF EXISTS `agregar_especificacion`;
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
DROP PROCEDURE IF EXISTS `agregar_favorito`;
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
DROP PROCEDURE IF EXISTS `cambiar_contrasena`;
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
DROP TABLE IF EXISTS `comentario`;
CREATE TABLE IF NOT EXISTS `comentario` (
  `id_comentario` int NOT NULL AUTO_INCREMENT,
  `id_receta` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `descripcion` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `calificacion` decimal(20,6) DEFAULT NULL,
  `fecha_comentario` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `id_receta` (`id_receta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `FK__receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comentario_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.comentario: ~0 rows (aproximadamente)

-- Volcando estructura para procedimiento pa_la_olla.editar_especificacion
DROP PROCEDURE IF EXISTS `editar_especificacion`;
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
DROP PROCEDURE IF EXISTS `eliminar_favorito`;
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

-- Volcando estructura para tabla pa_la_olla.favorito
DROP TABLE IF EXISTS `favorito`;
CREATE TABLE IF NOT EXISTS `favorito` (
  `id_favorito` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_receta` int DEFAULT NULL,
  `fecha_agregado` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_favorito`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_receta` (`id_receta`),
  CONSTRAINT `FK__usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_favorito_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.favorito: ~0 rows (aproximadamente)

-- Volcando estructura para procedimiento pa_la_olla.obtener_calificaciones_receta
DROP PROCEDURE IF EXISTS `obtener_calificaciones_receta`;
DELIMITER //
CREATE PROCEDURE `obtener_calificaciones_receta`(
	IN `p_id_receta` INT
)
BEGIN
	SELECT COUNT(*) AS total_comentario,
	AVG(c.calificacion) AS calificacion_promedio,
	SUM(CASE WHEN c.calificacion BETWEEN 1 AND 1.9 THEN 1 ELSE 0 END) AS una_estrella,
	SUM(CASE WHEN c.calificacion BETWEEN 2 AND 2.9 THEN 1 ELSE 0 END) AS dos_estrellas,
	SUM(CASE WHEN c.calificacion BETWEEN 3 AND 3.9 THEN 1 ELSE 0 END) AS tres_estrellas,
	SUM(CASE WHEN c.calificacion BETWEEN 4 AND 4.9 THEN 1 ELSE 0 END) AS cuatro_estrellas,
	SUM(CASE WHEN c.calificacion = 5 THEN 1 ELSE 0 END) AS cinco_estrellas
	FROM comentario c 
	WHERE c.id_receta = p_id_receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_comentarios_receta
DROP PROCEDURE IF EXISTS `obtener_comentarios_receta`;
DELIMITER //
CREATE PROCEDURE `obtener_comentarios_receta`(
	IN `p_id_receta` INT
)
BEGIN
	SELECT u.id_usuario, u.nombre_usuario, c.descripcion, c.calificacion, c.fecha_comentario
	FROM comentario c 
	left JOIN usuarios u ON c.id_usuario = u.id_usuario
	WHERE c.id_receta = p_id_receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_detalles_pedido
DROP PROCEDURE IF EXISTS `obtener_detalles_pedido`;
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
DROP PROCEDURE IF EXISTS `obtener_favoritos_usuario`;
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

-- Volcando estructura para procedimiento pa_la_olla.obtener_ingredientes_principales
DROP PROCEDURE IF EXISTS `obtener_ingredientes_principales`;
DELIMITER //
CREATE PROCEDURE `obtener_ingredientes_principales`()
BEGIN
	SELECT DISTINCT ingrediente_principal FROM receta WHERE ingrediente_principal IS NOT NULL;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_pedidos_por_fecha
DROP PROCEDURE IF EXISTS `obtener_pedidos_por_fecha`;
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

-- Volcando estructura para procedimiento pa_la_olla.obtener_recetas_principales
DROP PROCEDURE IF EXISTS `obtener_recetas_principales`;
DELIMITER //
CREATE PROCEDURE `obtener_recetas_principales`()
BEGIN
	SELECT * FROM receta
	WHERE id_receta IN (1, 2, 6);
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_receta_por_filtro
DROP PROCEDURE IF EXISTS `obtener_receta_por_filtro`;
DELIMITER //
CREATE PROCEDURE `obtener_receta_por_filtro`(
	IN `p_ingrediente_principal` VARCHAR(50)
)
BEGIN
	SELECT * FROM Receta WHERE ingrediente_principal = p_ingrediente_principal;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_todas_las_recetas
DROP PROCEDURE IF EXISTS `obtener_todas_las_recetas`;
DELIMITER //
CREATE PROCEDURE `obtener_todas_las_recetas`()
BEGIN
		SELECT * 
		FROM receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_comentarios_receta
DROP PROCEDURE IF EXISTS `obtener_total_comentarios_receta`;
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
DROP PROCEDURE IF EXISTS `obtener_total_favoritos_usuario`;
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
DROP PROCEDURE IF EXISTS `obtener_total_pedidos_usuario`;
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
DROP TABLE IF EXISTS `pago`;
CREATE TABLE IF NOT EXISTS `pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `monto` int DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `FK_pago_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pago: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.pedido
DROP TABLE IF EXISTS `pedido`;
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_receta` int DEFAULT NULL,
  `precio` decimal(20,6) DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_pedido` int DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_espec` (`id_receta`) USING BTREE,
  CONSTRAINT `FK_pedido_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_pedido_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pedido: ~0 rows (aproximadamente)

-- Volcando estructura para tabla pa_la_olla.receta
DROP TABLE IF EXISTS `receta`;
CREATE TABLE IF NOT EXISTS `receta` (
  `id_receta` int NOT NULL AUTO_INCREMENT,
  `nombre_receta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion_receta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `imagen_receta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ingrediente_principal` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `alergenos_receta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `rango_tiempo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `rango_porciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `rango_precio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `niveles` json DEFAULT NULL,
  `video` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_receta`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.receta: ~15 rows (aproximadamente)
INSERT INTO `receta` (`id_receta`, `nombre_receta`, `descripcion_receta`, `imagen_receta`, `ingrediente_principal`, `alergenos_receta`, `rango_tiempo`, `rango_porciones`, `rango_precio`, `niveles`, `video`) VALUES
	(1, 'Sancocho Panameño', 'El sancocho panameño es el plato nacional por excelencia. Esta sopa espesa es una mezcla reconfortante de gallina de patio, ñame y culantro.', 'https://static.wixstatic.com/media/a91788_0d896c6daa814dfbac85c18650e70f5e~mv2.jpg', 'Pollo', 'Ninguno', '5-55 minutos', '2-6', 'B/.6 - B/.26', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "45 minutos", "paso_a_paso": ["Lavar la gallina, pelar y cortar el ñame, y picar los vegetales.", "Colocar la gallina y el agua en una olla y hervir por 15 minutos.", "Agregar el ñame, ajo y ají, y cocinar por 30 minutos más.", "Incorporar el culantro y apagar el fuego para servir."]}, "4_personas": {"precio": "B/.11", "tiempo": "45 minutos", "paso_a_paso": ["Lavar y picar todos los ingredientes.", "Hervir la gallina por 20 minutos.", "Agregar el ñame, ajo y ají, y cocinar por 25 minutos más.", "Añadir el culantro, mezclar bien y servir."]}, "6_personas": {"precio": "B/.16", "tiempo": "55 minutos", "paso_a_paso": ["Lavar y pelar todo.", "Hervir la gallina en agua con sal por 25 minutos.", "Agregar el ñame y los vegetales, y cocinar por 30 minutos más.", "Finalizar con el culantro y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "30 minutos", "paso_a_paso": ["Colocar la gallina en una olla mediana con el agua sazonada y llevar a ebullición.", "Agregar el ñame, ajo y ají. Tapar.", "Cocinar a fuego medio por 30 minutos o hasta que el ñame esté suave.", "Agregar el culantro picado antes de apagar el fuego y servir."]}, "4_personas": {"precio": "B/.13", "tiempo": "35 minutos", "paso_a_paso": ["En una olla grande, hervir el pollo con el agua.", "Añadir ñame, ajo y ají.", "Cocinar por 35 minutos.", "Agregar culantro, mezclar bien y servir."]}, "6_personas": {"precio": "B/.18", "tiempo": "40 minutos", "paso_a_paso": ["Colocar todos los ingredientes en una olla grande excepto el culantro.", "Cocinar por 40 minutos.", "Agregar culantro al final para resaltar el sabor y servir."]}}, "principiante": {"2_personas": {"precio": "B/.10", "tiempo": "5 minutos", "paso_a_paso": ["Sacar del refrigerador y dejar a temperatura ambiente por 10 minutos.", "Perforar el empaque o verter en un recipiente apto para microondas.", "Calentar 5 minutos a potencia alta.", "Remover y dejar reposar 1 minuto antes de servir."]}, "4_personas": {"precio": "B/.18", "tiempo": "8 minutos", "paso_a_paso": ["Calentar por 8 minutos a potencia alta.", "Remover y dejar reposar 1-2 minutos antes de servir."]}, "6_personas": {"precio": "B/.26", "tiempo": "10 minutos", "paso_a_paso": ["Calentar por 10 minutos.", "Revolver a mitad de tiempo.", "Servir en platos hondos con arroz blanco."]}}}', NULL),
	(2, 'Arroz con Pollo Panameño', 'Este plato combina arroz cocido con pollo tierno, sofrito criollo y condimentos típicos como achiote y culantro, que le dan su característico color y sabor.', 'https://assets.unileversolutions.com/v1/113852387.jpg', 'Pollo', 'Ninguno', '5-40 minutos', '2-6', 'B/.6 - B/.23', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "30 minutos", "paso_a_paso": ["Lavar, picar y sofreír el pollo.", "Agregar cebolla, ajo y ají.", "Añadir achiote y el arroz lavado.", "Incorporar agua o caldo y sazonar.", "Cocinar tapado a fuego bajo por 30 minutos.", "Agregar culantro, reposar 5 minutos y servir."]}, "4_personas": {"precio": "B/.11", "tiempo": "35 minutos", "paso_a_paso": ["Picar y sofreír el pollo.", "Añadir cebolla, ajo y ají.", "Incorporar achiote y arroz.", "Cocinar con caldo por 35 minutos.", "Añadir culantro al final y reposar."]}, "6_personas": {"precio": "B/.16", "tiempo": "40 minutos", "paso_a_paso": ["Dorar el pollo, sofreír verduras y achiote.", "Añadir el arroz y el líquido.", "Cocinar por 40 minutos.", "Añadir culantro y reposar antes de servir."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "20 minutos", "paso_a_paso": ["Sofreír el pollo hasta dorar.", "Añadir cebolla, ajo, ají y sofreír.", "Agregar achiote y mezclar.", "Incorporar el arroz y luego el caldo.", "Cocinar tapado a fuego bajo por 20 minutos.", "Añadir culantro, reposar 5 minutos y servir."]}, "4_personas": {"precio": "B/.13", "tiempo": "25 minutos", "paso_a_paso": ["Sofríe el pollo hasta dorar.", "Añade cebolla, ajo y ají.", "Agrega el achiote, el arroz y mezcla.", "Vierte el caldo, sazona y cocina tapado por 25 minutos.", "Añade culantro, deja reposar y sirve."]}, "6_personas": {"precio": "B/.18", "tiempo": "30 minutos", "paso_a_paso": ["Dorar el pollo.", "Sofreír verduras y achiote.", "Añadir arroz y mezclar.", "Cocinar con caldo por 30 minutos.", "Añadir culantro al final, reposar 5 minutos y servir."]}}, "principiante": {"2_personas": {"precio": "B/.9", "tiempo": "5 minutos", "paso_a_paso": ["Dejar la porción a temperatura ambiente por 10 minutos.", "Perforar el empaque o verter en un recipiente para microondas.", "Calentar 5 minutos a potencia alta.", "Remover bien, dejar reposar 1-2 minutos y servir."]}, "4_personas": {"precio": "B/.16", "tiempo": "8 minutos", "paso_a_paso": ["Calentar por 8 minutos en microondas a potencia alta.", "Remover a mitad de tiempo.", "Dejar reposar 2 minutos antes de servir."]}, "6_personas": {"precio": "B/.23", "tiempo": "10 minutos", "paso_a_paso": ["Calentar por 10 minutos.", "Remover a los 5 minutos.", "Servir caliente."]}}}', NULL),
	(3, 'Arroz con Chorizo Tableño', 'Plato tradicional de la región de Los Santos, conocido por su sabor intenso y su particular chorizo ahumado.', 'https://www.recetaspanama.com/base/stock/Recipe/arroz-con-chorizo-tableno-y-ajies-dulces/arroz-con-chorizo-tableno-y-ajies-dulces_web.jpg.webp', 'Cerdo', 'Contiene cerdo.', '5-40 minutos', '2-6', 'B/.6 - B/.23', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "30 minutos", "paso_a_paso": ["Cortar chorizo y picar verduras.", "Sofreír el chorizo y luego las verduras.", "Incorporar el arroz y mezclar.", "Verter el caldo, sazonar y cocinar tapado por 30 minutos.", "Dejar reposar 5 minutos y servir."]}, "4_personas": {"precio": "B/.11", "tiempo": "35 minutos", "paso_a_paso": ["Sofríe el chorizo y luego las verduras.", "Agrega el arroz.", "Cocina con caldo por 35 minutos.", "Reposar antes de servir."]}, "6_personas": {"precio": "B/.16", "tiempo": "40 minutos", "paso_a_paso": ["Dorar el chorizo.", "Sofreír las verduras.", "Añadir el arroz y el líquido.", "Cocinar por 40 minutos.", "Reposar y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "20 minutos", "paso_a_paso": ["Sofreír el chorizo hasta que dore.", "Añadir cebolla, ajo y ají.", "Agregar el arroz y mezclar.", "Verter el caldo, sazonar y cocinar tapado por 20 minutos.", "Dejar reposar 5 minutos y servir."]}, "4_personas": {"precio": "B/.13", "tiempo": "25 minutos", "paso_a_paso": ["Sofríe el chorizo.", "Añade las verduras y cocina.", "Incorpora el arroz y el caldo.", "Cocina por 25 minutos tapado.", "Reposar y servir."]}, "6_personas": {"precio": "B/.18", "tiempo": "30 minutos", "paso_a_paso": ["Dorar el chorizo.", "Sofreír las verduras.", "Añadir arroz y el líquido.", "Cocinar por 30 minutos.", "Reposar antes de servir."]}}, "principiante": {"2_personas": {"precio": "B/.9", "tiempo": "5 minutos", "paso_a_paso": ["Dejar la porción a temperatura ambiente por 10 minutos.", "Calentar en microondas por 5 minutos, revolviendo a mitad de tiempo.", "Dejar reposar 1 minuto y servir."]}, "4_personas": {"precio": "B/.16", "tiempo": "8 minutos", "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Dejar reposar 2 minutos antes de servir."]}, "6_personas": {"precio": "B/.23", "tiempo": "10 minutos", "paso_a_paso": ["Calentar por 10 minutos, removiendo a los 5 minutos.", "Servir caliente."]}}}', NULL),
	(4, 'Carimañolas', 'Bolas de yuca de origen afrocaribeño, rellenas de carne y fritas hasta obtener una textura dorada y crujiente.', 'https://ethnicspoon.com/wp-content/uploads/2020/04/carimanolas-sq-500x375.jpg', 'res', 'Contiene carne (res o pollo).', '3-15 minutos', '2-6', 'B/.5 - B/.20', '{"avanzado": {"2_personas": {"precio": "B/.5", "tiempo": "5-7 minutos", "paso_a_paso": ["Pelar, rallar la yuca y escurrir.", "Sazonar la carne cruda con ajo y cebolla.", "Formar las bolas de yuca y rellenar.", "Freír por 5-7 minutos hasta dorar.", "Escurrir y servir."]}, "4_personas": {"precio": "B/.10", "tiempo": "5-7 minutos", "paso_a_paso": ["Rallar y preparar la yuca, sazonar la carne.", "Formar y freír las carimañolas en tandas.", "Servir calientes."]}, "6_personas": {"precio": "B/.15", "tiempo": "5-7 minutos", "paso_a_paso": ["Repetir el proceso para mayor cantidad.", "Freír con cuidado y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.6", "tiempo": "5-7 minutos", "paso_a_paso": ["Formar bolas con la yuca rallada y rellenar con carne.", "Cerrar bien las bolas.", "Freír en aceite caliente por 5-7 minutos hasta dorar.", "Escurrir y servir."]}, "4_personas": {"precio": "B/.11", "tiempo": "5-7 minutos", "paso_a_paso": ["Armar las carimañolas.", "Freír en tandas de 4-5 piezas hasta dorar.", "Escurrir y servir calientes."]}, "6_personas": {"precio": "B/.16", "tiempo": "5-7 minutos", "paso_a_paso": ["Repetir el proceso de armado.", "Freír en tandas para mantener la temperatura.", "Servir calientes."]}}, "principiante": {"2_personas": {"precio": "B/.8", "tiempo": "3-8 minutos", "paso_a_paso": ["Dejar a temperatura ambiente por 10 minutos.", "Calentar en microondas (3-4 min) o en horno a 180°C (8 min).", "Servir caliente."]}, "4_personas": {"precio": "B/.14", "tiempo": "6-12 minutos", "paso_a_paso": ["Calentar en microondas (6-7 min) o en horno (10-12 min).", "Servir calientes."]}, "6_personas": {"precio": "B/.20", "tiempo": "9-15 minutos", "paso_a_paso": ["Calentar en microondas (9-10 min) o en horno (15 min).", "Servir calientes."]}}}', NULL),
	(5, 'Mondongo Panameño', 'Guiso tradicional hecho con tripas de res, cocidas lentamente en un caldo especiado con verduras y hierbas locales.', 'https://productosdeldia.com/cdn/shop/articles/Receta_de_Mondongo_Panameno.jpg', 'res', 'Contiene tripas de res.', '5 minutos - 2 horas', '2-6', 'B/.7 - B/.28', '{"avanzado": {"2_personas": {"precio": "B/.7", "tiempo": "1 hora 30 minutos", "paso_a_paso": ["Limpiar bien las tripas con sal y vinagre.", "Cortar tripas y picar verduras.", "Sofreír verduras, añadir tripas y dorar.", "Incorporar zanahoria, caldo y condimentos.", "Cocinar tapado por 1h 30 min.", "Añadir culantro y servir."]}, "4_personas": {"precio": "B/.13", "tiempo": "1 hora 45 minutos", "paso_a_paso": ["Limpiar las tripas.", "Sofreír verduras y tripas.", "Cocinar por 1h 45 min.", "Añadir culantro y servir."]}, "6_personas": {"precio": "B/.19", "tiempo": "2 horas", "paso_a_paso": ["Repetir el proceso de limpieza y cocción.", "Cocinar por 2 horas.", "Añadir culantro y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.8", "tiempo": "1 hora", "paso_a_paso": ["Sofreír ajo, cebolla y ají.", "Añadir las tripas y dorar.", "Agregar zanahoria, caldo y condimentos.", "Cocinar tapado por 1 hora.", "Incorporar culantro al final y servir."]}, "4_personas": {"precio": "B/.15", "tiempo": "1 hora 15 minutos", "paso_a_paso": ["Sofreír ajo, cebolla, ají.", "Dorar tripas.", "Añadir verduras, caldo y cocinar por 1h 15 min.", "Añadir culantro al final."]}, "6_personas": {"precio": "B/.22", "tiempo": "1 hora 30 minutos", "paso_a_paso": ["Repetir el proceso en una olla grande.", "Cocinar por 1 hora 30 minutos.", "Añadir culantro y servir."]}}, "principiante": {"2_personas": {"precio": "B/.11", "tiempo": "5 minutos", "paso_a_paso": ["Dejar a temperatura ambiente por 10 minutos.", "Calentar en microondas por 5 minutos, removiendo a mitad de tiempo.", "Dejar reposar y servir."]}, "4_personas": {"precio": "B/.20", "tiempo": "8 minutos", "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Reposar 2 minutos y servir."]}, "6_personas": {"precio": "B/.28", "tiempo": "10 minutos", "paso_a_paso": ["Calentar por 10 minutos, removiendo a mitad de tiempo.", "Servir con acompañantes."]}}}', NULL),
	(6, 'Ropa Vieja Panameña', 'Plato tradicional elaborado con carne de res deshebrada en una salsa rica y aromática a base de tomate, cebolla y pimientos.', 'https://i0.wp.com/www.buenossaborespanama.com/wp-content/uploads/2024/11/beef-shredded-meat-with-sauce-in-black-pan-grey-b-2024-10-13-04-51-35-utc-scaled.jpg', 'res', 'No contiene gluten ni lácteos.', '5-105 minutos', '2-6', 'B/.7 - B/.26', '{"avanzado": {"2_personas": {"precio": "B/.7", "tiempo": "1 hora 30 minutos", "paso_a_paso": ["Cocinar la falda de res en agua con sal por 1 hora y deshebrar.", "Picar y sofreír las verduras.", "Añadir la carne, el agua o caldo y sazonar.", "Cocinar a fuego bajo por 30 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.13", "tiempo": "1 hora 40 minutos", "paso_a_paso": ["Cocinar y deshebrar la falda.", "Sofreír las verduras.", "Añadir la carne y el líquido.", "Cocinar por 40 minutos y servir."]}, "6_personas": {"precio": "B/.18", "tiempo": "1 hora 45 minutos", "paso_a_paso": ["Cocinar y deshebrar la falda.", "Sofreír las verduras.", "Añadir la carne y el líquido.", "Cocinar por 45 minutos y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.8", "tiempo": "15-20 minutos", "paso_a_paso": ["Sofreír cebolla, ajo, pimiento y tomate.", "Añadir la carne deshebrada y mezclar.", "Verter el caldo, sazonar y cocinar por 15-20 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.15", "tiempo": "25 minutos", "paso_a_paso": ["Sofreír las verduras.", "Agregar la carne y el caldo.", "Cocinar por 25 minutos y servir."]}, "6_personas": {"precio": "B/.22", "tiempo": "30 minutos", "paso_a_paso": ["Sofreír las verduras.", "Añadir la carne y el caldo.", "Cocinar por 30 minutos y servir."]}}, "principiante": {"2_personas": {"precio": "B/.10", "tiempo": "5 minutos", "paso_a_paso": ["Dejar a temperatura ambiente por 10 minutos.", "Calentar en microondas por 5 minutos, removiendo a mitad de tiempo.", "Dejar reposar 1-2 minutos y servir."]}, "4_personas": {"precio": "B/.18", "tiempo": "8 minutos", "paso_a_paso": ["Calentar por 8 minutos en microondas, removiendo a los 4 minutos.", "Reposar 2 minutos y servir."]}, "6_personas": {"precio": "B/.26", "tiempo": "10 minutos", "paso_a_paso": ["Calentar por 10 minutos, removiendo a mitad de tiempo.", "Servir con acompañamientos."]}}}', NULL),
	(7, 'Hojaldre', 'Pan frito muy popular en Panamá, hecho con una masa suave que al freírse se vuelve dorada y crujiente.', 'https://www.recetaspanama.com/base/stock/Recipe/hojaldras/hojaldras_web.jpg.webp', 'otros', 'Contiene gluten.', '2-33 minutos', '2-6', 'B/.3 - B/.14', '{"avanzado": {"2_personas": {"precio": "B/.3", "tiempo": "33 minutos", "paso_a_paso": ["Mezclar harina, azúcar y sal.", "Añadir manteca y luego agua hasta formar una masa.", "Reposar la masa por 30 minutos en refrigerador.", "Extender, cortar y freír por 2-3 minutos por lado.", "Escurrir y servir."]}, "4_personas": {"precio": "B/.6", "tiempo": "33 minutos", "paso_a_paso": ["Mezclar ingredientes secos, incorporar manteca y agua.", "Amasar, reposar, cortar y freír.", "Servir."]}, "6_personas": {"precio": "B/.9", "tiempo": "33 minutos", "paso_a_paso": ["Repetir el proceso en mayor cantidad.", "Freír por tandas y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.4", "tiempo": "2-3 minutos", "paso_a_paso": ["Calentar aceite en una sartén.", "Freír los círculos de masa por 2-3 minutos por lado.", "Escurrir y servir."]}, "4_personas": {"precio": "B/.7", "tiempo": "2-3 minutos", "paso_a_paso": ["Freír en tandas.", "Escurrir y servir."]}, "6_personas": {"precio": "B/.10", "tiempo": "2-3 minutos", "paso_a_paso": ["Freír en tandas.", "Servir calientes."]}}, "principiante": {"2_personas": {"precio": "B/.6", "tiempo": "2-3 minutos", "paso_a_paso": ["Dejar a temperatura ambiente por 10 minutos.", "Calentar en microondas (2-3 min) o en sartén.", "Servir calientes."]}, "4_personas": {"precio": "B/.10", "tiempo": "4-5 minutos", "paso_a_paso": ["Calentar en microondas por 4-5 minutos o en sartén.", "Servir calientes."]}, "6_personas": {"precio": "B/.14", "tiempo": "6-7 minutos", "paso_a_paso": ["Calentar en microondas por 6-7 minutos o en sartén.", "Servir calientes."]}}}', NULL),
	(8, 'Gallo Pinto Chiricano', 'Receta típica de Chiriquí a base de arroz y porotos rojos, con un sabor criollo por su sofrito.', 'https://www.recetaspanama.com/base/stock/Post/17-image/17-image_small.jpg.webp', 'otros', 'Ninguno', '5-132 minutos', '2-6', 'B/.3 - B/.15', '{"avanzado": {"2_personas": {"precio": "B/.3", "tiempo": "88 minutos", "paso_a_paso": ["Remojar porotos 8h y hervirlos 1h.", "Cocinar el arroz (20 min).", "Sofreír ajo y cebolla.", "Mezclar todo, añadir culantro y condimentos.", "Cocinar junto por 8 minutos."]}, "4_personas": {"precio": "B/.5", "tiempo": "110 minutos", "paso_a_paso": ["Remojar porotos 8h y hervir 1h 15 min.", "Cocinar el arroz.", "Picar y sofreír vegetales.", "Mezclar todo y cocinar por 10 minutos más."]}, "6_personas": {"precio": "B/.7", "tiempo": "132 minutos", "paso_a_paso": ["Remojar porotos 8h y cocinarlos 1h 30 min.", "Cocinar el arroz.", "Picar y sofreír vegetales.", "Mezclar todo y cocinar por 12 minutos más."]}}, "intermedio": {"2_personas": {"precio": "B/.4", "tiempo": "6 minutos", "paso_a_paso": ["Calentar aceite y sofreír ajo y cebolla.", "Incorporar arroz y porotos cocidos.", "Mezclar y agregar culantro y condimentos.", "Cocinar por 6 minutos y servir."]}, "4_personas": {"precio": "B/.7", "tiempo": "8 minutos", "paso_a_paso": ["Sofríe el ajo y la cebolla.", "Añade el arroz y los porotos, y mezcla.", "Incorpora culantro, condimenta y cocina por 8 minutos."]}, "6_personas": {"precio": "B/.10", "tiempo": "10 minutos", "paso_a_paso": ["Sofríe el ajo y la cebolla.", "Incorpora arroz y porotos.", "Mezcla con culantro, sazona y cocina por 10 minutos."]}}, "principiante": {"2_personas": {"precio": "B/.6", "tiempo": "5 minutos", "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar por 4 minutos, revolver y calentar 1 minuto más.", "Dejar reposar y servir."]}, "4_personas": {"precio": "B/.11", "tiempo": "7 minutos", "paso_a_paso": ["Calentar en microondas por 7 minutos, removiendo cada 2 minutos.", "Dejar reposar y servir."]}, "6_personas": {"precio": "B/.15", "tiempo": "10 minutos", "paso_a_paso": ["Calentar en microondas por 10 minutos, revolviendo cada 3 minutos.", "Dejar reposar y servir."]}}}', NULL),
	(9, 'Arroz con Coco', 'Plato popular en la costa Caribeña, consiste en arroz cocido en leche de coco fresca, resultando en un acompañante dulce y cremoso.', 'https://blog.superxtra.com/wp-content/uploads/2023/02/blog-arroz-con-coco-1.png', 'otros', 'Contiene coco.', '5-35 minutos', '2-6', 'B/.5 - B/.19', '{"avanzado": {"2_personas": {"precio": "B/.5", "tiempo": "25-30 minutos", "paso_a_paso": ["Extraer la leche de coco fresca.", "Mezclar con agua, azúcar y sal, y calentar.", "Añadir arroz crudo y mezclar.", "Cocinar tapado a fuego bajo por 25-30 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.10", "tiempo": "30 minutos", "paso_a_paso": ["Extraer leche de coco.", "Mezclar líquidos y azúcar.", "Cocinar arroz tapado por 30 minutos.", "Servir."]}, "6_personas": {"precio": "B/.14", "tiempo": "35 minutos", "paso_a_paso": ["Mismo procedimiento en mayor cantidad.", "Cocinar hasta que esté tierno y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.6", "tiempo": "20-25 minutos", "paso_a_paso": ["Mezclar leche de coco, agua, azúcar y sal, y calentar.", "Añadir el arroz lavado.", "Reducir fuego, tapar y cocinar por 20-25 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.11", "tiempo": "30 minutos", "paso_a_paso": ["Calentar líquidos y azúcar.", "Agregar arroz.", "Cocinar tapado por 30 minutos.", "Servir."]}, "6_personas": {"precio": "B/.15", "tiempo": "35 minutos", "paso_a_paso": ["Repetir el proceso en mayor cantidad.", "Cocinar hasta que el arroz esté tierno y servir."]}}, "principiante": {"2_personas": {"precio": "B/.8", "tiempo": "5 minutos", "paso_a_paso": ["Dejar a temperatura ambiente 10 minutos.", "Calentar en microondas 4-5 minutos, removiendo a mitad de tiempo.", "Reposar 2 minutos y servir."]}, "4_personas": {"precio": "B/.14", "tiempo": "7 minutos", "paso_a_paso": ["Calentar 7 minutos en microondas, removiendo a mitad de tiempo.", "Reposar 2 minutos y servir."]}, "6_personas": {"precio": "B/.19", "tiempo": "9 minutos", "paso_a_paso": ["Calentar 9 minutos, removiendo a mitad de tiempo.", "Servir caliente."]}}}', NULL),
	(10, 'Tamal de Olla Panameño', 'Variante práctica del tamal tradicional, se cocina en una cazuela sin perder el sabor clásico del maíz, pollo, pasitas y aceitunas.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/5c2408c3ff31cd93357c198278ff02e1.jpg', 'Pollo', 'Maíz, pasitas (sulfitos).', '5-60 minutos', '2-6', 'B/.6 - B/.25', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "40 minutos", "paso_a_paso": ["Cocinar y desmenuzar el pollo (25 min).", "Licuar y sofreír el sofrito.", "Añadir pollo, pasitas y aceitunas.", "Agregar la masa y condimentos.", "Cocinar a fuego bajo por 40 minutos, removiendo."]}, "4_personas": {"precio": "B/.11", "tiempo": "50 minutos", "paso_a_paso": ["Cocinar pollo, hacer sofrito y preparar masa.", "Mezclar todo y cocinar por 50 minutos."]}, "6_personas": {"precio": "B/.15", "tiempo": "60 minutos", "paso_a_paso": ["Repetir el proceso.", "Cocinar a fuego bajo durante 1 hora y servir."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "25 minutos", "paso_a_paso": ["Sofreír el sofrito por 3 minutos.", "Agregar pollo, pasitas, aceitunas y achiote.", "Incorporar la masa sazonada, mezclar.", "Cocinar tapado por 25 minutos, revolviendo ocasionalmente."]}, "4_personas": {"precio": "B/.13", "tiempo": "35 minutos", "paso_a_paso": ["Sofreír el sofrito.", "Añadir pollo, pasitas y aceitunas.", "Incorporar la masa y cocinar tapado por 35 minutos."]}, "6_personas": {"precio": "B/.18", "tiempo": "45 minutos", "paso_a_paso": ["Mismo procedimiento.", "Cocinar tapado durante 45 minutos hasta que espese."]}}, "principiante": {"2_personas": {"precio": "B/.10", "tiempo": "5 minutos", "paso_a_paso": ["Colocar en un plato para microondas.", "Calentar durante 5 minutos a potencia media-alta.", "Dejar reposar 2 minutos y servir."]}, "4_personas": {"precio": "B/.18", "tiempo": "9 minutos", "paso_a_paso": ["Calentar en microondas por 9 minutos, revolviendo a mitad de tiempo.", "Dejar reposar 3 minutos y servir."]}, "6_personas": {"precio": "B/.25", "tiempo": "12 minutos", "paso_a_paso": ["Calentar durante 12 minutos a potencia media-alta.", "Dejar reposar 3 minutos y servir."]}}}', NULL),
	(11, 'Bistec Picado a lo Panameño', 'Joya de las fondas panameñas, con carne de res cortada en trozos y cocida en su jugo con cebolla, tomate y pimentón.', 'https://i.ytimg.com/vi/P2wwqiYAMss/maxresdefault.jpg', 'res', 'Ninguno', '5-30 minutos', '2-6', 'B/.6 - B/.25', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "20 minutos", "paso_a_paso": ["Cortar la carne y picar las verduras.", "Sofreír los vegetales.", "Añadir la carne y cocinar por 15-20 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.11", "tiempo": "25 minutos", "paso_a_paso": ["Cortar y preparar todo.", "Cocinar por 25 minutos.", "Servir con arroz."]}, "6_personas": {"precio": "B/.16", "tiempo": "30 minutos", "paso_a_paso": ["Mismo procedimiento.", "Cocinar por 30 minutos hasta que esté suave.", "Servir."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "15 minutos", "paso_a_paso": ["Sofreír ajo, cebolla y pimiento.", "Añadir la carne sazonada y cocinar 5 minutos.", "Incorporar el tomate y cocinar por 10 minutos más.", "Servir caliente."]}, "4_personas": {"precio": "B/.13", "tiempo": "20 minutos", "paso_a_paso": ["Sofreír los vegetales.", "Añadir la carne y cocinar por 15-20 minutos.", "Servir."]}, "6_personas": {"precio": "B/.18", "tiempo": "25 minutos", "paso_a_paso": ["Sofreír todo y añadir la carne.", "Cocinar por 25 minutos y servir."]}}, "principiante": {"2_personas": {"precio": "B/.10", "tiempo": "5 minutos", "paso_a_paso": ["Calentar en microondas durante 5 minutos, revolviendo a la mitad.", "Servir caliente."]}, "4_personas": {"precio": "B/.18", "tiempo": "9 minutos", "paso_a_paso": ["Calentar durante 9 minutos, removiendo a los 4.", "Servir."]}, "6_personas": {"precio": "B/.25", "tiempo": "12 minutos", "paso_a_paso": ["Calentar durante 12 minutos, removiendo a mitad de tiempo.", "Servir caliente."]}}}', NULL),
	(12, 'Guacho de Mariscos', 'Arroz caldoso que combina mariscos frescos en una base de sofrito criollo, culantro y caldo, típico del Caribe panameño.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/561170d165f68568cccfb6b21b3e2442.png', 'Mariscos', 'Mariscos (camarones, calamares, almejas).', '5-40 minutos', '2-6', 'B/.7 - B/.30', '{"avanzado": {"2_personas": {"precio": "B/.7", "tiempo": "30 minutos", "paso_a_paso": ["Picar y sofreír los vegetales por 3 minutos.", "Añadir mariscos crudos y dorar por 2 minutos.", "Agregar el arroz, mezclar e incorporar caldo.", "Cocinar por 30 minutos, revolviendo.", "Añadir culantro y servir."]}, "4_personas": {"precio": "B/.13", "tiempo": "35 minutos", "paso_a_paso": ["Picar vegetales, sofreír, dorar mariscos, añadir arroz y caldo.", "Cocinar durante 35 minutos, removiendo."]}, "6_personas": {"precio": "B/.18", "tiempo": "40 minutos", "paso_a_paso": ["Repetir el proceso con más ingredientes.", "Cocinar durante 40 minutos hasta cremoso."]}}, "intermedio": {"2_personas": {"precio": "B/.9", "tiempo": "25 minutos", "paso_a_paso": ["Sofreír el sofrito por 2-3 minutos.", "Agregar los mariscos sazonados y cocinar por 2 minutos.", "Añadir el arroz y el caldo.", "Cocinar por 20-25 minutos, removiendo.", "Servir caliente."]}, "4_personas": {"precio": "B/.17", "tiempo": "30 minutos", "paso_a_paso": ["Sofreír el sofrito, añadir mariscos y dorar.", "Agregar arroz y caldo.", "Cocinar durante 30 minutos, revolviendo."]}, "6_personas": {"precio": "B/.23", "tiempo": "35 minutos", "paso_a_paso": ["Sofreír, cocinar mariscos, añadir arroz y caldo.", "Cocinar por 35 minutos a fuego medio, removiendo."]}}, "principiante": {"2_personas": {"precio": "B/.12", "tiempo": "5 minutos", "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar por 5 minutos, revolviendo a los 2 minutos.", "Dejar reposar 1 minuto y servir."]}, "4_personas": {"precio": "B/.22", "tiempo": "9 minutos", "paso_a_paso": ["Calentar en microondas por 9 minutos, removiendo a mitad de tiempo.", "Reposar 2 minutos y servir."]}, "6_personas": {"precio": "B/.30", "tiempo": "12 minutos", "paso_a_paso": ["Calentar durante 12 minutos, removiendo a los 6 minutos.", "Servir caliente."]}}}', NULL),
	(13, 'Lengua en Salsa Panameña', 'Plato tradicional con lengua de res cocida lentamente hasta quedar suave, bañada en una salsa criolla de tomate, cebolla y pimentón.', 'https://www.recetaspanama.com/base/stock/Recipe/lengua-en-salsa/lengua-en-salsa_web.jpg.webp', 'res', 'Ninguno', '6-145 minutos', '2-6', 'B/.7 - B/.30', '{"avanzado": {"2_personas": {"precio": "B/.7", "tiempo": "105 minutos", "paso_a_paso": ["Lavar y hervir la lengua por 1h 30 min hasta ablandar.", "Pelar y rebanar la lengua.", "Sofreír vegetales y condimentos.", "Añadir la lengua y cocinar por 15 minutos en la salsa."]}, "4_personas": {"precio": "B/.13", "tiempo": "110 minutos", "paso_a_paso": ["Hervir la lengua, rebanar, preparar sofrito y salsa.", "Cocinar todo junto por 20 minutos."]}, "6_personas": {"precio": "B/.18", "tiempo": "145 minutos", "paso_a_paso": ["Cocinar lengua por 2 horas si es necesario.", "Terminar con sofrito y cocción final de 25 minutos."]}}, "intermedio": {"2_personas": {"precio": "B/.9", "tiempo": "12 minutos", "paso_a_paso": ["Sofreír ajo, cebolla y pimentón.", "Agregar tomate, salsa de tomate y condimentos.", "Añadir la lengua cocida y cocinar tapado por 10-12 minutos.", "Servir caliente."]}, "4_personas": {"precio": "B/.17", "tiempo": "15 minutos", "paso_a_paso": ["Sofreír vegetales y condimentos.", "Añadir lengua y cocinar por 15 minutos."]}, "6_personas": {"precio": "B/.23", "tiempo": "20 minutos", "paso_a_paso": ["Mismo proceso con proporciones mayores.", "Cocinar a fuego medio por 20 minutos."]}}, "principiante": {"2_personas": {"precio": "B/.12", "tiempo": "6 minutos", "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar por 6 minutos, revolviendo a los 3 minutos.", "Dejar reposar y servir."]}, "4_personas": {"precio": "B/.22", "tiempo": "10 minutos", "paso_a_paso": ["Calentar durante 10 minutos, revolviendo a mitad de tiempo.", "Dejar reposar y servir."]}, "6_personas": {"precio": "B/.30", "tiempo": "13 minutos", "paso_a_paso": ["Calentar durante 13 minutos, removiendo a los 6.", "Servir caliente."]}}}', NULL),
	(14, 'Bofe Guisado Panameño', 'Plato popular del interior hecho con pulmón de res (bofe), guisado con vegetales en una sabrosa salsa criolla.', 'https://www.ladona.com.pa/ladona/uploads/recipe/image/236/1739994136.jpg', 'res', 'Ninguno', '6-115 minutos', '2-6', 'B/.5 - B/.21', '{"avanzado": {"2_personas": {"precio": "B/.5", "tiempo": "75 minutos", "paso_a_paso": ["Lavar y hervir el bofe en agua con sal por 1 hora.", "Picar el bofe y los vegetales.", "Sofreír los vegetales.", "Agregar el bofe, salsa y condimentos, y cocinar por 15 minutos."]}, "4_personas": {"precio": "B/.9", "tiempo": "110 minutos", "paso_a_paso": ["Limpiar y cocinar el bofe durante 1 hora y media.", "Picar y sofreír vegetales, incorporar carne y cocinar por 20 minutos."]}, "6_personas": {"precio": "B/.13", "tiempo": "115 minutos", "paso_a_paso": ["Lavar, cocinar y picar el bofe.", "Preparar sofrito y cocinar todo junto durante 25 minutos."]}}, "intermedio": {"2_personas": {"precio": "B/.6", "tiempo": "15 minutos", "paso_a_paso": ["Sofreír ajo, cebolla y pimentón.", "Añadir tomate.", "Incorporar el bofe cocido y picado.", "Agregar salsa de tomate, condimentos y cocinar por 15 minutos."]}, "4_personas": {"precio": "B/.11", "tiempo": "20 minutos", "paso_a_paso": ["Sofreír vegetales y condimentar.", "Agregar el bofe, mezclar con salsa y cocinar por 20 minutos."]}, "6_personas": {"precio": "B/.16", "tiempo": "25 minutos", "paso_a_paso": ["Mismo proceso: sofreír, agregar ingredientes y cocinar por 25 minutos."]}}, "principiante": {"2_personas": {"precio": "B/.8", "tiempo": "6 minutos", "paso_a_paso": ["Colocar en recipiente para microondas.", "Calentar durante 5-6 minutos.", "Dejar reposar y servir."]}, "4_personas": {"precio": "B/.15", "tiempo": "9 minutos", "paso_a_paso": ["Calentar durante 9 minutos, revolviendo a los 5 minutos.", "Dejar reposar y servir."]}, "6_personas": {"precio": "B/.21", "tiempo": "12 minutos", "paso_a_paso": ["Calentar en microondas durante 12 minutos, removiendo cada 4 minutos.", "Servir caliente."]}}}', NULL),
	(15, 'Fricasé de Pollo al Estilo Panameño', 'Receta clásica de la cocina criolla donde se guisan presas de pollo en una salsa espesa con tomate, vegetales y papas.', 'https://foodmetamorphosis.com/wp-content/uploads/2025/01/puerto-rican-fricase-de-pollo-chicken-fricase.jpg', 'Pollo', 'Ninguno', '6-40 minutos', '2-6', 'B/.6 - B/.24', '{"avanzado": {"2_personas": {"precio": "B/.6", "tiempo": "30 minutos", "paso_a_paso": ["Lavar y sazonar el pollo.", "Sofreír vegetales.", "Añadir el pollo y dorar.", "Agregar papa, salsa, agua y cocinar por 30 minutos."]}, "4_personas": {"precio": "B/.11", "tiempo": "35 minutos", "paso_a_paso": ["Dorar el pollo, añadir sofrito.", "Cocinar todo por 35 minutos y servir."]}, "6_personas": {"precio": "B/.16", "tiempo": "40 minutos", "paso_a_paso": ["Lavar, sazonar y dorar el pollo.", "Preparar sofrito, añadir papas y cocinar todo por 40 minutos."]}}, "intermedio": {"2_personas": {"precio": "B/.7", "tiempo": "15 minutos", "paso_a_paso": ["Sofreír ajo, cebolla, pimentón y tomate.", "Añadir papas, pollo cocido y salsa.", "Agregar agua, condimentar y cocinar por 15 minutos."]}, "4_personas": {"precio": "B/.13", "tiempo": "20 minutos", "paso_a_paso": ["Sofreír vegetales, añadir pollo y salsa.", "Cocinar todo durante 20 minutos.", "Servir caliente."]}, "6_personas": {"precio": "B/.18", "tiempo": "25 minutos", "paso_a_paso": ["Mismo procedimiento con proporciones ajustadas.", "Cocinar a fuego medio durante 25 minutos."]}}, "principiante": {"2_personas": {"precio": "B/.9", "tiempo": "6 minutos", "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar durante 6 minutos, revolviendo a los 3.", "Reposar 1 minuto y servir."]}, "4_personas": {"precio": "B/.17", "tiempo": "10 minutos", "paso_a_paso": ["Calentar durante 10 minutos, removiendo a los 5 minutos.", "Servir caliente."]}, "6_personas": {"precio": "B/.24", "tiempo": "13 minutos", "paso_a_paso": ["Calentar en microondas durante 13 minutos, removiendo cada 4 minutos.", "Servir."]}}}', NULL);

-- Volcando estructura para procedimiento pa_la_olla.registrar_receta
DROP PROCEDURE IF EXISTS `registrar_receta`;
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
DROP PROCEDURE IF EXISTS `registrar_usuario`;
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
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.usuarios: ~1 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `email`, `telefono`, `direccion`, `contrasena`) VALUES
	(9, 'José Macre', 'macremoises@gmail.com', '6845-2603', 'Don Bosco', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');

-- Volcando estructura para procedimiento pa_la_olla.verificar_usuario
DROP PROCEDURE IF EXISTS `verificar_usuario`;
DELIMITER //
CREATE PROCEDURE `verificar_usuario`(
	IN `p_email` VARCHAR(255),
	IN `p_contrasena` VARCHAR(50)
)
BEGIN
    SELECT *
    FROM usuarios
    WHERE email = p_email AND contrasena = SHA2(p_contrasena, 256)
    LIMIT 1;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
