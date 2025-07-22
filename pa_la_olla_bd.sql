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
            contrasena = SHA2(p_contrasena, 256)
        WHERE id_usuario = p_id_usuario;
    ELSE
        UPDATE usuarios
        SET nombre_usuario = p_nombre_usuario,
            email = IF(p_email IS NOT NULL AND p_email != '', p_email, email_actual),
            telefono = p_telefono
        WHERE id_usuario = p_id_usuario;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.agregar_comentario
DROP PROCEDURE IF EXISTS `agregar_comentario`;
DELIMITER //
CREATE PROCEDURE `agregar_comentario`(
	IN `p_id_usuario` INT,
	IN `p_id_receta` INT,
	IN `p_descripcion` TEXT,
	IN `p_calificacion` DECIMAL(20,6)
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
        INSERT INTO comentario (id_usuario, id_receta, descripcion, calificacion, fecha_comentario)
        VALUES (p_id_usuario, p_id_receta, p_descripcion, p_calificacion, CURRENT_TIMESTAMP);
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
  CONSTRAINT `FK_comentario_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comentario_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.comentario: ~0 rows (aproximadamente)
INSERT INTO `comentario` (`id_comentario`, `id_receta`, `id_usuario`, `descripcion`, `calificacion`, `fecha_comentario`) VALUES
	(14, 6, 9, 'Deliciosa', 5.000000, '2025-07-22 00:50:19');

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

-- Volcando estructura para procedimiento pa_la_olla.obtener_ingredientes_principales
DROP PROCEDURE IF EXISTS `obtener_ingredientes_principales`;
DELIMITER //
CREATE PROCEDURE `obtener_ingredientes_principales`()
BEGIN
	SELECT DISTINCT ingrediente_principal FROM receta WHERE ingrediente_principal IS NOT NULL;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_precio_por_niveles
DROP PROCEDURE IF EXISTS `obtener_precio_por_niveles`;
DELIMITER //
CREATE PROCEDURE `obtener_precio_por_niveles`(
	IN `p_id_receta` INT
)
BEGIN
	SELECT
	niveles->'$.principiante."2_personas".precio' AS principiante_2,
	niveles->'$.intermedio."2_personas".precio' AS intermedio_2,
	niveles->'$.avanzado."2_personas".precio' AS avanzado_2,
	niveles->'$.principiante."4_personas".precio' AS principiante_4,
	niveles->'$.intermedio."4_personas".precio' AS intermedio_4,
	niveles->'$.avanzado."4_personas".precio' AS avanzado_4,
	niveles->'$.principiante."6_personas".precio' AS principiante_6,
	niveles->'$.intermedio."6_personas".precio' AS intermedio_6,
	niveles->'$.avanzado."6_personas".precio' AS avanzado_6
	FROM receta r
	WHERE r.id_receta = p_id_receta;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_recetas_populares
DROP PROCEDURE IF EXISTS `obtener_recetas_populares`;
DELIMITER //
CREATE PROCEDURE `obtener_recetas_populares`()
BEGIN
SELECT r.*
FROM receta r
JOIN (
    SELECT p.id_receta
    FROM pedido p
    GROUP BY p.id_receta
    ORDER BY COUNT(*) DESC
    LIMIT 3
) AS populares
ON r.id_receta = populares.id_receta;
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

-- Volcando estructura para procedimiento pa_la_olla.obtener_todos_los_pedidos_por_usuario
DROP PROCEDURE IF EXISTS `obtener_todos_los_pedidos_por_usuario`;
DELIMITER //
CREATE PROCEDURE `obtener_todos_los_pedidos_por_usuario`(
	IN `p_id_usuario` INT
)
BEGIN
	SELECT 
	p.id_pedido,
	p.id_usuario,
	p.id_receta,
	p.orden_paypal,
	p.precio,
	p.receta_nivel,
	p.receta_cantidad,
	p.direccion,
	p.fecha_pedido,
	r.nombre_receta,
	r.descripcion_receta,
	r.niveles,
	r.video
	FROM pedido p
	JOIN receta r ON p.id_receta = r.id_receta 
	WHERE p.id_usuario = p_id_usuario
	ORDER BY p.fecha_pedido desc;
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

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_comentarios_usuario
DROP PROCEDURE IF EXISTS `obtener_total_comentarios_usuario`;
DELIMITER //
CREATE PROCEDURE `obtener_total_comentarios_usuario`(
	IN `p_id_usuario` INT
)
BEGIN
    SELECT COUNT(*) AS total_comentarios
    FROM comentario
    WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.obtener_total_pedidos_usuario
DROP PROCEDURE IF EXISTS `obtener_total_pedidos_usuario`;
DELIMITER //
CREATE PROCEDURE `obtener_total_pedidos_usuario`(
	IN `p_id_usuario` INT
)
BEGIN
    SELECT COUNT(*) AS total_pedidos
    FROM pedido
    WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Volcando estructura para tabla pa_la_olla.pedido
DROP TABLE IF EXISTS `pedido`;
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_receta` int DEFAULT NULL,
  `orden_paypal` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `precio` decimal(20,6) DEFAULT NULL,
  `receta_nivel` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `receta_cantidad` int DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_pedido` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_espec` (`id_receta`) USING BTREE,
  CONSTRAINT `FK_pedido_receta` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_pedido_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pedido: ~5 rows (aproximadamente)
INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `id_receta`, `orden_paypal`, `precio`, `receta_nivel`, `receta_cantidad`, `direccion`, `fecha_pedido`) VALUES
	(9, 10, 2, '90251416EJ539480S', 9.000000, 'principiante', 2, 'El Valle San Isidro Sector 2', '2025-07-21 22:14:27'),
	(10, 10, 4, '21S51432LR420521X', 16.000000, 'intermedio', 6, 'El Valle San Isidro Sector 2', '2025-07-21 22:14:48'),
	(11, 10, 7, '4H627513S56603041', 6.000000, 'avanzado', 4, 'El Valle San Isidro Sector 2', '2025-07-21 22:15:26'),
	(12, 10, 14, '1G688202VX312464X', 13.000000, 'avanzado', 6, 'El Valle San Isidro Sector 2', '2025-07-21 22:16:04'),
	(13, 10, 2, '6R009217A2610381S', 6.000000, 'avanzado', 2, 'El Valle San Isidro Sector 2', '2025-07-21 22:21:09'),
	(14, 9, 6, '6U119655X3990870R', 18.000000, 'principiante', 4, 'Don Bosco', '2025-07-22 00:47:43'),
	(15, 9, 6, '7CA31406E59521629', 13.000000, 'avanzado', 4, 'Don Bosco', '2025-07-22 00:49:00');

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
	(1, 'Sancocho Panameño', 'El sancocho panameño es el plato nacional por excelencia. Esta sopa espesa es una mezcla reconfortante de gallina de patio, ñame y culantro. Es común en festividades, almuerzos familiares y hasta como remedio para la resaca. Su sabor auténtico representa la tradición interiorana y la calidez del hogar panameño.', 'https://static.wixstatic.com/media/a91788_0d896c6daa814dfbac85c18650e70f5e~mv2.jpg', 'Pollo', 'Ninguno', '5-55 minutos', '2-6', '$6 - $26', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lavar la gallina, pelar y cortar el ñame, y picar los vegetales.", "Colocar la gallina y el agua en una olla y hervir por 15 minutos.", "Agregar el ñame, ajo y ají, y cocinar por 30 minutos más.", "Incorporar el culantro y apagar el fuego para servir."], "ingredientes": ["2 muslos de gallina crudos", "1 taza de ñame crudo", "2 dientes de ajo", "1 ají dulce", "1 rama de culantro", "Sal y 2 tazas de agua"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Lavar y picar todos los ingredientes.", "Hervir la gallina 20 minutos.", "Agregar el ñame, ajo y ají. Cocinar 25 minutos más.", "Añadir el culantro, mezclar bien y servir."], "ingredientes": ["4 muslos de gallina", "2 tazas de ñame", "4 dientes de ajo", "2 ajíes dulces", "2 ramas de culantro", "Sal y 4 tazas de agua"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Lavar y pelar todo.", "Hervir la gallina en agua con sal por 25 minutos.", "Agregar el ñame y los vegetales. Cocinar 30 minutos más.", "Finalizar con el culantro. Servir con arroz blanco."], "ingredientes": ["6 presas de gallina", "3 tazas de ñame", "6 dientes de ajo", "3 ajíes dulces", "3 ramas de culantro", "Sal y 6 tazas de agua"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Colocar la gallina en una olla mediana con el agua sazonada y llevar a ebullición.", "Agregar el ñame, ajo y ají. Tapar.", "Cocinar a fuego medio por 30 minutos o hasta que el ñame esté suave.", "Agregar el culantro picado antes de apagar el fuego y servir."], "ingredientes": ["2 muslos de gallina sazonados", "1 taza de ñame pelado y picado", "2 dientes de ajo picados", "1 ají dulce picado", "2 tazas de agua con sal", "1 rama de culantro picado"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["En una olla grande, hervir el pollo con el agua.", "Añadir ñame, ajo y ají. Cocinar 35 minutos.", "Agregar culantro, mezclar bien y servir."], "ingredientes": ["4 muslos de gallina sazonados", "2 tazas de ñame picado", "4 dientes de ajo", "2 ajíes dulces", "4 tazas de agua", "2 ramas de culantro picado"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Colocar todos los ingredientes en una olla grande excepto el culantro.", "Cocinar por 40 minutos.", "Agregar culantro al final para resaltar el sabor y servir."], "ingredientes": ["6 presas de gallina sazonadas", "3 tazas de ñame", "6 dientes de ajo", "3 ajíes dulces", "6 tazas de agua", "3 ramas de culantro"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Sacar del refrigerador y dejar a temperatura ambiente por 10 minutos.", "Perforar el empaque o verter en un recipiente apto para microondas.", "Calentar 5 minutos a potencia alta.", "Remover y dejar reposar 1 minuto antes de servir."], "ingredientes": ["2 porciones empacadas al vacío de sancocho con ñame, gallina, caldo y culantro."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calentar por 8 minutos a potencia alta.", "Remover y dejar reposar 1-2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 26.0, "paso_a_paso": ["Calentar por 10 minutos.", "Revolver a mitad de tiempo.", "Servir en platos hondos con arroz blanco."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/gZw8dgw-erw?si=ARGLA-DhaOEZMDSe'),
	(2, 'Arroz con Pollo Panameño', 'El arroz con pollo es uno de los platos más queridos y representativos de Panamá. Este plato combina arroz cocido con pollo tierno, sofrito criollo y condimentos típicos como achiote y culantro, que le dan su característico color y sabor. Se sirve tanto en almuerzos familiares como en celebraciones y representa la fusión de tradiciones culinarias panameñas.', 'https://assets.unileversolutions.com/v1/113852387.jpg', 'Pollo', 'Ninguno', '5-40 minutos', '2-6', '$6 - $23', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lavar, picar y sofreír el pollo.", "Agregar cebolla, ajo y ají.", "Añadir achiote y el arroz lavado.", "Incorporar agua o caldo y sazonar.", "Cocinar tapado a fuego bajo por 30 minutos.", "Agregar culantro, reposar 5 minutos y servir."], "ingredientes": ["250 g de pollo crudo", "1 taza de arroz crudo", "¼ taza de cebolla cruda", "1 diente de ajo", "1 cucharadita de achiote en polvo", "½ ají dulce", "1 taza de agua o caldo casero", "Sal, pimienta y culantro fresco"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Picar y sofreír pollo.", "Añadir cebolla, ajo, ají.", "Incorporar achiote y arroz.", "Cocinar con caldo 35 minutos.", "Culantro al final y reposar."], "ingredientes": ["500 g de pollo crudo", "2 tazas de arroz", "½ taza de cebolla", "2 dientes de ajo", "2 cucharaditas de achiote", "1 ají dulce", "2 tazas de agua o caldo", "Sal, pimienta, culantro"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Dorar pollo, sofreír verduras y achiote.", "Añadir arroz y líquido.", "Cocinar 40 minutos.", "Culantro y reposo antes de servir."], "ingredientes": ["750 g pollo crudo", "3 tazas arroz", "¾ taza cebolla", "3 dientes ajo", "3 cucharaditas achiote", "1 ½ ají dulce", "3 tazas caldo", "Sal, pimienta, culantro"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Sofreír el pollo hasta dorar.", "Añadir cebolla, ajo, ají dulce y sofreír.", "Agregar achiote y mezclar.", "Incorporar el arroz y luego el caldo.", "Cocinar tapado a fuego bajo por 20 minutos.", "Añadir culantro, reposar 5 minutos y servir."], "ingredientes": ["1 taza de arroz lavado", "250 g de pollo en piezas, sazonado", "¼ taza de cebolla picada", "1 diente de ajo picado", "1 cucharadita de achiote", "½ ají dulce picado", "1 taza de caldo de pollo", "Culantro fresco picado"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe el pollo en aceite hasta dorar.", "Añade cebolla, ajo y ají, cocina hasta transparencia.", "Agrega el achiote, el arroz y mezcla.", "Vierte el caldo, sazona y cocina tapado 25 minutos.", "Añade culantro, deja reposar y sirve."], "ingredientes": ["2 tazas de arroz", "500 g de pollo sazonado", "½ taza de cebolla picada", "2 dientes de ajo", "2 cucharaditas de achiote", "1 ají dulce", "2 tazas de caldo de pollo", "Culantro picado"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Dorar el pollo.", "Sofreír verduras y achiote.", "Añadir arroz, mezclar.", "Cocinar con caldo 30 minutos.", "Añadir culantro al final, reposar 5 minutos y servir."], "ingredientes": ["3 tazas de arroz", "750 g de pollo", "¾ taza de cebolla", "3 dientes de ajo", "3 cucharaditas de achiote", "1 ½ ají dulce", "3 tazas de caldo de pollo", "Culantro fresco"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Dejar la porción a temperatura ambiente por 10 minutos.", "Perforar el empaque o verter en un recipiente para microondas.", "Calentar 5 minutos a potencia alta.", "Remover bien, dejar reposar 1-2 minutos y servir."], "ingredientes": ["2 porciones de arroz con pollo ya cocinado y empacado al vacío."]}, "4_personas": {"precio": 16.0, "paso_a_paso": ["Calienta por 8 minutos en microondas a potencia alta.", "Remueve a mitad de tiempo para que se caliente uniformemente.", "Deja reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas listas para calentar."]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Calienta por 10 minutos.", "Remueve a los 5 minutos para evitar puntos fríos.", "Sirve caliente."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/S5eSuVLzn_k?si=Gfjj9PTdB5rle0CK'),
	(3, 'Arroz con Chorizo Tableño', 'El arroz con chorizo tableño es un plato tradicional panameño, originario de la región de Los Santos, conocido por su sabor intenso y su particular chorizo ahumado, elaborado artesanalmente. Es un plato popular en celebraciones y reuniones familiares, caracterizado por el arroz cocido junto al chorizo y un sofrito criollo que aporta un aroma irresistible.', 'https://www.recetaspanama.com/base/stock/Recipe/arroz-con-chorizo-tableno-y-ajies-dulces/arroz-con-chorizo-tableno-y-ajies-dulces_web.jpg.webp', 'Cerdo', 'Contiene cerdo. No contiene gluten ni lácteos.', '5-40 minutos', '2-6', '$6 - $23', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cortar chorizo y picar verduras.", "Sofreír el chorizo y luego las verduras.", "Incorporar el arroz y mezclar.", "Verter el caldo, sazonar y cocinar tapado por 30 minutos.", "Dejar reposar 5 minutos y servir."], "ingredientes": ["150 g de chorizo tableño crudo", "1 taza de arroz crudo", "¼ taza de cebolla cruda", "1 diente de ajo", "½ ají dulce", "1 taza de caldo o agua", "Sal, pimienta y aceite"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Sofríe chorizo.", "Añade verduras.", "Agrega arroz.", "Cocina con caldo 35 minutos.", "Reposar antes de servir."], "ingredientes": ["300 g chorizo crudo", "2 tazas arroz", "½ taza cebolla", "2 dientes ajo", "1 ají dulce", "2 tazas caldo", "Sal, pimienta, aceite"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Dorar chorizo.", "Sofreír verduras.", "Añadir arroz y líquido.", "Cocinar 40 minutos.", "Reposar."], "ingredientes": ["450 g chorizo crudo", "3 tazas arroz", "¾ taza cebolla", "3 dientes ajo", "1 ½ ají dulce", "3 tazas caldo", "Sal, pimienta, aceite"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Sofreír el chorizo hasta que dore.", "Añadir cebolla, ajo y ají.", "Agregar el arroz y mezclar.", "Verter el caldo, sazonar y cocinar tapado por 20 minutos.", "Dejar reposar 5 minutos y servir."], "ingredientes": ["1 taza de arroz lavado", "150 g de chorizo tableño en rodajas", "¼ taza de cebolla picada", "1 diente de ajo picado", "½ ají dulce picado", "1 taza de caldo o agua", "1 cucharada de aceite de achiote (opcional)"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe el chorizo hasta dorar.", "Añade verduras y cocina.", "Incorpora el arroz y el caldo.", "Cocina por 25 minutos tapado, reposa y sirve."], "ingredientes": ["2 tazas de arroz", "300 g de chorizo tableño", "½ taza de cebolla", "2 dientes de ajo", "1 ají dulce", "2 tazas de caldo", "2 cucharadas de aceite de achiote"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Dorar chorizo.", "Sofreír verduras.", "Añadir arroz y líquido.", "Cocinar 30 minutos.", "Reposar antes de servir."], "ingredientes": ["3 tazas de arroz", "450 g chorizo tableño", "¾ taza de cebolla", "3 dientes de ajo", "1 ½ ají dulce", "3 tazas de caldo", "3 cucharadas de aceite de achiote"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Dejar la porción a temperatura ambiente por 10 minutos.", "Calentar en microondas por 5 minutos, revolviendo a mitad de tiempo.", "Dejar reposar 1 minuto y servir."], "ingredientes": ["2 porciones empacadas de arroz con chorizo tableño."]}, "4_personas": {"precio": 16.0, "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Dejar reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Calentar por 10 minutos, removiendo a los 5 minutos.", "Servir caliente."], "ingredientes": ["6 porciones empacadas."]}}}', NULL),
	(4, 'Carimañolas', 'Las carimañolas son un plato tradicional panameño de origen afrocaribeño, popular en desayunos y meriendas. Son bolas de yuca rellenas, generalmente con carne de res o pollo, fritas hasta obtener una textura dorada y crujiente por fuera, y suave por dentro.', 'https://ethnicspoon.com/wp-content/uploads/2020/04/carimanolas-sq-500x375.jpg', 'Res', 'Contiene carne (res o pollo), posible gluten si se acompaña con salsas que lo contengan.', '3-15 minutos', '2-6', '$5 - $20', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Pelar y rallar la yuca con cuidado, escurrir el exceso de agua.", "Picar finamente ajo y cebolla.", "Sazonar la carne molida con ajo, cebolla, sal y pimienta.", "Formar bolas con la yuca rallada, dejando un hueco para el relleno.", "Colocar la carne sazonada dentro y cerrar bien las bolas.", "Freír las carimañolas hasta que estén doradas y crujientes, aproximadamente 5-7 minutos por tanda.", "Retirar, escurrir y servir calientes."], "ingredientes": ["2 tazas de yuca cruda pelada y rallada", "150 g de carne molida cruda", "1 diente de ajo fresco", "¼ taza de cebolla fresca", "Sal y pimienta al gusto", "Aceite para freír"]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Rallar y preparar yuca, sazonar carne.", "Formar y freír carimañolas en tandas.", "Servir calientes."], "ingredientes": ["4 tazas de yuca cruda", "300 g carne molida", "2 dientes de ajo", "½ taza de cebolla", "Aceite para freír"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Repetir proceso para mayor cantidad.", "Freír con cuidado y servir."], "ingredientes": ["6 tazas yuca cruda", "450 g carne molida", "3 dientes ajo", "¾ taza cebolla", "Aceite para freír"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Formar bolas con la yuca rallada, haciendo un hueco en el centro.", "Rellenar con carne molida sazonada y cerrar bien la bola.", "Calentar suficiente aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes (aproximadamente 5-7 minutos por tanda).", "Escurrir sobre papel absorbente y servir calientes."], "ingredientes": ["2 tazas de yuca rallada", "150 g de carne molida de res o pollo sazonada", "1 diente de ajo picado", "¼ taza de cebolla picada", "Sal y pimienta al gusto", "Aceite para freír"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Armar carimañolas dobles en cantidad y tamaño.", "Freír en tandas de 4-5 piezas hasta dorar.", "Escurrir y servir calientes."], "ingredientes": ["4 tazas de yuca rallada", "300 g de carne molida sazonada", "2 dientes de ajo", "½ taza de cebolla", "Aceite para freír"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Repetir el proceso de armado y fritura en mayor cantidad.", "Freír en tandas para mantener la temperatura del aceite.", "Servir calientes."], "ingredientes": ["6 tazas de yuca rallada", "450 g de carne molida", "3 dientes de ajo", "¾ taza de cebolla", "Aceite para freír"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Retirar las carimañolas del refrigerador y dejarlas a temperatura ambiente por 10 minutos.", "Calentar en microondas durante 3-4 minutos a potencia alta.", "Alternativamente, calentar en horno convencional a 180°C durante 8 minutos para mantener la textura crujiente.", "Servir caliente, acompañado de salsa de chile o mayonesa si se desea."], "ingredientes": ["4 carimañolas fritas y empacadas (2 por persona)."]}, "4_personas": {"precio": 14.0, "paso_a_paso": ["Calentar en microondas 6-7 minutos o en horno 10-12 minutos.", "Servir calientes."], "ingredientes": ["8 carimañolas (2 por persona)."]}, "6_personas": {"precio": 20.0, "paso_a_paso": ["Calentar en microondas 9-10 minutos o en horno 15 minutos.", "Servir calientes."], "ingredientes": ["12 carimañolas."]}}}', 'https://www.youtube.com/embed/obZDiCuiZAg?si=0vB0OriBL6BVgM1I'),
	(5, 'Mondongo Panameño', 'El mondongo es un guiso tradicional panameño hecho con tripas de res, cocidas lentamente en un caldo especiado con verduras y hierbas locales. Este plato, de origen colonial, es muy apreciado por su sabor profundo y textura única.', 'https://productosdeldia.com/cdn/shop/articles/Receta_de_Mondongo_Panameno.jpg', 'Res', 'Contiene tripas de res (puede no ser apto para todos). No contiene gluten ni lácteos.', '5 minutos - 2 horas', '2-6', '$7 - $28', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Limpiar bien las tripas con sal y vinagre, enjuagar varias veces.", "Cortar la tripa en trozos pequeños.", "Picar ajo, cebolla, zanahoria y ají dulce.", "En olla, sofreír ajo, cebolla y ají.", "Añadir tripas y dorar ligeramente.", "Incorporar zanahoria y agua o caldo.", "Cocinar tapado a fuego bajo por 1 hora 30 minutos o hasta ternura.", "Añadir culantro al final."], "ingredientes": ["250 g tripas de res crudas", "1 diente de ajo fresco", "¼ taza de cebolla fresca", "½ taza de zanahoria cruda", "1 ají dulce", "2 tazas de agua o caldo", "Culantro, sal, pimienta, comino"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Limpiar tripas.", "Sofreír verduras y tripas.", "Cocinar 1h45 min.", "Culantro y servir."], "ingredientes": ["500 g tripas crudas", "2 dientes ajo", "½ taza cebolla", "1 taza zanahoria", "2 ajíes dulces", "4 tazas caldo", "Condimentos"]}, "6_personas": {"precio": 19.0, "paso_a_paso": ["Repetir limpieza y cocción.", "Cocinar 2 horas.", "Culantro y servir."], "ingredientes": ["750 g tripas crudas", "3 dientes ajo", "¾ taza cebolla", "1 ½ taza zanahoria", "3 ajíes dulces", "6 tazas caldo", "Condimentos"]}}, "intermedio": {"2_personas": {"precio": 8.0, "paso_a_paso": ["En una olla mediana, calentar un poco de aceite y sofreír ajo, cebolla y ají dulce.", "Añadir las tripas y dorar ligeramente.", "Agregar la zanahoria y el caldo.", "Sazonar con sal, pimienta y comino.", "Cocinar tapado a fuego medio-bajo por 1 hora o hasta que las tripas estén tiernas.", "Incorporar culantro picado al final."], "ingredientes": ["250 g de tripas de res limpias y cortadas", "1 diente de ajo picado", "¼ taza de cebolla picada", "½ taza de zanahoria picada", "1 ají dulce picado", "2 tazas de caldo de res o agua", "Culantro fresco picado", "Sal, pimienta y comino al gusto"]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["Sofreír ajo, cebolla, ají.", "Dorar tripas.", "Añadir verduras y caldo.", "Cocinar 1 hora 15 minutos.", "Culantro al final."], "ingredientes": ["500 g tripas", "2 dientes de ajo", "½ taza cebolla", "1 taza zanahoria", "2 ajíes dulces", "4 tazas caldo", "Culantro, sal, pimienta, comino"]}, "6_personas": {"precio": 22.0, "paso_a_paso": ["Repetir proceso en olla grande.", "Cocinar 1 hora 30 minutos.", "Culantro y servir."], "ingredientes": ["750 g tripas", "3 dientes ajo", "¾ taza cebolla", "1 ½ taza zanahoria", "3 ajíes dulces", "6 tazas caldo", "Condimentos"]}}, "principiante": {"2_personas": {"precio": 11.0, "paso_a_paso": ["Sacar las porciones del refrigerador y dejar a temperatura ambiente 10 minutos.", "Perforar el empaque o transferir a un recipiente apto para microondas.", "Calentar 5 minutos a potencia alta, removiendo a mitad de tiempo.", "Dejar reposar 1-2 minutos antes de servir."], "ingredientes": ["2 porciones de mondongo preparado y empacado al vacío."]}, "4_personas": {"precio": 20.0, "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Reposar 2 minutos."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 28.0, "paso_a_paso": ["Calentar 10 minutos, removiendo a mitad de tiempo.", "Servir con acompañantes."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/7nlgDtq5rVo?si=mdedRuXB7z7bhPZ2'),
	(6, 'Ropa Vieja Panameña', 'La ropa vieja es un plato tradicional panameño elaborado con carne de res deshebrada en una salsa rica y aromática a base de tomate, cebolla, pimientos y especias. Se sirve típicamente acompañado de arroz blanco y plátanos maduros fritos.', 'https://i0.wp.com/www.buenossaborespanama.com/wp-content/uploads/2024/11/beef-shredded-meat-with-sauce-in-black-pan-grey-b-2024-10-13-04-51-35-utc-scaled.jpg', 'Res', 'Contiene carne de res. No contiene gluten ni lácteos.', '5-105 minutos', '2-6', '$7 - $26', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Cocina la falda de res en agua con sal por 1 hora y deshebra.", "Pica y sofríe las verduras.", "Añade la carne, el agua o caldo y sazona.", "Cocina a fuego bajo por 30 minutos.", "Servir caliente."], "ingredientes": ["300 g de falda de res cruda", "¼ taza de cebolla cruda", "½ pimiento rojo", "1 tomate", "1 diente de ajo", "1 cucharada aceite", "Sal, pimienta, comino", "½ taza de agua o caldo"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Cocinar falda, deshebrar.", "Sofreír verduras.", "Añadir carne y líquido.", "Cocinar 40 minutos.", "Servir."], "ingredientes": ["600 g falda de res cruda", "½ taza cebolla", "1 pimiento rojo", "2 tomates", "2 dientes ajo", "2 cucharadas aceite", "1 taza agua o caldo"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Cocinar falda.", "Deshebrar.", "Sofreír verduras.", "Añadir carne y líquido.", "Cocinar 45 minutos.", "Servir."], "ingredientes": ["900 g falda de res", "¾ taza cebolla", "1 ½ pimiento rojo", "3 tomates", "3 dientes ajo", "3 cucharadas aceite", "1 ½ taza agua o caldo"]}}, "intermedio": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Sofreír cebolla, ajo, pimiento y tomate.", "Añadir la carne deshebrada y mezclar.", "Verter el caldo, sazonar y cocinar por 15-20 minutos.", "Servir caliente."], "ingredientes": ["250 g de carne de res cocida y deshebrada", "¼ taza de cebolla picada", "½ pimiento rojo picado", "1 tomate picado", "1 diente de ajo picado", "1 cucharada de aceite", "½ taza de caldo de res", "Sal, pimienta, comino al gusto"]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["Sofríe verduras.", "Agrega carne y caldo.", "Cocina 25 minutos.", "Sirve."], "ingredientes": ["500 g carne cocida y deshebrada", "½ taza cebolla", "1 pimiento rojo", "2 tomates", "2 dientes ajo", "2 cucharadas aceite", "1 taza caldo de res"]}, "6_personas": {"precio": 22.0, "paso_a_paso": ["Sofríe verduras.", "Añade carne y caldo.", "Cocina 30 minutos.", "Sirve."], "ingredientes": ["750 g carne deshebrada", "¾ taza cebolla", "1 ½ pimiento rojo", "3 tomates", "3 dientes ajo", "3 cucharadas aceite", "1 ½ taza caldo"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Dejar a temperatura ambiente por 10 minutos.", "Calentar en microondas por 5 minutos, removiendo a mitad de tiempo.", "Dejar reposar 1-2 minutos y servir."], "ingredientes": ["2 porciones de ropa vieja ya preparada y empacada."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calienta por 8 minutos en microondas, removiendo a los 4 minutos.", "Reposa 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 26.0, "paso_a_paso": ["Calienta por 10 minutos, removiendo a mitad de tiempo.", "Sirve con los acompañamientos tradicionales."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/FO0Dd8OYXgc?si=tX6zZtMzC98gkVLK'),
	(7, 'Hojaldre', 'El hojalde panameño es un pan frito muy popular en Panamá, hecho con una masa suave y hojaldrada que al freírse se vuelve dorada y crujiente por fuera, pero suave por dentro. Se suele acompañar con café o chocolate caliente en desayunos o meriendas tradicionales.', 'https://www.recetaspanama.com/base/stock/Recipe/hojaldras/hojaldras_web.jpg.webp', 'Otros', 'Contiene gluten (harina de trigo), puede contener trazas de leche y huevo según la receta.', '2-33 minutos', '2-6', '$3 - $14', '{"avanzado": {"2_personas": {"precio": 3.0, "paso_a_paso": ["En un bol grande, mezcla la harina, el azúcar y la sal.", "Añade la manteca o mantequilla fría y mezcla con las manos o un cortapastas hasta obtener una textura arenosa.", "Agrega agua fría poco a poco hasta formar una masa suave que no se pegue a las manos.", "Deja reposar la masa cubierta con un paño por 30 minutos en el refrigerador.", "Extiende la masa con un rodillo sobre una superficie enharinada hasta obtener un grosor de aproximadamente ½ cm.", "Corta la masa en círculos del tamaño deseado.", "Fríe los círculos de masa 2-3 minutos por lado hasta que estén dorados y hojaldrados.", "Escurre sobre papel absorbente y sirve calientes."], "ingredientes": ["2 tazas de harina de trigo", "½ taza de manteca o mantequilla fría", "½ taza de agua fría", "1 cucharadita de azúcar", "½ cucharadita de sal"]}, "4_personas": {"precio": 6.0, "paso_a_paso": ["Mezcla ingredientes secos.", "Incorpora manteca.", "Añade agua y amasa.", "Reposa y corta masa.", "Fríe y sirve."], "ingredientes": ["4 tazas harina", "1 taza manteca", "1 taza agua fría", "2 cucharaditas azúcar", "1 cucharadita sal"]}, "6_personas": {"precio": 9.0, "paso_a_paso": ["Repite el proceso en mayor cantidad.", "Fríe por tandas.", "Sirve."], "ingredientes": ["6 tazas harina", "1 ½ taza manteca", "1 ½ taza agua", "3 cucharaditas azúcar", "1 ½ cucharadita sal"]}}, "intermedio": {"2_personas": {"precio": 4.0, "paso_a_paso": ["Calentar suficiente aceite en sartén a temperatura media.", "Tomar los círculos de masa y freírlos por tandas, aproximadamente 2-3 minutos por lado o hasta que estén dorados y hojaldrados.", "Escurrir sobre papel absorbente para eliminar exceso de grasa.", "Servir calientes."], "ingredientes": ["2 tazas de masa de harina de trigo preparada y cortada", "¼ taza de manteca de cerdo o mantequilla", "1 cucharadita de azúcar", "½ cucharadita de sal", "Aceite para freír"]}, "4_personas": {"precio": 7.0, "paso_a_paso": ["Freír en tandas.", "Escurrir y servir."], "ingredientes": ["4 tazas masa preparada", "½ taza manteca o mantequilla", "2 cucharaditas azúcar", "1 cucharadita sal", "Aceite"]}, "6_personas": {"precio": 10.0, "paso_a_paso": ["Freír en tandas.", "Servir calientes."], "ingredientes": ["6 tazas masa", "¾ taza manteca", "3 cucharaditas azúcar", "1 ½ cucharadita sal", "Aceite"]}}, "principiante": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Sacar los hojaldras del refrigerador y dejarlos a temperatura ambiente por 10 minutos.", "Calentar en microondas durante 2-3 minutos a potencia media para no resecar.", "Para mejor textura, se pueden recalentar en sartén con un poco de mantequilla a fuego medio durante 2 minutos por lado.", "Servir calientes acompañados de café o chocolate."], "ingredientes": ["4 hojaldras fritas y empacadas (2 por persona)."]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Calentar en microondas 4-5 minutos o en sartén.", "Servir calientes."], "ingredientes": ["8 hojaldras empacadas."]}, "6_personas": {"precio": 14.0, "paso_a_paso": ["Calentar en microondas 6-7 minutos o en sartén.", "Servir calientes."], "ingredientes": ["12 hojaldras empacadas."]}}}', 'https://www.youtube.com/embed/VYt8mYXWrKo?si=tsZiak66MB1AqaPl'),
	(8, 'Guacho de Rabito', 'El Gallo Pinto Chiricano es una receta típica de la región occidental de Panamá. A base de arroz y porotos (frijoles rojos), es un plato sencillo y nutritivo, caracterizado por su sabor criollo.', 'https://www.recetaspanama.com/base/stock/Post/17-image/17-image_small.jpg.webp', 'Otros', 'Ninguno', '5-132 minutos', '2-6', '$3 - $15', '{"avanzado": {"2_personas": {"precio": 3.0, "paso_a_paso": ["Remoja los porotos 8h y hiérvelos 1h.", "Cocina el arroz (20 min).", "Sofreír ajo y cebolla.", "Mezclar todo, añadir culantro y condimentos.", "Cocina junto por 8 minutos."], "ingredientes": ["½ taza de arroz crudo", "¾ taza de porotos rojos secos", "1 diente de ajo", "¼ cebolla", "1 cda aceite con achiote", "1 cda culantro fresco"]}, "4_personas": {"precio": 5.0, "paso_a_paso": ["Remojar porotos por 8 horas, hervir 1h 15 min.", "Cocinar el arroz.", "Picar y sofreír vegetales.", "Mezclar todo y cocinar por 10 minutos más."], "ingredientes": ["1 taza arroz crudo", "1½ tazas porotos secos", "2 dientes de ajo", "½ cebolla", "2 cdas aceite", "2 cdas culantro"]}, "6_personas": {"precio": 7.0, "paso_a_paso": ["Remoja y cocina los porotos (1h 30 min aprox.).", "Cocina el arroz.", "Picar y sofreír vegetales.", "Mezclar todo y cocinar por 12 minutos más."], "ingredientes": ["1½ tazas arroz crudo", "2¼ tazas porotos secos", "3 dientes de ajo", "1 cebolla", "3 cdas aceite", "3 cdas culantro"]}}, "intermedio": {"2_personas": {"precio": 4.0, "paso_a_paso": ["Calienta el aceite y sofríe ajo y cebolla.", "Incorpora arroz y porotos cocidos.", "Mezcla y agrega culantro y condimentos.", "Cocina por 6 minutos y sirve."], "ingredientes": ["1 taza de arroz blanco cocido", "¾ taza de porotos rojos cocidos", "1 cda de aceite de achiote", "1 diente de ajo picado", "¼ cebolla blanca picada", "1 cda de culantro fresco picado"]}, "4_personas": {"precio": 7.0, "paso_a_paso": ["Sofríe el ajo y la cebolla por 3 minutos.", "Añade el arroz y los porotos, y mezcla.", "Incorpora culantro, condimenta y cocina por 8 minutos."], "ingredientes": ["2 tazas de arroz cocido", "1½ tazas de porotos cocidos", "2 cdas de aceite de achiote", "2 dientes de ajo picados", "½ cebolla picada", "2 cdas de culantro"]}, "6_personas": {"precio": 10.0, "paso_a_paso": ["Sofríe el ajo y la cebolla.", "Incorpora arroz y porotos.", "Mezcla con culantro, sazona y cocina por 10 minutos."], "ingredientes": ["3 tazas de arroz cocido", "2¼ tazas de porotos cocidos", "3 cdas de aceite de achiote", "3 dientes de ajo picados", "1 cebolla mediana picada", "3 cdas de culantro"]}}, "principiante": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar por 4 minutos, revolver y calentar 1 minuto más.", "Dejar reposar y servir."], "ingredientes": ["2 porciones (1 taza cada una) de arroz y porotos mezclados y sazonados, empacados al vacío."]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Calienta en microondas por 7 minutos, removiendo cada 2 minutos.", "Deja reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones (1 taza cada una) listas y empacadas."]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Calienta en un recipiente grande durante 10 minutos, revolviendo cada 3 minutos.", "Deja reposar y sirve caliente."], "ingredientes": ["6 porciones preparadas."]}}}', 'https://www.youtube.com/embed/85bxNZlhMSk?si=y9lrLBlYad6Z1mqC'),
	(9, 'Arroz con Coco', 'El arroz con coco es un plato tradicional panameño, especialmente popular en la costa Caribeña. Consiste en arroz cocido en leche de coco fresca, resultando en un acompañante dulce y cremoso.', 'https://blog.superxtra.com/wp-content/uploads/2023/02/blog-arroz-con-coco-1.png', 'Otros', 'Contiene coco (frutos secos). No contiene gluten ni lácteos.', '5-35 minutos', '2-6', '$5 - $19', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Extrae leche de coco fresca.", "Mezcla con agua, azúcar y sal, y calienta.", "Añade arroz crudo y mezcla.", "Cocina tapado a fuego bajo por 25-30 minutos.", "Servir caliente."], "ingredientes": ["1 taza arroz crudo", "1 taza leche de coco natural recién extraída", "½ taza agua", "2 cucharadas azúcar sin procesar", "¼ cucharadita sal"]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Extrae leche de coco.", "Mezcla líquidos y azúcar.", "Cocina arroz tapado 30 minutos.", "Sirve."], "ingredientes": ["2 tazas arroz crudo", "2 tazas leche de coco fresca", "1 taza agua", "4 cucharadas azúcar sin procesar", "½ cucharadita sal"]}, "6_personas": {"precio": 14.0, "paso_a_paso": ["Igual procedimiento en mayor cantidad.", "Cocina hasta tierno.", "Sirve."], "ingredientes": ["3 tazas arroz crudo", "3 tazas leche de coco fresca", "1 ½ taza agua", "6 cucharadas azúcar sin procesar", "¾ cucharadita sal"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["En una olla mediana, mezcla la leche de coco, agua, azúcar, sal y canela.", "Calienta a fuego medio hasta que empiece a hervir suavemente.", "Añade el arroz lavado y mezcla bien.", "Reduce el fuego a bajo, tapa la olla y cocina por 20-25 minutos o hasta que el arroz esté tierno y el líquido se haya absorbido.", "Retira la rama de canela antes de servir."], "ingredientes": ["1 taza de arroz lavado y escurrido", "1 taza de leche de coco fresca", "½ taza de agua", "2 cucharadas de azúcar", "¼ cucharadita de sal", "1 rama de canela (opcional)"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Calienta líquidos y azúcar.", "Agrega arroz.", "Cocina tapado 30 minutos.", "Sirve."], "ingredientes": ["2 tazas arroz", "2 tazas leche de coco", "1 taza agua", "4 cucharadas azúcar", "½ cucharadita sal", "2 ramas canela (opcional)"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Repite proceso en mayor cantidad.", "Cocina hasta arroz tierno.", "Sirve."], "ingredientes": ["3 tazas arroz", "3 tazas leche de coco", "1 ½ taza agua", "6 cucharadas azúcar", "¾ cucharadita sal", "3 ramas canela (opcional)"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Sacar del refrigerador y dejar reposar 10 minutos a temperatura ambiente.", "Calentar en microondas a potencia alta durante 4-5 minutos, removiendo a mitad de tiempo para calentar uniformemente.", "Dejar reposar 2 minutos antes de servir.", "Servir caliente como acompañante de pescado o carne."], "ingredientes": ["2 porciones de arroz con coco cocinado y empacado."]}, "4_personas": {"precio": 14.0, "paso_a_paso": ["Calentar 7 minutos en microondas, removiendo a mitad de tiempo.", "Reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 19.0, "paso_a_paso": ["Calentar 9 minutos, removiendo a mitad de tiempo.", "Servir caliente."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/wNddpK2GnQM?si=jNpbDwcvxyFbnKgL'),
	(10, 'Tamal de Olla Panameño', 'El tamal de olla es una variante urbana y práctica del tradicional tamal panameño, cocinado en cazuela con el sabor clásico del maíz, pollo, pasitas y aceitunas.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/5c2408c3ff31cd93357c198278ff02e1.jpg', 'Pollo', 'Maíz, pasitas (sulfitos).', '5-60 minutos', '2-6', '$6 - $25', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cocina y desmenuza el pollo (25 min).", "Licúa y sofríe el sofrito.", "Añade pollo, pasitas y aceitunas.", "Agrega la masa y condimenta.", "Cocina a fuego bajo por 40 minutos, removiendo."], "ingredientes": ["1 taza de maíz nuevo molido", "250 g de pollo crudo", "¼ cebolla, 1 ajo, ¼ ají, 1 rama culantro", "2 cucharadas pasitas, 2 cucharadas aceitunas"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Cocinar pollo, hacer sofrito, preparar masa.", "Mezclar todo y cocinar por 50 minutos."], "ingredientes": ["2 tazas maíz molido", "500 g pollo", "Verduras para sofrito", "¼ taza pasitas y aceitunas"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Repetir proceso.", "Cocinar a fuego bajo durante 1 hora."], "ingredientes": ["3 tazas maíz molido", "750 g pollo", "Verduras, pasitas y aceitunas al gusto"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una olla con aceite caliente, sofríe el sofrito por 3 minutos.", "Agregar pollo, pasitas, aceitunas y achiote.", "Incorporar la masa sazonada, mezclar.", "Cocinar tapado por 25 minutos, revolviendo ocasionalmente."], "ingredientes": ["1 taza de masa de maíz preparada", "250 g de pollo cocido y desmenuzado", "¼ taza de sofrito (ajo, cebolla, ají, culantro)", "2 cucharadas de pasitas", "2 cucharadas de aceitunas"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe el sofrito.", "Añade el pollo, pasitas y aceitunas.", "Incorpora la masa y cocina tapado durante 35 minutos."], "ingredientes": ["2 tazas masa", "500 g pollo desmenuzado", "½ taza sofrito", "¼ taza pasitas", "¼ taza aceitunas"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Mismo procedimiento anterior.", "Cocinar tapado durante 45 minutos hasta que la mezcla espese."], "ingredientes": ["3 tazas masa", "750 g pollo", "¾ taza sofrito", "½ taza pasitas y aceitunas"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Retira del empaque y colócalo en un plato apto para microondas.", "Calienta durante 5 minutos a potencia media-alta.", "Deja reposar 2 minutos y servir."], "ingredientes": ["2 porciones de tamal de olla ya cocinado y empacado al vacío."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calienta en el microondas durante 9 minutos, revolviendo a mitad de tiempo.", "Deja reposar 3 minutos."], "ingredientes": ["4 porciones de tamal de olla listos para calentar."]}, "6_personas": {"precio": 25.0, "paso_a_paso": ["Calienta durante 12 minutos a potencia media-alta.", "Deja reposar 3 minutos antes de servir."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/ftf2gD4iqig?si=1gna-jam-EDQE-8Q'),
	(11, 'Bistec Picado a lo Panameño', 'Este plato es una joya de las fondas panameñas. El bistec picado se prepara con carne de res cortada en trozos pequeños y cocida en su propio jugo junto con cebolla, ajo, tomate y pimentón.', 'https://i.ytimg.com/vi/P2wwqiYAMss/maxresdefault.jpg', 'Res', 'Ninguno', '5-30 minutos', '2-6', '$6 - $25', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cortar la carne en tiras.", "Picar todas las verduras.", "En sartén con aceite, sofreír vegetales.", "Añadir carne y cocinar 15-20 min.", "Servir caliente."], "ingredientes": ["300 g carne de res cruda", "½ cebolla, ¼ pimiento, 1 tomate", "1 ajo", "Aceite, sal y especias"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Cortar y preparar todo.", "Cocinar 25 min.", "Servir con arroz."], "ingredientes": ["600 g carne", "1 cebolla, 1 pimiento, 2 tomates", "2 ajos"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Mismo procedimiento.", "Cocinar 30 min hasta suave.", "Servir."], "ingredientes": ["900 g carne", "1 ½ cebolla, 1 ½ pimiento", "3 tomates", "3 ajos"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En sartén caliente, añade aceite y sofríe ajo, cebolla y pimiento.", "Añade la carne sazonada y cocina 5 minutos.", "Incorpora el tomate y cocina por 10 minutos más hasta espesar.", "Servir caliente."], "ingredientes": ["300 g carne de res en tiras", "½ cebolla, ½ tomate, ¼ pimiento rojo", "1 ajo picado", "Sal, pimienta, comino", "1 cda aceite"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe vegetales.", "Añade carne, cocina 15-20 min hasta suave.", "Servir."], "ingredientes": ["600 g carne", "1 cebolla, 1 pimiento, 2 tomates", "2 dientes ajo, 2 cdas aceite"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Sofríe todo, añade carne.", "Cocina 25 min removiendo ocasionalmente.", "Servir."], "ingredientes": ["900 g carne", "1 ½ cebolla y pimiento", "3 tomates", "3 dientes ajo"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Calienta en microondas durante 5 minutos, revolviendo a la mitad.", "Servir caliente."], "ingredientes": ["2 porciones de bistec picado cocinado."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calentar durante 9 minutos, removiendo a los 4.", "Servir."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 25.0, "paso_a_paso": ["Calentar durante 12 minutos, removiendo a mitad de tiempo.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/2WzfqRitCPg?si=s5gqEmmhW02dycdP'),
	(12, 'Guacho de Mariscos', 'El guacho de mariscos es uno de los platos más representativos del sabor caribeño panameño. Es una especie de arroz caldoso que combina mariscos frescos en una base de sofrito criollo, culantro y caldo de mariscos.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/561170d165f68568cccfb6b21b3e2442.png', 'Mariscos', 'Mariscos (camarones, calamares, almejas).', '5-40 minutos', '2-6', '$7 - $30', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Lavar, picar y sofreír los vegetales por 3 minutos.", "Añadir mariscos crudos y dorar por 2 minutos.", "Agregar el arroz, mezclar e incorporar caldo.", "Cocinar durante 30 minutos, revolviendo.", "Añadir culantro y servir."], "ingredientes": ["½ taza arroz crudo", "200 g mariscos crudos", "¼ cebolla, 1 diente ajo, ¼ ají dulce", "1 rama culantro", "1 taza agua o caldo"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Picar y preparar todos los ingredientes.", "Sofreír vegetales, dorar mariscos, añadir arroz y caldo.", "Cocinar durante 35 minutos, removiendo."], "ingredientes": ["1 taza arroz", "400 g mariscos crudos", "½ cebolla, 2 dientes ajo, ½ ají", "2 ramas culantro", "2 tazas caldo"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Repetir proceso con proporciones mayores.", "Cocinar durante 40 minutos o hasta que el arroz esté cremoso."], "ingredientes": ["1 ½ tazas arroz", "600 g mariscos", "¾ cebolla, 3 ajos, ¾ ají", "3 ramas culantro", "3 tazas caldo"]}}, "intermedio": {"2_personas": {"precio": 9.0, "paso_a_paso": ["En una olla, calienta el aceite y sofríe el sofrito durante 2-3 minutos.", "Agrega los mariscos ya sazonados y cocina por 2 minutos.", "Añade el arroz y el caldo.", "Cocinar por 20-25 minutos, removiendo.", "El arroz debe quedar cremoso, no seco.", "Servir caliente."], "ingredientes": ["½ taza de arroz lavado", "200 g mezcla de mariscos limpios y sazonados", "1 taza de caldo de mariscos", "¼ taza sofrito", "1 cucharada aceite"]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["Sofreír el sofrito.", "Añadir mariscos y dorar.", "Agregar arroz y caldo.", "Cocinar durante 30 minutos, revolviendo."], "ingredientes": ["1 taza arroz", "400 g mariscos sazonados", "2 tazas caldo", "½ taza sofrito", "2 cucharadas aceite"]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Sofreír y cocinar mariscos.", "Añadir arroz y caldo.", "Cocinar 35 minutos a fuego medio, removiendo."], "ingredientes": ["1 ½ tazas arroz", "600 g mariscos sazonados", "3 tazas caldo", "¾ taza sofrito", "3 cucharadas aceite"]}}, "principiante": {"2_personas": {"precio": 12.0, "paso_a_paso": ["Retira del empaque y colócalo en un recipiente apto para microondas.", "Calienta a potencia media-alta durante 5 minutos, revolviendo a los 2 minutos.", "Deja reposar 1 minuto y servir.", "Acompaña con patacones o ensalada."], "ingredientes": ["2 porciones de guacho de mariscos empacadas al vacío."]}, "4_personas": {"precio": 22.0, "paso_a_paso": ["Calentar en microondas durante 9 minutos, removiendo a mitad de tiempo.", "Reposar 2 minutos."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 30.0, "paso_a_paso": ["Calienta durante 12 minutos, removiendo a los 6 minutos.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/Mu7e-A0CxQo?si=XSUrdBodSsSBwY4z'),
	(13, 'Lengua en Salsa Panameña', 'La lengua en salsa es un plato tradicional muy valorado en los hogares panameños, con lengua de res cocida lentamente hasta quedar suave, bañada en una salsa criolla.', 'https://www.recetaspanama.com/base/stock/Recipe/lengua-en-salsa/lengua-en-salsa_web.jpg.webp', 'Res', 'Ninguno', '6-145 minutos', '2-6', '$7 - $30', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Lava y hierve la lengua por 1h 30 min hasta ablandar.", "Pelar y rebanar la lengua.", "Sofreír vegetales y condimentos.", "Añadir la lengua y cocinar por 15 minutos en la salsa."], "ingredientes": ["300 g lengua cruda", "¼ cebolla, ½ tomate, ¼ pimentón", "1 ajo, 1 cda culantro", "2 cdas salsa de tomate"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Hervir lengua con sal y culantro.", "Rebanar, preparar sofrito y salsa.", "Cocinar todo junto por 20 minutos."], "ingredientes": ["600 g lengua", "½ cebolla, 2 tomates, ½ pimentón", "2 ajos, 2 cdas culantro", "4 cdas salsa"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Mismo proceso con proporciones ajustadas.", "Cocinar lengua por 2 horas si es necesario.", "Terminar con sofrito y cocción final de 25 minutos."], "ingredientes": ["900 g lengua", "1 cebolla, 2 tomates, 1 pimentón", "3 ajos, 3 cdas culantro", "6 cdas salsa de tomate"]}}, "intermedio": {"2_personas": {"precio": 9.0, "paso_a_paso": ["En sartén, calienta el aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Agregar tomate, salsa de tomate y condimentos.", "Añadir la lengua cocida y cocinar tapado por 10-12 minutos.", "Servir caliente."], "ingredientes": ["300 g de lengua cocida y rebanada", "¼ cebolla en julianas", "½ tomate picado", "¼ pimentón", "1 ajo picado", "1 cda culantro", "2 cdas salsa de tomate"]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["Sofríe vegetales y condimentos.", "Añade lengua y cocina todo junto por 15 minutos."], "ingredientes": ["600 g lengua cocida", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 2 cdas culantro", "4 cdas salsa de tomate"]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Igual proceso con proporciones mayores.", "Cocina a fuego medio por 20 minutos."], "ingredientes": ["900 g lengua cocida", "1 cebolla, 1 pimentón, 2 tomates", "3 ajos, 3 cdas culantro", "6 cdas salsa de tomate"]}}, "principiante": {"2_personas": {"precio": 12.0, "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar por 6 minutos, revolviendo a los 3 minutos.", "Dejar reposar y servir."], "ingredientes": ["2 porciones de lengua cocida en salsa criolla, empacadas al vacío."]}, "4_personas": {"precio": 22.0, "paso_a_paso": ["Calentar durante 10 minutos, revolviendo a la mitad del tiempo.", "Dejar reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 30.0, "paso_a_paso": ["Calienta durante 13 minutos, removiendo a los 6.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/Ei9jgfOMfXM?si=AIZjba981qqij_t7'),
	(14, 'Bofe Guisado Panameño', 'El bofe guisado es un plato muy popular en el interior del país, hecho con pulmón de res (bofe), guisado con vegetales en una sabrosa salsa criolla.', 'https://www.ladona.com.pa/ladona/uploads/recipe/image/236/1739994136.jpg', 'Res', 'Ninguno', '6-115 minutos', '2-6', '$5 - $21', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Lava y hierve el bofe en agua con sal por 1 hora.", "Pica el bofe y los vegetales.", "Sofríe los vegetales.", "Agrega el bofe, salsa y condimentos, y cocina por 15 minutos."], "ingredientes": ["250 g de bofe crudo", "¼ cebolla, ½ tomate, ¼ pimentón", "1 diente de ajo", "2 cdas salsa de tomate"]}, "4_personas": {"precio": 9.0, "paso_a_paso": ["Limpia y cocina el bofe durante 1 hora y media.", "Pica y sofríe los vegetales, incorpora la carne y cocina por 20 minutos."], "ingredientes": ["500 g de bofe", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 13.0, "paso_a_paso": ["Lava, cocina y pica el bofe.", "Prepara sofrito y cocina todo junto durante 25 minutos."], "ingredientes": ["750 g de bofe", "1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Sofreír el ajo, cebolla y pimentón por 3 minutos.", "Añadir el tomate.", "Incorporar el bofe cocido y picado.", "Agregar la salsa y condimentos, y cocinar por 15 minutos."], "ingredientes": ["250 g de bofe cocido y picado", "¼ cebolla en julianas", "½ tomate", "¼ pimentón", "1 ajo", "2 cdas salsa de tomate"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Sofríe los vegetales y condimenta.", "Agrega el bofe, mezcla con la salsa y cocina durante 20 minutos."], "ingredientes": ["500 g de bofe cocido", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Mismo proceso: sofreír, agregar ingredientes y cocinar durante 25 minutos."], "ingredientes": ["750 g de bofe cocido", "1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa de tomate"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Colocar en recipiente para microondas.", "Calentar durante 5-6 minutos.", "Dejar reposar 1 minuto y servir."], "ingredientes": ["2 porciones de bofe guisado empacado al vacío."]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["Calienta durante 9 minutos, revolviendo a los 5 minutos.", "Dejar reposar 2 minutos."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 21.0, "paso_a_paso": ["Calentar en microondas durante 12 minutos, removiendo cada 4 minutos.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/iLo7znhr_TA?si=ABe6YmsDisJYyOb_'),
	(15, 'Pollo Guisado', 'El fricasé de pollo es una receta clásica de la cocina criolla panameña, donde se guisan presas de pollo en una salsa espesa con tomate, vegetales y papas, dejando la carne jugosa y bien sazonada.', 'https://foodmetamorphosis.com/wp-content/uploads/2025/01/puerto-rican-fricase-de-pollo-chicken-fricase.jpg', 'Pollo', 'Ninguno', '6-40 minutos', '2-6', '$6 - $24', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lava y sazona el pollo.", "Sofreír vegetales.", "Añadir el pollo y dorar.", "Agregar papa, salsa, agua y cocinar por 30 minutos."], "ingredientes": ["2 presas de pollo crudas", "½ papa", "¼ cebolla, 1 ajo, ½ tomate, ¼ pimentón", "2 cdas salsa de tomate"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Mismo proceso: dorar pollo, añadir sofrito, cocinar todo por 35 minutos."], "ingredientes": ["4 presas de pollo crudo", "1 papa, ½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Lava, sazona y dora el pollo.", "Prepara sofrito, añade papas y cocina todo durante 40 minutos."], "ingredientes": ["6 presas de pollo", "2 papas, 1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una sartén con aceite, sofríe el ajo, cebolla, pimentón y tomate durante 3 minutos.", "Añadir papas, pollo cocido y salsa.", "Agregar agua, condimentar y cocinar por 15 minutos."], "ingredientes": ["2 presas de pollo cocidas y sazonadas", "½ papa en cubos", "¼ cebolla en julianas", "½ tomate", "¼ pimentón", "1 diente de ajo"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe vegetales, añade pollo y salsa.", "Cocina todo durante 20 minutos.", "Servir caliente."], "ingredientes": ["4 presas de pollo cocidas", "1 papa, ½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Mismo procedimiento con proporciones ajustadas.", "Cocina a fuego medio durante 25 minutos."], "ingredientes": ["6 presas de pollo", "2 papas, 1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Colocar en un recipiente para microondas.", "Calentar durante 6 minutos, revolviendo a los 3.", "Reposar 1 minuto y servir."], "ingredientes": ["2 presas de pollo guisadas en fricasé, con papas y salsa, empacadas al vacío."]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["Calienta durante 10 minutos, removiendo a los 5 minutos.", "Servir caliente."], "ingredientes": ["4 presas listas con guarnición."]}, "6_personas": {"precio": 24.0, "paso_a_paso": ["Calienta en microondas durante 13 minutos, removiendo cada 4 minutos.", "Servir."], "ingredientes": ["6 presas de pollo guisadas."]}}}', 'https://www.youtube.com/embed/WuVBjgJNqH8?si=ICQYKz1Gplm0jPgo');

-- Volcando estructura para procedimiento pa_la_olla.registrar_pedido
DROP PROCEDURE IF EXISTS `registrar_pedido`;
DELIMITER //
CREATE PROCEDURE `registrar_pedido`(
	IN `p_id_usuario` INT,
	IN `p_id_receta` INT,
	IN `p_orden_paypal` TEXT,
	IN `p_precio` DECIMAL(20,6),
	IN `p_receta_nivel` TEXT,
	IN `p_receta_cantidad` INT,
	IN `p_direccion` TEXT
)
BEGIN
	INSERT INTO pedido (id_usuario, id_receta, orden_paypal, precio, receta_nivel, receta_cantidad, direccion)
	VALUES(p_id_usuario, p_id_receta, p_orden_paypal, p_precio, p_receta_nivel, p_receta_cantidad, p_direccion);
END//
DELIMITER ;

-- Volcando estructura para procedimiento pa_la_olla.registrar_usuario
DROP PROCEDURE IF EXISTS `registrar_usuario`;
DELIMITER //
CREATE PROCEDURE `registrar_usuario`(
	IN `p_nombre_usuario` VARCHAR(100),
	IN `p_email` VARCHAR(255),
	IN `p_contrasena` VARCHAR(255),
	IN `p_telefono` VARCHAR(20)
)
BEGIN
    -- Primero verificamos si el correo ya existe
    DECLARE email_existe INT;
    SELECT COUNT(*) INTO email_existe FROM usuarios WHERE email = p_email;
    
    IF email_existe > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este email ya está registrado';
    ELSE
        -- Insertamos el nuevo usuario
        INSERT INTO usuarios (nombre_usuario, email, contrasena, telefono)
        VALUES (p_nombre_usuario, p_email, SHA2(p_contrasena, 256), p_telefono);
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
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `email`, `telefono`, `contrasena`) VALUES
	(9, 'Moises Macre', 'josemoises@gmail.com', '6845-2603', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'),
	(10, 'Carlos Rodríguez', 'carv2012@gmail.com', '61744815', 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270'),
	(11, 'Neymar ', 'enejota@gmail.com', '66753846', '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414');

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

-- Volcando estructura para procedimiento pa_la_olla.ver_receta
DROP PROCEDURE IF EXISTS `ver_receta`;
DELIMITER //
CREATE PROCEDURE `ver_receta`(
	IN `p_id_receta` INT
)
BEGIN
	SELECT * FROM receta WHERE id_receta = p_id_receta;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
