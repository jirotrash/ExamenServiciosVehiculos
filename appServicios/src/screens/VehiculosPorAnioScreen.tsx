import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';

export const VehiculosPorAnioScreen: React.FC = () => {
  const [anio, setAnio] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/vehiculos/por-anio?anio=${encodeURIComponent(anio)}`);
      setItems(res.data.data || res.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.form}><Text>Año</Text><TextInput value={anio} onChangeText={setAnio} keyboardType="numeric" style={styles.input}/><Button title="Listar" onPress={fetch}/></View>
      <FlatList data={items} keyExtractor={(i)=>String(i.id_vehiculo||i.placas)} renderItem={({item})=> <View style={styles.item}><Text style={{fontWeight:'700'}}>{item.placas}</Text><Text>{item.marca} {item.modelo} - {item.anio}</Text></View>} contentContainerStyle={{padding:12}} ListEmptyComponent={<Text style={{textAlign:'center'}}>No hay vehículos</Text>} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#f3f6fb'}, form:{padding:12,backgroundColor:'#fff',margin:12,borderRadius:10}, input:{borderWidth:1,borderColor:'#ddd',padding:8,marginVertical:8,borderRadius:6}, item:{backgroundColor:'#fff',padding:12,borderRadius:8,marginBottom:10}});
