import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const PantallaPerfil = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Perfil principal */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/user.png')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>Usuario</Text>
        <Text style={styles.status}>Cliente Activo</Text>
      </View>

      {/* Información y estadísticas */}
      <View style={styles.infoWrapper}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Información Personal</Text>
          <Text style={styles.boxText}>Correo: usuario@example.com</Text>
          <Text style={styles.boxText}>Teléfono: 123-456</Text>
          <Text style={styles.boxText}>Dirección: Ciudad de Panamá</Text>
        
          <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>Estadísticas</Text>
          <View style={styles.row}>
            <Text>Pedidos</Text>
            <Text style={styles.badge}>12</Text>
          </View>
          <View style={styles.row}>
            <Text>Favoritas</Text>
            <Text style={styles.badgePink}>8</Text>
          </View>
          <View style={styles.row}>
            <Text>Reseñas</Text>
            <Text style={styles.badge}>5</Text>
          </View>
        </View>
      </View>

      {/* Pedidos recientes */}
      <View style={styles.largeBox}>
        <Text style={styles.boxTitle}>Pedidos Recientes</Text>
        <View style={styles.recentOrder}>
          <View>
            <Text style={styles.orderTitle}>Sancocho Panameño</Text>
            <Text style={styles.orderSubtitle}>Pedido #PA001 • 15 de enero de 2024</Text>
          </View>
          <View style={styles.orderButtons}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ver Receta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Ver Todos los Pedidos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    backgroundColor: '#F59E0B',
    borderRadius: 100,
    padding: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7F1D1D',
  },
  status: {
    backgroundColor: '#F59E0B',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 12,
  },
  infoWrapper: {
    gap: 16,
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  largeBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#7F1D1D',
  },
  boxText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: '#000',
  },
  badgePink: {
    backgroundColor: '#F472B6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: '#000',
  },
  recentOrder: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  orderTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1F2937',
  },
  orderSubtitle: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
  },
  orderButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginLeft: 56,
  },
  button: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mainButton: {
    backgroundColor: '#F97316',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

});

export default PantallaPerfil;
