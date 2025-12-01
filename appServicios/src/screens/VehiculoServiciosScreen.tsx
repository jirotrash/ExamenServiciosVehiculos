import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';
import { ServicioDto } from '../interfaces/serviciosInterface';

interface Props {
  route: any;
  navigation: any;
}

export const VehiculoServiciosScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params as { id: number };
  const [servicios, setServicios] = useState<ServicioDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/vehiculos/${id}/servicios`);
      setServicios(res.data.data || res.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === 'number') fetchServicios();
  }, [id]);

  const renderItem = ({ item }: { item: ServicioDto }) => (
    <View style={styles.item}>
      <Text style={styles.tipo}>{item.tipo}</Text>
      <Text style={styles.costo}>Costo: ${item.costo}</Text>
      <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={servicios}
          keyExtractor={(s) => String(s.id_servicio || s.tipo + s.fecha)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay servicios</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  tipo: { fontWeight: '700' },
  costo: { color: '#333', marginTop: 6 },
  fecha: { color: '#666', marginTop: 4 }
});
