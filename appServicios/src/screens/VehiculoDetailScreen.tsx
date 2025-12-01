import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehiculoDto } from '../interfaces/serviciosInterface';

interface Props {
  route: any;
  navigation: any;
}

export const VehiculoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const vehiculo = route?.params?.vehiculo as VehiculoDto | undefined;

  const activoValue = (() => {
    const a = (vehiculo as any)?.activo;
    if (a === undefined || a === null) return true;
    if (typeof a === 'boolean') return a;
    if (typeof a === 'number') return a !== 0;
    if (typeof a === 'string') return a.toLowerCase() === 'true' || a === '1';
    return Boolean(a);
  })();

  if (!vehiculo) {
    return (
      <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, color: '#333' }}>No se encontraron datos del vehículo.</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Volver" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.card}>
        <Text style={styles.id}>ID:{vehiculo.id_vehiculo}</Text>
        <Text style={styles.placas}>{vehiculo.placas}</Text>
        <Text style={styles.marca}>{vehiculo.marca} - {vehiculo.modelo}</Text>
        <Text style={styles.anio}>Año: {vehiculo.anio}</Text>
        <Text style={styles.prop}>Propietario: {vehiculo.propietario}</Text>
        <Text style={[styles.activo, { color: activoValue ? '#27ae60' : '#e74c3c' }]}>{activoValue ? 'Activo' : 'Inactivo'}</Text>
      </View>

      <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Ver servicios" onPress={() => navigation.navigate('VehiculoServicios', { id: vehiculo.id_vehiculo })} />
        <View style={{ width: 12 }} />
        <Button title="Editar" onPress={() => navigation.navigate('VehiculoForm', { vehiculo })} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  card: { margin: 12, padding: 16, borderRadius: 12, backgroundColor: '#fff' },
  placas: { fontSize: 18, fontWeight: '800' },
  marca: { fontSize: 14, color: '#666', marginTop: 6 },
  anio: { fontSize: 13, color: '#333', marginTop: 8 },
  prop: { fontSize: 13, color: '#444', marginTop: 6 },
  activo: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  id: { fontSize: 12, color: '#242323ff', marginTop: 4 }
});
