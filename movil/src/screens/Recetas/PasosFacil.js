import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from "@react-navigation/native";
import WhatsAppButton from '../../components/WhatsAppButton';

const PasosFacil = () => {
  const route = useRoute();
  const { receta } = route.params;

  return (
    <View style={{ flex: 1 }}>
      
        <Text style={styles.title}>
          {receta.nombre_receta} – <Text style={styles.highlight}>Listo para Calentar</Text>
        </Text>
        <Text style={styles.subtitle}>
          Tu {receta.nombre_receta} ya está preparada. Solo necesitas calentar y ¡a disfrutar!
        </Text>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>⚡</Text>
            <Text style={styles.sectionTitle}>Instrucciones de Calentamiento</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheading}>🍽️ Microondas (Recomendado)</Text>
            <View style={styles.list}>
              {receta.niveles?.[receta.receta_nivel]?.[`${receta.receta_cantidad}_personas`]?.paso_a_paso?.map((paso_a_paso, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>
                    <Text style={styles.ingredientNumber}>{index + 1}. </Text>
                    {paso_a_paso}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheading}>Alternativa: Estufa</Text>
            <Text style={styles.altMethod}>
              Sartén: Vacía el contenido en una sartén a fuego medio-bajo, agrega una cucharada de agua y calienta por 3–5 minutos revolviendo ocasionalmente.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Consejos Importantes</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Asegúrate que esté bien caliente antes de servir</Text>
              <Text style={styles.listItem}>• Ten cuidado al retirar del microondas, puede estar muy caliente</Text>
              <Text style={styles.listItem}>• Consume inmediatamente después de calentar</Text>
            </View>
          </View>

          <View style={styles.finalBox}>
            <Text style={styles.finalText}>¡Calienta y a Comer! 🍽️</Text>
          </View>
        </View>

       
      

      <WhatsAppButton style={styles.whatsappButton} />
    </View>
  );
};

const styles = StyleSheet.create({
    whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#fffefc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#581c1c',
  },
  highlight: {
    color: '#7f1d1d',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f1d1d',
    opacity: 0.8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 14,
  },
  icon: {
    fontSize: 18,
  },
  section: {
    gap: 6,
  },
  subheading: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
    color: '#991b1b',
  },
  list: {
    gap: 4,
  },
  listItem: {
    fontSize: 13,
    color: '#450a0a',
  },
  altMethod: {
    fontSize: 13,
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    color: '#450a0a',
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  warningTitle: {
    color: '#b91c1c',
    fontWeight: '600',
    marginBottom: 6,
  },
  finalBox: {
    backgroundColor: '#ffedd5',
    borderColor: '#fed7aa',
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  finalText: {
    color: '#c2410c',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  finalSubtext: {
    fontSize: 13,
    marginTop: 6,
    color: '#78350f',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 20, // separa los botones
    flexWrap: 'wrap',
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#7f1d1d',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  outlinedButtonText: {
    color: '#7f1d1d',
    fontSize: 14,
    fontWeight: '500',
  },
  filledButton: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  filledButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PasosFacil;


