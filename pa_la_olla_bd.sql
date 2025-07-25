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
        SET descripcion = p_descripcion,
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.comentario: ~1 rows (aproximadamente)
INSERT INTO `comentario` (`id_comentario`, `id_receta`, `id_usuario`, `descripcion`, `calificacion`, `fecha_comentario`) VALUES
	(19, 2, 10, 'A', 5.000000, '2025-07-22 22:50:31'),
	(20, 7, 10, 'Delicioso ', 5.000000, '2025-07-22 22:51:09');

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla pa_la_olla.pedido: ~9 rows (aproximadamente)
INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `id_receta`, `orden_paypal`, `precio`, `receta_nivel`, `receta_cantidad`, `direccion`, `fecha_pedido`) VALUES
	(16, 10, 2, '4W6394354U926210R', 16.000000, 'principiante', 4, 'El Valle San Isidro Sector 2', '2025-07-22 02:31:35'),
	(17, 10, 9, '0B362402G9844400G', 14.000000, 'avanzado', 6, 'El Valle San Isidro Sector 2', '2025-07-22 02:31:54'),
	(18, 10, 7, '01131200448477222', 7.000000, 'intermedio', 4, 'El Valle San Isidro Sector 2', '2025-07-22 02:32:13'),
	(19, 10, 6, '61P28780Y2904961B', 10.000000, 'principiante', 2, 'A', '2025-07-25 01:28:55'),
	(20, 10, 7, '28F23347LF5839447', 9.000000, 'avanzado', 6, 'A', '2025-07-25 01:33:07'),
	(21, 10, 7, '4BJ3215538518692V', 10.000000, 'principiante', 4, 'A', '2025-07-25 01:34:53'),
	(22, 10, 9, '4B314205FA416290R', 14.000000, 'avanzado', 6, 'Z', '2025-07-25 01:59:04'),
	(23, 10, 15, '1ER10932SL6071939', 13.000000, 'intermedio', 4, 'A', '2025-07-25 02:23:44'),
	(24, 10, 5, '54H13712AP8822230', 8.000000, 'intermedio', 2, 'A', '2025-07-25 02:28:05');

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
	(1, 'Sancocho Panameño', 'El sancocho panameño es el plato nacional por excelencia. Esta sopa espesa es una mezcla reconfortante de gallina de patio, ñame y culantro. Es común en festividades, almuerzos familiares y hasta como remedio para la resaca. Su sabor auténtico representa la tradición interiorana y la calidez del hogar panameño.', 'https://static.wixstatic.com/media/a91788_0d896c6daa814dfbac85c18650e70f5e~mv2.jpg', 'Pollo', 'Ninguno', '5-55 minutos', '2-6', '$6 - $26', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lavar la gallina con agua y limón.", "Pelar y cortar el ñame en cubos medianos.", "Picar finamente el ajo, ají y culantro.", "Colocar la gallina y el agua en una olla. Hervir 15 minutos.", "Agregar el ñame, ajo y ají. Cocinar 30 minutos más.", "Al final, incorporar el culantro y apagar el fuego.", "Servir con arroz blanco o patacones."], "ingredientes": ["2 muslos de gallina crudos", "1 taza de ñame crudo", "2 dientes de ajo", "1 ají dulce", "1 rama de culantro", "Sal y 2 tazas de agua"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Lavar todos los ingredientes y picar finamente.", "Hervir la gallina 20 minutos.", "Agregar el ñame, ajo y ají. Cocinar 25 minutos más.", "Añadir el culantro, mezclar bien y servir."], "ingredientes": ["4 muslos de gallina", "2 tazas de ñame", "4 dientes de ajo", "2 ajíes dulces", "2 ramas de culantro", "Sal y 4 tazas de agua"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Lavar y pelar todo.", "Hervir la gallina en agua con sal por 25 minutos.", "Agregar el ñame y los vegetales. Cocinar 30 minutos más.", "Finalizar con el culantro. Servir con arroz blanco."], "ingredientes": ["6 presas de gallina", "3 tazas de ñame", "6 dientes de ajo", "3 ajíes dulces", "3 ramas de culantro", "Sal y 6 tazas de agua"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Colocar la gallina en una olla mediana con el agua sazonada.", "Llevar a ebullición.", "Agregar el ñame, ajo y ají. Tapar.", "Cocinar a fuego medio por 30 minutos o hasta que el ñame esté suave.", "Agregar el culantro picado antes de apagar el fuego.", "Servir caliente con arroz."], "ingredientes": ["2 muslos de gallina sazonados", "1 taza de ñame pelado y picado", "2 dientes de ajo picados", "1 ají dulce picado", "2 tazas de agua con sal", "1 rama de culantro picado"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["En una olla grande, hervir el pollo con el agua.", "Añadir ñame, ajo y ají. Cocinar 35 minutos.", "Agregar culantro, mezclar bien y servir.", "Ideal con arroz blanco."], "ingredientes": ["4 muslos de gallina sazonados", "2 tazas de ñame picado", "4 dientes de ajo", "2 ajíes dulces", "4 tazas de agua", "2 ramas de culantro picado"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Colocar todos los ingredientes en una olla grande excepto el culantro.", "Cocinar por 40 minutos.", "Agregar culantro al final para resaltar el sabor.", "Servir caliente con arroz blanco o tajadas."], "ingredientes": ["6 presas de gallina sazonadas", "3 tazas de ñame", "6 dientes de ajo", "3 ajíes dulces", "6 tazas de agua", "3 ramas de culantro"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Perforar el empaque o verter en un recipiente apto para microondas.", "Calentar 5 minutos a potencia alta.", "Remover y dejar reposar 1 minuto antes de servir.", "Acompañar con arroz si se desea."], "ingredientes": ["2 porciones empacadas al vacío de sancocho con ñame, gallina, caldo y culantro."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calentar por 8 minutos a potencia alta.", "Remover y dejar reposar 1-2 minutos antes de servir.", "Servir con arroz o yuca hervida."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 26.0, "paso_a_paso": ["Calentar por 10 minutos.", "Revolver a mitad de tiempo.", "Servir en platos hondos con arroz blanco."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/gZw8dgw-erw?si=ARGLA-DhaOEZMDSe'),
	(2, 'Arroz con Pollo Panameño', 'El arroz con pollo es uno de los platos más queridos y representativos de Panamá. Este plato combina arroz cocido con pollo tierno, sofrito criollo y condimentos típicos como achiote y culantro, que le dan su característico color y sabor. Se sirve tanto en almuerzos familiares como en celebraciones y representa la fusión de tradiciones culinarias panameñas.', 'https://assets.unileversolutions.com/v1/113852387.jpg', 'Pollo', 'Ninguno', '5-40 minutos', '2-6', '$6 - $23', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lavar y picar el pollo en trozos.", "Picar cebolla, ajo y ají dulce finamente.", "En una olla, sofreír pollo con aceite hasta que esté ligeramente dorado.", "Agregar cebolla, ajo y ají, sofreír hasta que estén transparentes.", "Añadir el achiote en polvo y mezclar bien para teñir el aceite.", "Incorporar el arroz lavado y mezclar para cubrirlo con el sofrito.", "Añadir el agua o caldo, sazonar con sal y pimienta.", "Cocinar tapado a fuego bajo durante 30 minutos o hasta que el arroz esté cocido y el líquido absorbido.", "Agregar el culantro picado justo antes de apagar el fuego.", "Dejar reposar tapado 5 minutos antes de servir."], "ingredientes": ["250 g de pollo crudo", "1 taza de arroz crudo", "¼ taza de cebolla cruda", "1 diente de ajo", "1 cucharadita de achiote en polvo", "½ ají dulce", "1 taza de agua o caldo casero", "Sal, pimienta y culantro fresco"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Picar y sofreír pollo.", "Añadir cebolla, ajo, ají.", "Incorporar achiote y arroz.", "Cocinar con caldo 35 minutos.", "Culantro al final y reposar."], "ingredientes": ["500 g de pollo crudo", "2 tazas de arroz", "½ taza de cebolla", "2 dientes de ajo", "2 cucharaditas de achiote", "1 ají dulce", "2 tazas de agua o caldo", "Sal, pimienta, culantro"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Dorar pollo, sofreír verduras y achiote.", "Añadir arroz y líquido.", "Cocinar 40 minutos.", "Culantro y reposo antes de servir."], "ingredientes": ["750 g pollo crudo", "3 tazas arroz", "¾ taza cebolla", "3 dientes ajo", "3 cucharaditas achiote", "1 ½ ají dulce", "3 tazas caldo", "Sal, pimienta, culantro"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una olla mediana, calienta un poco de aceite y sofríe el pollo hasta dorar ligeramente.", "Añade la cebolla, ajo, ají dulce y sofríe hasta que estén transparentes.", "Agrega el achiote para teñir el aceite y mezcla bien.", "Incorpora el arroz lavado y mezcla para que se impregne del color y sabor.", "Vierte el caldo de pollo, sazonar con sal y pimienta.", "Cocina tapada a fuego bajo por 20 minutos o hasta que el arroz esté tierno y el líquido absorbido.", "Agrega el culantro picado antes de apagar el fuego.", "Deja reposar 5 minutos tapado antes de servir."], "ingredientes": ["1 taza de arroz lavado", "250 g de pollo en piezas, sazonado con sal, ajo y pimienta", "¼ taza de cebolla picada", "1 diente de ajo picado", "1 cucharadita de achiote (para dar color)", "½ ají dulce picado", "1 taza de caldo de pollo", "Culantro fresco picado"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe el pollo en aceite hasta dorar.", "Añade cebolla, ajo y ají, cocina hasta transparencia.", "Agrega el achiote y mezcla bien.", "Incorpora el arroz y mezcla.", "Vierte el caldo, sazona y cocina tapado 25 minutos.", "Añade culantro, deja reposar y sirve."], "ingredientes": ["2 tazas de arroz", "500 g de pollo sazonado", "½ taza de cebolla picada", "2 dientes de ajo", "2 cucharaditas de achiote", "1 ají dulce", "2 tazas de caldo de pollo", "Culantro picado"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Dorar el pollo.", "Sofreír verduras y achiote.", "Añadir arroz, mezclar.", "Cocinar con caldo 30 minutos.", "Culantro al final.", "Reposar 5 minutos y servir."], "ingredientes": ["3 tazas de arroz", "750 g de pollo", "¾ taza de cebolla", "3 dientes de ajo", "3 cucharaditas de achiote", "1 ½ ají dulce", "3 tazas de caldo de pollo", "Culantro fresco"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Perfora ligeramente el empaque para permitir la salida del vapor o transfiere a un recipiente apto para microondas.", "Calienta en microondas a potencia alta durante 5 minutos.", "Remueve bien para distribuir el calor y deja reposar 1-2 minutos.", "Sirve caliente y, si deseas, acompaña con ensalada fresca o tajadas de plátano."], "ingredientes": ["2 porciones de arroz con pollo ya cocinado y empacado al vacío."]}, "4_personas": {"precio": 16.0, "paso_a_paso": ["Calienta por 8 minutos en microondas a potencia alta.", "Remueve a mitad de tiempo para que se caliente uniformemente.", "Deja reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas listas para calentar."]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Calienta por 10 minutos.", "Remueve a los 5 minutos para evitar puntos fríos.", "Sirve caliente."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/S5eSuVLzn_k?si=Gfjj9PTdB5rle0CK'),
	(3, 'Arroz con Chorizo Tableño', 'El arroz con chorizo tableño es un plato tradicional panameño, originario de la región de Los Santos, conocido por su sabor intenso y su particular chorizo ahumado, elaborado artesanalmente. Es un plato popular en celebraciones y reuniones familiares, caracterizado por el arroz cocido junto al chorizo y un sofrito criollo que aporta un aroma irresistible.', 'https://www.recetaspanama.com/base/stock/Recipe/arroz-con-chorizo-tableno-y-ajies-dulces/arroz-con-chorizo-tableno-y-ajies-dulces_web.jpg.webp', 'Otros', 'Contiene cerdo. No contiene gluten ni lácteos.', '5-40 minutos', '2-6', '$6 - $23', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cortar el chorizo en rodajas.", "Picar la cebolla, ajo y ají dulce finamente.", "En una olla, calienta el aceite y sofríe el chorizo hasta que esté dorado y suelte su grasa.", "Añade la cebolla, ajo y ají, cocina hasta que la cebolla esté transparente.", "Incorpora el arroz lavado y mezcla bien para que se impregne del sabor del sofrito.", "Vierte el caldo o agua, sazonar con sal y pimienta.", "Cocina tapada a fuego bajo por 30 minutos o hasta que el arroz esté tierno y haya absorbido el líquido.", "Deja reposar 5 minutos tapado antes de servir."], "ingredientes": ["150 g de chorizo tableño crudo", "1 taza de arroz crudo", "¼ taza de cebolla cruda", "1 diente de ajo", "½ ají dulce", "1 taza de caldo o agua", "Sal, pimienta y aceite para freír"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Sofríe chorizo.", "Añade verduras.", "Agrega arroz.", "Cocina con caldo 35 minutos.", "Reposar antes de servir."], "ingredientes": ["300 g chorizo crudo", "2 tazas arroz", "½ taza cebolla", "2 dientes ajo", "1 ají dulce", "2 tazas caldo", "Sal, pimienta, aceite"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Dorar chorizo.", "Sofreír verduras.", "Añadir arroz y líquido.", "Cocinar 40 minutos.", "Reposar."], "ingredientes": ["450 g chorizo crudo", "3 tazas arroz", "¾ taza cebolla", "3 dientes ajo", "1 ½ ají dulce", "3 tazas caldo", "Sal, pimienta, aceite"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una olla mediana, calienta el aceite y sofríe el chorizo hasta que suelte su grasa y esté dorado.", "Añade cebolla, ajo y ají dulce, cocina hasta que la cebolla esté transparente.", "Agrega el arroz lavado y mezcla para cubrirlo con la grasa del chorizo y el sofrito.", "Vierte el caldo o agua y sazonar con sal al gusto.", "Cocina tapada a fuego bajo por 20 minutos o hasta que el arroz esté tierno y el líquido absorbido.", "Deja reposar 5 minutos antes de servir."], "ingredientes": ["1 taza de arroz lavado", "150 g de chorizo tableño en rodajas", "¼ taza de cebolla picada", "1 diente de ajo picado", "½ ají dulce picado", "1 taza de caldo de pollo o agua", "1 cucharada de aceite de achiote (opcional)"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Sofríe el chorizo hasta dorar.", "Añade verduras y cocina.", "Incorpora el arroz y el caldo.", "Cocina por 25 minutos tapado, reposa y sirve."], "ingredientes": ["2 tazas de arroz", "300 g de chorizo tableño", "½ taza de cebolla", "2 dientes de ajo", "1 ají dulce", "2 tazas de caldo", "2 cucharadas de aceite de achiote"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Dorar chorizo.", "Sofreír verduras.", "Añadir arroz y líquido.", "Cocinar 30 minutos.", "Reposar antes de servir."], "ingredientes": ["3 tazas de arroz", "450 g chorizo tableño", "¾ taza de cebolla", "3 dientes de ajo", "1 ½ ají dulce", "3 tazas de caldo", "3 cucharadas de aceite de achiote"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Perforar ligeramente el empaque o transferir a un recipiente apto para microondas.", "Calentar en microondas a potencia alta durante 5 minutos.", "Revolver a mitad de tiempo para una cocción pareja.", "Dejar reposar 1 minuto antes de servir.", "Se puede acompañar con ensalada fresca o tajadas."], "ingredientes": ["2 porciones empacadas de arroz con chorizo tableño, ya cocinado y listo."]}, "4_personas": {"precio": 16.0, "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Dejar reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["Calentar por 10 minutos, removiendo a los 5 minutos.", "Servir caliente."], "ingredientes": ["6 porciones empacadas."]}}}', NULL),
	(4, 'Carimañolas', 'Las carimañolas son un plato tradicional panameño de origen afrocaribeño, popular en desayunos y meriendas. Son bolas de yuca rellenas, generalmente con carne de res o pollo, fritas hasta obtener una textura dorada y crujiente por fuera, y suave por dentro.', 'https://ethnicspoon.com/wp-content/uploads/2020/04/carimanolas-sq-500x375.jpg', 'Res', 'Contiene carne (res o pollo), posible gluten si se acompaña con salsas que lo contengan.', '3-15 minutos', '2-6', '$5 - $20', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Pelar y rallar la yuca con cuidado, escurrir el exceso de agua.", "Picar finamente ajo y cebolla.", "Sazonar la carne molida con ajo, cebolla, sal y pimienta.", "Formar bolas con la yuca rallada, dejando un hueco para el relleno.", "Colocar la carne sazonada dentro y cerrar bien las bolas.", "Calentar aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes, aproximadamente 5-7 minutos por tanda.", "Retirar, escurrir y servir calientes."], "ingredientes": ["2 tazas de yuca cruda pelada y rallada", "150 g de carne molida cruda", "1 diente de ajo fresco", "¼ taza de cebolla fresca", "Sal y pimienta al gusto", "Aceite para freír"]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Pelar y rallar la yuca con cuidado, escurrir el exceso de agua.", "Picar finamente ajo y cebolla.", "Sazonar la carne molida con ajo, cebolla, sal y pimienta.", "Formar bolas con la yuca rallada, dejando un hueco para el relleno.", "Colocar la carne sazonada dentro y cerrar bien las bolas.", "Calentar aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes, aproximadamente 5-7 minutos por tanda.", "Retirar, escurrir y servir calientes."], "ingredientes": ["4 tazas de yuca cruda", "300 g carne molida", "2 dientes de ajo", "½ taza de cebolla", "Aceite para freír"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Pelar y rallar la yuca con cuidado, escurrir el exceso de agua.", "Picar finamente ajo y cebolla.", "Sazonar la carne molida con ajo, cebolla, sal y pimienta.", "Formar bolas con la yuca rallada, dejando un hueco para el relleno.", "Colocar la carne sazonada dentro y cerrar bien las bolas.", "Calentar aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes, aproximadamente 5-7 minutos por tanda.", "Retirar, escurrir y servir calientes."], "ingredientes": ["6 tazas yuca cruda", "450 g carne molida", "3 dientes ajo", "¾ taza cebolla", "Aceite para freír"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Formar bolas con la yuca rallada, haciendo un hueco en el centro.", "Rellenar con carne molida sazonada y cerrar bien la bola.", "Calentar suficiente aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes (aproximadamente 5-7 minutos por tanda).", "Escurrir sobre papel absorbente y servir calientes."], "ingredientes": ["2 tazas de yuca rallada", "150 g de carne molida de res o pollo sazonada", "1 diente de ajo picado", "¼ taza de cebolla picada", "Sal y pimienta al gusto", "Aceite para freír"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Formar bolas con la yuca rallada, haciendo un hueco en el centro.", "Rellenar con carne molida sazonada y cerrar bien la bola.", "Calentar suficiente aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes (aproximadamente 5-7 minutos por tanda).", "Escurrir sobre papel absorbente y servir calientes."], "ingredientes": ["4 tazas de yuca rallada", "300 g de carne molida sazonada", "2 dientes de ajo", "½ taza de cebolla", "Aceite para freír"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Formar bolas con la yuca rallada, haciendo un hueco en el centro.", "Rellenar con carne molida sazonada y cerrar bien la bola.", "Calentar suficiente aceite en sartén a temperatura media-alta.", "Freír las carimañolas hasta que estén doradas y crujientes (aproximadamente 5-7 minutos por tanda).", "Escurrir sobre papel absorbente y servir calientes."], "ingredientes": ["6 tazas de yuca rallada", "450 g de carne molida", "3 dientes de ajo", "¾ taza de cebolla", "Aceite para freír"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Calentar en microondas durante 3-4 minutos a potencia alta.", "Alternativamente, calentar en horno convencional a 180°C durante 8 minutos para mantener la textura crujiente.", "Servir caliente, acompañado de salsa de chile o mayonesa si se desea."], "ingredientes": ["4 carimañolas fritas y empacadas (2 por persona)."]}, "4_personas": {"precio": 14.0, "paso_a_paso": ["Calentar en microondas 6-7 minutos o en horno 10-12 minutos.", "Servir calientes."], "ingredientes": ["8 carimañolas (2 por persona)."]}, "6_personas": {"precio": 20.0, "paso_a_paso": ["Calentar en microondas 9-10 minutos o en horno 15 minutos.", "Servir calientes."], "ingredientes": ["12 carimañolas."]}}}', 'https://www.youtube.com/embed/obZDiCuiZAg?si=0vB0OriBL6BVgM1I'),
	(5, 'Mondongo Panameño', 'El mondongo es un guiso tradicional panameño hecho con tripas de res, cocidas lentamente en un caldo especiado con verduras y hierbas locales. Este plato, de origen colonial, es muy apreciado por su sabor profundo y textura única.', 'https://productosdeldia.com/cdn/shop/articles/Receta_de_Mondongo_Panameno.jpg', 'Res', 'Contiene tripas de res (puede no ser apto para todos). No contiene gluten ni lácteos.', '5 minutos - 2 horas', '2-6', '$7 - $28', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Limpiar bien las tripas con sal y vinagre, enjuagar varias veces.", "Cortar la tripa en trozos pequeños.", "Picar ajo, cebolla, zanahoria y ají dulce.", "En olla, sofreír ajo, cebolla y ají.", "Añadir tripas y dorar ligeramente.", "Incorporar zanahoria y agua o caldo.", "Cocinar tapado a fuego bajo por 1 hora 30 minutos o hasta ternura.", "Sazonar con sal, pimienta y comino.", "Añadir culantro al final.", "Servir con arroz blanco o yuca."], "ingredientes": ["250 g tripas de res crudas", "1 diente de ajo fresco", "¼ taza de cebolla fresca", "½ taza de zanahoria cruda", "1 ají dulce", "2 tazas de agua o caldo", "Culantro, sal, pimienta, comino"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Limpiar bien las tripas con sal y vinagre, enjuagar varias veces.", "Cortar la tripa en trozos pequeños.", "Picar ajo, cebolla, zanahoria y ají dulce.", "En olla, sofreír ajo, cebolla y ají.", "Añadir tripas y dorar ligeramente.", "Incorporar zanahoria y agua o caldo.", "Cocinar tapado a fuego bajo por 1 hora 30 minutos o hasta ternura.", "Sazonar con sal, pimienta y comino.", "Añadir culantro al final.", "Servir con arroz blanco o yuca."], "ingredientes": ["500 g tripas crudas", "2 dientes ajo", "½ taza cebolla", "1 taza zanahoria", "2 ajíes dulces", "4 tazas caldo", "Condimentos"]}, "6_personas": {"precio": 19.0, "paso_a_paso": ["Limpiar bien las tripas con sal y vinagre, enjuagar varias veces.", "Cortar la tripa en trozos pequeños.", "Picar ajo, cebolla, zanahoria y ají dulce.", "En olla, sofreír ajo, cebolla y ají.", "Añadir tripas y dorar ligeramente.", "Incorporar zanahoria y agua o caldo.", "Cocinar tapado a fuego bajo por 1 hora 30 minutos o hasta ternura.", "Sazonar con sal, pimienta y comino.", "Añadir culantro al final.", "Servir con arroz blanco o yuca."], "ingredientes": ["750 g tripas crudas", "3 dientes ajo", "¾ taza cebolla", "1 ½ taza zanahoria", "3 ajíes dulces", "6 tazas caldo", "Condimentos"]}}, "intermedio": {"2_personas": {"precio": 8.0, "paso_a_paso": ["En una olla mediana, calentar un poco de aceite y sofreír ajo, cebolla y ají dulce.", "Añadir las tripas y dorar ligeramente.", "Agregar la zanahoria y el caldo.", "Sazonar con sal, pimienta y comino.", "Cocinar tapado a fuego medio-bajo por 1 hora o hasta que las tripas estén tiernas.", "Incorporar culantro picado al final.", "Servir con arroz blanco."], "ingredientes": ["250 g de tripas de res limpias y cortadas", "1 diente de ajo picado", "¼ taza de cebolla picada", "½ taza de zanahoria picada", "1 ají dulce picado", "2 tazas de caldo de res o agua", "Culantro fresco picado", "Sal, pimienta y comino al gusto"]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["Sofreír ajo, cebolla, ají.", "Dorar tripas.", "Añadir verduras y caldo.", "Cocinar 1 hora 15 minutos.", "Culantro al final."], "ingredientes": ["500 g tripas", "2 dientes de ajo", "½ taza cebolla", "1 taza zanahoria", "2 ajíes dulces", "4 tazas caldo", "Culantro, sal, pimienta, comino"]}, "6_personas": {"precio": 22.0, "paso_a_paso": ["En una olla mediana, calentar un poco de aceite y sofreír ajo, cebolla y ají dulce.", "Añadir las tripas y dorar ligeramente.", "Agregar la zanahoria y el caldo.", "Sazonar con sal, pimienta y comino.", "Cocinar tapado a fuego medio-bajo por 1 hora o hasta que las tripas estén tiernas.", "Incorporar culantro picado al final.", "Servir con arroz blanco."], "ingredientes": ["750 g tripas", "3 dientes ajo", "¾ taza cebolla", "1 ½ taza zanahoria", "3 ajíes dulces", "6 tazas caldo", "Condimentos"]}}, "principiante": {"2_personas": {"precio": 11.0, "paso_a_paso": ["Perforar el empaque o transferir a un recipiente apto para microondas.", "Calentar 5 minutos a potencia alta, removiendo a mitad de tiempo.", "Dejar reposar 1-2 minutos antes de servir.", "Servir con arroz blanco o yuca."], "ingredientes": ["2 porciones de mondongo preparado y empacado al vacío."]}, "4_personas": {"precio": 20.0, "paso_a_paso": ["Calentar por 8 minutos, revolviendo a los 4 minutos.", "Reposar 2 minutos."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 28.0, "paso_a_paso": ["Calentar 10 minutos, removiendo a mitad de tiempo.", "Servir con acompañantes."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/7nlgDtq5rVo?si=mdedRuXB7z7bhPZ2'),
	(6, 'Ropa Vieja Panameña', 'La ropa vieja es un plato tradicional panameño elaborado con carne de res deshebrada en una salsa rica y aromática a base de tomate, cebolla, pimientos y especias. Se sirve típicamente acompañado de arroz blanco y plátanos maduros fritos.', 'https://i0.wp.com/www.buenossaborespanama.com/wp-content/uploads/2024/11/beef-shredded-meat-with-sauce-in-black-pan-grey-b-2024-10-13-04-51-35-utc-scaled.jpg', 'Res', 'Contiene carne de res. No contiene gluten ni lácteos.', '5-105 minutos', '2-6', '$7 - $26', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Cocina la falda de res en agua con sal hasta que esté tierna (aproximadamente 1 hora).", "Deja enfriar y deshebra la carne con las manos o tenedor.", "Pica finamente cebolla, ajo, pimiento y tomate.", "En sartén, calienta el aceite y sofríe las verduras hasta suavizar.", "Añade la carne deshebrada y mezcla bien.", "Vierte el agua o caldo y sazona con sal, pimienta y comino.", "Cocina a fuego bajo por 30 minutos, mezclando ocasionalmente para que tome sabor.", "Sirve caliente acompañado de arroz blanco y plátano maduro frito."], "ingredientes": ["300 g de falda de res cruda", "¼ taza de cebolla cruda", "½ pimiento rojo", "1 tomate", "1 diente de ajo", "1 cucharada aceite", "Sal, pimienta, comino", "½ taza de agua o caldo"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Cocina la falda de res en agua con sal hasta que esté tierna (aproximadamente 1 hora).", "Deja enfriar y deshebra la carne con las manos o tenedor.", "Pica finamente cebolla, ajo, pimiento y tomate.", "En sartén, calienta el aceite y sofríe las verduras hasta suavizar.", "Añade la carne deshebrada y mezcla bien.", "Vierte el agua o caldo y sazona con sal, pimienta y comino.", "Cocina a fuego bajo por 30 minutos, mezclando ocasionalmente para que tome sabor.", "Sirve caliente acompañado de arroz blanco y plátano maduro frito."], "ingredientes": ["600 g falda de res cruda", "½ taza cebolla", "1 pimiento rojo", "2 tomates", "2 dientes ajo", "2 cucharadas aceite", "1 taza agua o caldo"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Cocina la falda de res en agua con sal hasta que esté tierna (aproximadamente 1 hora).", "Deja enfriar y deshebra la carne con las manos o tenedor.", "Pica finamente cebolla, ajo, pimiento y tomate.", "En sartén, calienta el aceite y sofríe las verduras hasta suavizar.", "Añade la carne deshebrada y mezcla bien.", "Vierte el agua o caldo y sazonar con sal, pimienta y comino.", "Cocina a fuego bajo por 30 minutos, mezclando ocasionalmente para que tome sabor.", "Sirve caliente acompañado de arroz blanco y plátano maduro frito."], "ingredientes": ["900 g falda de res", "¾ taza cebolla", "1 ½ pimiento rojo", "3 tomates", "3 dientes ajo", "3 cucharadas aceite", "1 ½ taza agua o caldo"]}}, "intermedio": {"2_personas": {"precio": 8.0, "paso_a_paso": ["En una sartén, calienta el aceite y sofríe la cebolla, ajo, pimiento y tomate hasta que estén suaves y fragantes.", "Añade la carne deshebrada y mezcla bien.", "Vierte el caldo de res y sazona con sal, pimienta y comino.", "Cocina a fuego medio bajo durante 15-20 minutos para que los sabores se integren.", "Sirve caliente acompañado de arroz blanco y plátanos."], "ingredientes": ["250 g de carne de res cocida y deshebrada", "¼ taza de cebolla picada", "½ pimiento rojo picado", "1 tomate picado", "1 diente de ajo picado", "1 cucharada de aceite", "½ taza de caldo de res", "Sal, pimienta, comino al gusto"]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["En una sartén, calienta el aceite y sofríe la cebolla, ajo, pimiento y tomate hasta que estén suaves y fragantes.", "Añade la carne deshebrada y mezcla bien.", "Vierte el caldo de res y sazona con sal, pimienta y comino.", "Cocina a fuego medio bajo durante 15-20 minutos para que los sabores se integren.", "Sirve caliente acompañado de arroz blanco y plátanos."], "ingredientes": ["500 g carne cocida y deshebrada", "½ taza cebolla", "1 pimiento rojo", "2 tomates", "2 dientes ajo", "2 cucharadas aceite", "1 taza caldo de res"]}, "6_personas": {"precio": 22.0, "paso_a_paso": ["En una sartén, calienta el aceite y sofríe la cebolla, ajo, pimiento y tomate hasta que estén suaves y fragantes.", "Añade la carne deshebrada y mezcla bien.", "Vierte el caldo de res y sazona con sal, pimienta y comino.", "Cocina a fuego medio bajo durante 15-20 minutos para que los sabores se integren.", "Sirve caliente acompañado de arroz blanco y plátanos."], "ingredientes": ["750 g carne deshebrada", "¾ taza cebolla", "1 ½ pimiento rojo", "3 tomates", "3 dientes ajo", "3 cucharadas aceite", "1 ½ taza caldo"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Perfora el empaque o transfiere a un recipiente apto para microondas.", "Calienta en microondas a potencia alta durante 5 minutos.", "Remueve a mitad de tiempo para distribuir el calor uniformemente.", "Deja reposar 1-2 minutos antes de servir.", "Sirve acompañado de arroz blanco y plátanos maduros fritos."], "ingredientes": ["2 porciones de ropa vieja ya preparada y empacada."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calienta por 8 minutos en microondas, removiendo a los 4 minutos.", "Reposa 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 26.0, "paso_a_paso": ["Calienta por 10 minutos, removiendo a mitad de tiempo.", "Sirve con los acompañamientos tradicionales."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/FO0Dd8OYXgc?si=tX6zZtMzC98gkVLK'),
	(7, 'Hojaldre', 'El hojaldre panameño es un pan frito muy popular en Panamá, hecho con una masa suave y hojaldrada que al freírse se vuelve dorada y crujiente por fuera, pero suave por dentro. Se suele acompañar con café o chocolate caliente en desayunos o meriendas tradicionales.', 'https://www.recetaspanama.com/base/stock/Recipe/hojaldras/hojaldras_web.jpg.webp', 'Otros', 'Contiene gluten (harina de trigo), puede contener trazas de leche y huevo según la receta.', '2-33 minutos', '2-6', '$3 - $14', '{"avanzado": {"2_personas": {"precio": 3.0, "paso_a_paso": ["En un bol grande, mezcla la harina, el azúcar y la sal.", "Añade la manteca o mantequilla fría y mezcla con las manos o un cortapastas hasta obtener una textura arenosa.", "Agrega agua fría poco a poco hasta formar una masa suave que no se pegue a las manos.", "Deja reposar la masa cubierta con un paño por 30 minutos en el refrigerador.", "Extiende la masa con un rodillo sobre una superficie enharinada hasta obtener un grosor de aproximadamente ½ cm.", "Corta la masa en círculos del tamaño deseado.", "Calienta aceite suficiente en sartén a temperatura media.", "Fríe los círculos de masa 2-3 minutos por lado hasta que estén dorados y hojaldrados.", "Escurre sobre papel absorbente y sirve calientes."], "ingredientes": ["2 tazas de harina de trigo", "½ taza de manteca de cerdo o mantequilla fría cortada en cubos", "½ taza de agua fría (aproximada)", "1 cucharadita de azúcar", "½ cucharadita de sal"]}, "4_personas": {"precio": 6.0, "paso_a_paso": ["En un bol grande, mezcla la harina, el azúcar y la sal.", "Añade la manteca o mantequilla fría y mezcla con las manos o un cortapastas hasta obtener una textura arenosa.", "Agrega agua fría poco a poco hasta formar una masa suave que no se pegue a las manos.", "Deja reposar la masa cubierta con un paño por 30 minutos en el refrigerador.", "Extiende la masa con un rodillo sobre una superficie enharinada hasta obtener un grosor de aproximadamente ½ cm.", "Corta la masa en círculos del tamaño deseado.", "Calienta aceite suficiente en sartén a temperatura media.", "Fríe los círculos de masa 2-3 minutos por lado hasta que estén dorados y hojaldrados.", "Escurre sobre papel absorbente y sirve calientes."], "ingredientes": ["4 tazas harina", "1 taza manteca", "1 taza agua fría", "2 cucharaditas azúcar", "1 cucharadita sal"]}, "6_personas": {"precio": 9.0, "paso_a_paso": ["En un bol grande, mezcla la harina, el azúcar y la sal.", "Añade la manteca o mantequilla fría y mezcla con las manos o un cortapastas hasta obtener una textura arenosa.", "Agrega agua fría poco a poco hasta formar una masa suave que no se pegue a las manos.", "Deja reposar la masa cubierta con un paño por 30 minutos en el refrigerador.", "Extiende la masa con un rodillo sobre una superficie enharinada hasta obtener un grosor de aproximadamente ½ cm.", "Corta la masa en círculos del tamaño deseado.", "Calienta aceite suficiente en sartén a temperatura media.", "Fríe los círculos de masa 2-3 minutos por lado hasta que estén dorados y hojaldrados.", "Escurre sobre papel absorbente y sirve calientes."], "ingredientes": ["6 tazas harina", "1 ½ taza manteca", "1 ½ taza agua", "3 cucharaditas azúcar", "1 ½ cucharadita sal"]}}, "intermedio": {"2_personas": {"precio": 4.0, "paso_a_paso": ["Calentar suficiente aceite en sartén a temperatura media.", "Tomar los círculos de masa y freírlos por tandas, aproximadamente 2-3 minutos por lado o hasta que estén dorados y hojaldrados.", "Escurrir sobre papel absorbente para eliminar exceso de grasa.", "Servir calientes."], "ingredientes": ["2 tazas de masa de harina de trigo preparada y cortada en círculos", "¼ taza de manteca de cerdo o mantequilla", "1 cucharadita de azúcar", "½ cucharadita de sal", "Aceite para freír"]}, "4_personas": {"precio": 7.0, "paso_a_paso": ["Calentar suficiente aceite en sartén a temperatura media.", "Tomar los círculos de masa y freírlos por tandas, aproximadamente 2-3 minutos por lado o hasta que estén dorados y hojaldrados.", "Escurrir sobre papel absorbente para eliminar exceso de grasa.", "Servir calientes."], "ingredientes": ["4 tazas masa preparada", "½ taza manteca o mantequilla", "2 cucharaditas azúcar", "1 cucharadita sal", "Aceite"]}, "6_personas": {"precio": 10.0, "paso_a_paso": ["Calentar suficiente aceite en sartén a temperatura media.", "Tomar los círculos de masa y freírlos por tandas, aproximadamente 2-3 minutos por lado o hasta que estén dorados y hojaldrados.", "Escurrir sobre papel absorbente para eliminar exceso de grasa.", "Servir calientes."], "ingredientes": ["6 tazas masa", "¾ taza manteca", "3 cucharaditas azúcar", "1 ½ cucharadita sal", "Aceite"]}}, "principiante": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Calentar en microondas durante 2-3 minutos a potencia media para no resecar.", "Para mejor textura, se pueden recalentar en sartén con un poco de mantequilla a fuego medio durante 2 minutos por lado.", "Servir calientes acompañados de café o chocolate."], "ingredientes": ["4 hojaldras fritas y empacadas (2 por persona)."]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Calentar en microondas 4-5 minutos o en sartén.", "Servir calientes."], "ingredientes": ["8 hojaldras empacadas."]}, "6_personas": {"precio": 14.0, "paso_a_paso": ["Calentar en microondas 6-7 minutos o en sartén.", "Servir calientes."], "ingredientes": ["12 hojaldras empacadas."]}}}', 'https://www.youtube.com/embed/VYt8mYXWrKo?si=tsZiak66MB1AqaPl'),
	(8, 'Guacho de Rabito Panameño', 'El Guacho de Rabito es una joya de la cocina panameña, especialmente popular en zonas como Panamá Oeste y la ciudad capital. Este plato combina arroz caldoso con rabito de puerco salado, vegetales y especias criollas, ofreciendo una textura reconfortante y un sabor profundo. Es muy apreciado por su sabor intenso y su capacidad para unir a la familia alrededor de la mesa.', 'https://www.recetaspanama.com/base/stock/Post/17-image/17-image_small.jpg.webp', 'Otros', 'Contiene cerdo', '5-135 minutos', '2-6', '$3 - $15', '{"avanzado": {"2_personas": {"precio": 3.0, "paso_a_paso": ["Remoja el rabito salado por 8 horas, cambiando el agua varias veces.", "Cocina el rabito por 1 hora hasta ablandar.", "En paralelo, cocina el arroz con 2 tazas de agua y sal.", "Sofríe cebolla, ajo y pimentón en aceite.", "Agrega rabito desmenuzado, arroz cocido y caldo.", "Incorpora el culantro, sal y pimienta.", "Cocina por 10 minutos removiendo para espesar.", "Servir caliente."], "ingredientes": ["1 taza arroz crudo", "300g rabito salado", "2½ tazas agua", "¼ cebolla", "1 diente ajo", "¼ pimentón", "1½ cda culantro", "1½ cda aceite", "Sal y pimienta"]}, "4_personas": {"precio": 5.0, "paso_a_paso": ["Remoja el rabito 8 horas, cocínalo por 1½ horas.", "Cocina arroz en agua con sal.", "Sofríe cebolla, ajo y pimentón en aceite caliente.", "Agrega rabito, arroz y 3 tazas de caldo.", "Sazona con culantro, sal y pimienta.", "Cocina 12 minutos a fuego medio removiendo bien.", "Servir caliente."], "ingredientes": ["2 tazas arroz crudo", "500g rabito salado", "4 tazas agua", "½ cebolla", "2 dientes ajo", "½ pimentón", "2½ cdas culantro", "2½ cdas aceite", "Sal y pimienta"]}, "6_personas": {"precio": 7.0, "paso_a_paso": ["Desala el rabito por 8h, cocínalo 1h 45 min hasta ablandar.", "Cocina el arroz en 5 tazas de agua con sal.", "Sofríe ajo, cebolla y pimentón en aceite por 4 minutos.", "Agrega el rabito desmenuzado, arroz cocido y 5 tazas de caldo.", "Sazona con culantro, sal y pimienta.", "Cocina todo por 15 minutos removiendo para lograr textura espesa.", "Sirve caliente."], "ingredientes": ["3 tazas arroz crudo", "700g rabito salado", "5 tazas agua", "1 cebolla", "3 dientes ajo", "1 pimentón", "3 cdas culantro", "3 cdas aceite", "Sal y pimienta"]}}, "intermedio": {"2_personas": {"precio": 4.0, "paso_a_paso": ["Sofríe cebolla, ajo y pimentón en aceite por 3 minutos.", "Agrega el rabito previamente cocido y desmenuzado.", "Añade arroz cocido, caldo y culantro.", "Cocina por 10 minutos hasta espesar un poco.", "Rectifica sal y pimienta, sirve caliente."], "ingredientes": ["1 taza de arroz cocido", "1 taza de rabito cocido y desmenuzado", "1½ taza de caldo", "¼ cebolla picada", "1 diente de ajo", "¼ pimentón", "1 cda de culantro", "1 cda de aceite", "Sal y pimienta"]}, "4_personas": {"precio": 7.0, "paso_a_paso": ["En una olla grande, sofríe cebolla, ajo y pimentón.", "Agrega el rabito desmenuzado y mezcla bien.", "Añade arroz cocido y caldo.", "Incorpora culantro y condimenta al gusto.", "Cocina por 12 minutos removiendo ocasionalmente.", "Sirve caliente."], "ingredientes": ["2 tazas arroz cocido", "2 tazas rabito cocido", "3 tazas caldo", "½ cebolla", "2 dientes de ajo", "½ pimentón", "2 cdas culantro", "2 cdas aceite", "Sal y pimienta"]}, "6_personas": {"precio": 10.0, "paso_a_paso": ["Sofríe ajo, cebolla y pimentón en aceite por 4 minutos.", "Agrega rabito desmenuzado y revuelve.", "Incorpora arroz cocido y caldo.", "Sazona con culantro, sal y pimienta.", "Cocina por 15 minutos para espesar el guacho.", "Servir caliente."], "ingredientes": ["3 tazas arroz cocido", "3 tazas rabito cocido", "4½ tazas caldo", "1 cebolla", "3 dientes de ajo", "1 pimentón", "3 cdas culantro", "3 cdas aceite", "Sal y pimienta"]}}, "principiante": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Saca el guacho del empaque y colócalo en un recipiente apto para microondas.", "Calienta por 4 minutos a temperatura media-alta.", "Remueve y calienta 1 minuto adicional si es necesario.", "Deja reposar 1 minuto antes de servir."], "ingredientes": ["2 porciones listas de guacho de rabito empacadas al vacío (1 taza cada una)."]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Coloca las porciones en un recipiente grande.", "Calienta en el microondas durante 7 minutos, revolviendo cada 2 minutos.", "Deja reposar 2 minutos y sirve caliente."], "ingredientes": ["4 porciones listas de guacho de rabito empacadas."]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Vacía las porciones en una olla y calienta a fuego medio por 10 minutos.", "Remueve ocasionalmente para evitar que se pegue.", "Sirve caliente."], "ingredientes": ["6 porciones listas de guacho de rabito cocido."]}}}', 'https://www.youtube.com/embed/85bxNZlhMSk?si=y9lrLBlYad6Z1mqC'),
	(9, 'Arroz con Coco', 'El arroz con coco es un plato tradicional panameño, especialmente popular en la costa Caribeña. Consiste en arroz cocido lentamente en leche de coco fresca, azúcar y sal, resultando en un acompañante dulce y cremoso que acompaña frecuentemente pescados o carnes saladas, especialmente en almuerzos y cenas.', 'https://blog.superxtra.com/wp-content/uploads/2023/02/blog-arroz-con-coco-1.png', 'Otros', 'Contiene coco (frutos secos). No contiene gluten ni lácteos.', '5-35 minutos', '2-6', '$5 - $19', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Extrae leche de coco fresca, asegurándote de colarla para eliminar residuos sólidos.", "Mezcla leche de coco, agua, azúcar y sal en olla. Calienta a fuego medio hasta que comience a hervir.", "Añade el arroz crudo y mezcla bien.", "Reduce fuego a bajo y cocina tapado durante 25-30 minutos, removiendo ocasionalmente para evitar que se pegue.", "Retira la rama de canela antes de servir.", "Servir caliente como acompañante."], "ingredientes": ["1 taza arroz crudo", "1 taza leche de coco natural recién extraída", "½ taza agua", "2 cucharadas azúcar sin procesar", "¼ cucharadita sal", "1 rama canela (opcional)"]}, "4_personas": {"precio": 10.0, "paso_a_paso": ["Extrae leche de coco fresca, asegurándote de colarla para eliminar residuos sólidos.", "Mezcla leche de coco, agua, azúcar y sal en olla. Calienta a fuego medio hasta que comience a hervir.", "Añade el arroz crudo y mezcla bien.", "Reduce fuego a bajo y cocina tapado durante 25-30 minutos, removiendo ocasionalmente para evitar que se pegue.", "Retira la rama de canela antes de servir.", "Servir caliente como acompañante."], "ingredientes": ["2 tazas arroz crudo", "2 tazas leche de coco fresca", "1 taza agua", "4 cucharadas azúcar sin procesar", "½ cucharadita sal", "2 ramas canela (opcional)"]}, "6_personas": {"precio": 14.0, "paso_a_paso": ["Extrae leche de coco fresca, asegurándote de colarla para eliminar residuos sólidos.", "Mezcla leche de coco, agua, azúcar y sal en olla. Calienta a fuego medio hasta que comience a hervir.", "Añade el arroz crudo y mezcla bien.", "Reduce fuego a bajo y cocina tapado durante 25-30 minutos, removiendo ocasionalmente para evitar que se pegue.", "Retira la rama de canela antes de servir.", "Servir caliente como acompañante."], "ingredientes": ["3 tazas arroz crudo", "3 tazas leche de coco fresca", "1 ½ taza agua", "6 cucharadas azúcar sin procesar", "¾ cucharadita sal", "3 ramas canela (opcional)"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["En una olla mediana, mezcla la leche de coco, agua, azúcar, sal y canela.", "Calienta a fuego medio hasta que empiece a hervir suavemente.", "Añade el arroz lavado y mezcla bien.", "Reduce el fuego a bajo, tapa la olla y cocina por 20-25 minutos o hasta que el arroz esté tierno y el líquido se haya absorbido.", "Retira la rama de canela antes de servir.", "Sirve caliente como acompañante."], "ingredientes": ["1 taza de arroz lavado y escurrido", "1 taza de leche de coco fresca", "½ taza de agua", "2 cucharadas de azúcar", "¼ cucharadita de sal", "1 rama de canela (opcional)"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["En una olla mediana, mezcla la leche de coco, agua, azúcar, sal y canela.", "Calienta a fuego medio hasta que empiece a hervir suavemente.", "Añade el arroz lavado y mezcla bien.", "Reduce el fuego a bajo, tapa la olla y cocina por 20-25 minutos o hasta que el arroz esté tierno y el líquido se haya absorbido.", "Retira la rama de canela antes de servir.", "Sirve caliente como acompañante."], "ingredientes": ["2 tazas arroz", "2 tazas leche de coco", "1 taza agua", "4 cucharadas azúcar", "½ cucharadita sal", "2 ramas canela (opcional)"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["En una olla mediana, mezcla la leche de coco, agua, azúcar, sal y canela.", "Calienta a fuego medio hasta que empiece a hervir suavemente.", "Añade el arroz lavado y mezcla bien.", "Reduce el fuego a bajo, tapa la olla y cocina por 20-25 minutos o hasta que el arroz esté tierno y el líquido se haya absorbido.", "Retira la rama de canela antes de servir.", "Sirve caliente como acompañante."], "ingredientes": ["3 tazas arroz", "3 tazas leche de coco", "1 ½ taza agua", "6 cucharadas azúcar", "¾ cucharadita sal", "3 ramas canela (opcional)"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Calentar en microondas a potencia alta durante 4-5 minutos, removiendo a mitad de tiempo para calentar uniformemente.", "Dejar reposar 2 minutos antes de servir.", "Servir caliente como acompañante de pescado o carne."], "ingredientes": ["2 porciones de arroz con coco cocinado y empacado."]}, "4_personas": {"precio": 14.0, "paso_a_paso": ["Calentar 7 minutos en microondas, removiendo a mitad de tiempo.", "Reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones empacadas."]}, "6_personas": {"precio": 19.0, "paso_a_paso": ["Calentar 9 minutos, removiendo a mitad de tiempo.", "Servir caliente."], "ingredientes": ["6 porciones empacadas."]}}}', 'https://www.youtube.com/embed/wNddpK2GnQM?si=jNpbDwcvxyFbnKgL'),
	(10, 'Tamal de Olla Panameño', 'El tamal de olla es una variante urbana y práctica del tradicional tamal panameño. En lugar de estar envuelto en hojas, se cocina en una cazuela, lo que facilita su preparación sin perder ese sabor clásico del maíz molido, el pollo sazonado, las pasitas, las aceitunas y las especias.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/5c2408c3ff31cd93357c198278ff02e1.jpg', 'Otros', 'Maíz, pasitas (sulfitos).', '5-60 minutos', '2-6', '$6 - $25', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cocina el pollo en agua con sal por 25 minutos. Desmenúzalo.", "Licúa el sofrito con un chorrito de agua.", "En una olla, sofríe el sofrito, añade pollo, pasitas y aceitunas.", "Agrega la masa y condimenta.", "Cocina a fuego bajo por 40 minutos, removiendo para que no se pegue.", "Sirve caliente."], "ingredientes": ["1 taza de maíz nuevo molido", "250 g de pollo crudo", "¼ cebolla, 1 ajo, ¼ ají, 1 rama culantro", "2 cucharadas pasitas, 2 cucharadas aceitunas", "Sal, pimienta, achiote"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Cocina el pollo en agua con sal por 25 minutos. Desmenúzalo.", "Licúa el sofrito con un chorrito de agua.", "En una olla, sofríe el sofrito, añade pollo, pasitas y aceitunas.", "Agrega la masa y condimenta.", "Cocina a fuego bajo por 50 minutos, removiendo para que no se pegue.", "Sirve caliente."], "ingredientes": ["2 tazas maíz molido", "500 g pollo", "Verduras para sofrito", "¼ taza pasitas y aceitunas"]}, "6_personas": {"precio": 15.0, "paso_a_paso": ["Cocina el pollo en agua con sal por 25 minutos. Desmenúzalo.", "Licúa el sofrito con un chorrito de agua.", "En una olla, sofríe el sofrito, añade pollo, pasitas y aceitunas.", "Agrega la masa y condimenta.", "Cocina a fuego bajo por 60 minutos, removiendo para que no se pegue.", "Sirve caliente."], "ingredientes": ["3 tazas maíz molido", "750 g pollo", "Verduras, pasitas y aceitunas al gusto"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una olla con aceite caliente, sofríe el sofrito por 3 minutos.", "Agrega el pollo, pasitas, aceitunas y achiote. Cocina 2 minutos.", "Incorpora la masa sazonada.", "Mezcla todo muy bien y cocina tapado a fuego medio-bajo durante 25 minutos, revolviendo ocasionalmente.", "Sirve caliente."], "ingredientes": ["1 taza de masa de maíz preparada", "250 g de pollo cocido y desmenuzado", "¼ taza de sofrito (ajo, cebolla, ají, culantro)", "2 cucharadas de pasitas", "2 cucharadas de aceitunas", "Sal, pimienta y achiote al gusto"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["En una olla con aceite caliente, sofríe el sofrito por 3 minutos.", "Agrega el pollo, pasitas, aceitunas y achiote. Cocina 2 minutos.", "Incorpora la masa sazonada.", "Mezcla todo muy bien y cocina tapado a fuego medio-bajo durante 35 minutos, revolviendo ocasionalmente.", "Servir caliente."], "ingredientes": ["2 tazas masa", "500 g pollo desmenuzado", "½ taza sofrito", "¼ taza pasitas", "¼ taza aceitunas", "Sal, pimienta, achiote"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["En una olla con aceite caliente, sofríe el sofrito por 3 minutos.", "Agrega el pollo, pasitas, aceitunas y achiote. Cocina 2 minutos.", "Incorpora la masa sazonada.", "Mezcla todo muy bien y cocina tapado a fuego medio-bajo durante 45 minutos, revolviendo ocasionalmente.", "Servir caliente."], "ingredientes": ["3 tazas masa", "750 g pollo", "¾ taza sofrito", "½ taza pasitas y aceitunas", "Condimentos al gusto"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Retira del empaque y colócalo en un plato apto para microondas.", "Calienta durante 5 minutos a potencia media-alta.", "Deja reposar 2 minutos antes de servir.", "Sirve con ensalada verde o arroz blanco."], "ingredientes": ["2 porciones de tamal de olla ya cocinado y empacado al vacío."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calienta en el microondas durante 9 minutos, revolviendo a mitad de tiempo.", "Deja reposar 3 minutos.", "Servir caliente."], "ingredientes": ["4 porciones de tamal de olla listos para calentar."]}, "6_personas": {"precio": 25.0, "paso_a_paso": ["Calienta durante 12 minutos a potencia media-alta.", "Deja reposar 3 minutos antes de servir.", "Puedes acompañar con tajadas o ensalada."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/ftf2gD4iqig?si=1gna-jam-EDQE-8Q'),
	(11, 'Bistec Picado a lo Panameño', 'Este plato es una joya de las fondas panameñas. El bistec picado se prepara con carne de res cortada en trozos pequeños y cocida en su propio jugo junto con cebolla, ajo, tomate y pimentón.', 'https://i.ytimg.com/vi/P2wwqiYAMss/maxresdefault.jpg', 'Res', 'Ninguno', '5-30 minutos', '2-6', '$6 - $25', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Cortar la carne en tiras.", "Picar todas las verduras.", "En sartén con aceite, sofreír vegetales.", "Añadir carne y cocinar 15-20 min.", "Servir caliente."], "ingredientes": ["300 g carne de res cruda", "½ cebolla, ¼ pimiento, 1 tomate", "1 ajo", "Aceite, sal y especias"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Cortar la carne en tiras.", "Picar todas las verduras.", "En sartén con aceite, sofreír vegetales.", "Añadir carne y cocinar 15-20 min.", "Servir caliente."], "ingredientes": ["600 g carne", "1 cebolla, 1 pimiento, 2 tomates", "2 ajos"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Cortar la carne en tiras.", "Picar todas las verduras.", "En sartén con aceite, sofreír vegetales.", "Añadir carne y cocinar 15-20 min.", "Servir caliente."], "ingredientes": ["900 g carne", "1 ½ cebolla, 1 ½ pimiento", "3 tomates", "3 ajos"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En sartén caliente, añade aceite y sofríe ajo, cebolla y pimiento.", "Añade la carne sazonada y cocina 5 minutos.", "Incorpora el tomate y cocina por 10 minutos más hasta espesar.", "Servir caliente."], "ingredientes": ["300 g carne de res en tiras", "½ cebolla, ½ tomate, ¼ pimiento rojo", "1 ajo picado", "Sal, pimienta, comino", "1 cda aceite"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["En sartén caliente, añade aceite y sofríe ajo, cebolla y pimiento.", "Añade la carne sazonada y cocina 5 minutos.", "Incorpora el tomate y cocina por 10 minutos más hasta espesar.", "Servir caliente."], "ingredientes": ["600 g carne", "1 cebolla, 1 pimiento, 2 tomates", "2 dientes ajo, 2 cdas aceite"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["En sartén caliente, añade aceite y sofríe ajo, cebolla y pimiento.", "Añade la carne sazonada y cocina 5 minutos.", "Incorpora el tomate y cocina por 15 minutos más hasta espesar.", "Servir caliente."], "ingredientes": ["900 g carne", "1 ½ cebolla y pimiento", "3 tomates", "3 dientes ajo"]}}, "principiante": {"2_personas": {"precio": 10.0, "paso_a_paso": ["Calienta en microondas durante 5 minutos, revolviendo a la mitad del tiempo.", "Servir caliente con arroz o tajadas."], "ingredientes": ["2 porciones de bistec picado cocinado."]}, "4_personas": {"precio": 18.0, "paso_a_paso": ["Calentar durante 9 minutos, removiendo a los 4.", "Servir."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 25.0, "paso_a_paso": ["Calentar durante 12 minutos, removiendo a mitad de tiempo.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/2WzfqRitCPg?si=s5gqEmmhW02dycdP'),
	(12, 'Guacho de Mariscos', 'El guacho de mariscos es uno de los platos más representativos del sabor caribeño panameño. Es una especie de arroz caldoso que combina mariscos frescos como camarones, calamares, almejas y conchas en una base de sofrito criollo, culantro y caldo de mariscos.', 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/561170d165f68568cccfb6b21b3e2442.png', 'Mariscos', 'Mariscos (camarones, calamares, almejas).', '5-40 minutos', '2-6', '$7 - $30', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Lavar y picar todos los vegetales finamente para hacer el sofrito.", "En una olla, calentar el aceite y sofreír la cebolla, ajo y ají por 3 minutos.", "Añadir los mariscos crudos y dorar ligeramente por 2 minutos.", "Agregar el arroz y mezclar.", "Incorporar el agua o caldo, salpimentar.", "Cocinar durante 30 minutos, revolviendo para que no se pegue.", "Añadir culantro picado al final.", "Servir caliente."], "ingredientes": ["½ taza arroz crudo", "200 g mariscos crudos (camarones, calamares, almejas)", "¼ cebolla, 1 diente ajo, ¼ ají dulce", "1 rama culantro", "1 taza agua o caldo casero", "1 cda aceite", "Sal, pimienta"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Lavar y picar todos los vegetales finamente para hacer el sofrito.", "En una olla, calentar el aceite y sofreír la cebolla, ajo y ají por 3 minutos.", "Añadir los mariscos crudos y dorar ligeramente por 2 minutos.", "Agregar el arroz y mezclar.", "Incorporar el agua o caldo, salpimentar.", "Cocinar durante 35 minutos, revolviendo para que no se pegue.", "Añadir culantro picado al final.", "Servir caliente."], "ingredientes": ["1 taza arroz", "400 g mariscos crudos", "½ cebolla, 2 dientes ajo, ½ ají", "2 ramas culantro", "2 tazas caldo"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Lavar y picar todos los vegetales finamente para hacer el sofrito.", "En una olla, calentar el aceite y sofreír la cebolla, ajo y ají por 3 minutos.", "Añadir los mariscos crudos y dorar ligeramente por 2 minutos.", "Agregar el arroz y mezclar.", "Incorporar el agua o caldo, salpimentar.", "Cocinar durante 40 minutos, revolviendo para que no se pegue.", "Añadir culantro picado al final.", "Servir caliente."], "ingredientes": ["1 ½ tazas arroz", "600 g mariscos", "¾ cebolla, 3 ajos, ¾ ají", "3 ramas culantro", "3 tazas caldo"]}}, "intermedio": {"2_personas": {"precio": 9.0, "paso_a_paso": ["En una olla, calienta el aceite y sofríe el sofrito durante 2-3 minutos.", "Agrega los mariscos ya sazonados y cocina por 2 minutos.", "Añade el arroz y mezcla bien.", "Vierte el caldo caliente y cocina a fuego medio por 20-25 minutos, removiendo para evitar que se pegue.", "El arroz debe quedar cremoso, no seco. Ajusta con más caldo si es necesario.", "Sirve caliente."], "ingredientes": ["½ taza de arroz lavado", "200 g mezcla de mariscos limpios y sazonados (camarón, calamar, almeja)", "1 taza de caldo de mariscos", "¼ taza sofrito (cebolla, ajo, ají, culantro)", "1 cucharada aceite", "Sal y pimienta al gusto"]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["En una olla, calienta el aceite y sofríe el sofrito durante 4-5 minutos.", "Agrega los mariscos ya sazonados y cocina por 2 minutos.", "Añade el arroz y mezcla bien.", "Vierte el caldo caliente y cocina a fuego medio por 25-35 minutos, removiendo para evitar que se pegue.", "El arroz debe quedar cremoso, no seco. Ajusta con más caldo si es necesario.", "Sirve caliente."], "ingredientes": ["1 taza arroz", "400 g mariscos sazonados", "2 tazas caldo", "½ taza sofrito", "2 cucharadas aceite", "Sal, pimienta"]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["En una olla, calienta el aceite y sofríe el sofrito durante 5 minutos.", "Agrega los mariscos ya sazonados y cocina por 2 minutos.", "Añade el arroz y mezcla bien.", "Vierte el caldo caliente y cocina a fuego medio por 35 minutos, removiendo para evitar que se pegue.", "El arroz debe quedar cremoso, no seco. Ajusta con más caldo si es necesario.", "Sirve caliente."], "ingredientes": ["1 ½ tazas arroz", "600 g mariscos sazonados", "3 tazas caldo", "¾ taza sofrito", "3 cucharadas aceite"]}}, "principiante": {"2_personas": {"precio": 12.0, "paso_a_paso": ["Retira del empaque y colócalo en un recipiente apto para microondas.", "Calienta a potencia media-alta durante 5 minutos, revolviendo a los 2 minutos para distribuir el calor.", "Deja reposar 1 minuto antes de servir.", "Acompaña con patacones o ensalada."], "ingredientes": ["2 porciones de guacho de mariscos empacadas al vacío."]}, "4_personas": {"precio": 22.0, "paso_a_paso": ["Calentar en microondas durante 9 minutos, removiendo a mitad de tiempo.", "Reposar 2 minutos.", "Servir caliente."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 30.0, "paso_a_paso": ["Calienta durante 12 minutos, removiendo a los 6 minutos.", "Servir caliente con patacones o pan."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/Mu7e-A0CxQo?si=XSUrdBodSsSBwY4z'),
	(13, 'Lengua en Salsa Panameña', 'La lengua en salsa es un plato tradicional muy valorado en los hogares panameños, especialmente para almuerzos dominicales o fechas especiales. Se prepara con lengua de res cocida lentamente hasta que quede suave y se baña en una salsa criolla hecha con tomate, cebolla, ajo, pimentón y culantro.', 'https://www.recetaspanama.com/base/stock/Recipe/lengua-en-salsa/lengua-en-salsa_web.jpg.webp', 'Res', 'Ninguno', '6-145 minutos', '2-6', '$7 - $30', '{"avanzado": {"2_personas": {"precio": 7.0, "paso_a_paso": ["Lava bien la lengua y colócala en una olla con sal, ajo y culantro.", "Hierve por 1 hora y media o hasta que esté blanda.", "Pela la lengua y córtala en rebanadas.", "Sofríe vegetales y condimentos.", "Añade la lengua cocida y mezcla todo.", "Cocina por 15 minutos en salsa espesa.", "Servir con arroz o yuca hervida."], "ingredientes": ["300 g lengua cruda", "¼ cebolla, ½ tomate, ¼ pimentón", "1 ajo, 1 cda culantro", "2 cdas salsa de tomate", "Sal, pimienta, comino", "1 cda aceite"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["Lava bien la lengua y colócala en una olla con sal, ajo y culantro.", "Hierve por 1 hora y 45 minutos o hasta que esté blanda.", "Pela la lengua y córtala en rebanadas.", "Sofríe vegetales y condimentos.", "Añade la lengua cocida y mezcla todo.", "Cocina por 15 minutos en salsa espesa.", "Servir con arroz o yuca hervida."], "ingredientes": ["600 g lengua", "½ cebolla, 2 tomates, ½ pimentón", "2 ajos, 2 cdas culantro", "4 cdas salsa"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["Lava bien la lengua y colócala en una olla con sal, ajo y culantro.", "Hierve por 2 horas o hasta que esté blanda.", "Pela la lengua y córtala en rebanadas.", "Sofríe vegetales y condimentos.", "Añade la lengua cocida y mezcla todo.", "Cocina por 15 minutos en salsa espesa.", "Servir con arroz o yuca hervida."], "ingredientes": ["900 g lengua", "1 cebolla, 2 tomates, 1 pimentón", "3 ajos, 3 cdas culantro", "6 cdas salsa de tomate"]}}, "intermedio": {"2_personas": {"precio": 9.0, "paso_a_paso": ["En sartén, calienta el aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Agrega el tomate, salsa de tomate y condimentos. Cocina 2 minutos.", "Añade la lengua cocida y mezcla con la salsa.", "Cocina tapado por 10-12 minutos a fuego bajo hasta que espese.", "Servir caliente."], "ingredientes": ["300 g de lengua cocida y rebanada", "¼ cebolla en julianas", "½ tomate picado", "¼ pimentón", "1 ajo picado", "1 cda culantro", "2 cdas salsa de tomate", "Sal, pimienta y comino", "1 cda aceite"]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["En sartén, calienta el aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Agrega el tomate, salsa de tomate y condimentos. Cocina 2 minutos.", "Añade la lengua cocida y mezcla con la salsa.", "Cocina tapado por 15 minutos a fuego bajo hasta que espese.", "Servir caliente."], "ingredientes": ["600 g lengua cocida", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 2 cdas culantro", "4 cdas salsa de tomate", "Condimentos"]}, "6_personas": {"precio": 23.0, "paso_a_paso": ["En sartén, calienta el aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Agrega el tomate, salsa de tomate y condimentos. Cocina 2 minutos.", "Añade la lengua cocida y mezcla con la salsa.", "Cocina tapado por 20 minutos a fuego bajo hasta que espese.", "Servir caliente."], "ingredientes": ["900 g lengua cocida", "1 cebolla, 1 pimentón, 2 tomates", "3 ajos, 3 cdas culantro", "6 cdas salsa de tomate", "Condimentos"]}}, "principiante": {"2_personas": {"precio": 12.0, "paso_a_paso": ["Retira del empaque y coloca en un recipiente apto para microondas.", "Calienta durante 6 minutos a potencia media-alta, revolviendo a los 3 minutos.", "Deja reposar 1 minuto antes de servir.", "Acompañar con arroz blanco o puré de papas."], "ingredientes": ["2 porciones de lengua cocida en salsa criolla, empacadas al vacío."]}, "4_personas": {"precio": 22.0, "paso_a_paso": ["Calentar durante 10 minutos, revolviendo a la mitad del tiempo.", "Dejar reposar 2 minutos antes de servir."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 30.0, "paso_a_paso": ["Calienta durante 13 minutos, removiendo a los 6.", "Servir caliente con arroz o patacones."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/Ei9jgfOMfXM?si=AIZjba981qqij_t7'),
	(14, 'Bofe Guisado Panameño', 'El bofe guisado es un plato muy popular en comunidades panameñas, especialmente en zonas rurales y fondas del interior. El bofe, que es el pulmón de la res, se limpia y cocina hasta suavizarse, luego se guisa con vegetales como cebolla, tomate, pimentón y ajo en una salsa criolla.', 'https://www.ladona.com.pa/ladona/uploads/recipe/image/236/1739994136.jpg', 'Res', 'Ninguno', '6-115 minutos', '2-6', '$5 - $21', '{"avanzado": {"2_personas": {"precio": 5.0, "paso_a_paso": ["Lava bien el bofe con limón o vinagre y enjuágalo varias veces.", "Hierve el bofe en agua con sal durante 1 hora, luego escúrrelo y pícalo.", "Pica la cebolla, ajo, tomate y pimentón.", "Sofríe los vegetales por 3 minutos.", "Agrega el bofe cocido, salsa de tomate y condimentos.", "Cocina durante 15 minutos a fuego medio.", "Servir caliente."], "ingredientes": ["250 g de bofe crudo", "¼ cebolla, ½ tomate, ¼ pimentón", "1 diente de ajo", "2 cdas salsa de tomate", "Sal, pimienta, comino", "1 cda aceite", "Jugo de limón o vinagre para limpieza"]}, "4_personas": {"precio": 9.0, "paso_a_paso": ["Lava bien el bofe con limón o vinagre y enjuágalo varias veces.", "Hierve el bofe en agua con sal durante 1 hora y media, luego escúrrelo y pícalo.", "Pica la cebolla, ajo, tomate y pimentón.", "Sofríe los vegetales por 3 minutos.", "Agrega el bofe cocido, salsa de tomate y condimentos.", "Cocina durante 20 minutos a fuego medio.", "Servir caliente."], "ingredientes": ["500 g de bofe", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 13.0, "paso_a_paso": ["Lava bien el bofe con limón o vinagre y enjuágalo varias veces.", "Hierve el bofe en agua con sal durante 1 hora y 45 minutos, luego escúrrelo y pícalo.", "Pica la cebolla, ajo, tomate y pimentón.", "Sofríe los vegetales por 3 minutos.", "Agrega el bofe cocido, salsa de tomate y condimentos.", "Cocina durante 25 minutos a fuego medio.", "Servir caliente."], "ingredientes": ["750 g de bofe", "1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "intermedio": {"2_personas": {"precio": 6.0, "paso_a_paso": ["En una sartén, calienta aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Añade el tomate picado y mezcla bien.", "Incorpora el bofe cocido y picado.", "Agrega la salsa de tomate, sal, pimienta y comino.", "Cocina a fuego medio por 15 minutos, hasta que la salsa espese.", "Servir caliente."], "ingredientes": ["250 g de bofe cocido y picado", "¼ cebolla en julianas", "½ tomate", "¼ pimentón", "1 ajo", "2 cdas salsa de tomate", "Sal, pimienta, comino", "1 cda aceite"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["En una sartén, calienta aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Añade el tomate picado y mezcla bien.", "Incorpora el bofe cocido y picado.", "Agrega la salsa de tomate, sal, pimienta y comino.", "Cocina a fuego medio por 20 minutos, hasta que la salsa espese.", "Servir caliente."], "ingredientes": ["500 g de bofe cocido", "½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa", "Especias"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["En una sartén, calienta aceite y sofríe el ajo, cebolla y pimentón por 3 minutos.", "Añade el tomate picado y mezcla bien.", "Incorpora el bofe cocido y picado.", "Agrega la salsa de tomate, sal, pimienta y comino.", "Cocina a fuego medio por 25 minutos, hasta que la salsa espese.", "Servir caliente."], "ingredientes": ["750 g de bofe cocido", "1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa de tomate", "Sal, pimienta, comino"]}}, "principiante": {"2_personas": {"precio": 8.0, "paso_a_paso": ["Retirar del empaque y colocar en recipiente apto para microondas.", "Calentar durante 5-6 minutos a potencia media-alta.", "Dejar reposar 1 minuto antes de servir.", "Acompañar con arroz o patacones."], "ingredientes": ["2 porciones de bofe guisado empacado al vacío."]}, "4_personas": {"precio": 15.0, "paso_a_paso": ["Calienta durante 9 minutos, revolviendo a los 5 minutos.", "Dejar reposar 2 minutos.", "Servir con acompañamiento."], "ingredientes": ["4 porciones listas."]}, "6_personas": {"precio": 21.0, "paso_a_paso": ["Calentar en microondas durante 12 minutos, removiendo cada 4 minutos.", "Servir caliente."], "ingredientes": ["6 porciones listas."]}}}', 'https://www.youtube.com/embed/iLo7znhr_TA?si=ABe6YmsDisJYyOb_'),
	(15, 'Pollo Guisado al Estilo Panameño', 'El pollo guisado es una receta clásica de la cocina criolla panameña, especialmente en el interior del país. Se elabora guisando presas de pollo en una salsa espesa con tomate, cebolla, pimentón, ajo y papas.', 'https://foodmetamorphosis.com/wp-content/uploads/2025/01/puerto-rican-fricase-de-pollo-chicken-fricase.jpg', 'Pollo', 'Ninguno', '6-40 minutos', '2-6', '$6 - $24', '{"avanzado": {"2_personas": {"precio": 6.0, "paso_a_paso": ["Lava y sazona el pollo con sal, pimienta y orégano.", "En una olla, calienta el aceite y sofríe el ajo, cebolla, tomate y pimentón por 3 minutos.", "Añade el pollo y dóralo por ambos lados.", "Agrega la papa en cubos, salsa de tomate y ½ taza de agua.", "Cocina a fuego medio-bajo por 30 minutos, removiendo ocasionalmente.", "Servir con arroz blanco."], "ingredientes": ["2 presas de pollo crudas", "½ papa", "¼ cebolla, 1 ajo, ½ tomate, ¼ pimentón", "2 cdas salsa de tomate", "Sal, pimienta, orégano", "1 cda aceite"]}, "4_personas": {"precio": 11.0, "paso_a_paso": ["Lava y sazona el pollo con sal, pimienta y orégano.", "En una olla, calienta el aceite y sofríe el ajo, cebolla, tomate y pimentón por 3 minutos.", "Añade el pollo y dóralo por ambos lados.", "Agrega la papa en cubos, salsa de tomate y ½ taza de agua.", "Cocina a fuego medio-bajo por 35 minutos, removiendo ocasionalmente.", "Servir con arroz blanco."], "ingredientes": ["4 presas de pollo crudo", "1 papa, ½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 16.0, "paso_a_paso": ["Lava y sazona el pollo con sal, pimienta y orégano.", "En una olla, calienta el aceite y sofríe el ajo, cebolla, tomate y pimentón por 3 minutos.", "Añade el pollo y dóralo por ambos lados.", "Agrega la papa en cubos, salsa de tomate y ½ taza de agua.", "Cocina a fuego medio-bajo por 40 minutos, removiendo ocasionalmente.", "Servir con arroz blanco."], "ingredientes": ["6 presas de pollo", "2 papas, 1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "intermedio": {"2_personas": {"precio": 7.0, "paso_a_paso": ["En una sartén con aceite, sofríe el ajo, cebolla, pimentón y tomate durante 3 minutos.", "Añade las papas, pollo cocido y salsa de tomate.", "Agrega ½ taza de agua y condimenta.", "Cocina todo junto durante 15 minutos, revolviendo ocasionalmente.", "Servir con arroz o patacones."], "ingredientes": ["2 presas de pollo cocidas y sazonadas", "½ papa en cubos", "¼ cebolla en julianas", "½ tomate", "¼ pimentón", "1 diente de ajo", "2 cdas salsa de tomate", "Sal, pimienta y orégano", "1 cda aceite"]}, "4_personas": {"precio": 13.0, "paso_a_paso": ["En una sartén con aceite, sofríe el ajo, cebolla, pimentón y tomate durante 3 minutos.", "Añade las papas, pollo cocido y salsa de tomate.", "Agrega ½ taza de agua y condimenta.", "Cocina todo junto durante 20 minutos, revolviendo ocasionalmente.", "Servir con arroz o patacones."], "ingredientes": ["4 presas de pollo cocidas", "1 papa, ½ cebolla, 1 tomate, ½ pimentón", "2 ajos, 4 cdas salsa"]}, "6_personas": {"precio": 18.0, "paso_a_paso": ["En una sartén con aceite, sofríe el ajo, cebolla, pimentón y tomate durante 3 minutos.", "Añade las papas, pollo cocido y salsa de tomate.", "Agrega ½ taza de agua y condimenta.", "Cocina todo junto durante 25 minutos, revolviendo ocasionalmente.", "Servir con arroz o patacones."], "ingredientes": ["6 presas de pollo", "2 papas, 1 cebolla, 1 tomate grande, 1 pimentón", "3 ajos, 6 cdas salsa"]}}, "principiante": {"2_personas": {"precio": 9.0, "paso_a_paso": ["Colocar el contenido en un recipiente apto para microondas.", "Calentar durante 6 minutos, revolviendo a los 3 minutos.", "Reposar 1 minuto.", "Servir con arroz blanco o yuca cocida."], "ingredientes": ["2 presas de pollo guisadas en fricasé, con papas y salsa, empacadas al vacío."]}, "4_personas": {"precio": 17.0, "paso_a_paso": ["Calienta durante 10 minutos, removiendo a los 5 minutos.", "Servir caliente con el acompañamiento deseado."], "ingredientes": ["4 presas listas con guarnición."]}, "6_personas": {"precio": 24.0, "paso_a_paso": ["Calienta en microondas durante 13 minutos, removiendo cada 4 minutos.", "Servir."], "ingredientes": ["6 presas de pollo guisadas."]}}}', 'https://www.youtube.com/embed/WuVBjgJNqH8?si=ICQYKz1Gplm0jPgo');

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
	(10, 'Alberto Rodríguez', 'carv2012@gmail.com', '61744815', 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270'),
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
