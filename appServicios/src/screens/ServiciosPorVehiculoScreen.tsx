import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';
import { useFocusEffect } from '@react-navigation/native';

export const ServiciosPorVehiculoScreen: React.FC<any> = ({ navigation }) => {
  const [id, setId] = useState('');
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const fetch = async () => {
    setLoading(true);
    try {
      const url = `${(serviciosApi.defaults.baseURL || '').replace(/\/$/, '')}/vehiculos/${id}/servicios`;
      const res = await serviciosApi.get(`/vehiculos/${id}/servicios`);
      setServicios(res.data.data || res.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) fetch();
    }, [id])
  );

  const eliminarServicio = (idServicio: number) => {
    Alert.alert('Confirmar', '¿Eliminar este servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await serviciosApi.delete(`/servicios/${idServicio}`);
          Alert.alert('Eliminado', 'Servicio eliminado');
          fetch();
        } catch (e: any) {
          const msg = e?.response?.data || e?.message || String(e);
          Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.form}>
        <Text style={styles.label}>ID Vehículo</Text>
        <TextInput value={id} onChangeText={setId} keyboardType="numeric" style={styles.input} />
        <View style={{flexDirection:'row', marginTop:6}}>
          <TouchableOpacity style={[styles.primaryBtn, {flex:1, marginRight:8}]} onPress={fetch}>
            <Text style={styles.primaryText}>CONSULTAR SERVICIOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtnOutline, {width:140}]} onPress={() => navigation.navigate('ServicioForm', { idVehiculo: id })}>
            <Text style={styles.primaryTextOutline}>CREAR SERVICIO</Text>
          </TouchableOpacity>
        </View>
      </View>
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      <FlatList
        data={servicios}
        keyExtractor={(i) => String(i.id_servicio || i.tipo + i.fecha)}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>{String(item.tipo)}</Text>
                <Text style={styles.cardSubtitle}>{String(item.fecha)} - ${String(item.costo)}</Text>
                {item.descripcion ? <Text style={styles.cardDesc}>{String(item.descripcion)}</Text> : null}
              </View>
              <View style={{justifyContent:'space-between', alignItems:'flex-end'}}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('ServicioForm', { servicio: item, idVehiculo: id })}><Text style={styles.smallBtnText}>EDITAR</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.smallBtn, {backgroundColor:'#e74c3c'}]} onPress={() => eliminarServicio(Number(item.id_servicio))}><Text style={[styles.smallBtnText,{color:'#fff'}]}>ELIMINAR</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{padding:12}}
        ListEmptyComponent={<Text style={{textAlign:'center'}}>No hay servicios</Text>}
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
