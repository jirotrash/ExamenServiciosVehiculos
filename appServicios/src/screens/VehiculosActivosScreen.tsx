import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';
import { useFocusEffect } from '@react-navigation/native';

export const VehiculosActivosScreen: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviciosApi.get('/vehiculos/activos');
      setData(res.data.data || res.data || []);
    } catch (e: any) {
      const srv = e?.response?.data || e?.message || String(e);
      setError(typeof srv === 'string' ? srv : JSON.stringify(srv));
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchActivos();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => {
    const placas = String(item.placas || '').toUpperCase();
    const id = item.id_vehiculo ?? item.id ?? null;
    const subtitle = `${item.marca || ''} ${item.modelo || ''} - ${item.anio || ''}`.trim();
    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardText}>
            {id !== null ? <Text style={styles.idText}>ID: {String(id)}</Text> : null}
            <Text style={styles.placas}>{placas}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchActivos} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.refreshText}>REFRESCAR</Text>}
        </TouchableOpacity>
      </View>

      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id_vehiculo || i.placas)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.empty}>No hay vehículos</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  header: { backgroundColor: '#0b3b5c', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  refreshBtn: { backgroundColor: '#0b78d1', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  refreshText: { color: '#fff', fontWeight: '700' },
  listContainer: { padding: 12, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardText: { flex: 1 },
  placas: { fontWeight: '800', fontSize: 14, color: '#0b3b5c' },
  idText: { color: '#8a8f98', fontSize: 12, marginBottom: 4, fontWeight: '600' },
  subtitle: { color: '#555', marginTop: 6 },
  empty: { textAlign: 'center', color: '#666', marginTop: 30 },
  errorBox: { margin: 12, padding: 10, backgroundColor: '#ffeef0', borderRadius: 8 },
  errorText: { color: '#cc0000' }
});
