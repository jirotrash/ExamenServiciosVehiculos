import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';

export const RevisionesPorVehiculoScreen: React.FC<any> = ({ navigation }) => {
  const [id, setId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/vehiculos/${id}/revisiones`);
      setItems(res.data.data || res.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.form}>
        <Text style={styles.label}>ID Vehículo</Text>
        <TextInput value={id} onChangeText={setId} keyboardType="numeric" style={styles.input} />
        <View style={{flexDirection:'row', marginTop:6}}>
          <TouchableOpacity style={[styles.primaryBtn, {flex:1, marginRight:8}]} onPress={fetch}>
            <Text style={styles.primaryText}>CONSULTAR REVISIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtnOutline, {width:140}]} onPress={() => navigation.navigate('RevisionForm', { idVehiculo: id })}>
            <Text style={styles.primaryTextOutline}>CREAR REVISIÓN</Text>
          </TouchableOpacity>
        </View>
      </View>
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      {loading && <ActivityIndicator />}

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id_revision || i.fecha)}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RevisionDetail', { revision: item })}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>{String(item.fecha)}</Text>
                <Text style={styles.cardSubtitle}>{String(item.resultados ?? item.resultado ?? '')}</Text>
                {item.observaciones ? <Text style={styles.cardDesc}>{String(item.observaciones)}</Text> : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{padding:12}}
        ListEmptyComponent={<Text style={{textAlign:'center'}}>No hay revisiones</Text>}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f3f6fb'},
  header: { backgroundColor: '#0b3b5c', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  refreshBtn: { backgroundColor: '#0b78d1', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  refreshText: { color: '#fff', fontWeight: '700' },
  form:{padding:12,backgroundColor:'#fff',margin:12,borderRadius:10},
  label: { fontSize: 13, color:'#333' },
  input:{borderWidth:1,borderColor:'#e0e6ef',padding:10,marginVertical:8,borderRadius:8,backgroundColor:'#fcfdff'},
  primaryBtn: { backgroundColor: '#0b78d1', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  primaryBtnOutline: { borderWidth:1, borderColor:'#0b78d1', paddingVertical:12, borderRadius:8, alignItems:'center', justifyContent:'center' },
  primaryTextOutline: { color:'#0b78d1', fontWeight:'700' },
  item:{backgroundColor:'#fff',padding:12,borderRadius:8,marginBottom:10},
  errorBox: { margin: 12, padding: 10, backgroundColor: '#ffeef0', borderRadius: 8 },
  errorText: { color: '#cc0000' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontWeight: '800', fontSize: 14, color: '#0b3b5c' },
  cardSubtitle: { color: '#555', marginTop: 6 },
  cardDesc: { color: '#666', marginTop: 8 },
  smallBtn: { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginBottom: 6 },
  smallBtnText: { color: '#0b3b5c', fontWeight: '700', fontSize: 12 },
});
