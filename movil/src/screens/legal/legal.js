import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export function PoliticaScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Botón para volver a la pantalla anterior */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Volver</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Política de Privacidad</Text>

        <View style={styles.prose}>
          <Text style={styles.paragraph}>
            En Pa’ la Olla, valoramos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal al usar nuestra plataforma web o móvil.
          </Text>

          <Text style={styles.heading2}>1. Información que recopilamos</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Datos personales:</Text> nombre, dirección, correo electrónico, número de teléfono.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Información de pago:</Text> procesada exclusivamente a través de PayPal. No almacenamos información de tarjetas de crédito o débito en nuestros.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Historial de pedidos</Text> </Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Datos de navegación:</Text> cookies, dirección IP, tipo de dispositivo, navegador.</Text>
          </View>

          <Text style={styles.heading2}>2. Uso de la información</Text>
          <Text style={styles.paragraph}>Utilizamos la información para:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Procesar pedidos y entregas.</Text>
            <Text style={styles.listItem}>• Mejorar la experiencia del usuario.</Text>
            <Text style={styles.listItem}>• Realizar sugerencias de recetas.</Text>
            <Text style={styles.listItem}>• Cumplir con obligaciones legales.</Text>
          </View>

          <Text style={styles.heading2}>3. Compartir información con terceros</Text>
          <Text style={styles.paragraph}>Compartimos datos únicamente con:</Text>
           <View style={styles.list}>
            <Text style={styles.listItem}>• <Text style={styles.bold}>PayPal:</Text> Para procesar pagos.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Proveedores logísticos:</Text> Para realizar entregas de ingredientes.</Text>
            <Text style={styles.listItem}>• No vendemos ni alquilamos información personal a terceros.</Text>
          </View>

          <Text style={styles.heading2}>4. Seguridad de la información</Text>
          <Text style={styles.paragraph}>
            Limitamos el acceso a la información sensible solo al personal autorizado.
          </Text>

          <Text style={styles.heading2}>5. Derechos del usuario</Text>
          <Text style={styles.paragraph}>Como usuario, tienes derecho a:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Acceder, corregir o eliminar sus datos.</Text>
            <Text style={styles.listItem}>• Solicitar la eliminación de su cuenta y todos los datos asociados.</Text>
          </View>

          <Text style={styles.heading2}>6. Cambios a esta política</Text>
          <Text style={styles.paragraph}>
            Nos reservamos el derecho de modificar esta política. Notificaremos a los usuarios por correo o mediante la plataforma.
          </Text>

          <Text style={[styles.paragraph, styles.bold, styles.footerText]}>
            Fecha de entrada en vigor: 28 de Julio 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function TerminosScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Volver</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Términos y Condiciones</Text>

        <View style={styles.prose}>
          <Text style={styles.paragraph}>
            En Pa’ la Olla, valoramos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal al usar nuestra plataforma web o móvil.
          </Text>

          <Text style={styles.heading2}>1. Uso de la plataforma</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Solo mayores de 18 años pueden realizar pedidos.</Text>
            <Text style={styles.listItem}>•El usuario se compromete a proporcionar información veraz al registrarse.</Text>
          </View>

          <Text style={styles.heading2}>2. Proceso de pedidos</Text>
          <Text style={styles.paragraph}>Utilizamos la información para:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Los pedidos de ingredientes se realizan al seleccionar una receta.</Text>
            <Text style={styles.listItem}>•	El pago se efectúa mediante PayPal, bajo sus propios términos y condiciones.</Text>
            <Text style={styles.listItem}>•	El usuario es responsable de verificar la dirección de entrega antes de confirmar el pedido.</Text>
          </View>

          <Text style={styles.heading2}>3. Reembolsos y cancelaciones</Text>
          <Text style={styles.paragraph}>Compartimos datos únicamente con:</Text>
           <View style={styles.list}>
            <Text style={styles.listItem}>•Una vez confirmado y procesado un pedido, no se aceptan cancelaciones.</Text>
            <Text style={styles.listItem}>•Si el pedido llega incompleto o con ingredientes en mal estado, el usuario podrá solicitar revisión y posible reembolso parcial dentro de las 24 horas posteriores a la entrega.</Text>
          </View>

          <Text style={styles.heading2}>4. Disponibilidad del servicio</Text>
          <Text style={styles.paragraph}>
            La plataforma puede no estar disponible por mantenimiento o fallas técnicas. Pa’ la Olla no garantiza disponibilidad continua.
          </Text>

          <Text style={styles.heading2}>5. Modificaciones</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>Nos reservamos el derecho de modificar funcionalidades, precios o términos sin previo aviso. Los cambios se comunicarán de forma oportuna.</Text>
          </View>

          <Text style={styles.heading2}>6. Ley aplicable</Text>
          <Text style={styles.paragraph}>
            Este acuerdo se rige por las leyes de la República de Panamá.
          </Text>

          <Text style={[styles.paragraph, styles.bold, styles.footerText]}>
            Fecha de entrada en vigor: 28 de Julio 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


//==================================================================
// Estilos para los componentes
//==================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Un color de fondo neutro
    paddingTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#991B1B', // text-red-800
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#991B1B', // text-red-800
    marginBottom: 16,
  },
  prose: {
    // Contenedor para el texto principal
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B91C1C', // text-red-700
    marginTop: 24,
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151', // gray-700
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151', // gray-700
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
  }
});
