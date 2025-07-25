import React from 'react';
import { Linking, TouchableOpacity, StyleSheet, Image } from 'react-native';
const whatsappIcono = require('../../assets/whatsapp-icon.png');;
const whatsappNumber = '50768452603';
const message = 'Hola, tengo una consulta Pa la olla.';

const openWhatsApp = () => {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch(() => {
    alert('Asegúrate de tener WhatsApp instalado');
  });
};

const WhatsAppButton = () => (
  <TouchableOpacity style={styles.floatingButton} onPress={openWhatsApp}>
    <Image
      source={whatsappIcono}
      style={styles.whatsappIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  whatsappIcon: {
    width: 70,
    height: 70,
  },
});

export default WhatsAppButton;