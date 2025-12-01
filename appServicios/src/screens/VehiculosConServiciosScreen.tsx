import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';

export const VehiculosConServiciosScreen: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get('/vehiculos/con-servicios');
      setItems(res.data.data || res.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || String(e));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const renderServicio = (s: any) => (
    <View style={styles.servicioRow} key={String(s.id_servicio || Math.random())}>
      <View style={styles.servicioLeft} />
      <View style={styles.servicioBody}>
        <Text style={styles.servicioTipo}>{s.tipo}</Text>
        <Text style={styles.servicioMeta}>{s.fecha} • ${Number(s.costo).toFixed(2)}</Text>
        {s.descripcion ? <Text style={styles.servicioDesc}>{s.descripcion}</Text> : null}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.placas}>{item.placas}</Text>
          <Text style={styles.marca}>{item.marca} • {item.modelo} • {item.anio}</Text>
          <Text style={styles.propietario}>{item.propietario}</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{(item.servicios || []).length}</Text></View>
      </View>

      <View style={styles.cardBody}>
        {(item.servicios || []).length === 0
          ? <Text style={styles.empty}>Sin servicios</Text>
          : (item.servicios || []).map((s: any) => renderServicio(s))
        }
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {loading && <ActivityIndicator style={{marginTop:16}} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id_vehiculo || i.placas)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No hay resultados</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  error: { color: 'red', padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  placas: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  marca: { fontSize: 13, color: '#666' },
  propietario: { fontSize: 12, color: '#888', marginTop: 6 },
  countBadge: { backgroundColor: '#0b78d1', minWidth: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  countText: { color: '#fff', fontWeight: '700' },
  cardBody: { marginTop: 8 },
  empty: { color: '#666' },
  servicioRow: { flexDirection: 'row', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f3f6' },
  servicioLeft: { width: 6, height: '100%', backgroundColor: '#0b78d1', borderRadius: 3, marginRight: 10 },
  servicioBody: { flex: 1 },
  servicioTipo: { fontSize: 14, fontWeight: '700' },
  servicioMeta: { fontSize: 12, color: '#666', marginTop: 4 },
  servicioDesc: { fontSize: 12, color: '#444', marginTop: 6 }
});
