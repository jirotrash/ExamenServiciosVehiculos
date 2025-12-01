import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehiculoCard } from '../components/VehiculoCard';
import { useServicios } from '../hooks/useServicios';
import { VehiculoDto } from '../interfaces/serviciosInterface';

interface Props {
  navigation: any;
}

export const VehiculosScreen: React.FC<Props> = ({ navigation }) => {
  const { vehiculos, loading, error, fetchVehiculos, loadMore, loadingMore, refresh, refreshing, hasMore } = useServicios();

  useEffect(() => {
    fetchVehiculos();
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, []);

  const ITEM_WIDTH = Math.floor((Dimensions.get('window').width - 36) / 2);
  const renderItem = ({ item }: { item: VehiculoDto }) => (
    <View style={[styles.itemWrapper, { width: ITEM_WIDTH }]}>
      <VehiculoCard vehiculo={item} onPress={(v) => navigation.navigate('VehiculoDetail', { vehiculo: v })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehículos</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Crear" onPress={() => navigation.navigate('VehiculoForm')} />
          <View style={{ width: 12 }} />
          <Button title="Actualizar" onPress={() => fetchVehiculos()} />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => String(item.id_vehiculo || item.placas)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReachedThreshold={0.6}
        onEndReached={() => { if (hasMore) loadMore(); }}
        ListFooterComponent={() => loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} size="small" color="#4A90E2" /> : null}
        refreshing={refreshing}
        onRefresh={() => refresh()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  itemWrapper: {
    paddingHorizontal: 6,
    marginBottom: 8,
    alignSelf: 'flex-start'
  },
  title: { fontSize: 20, fontWeight: '700', color: '#333' }
});
