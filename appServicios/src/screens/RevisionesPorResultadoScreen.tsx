import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { serviciosApi } from '../api/serviciosApi';

export const RevisionesPorResultadoScreen: React.FC = () => {
  const [resultado, setResultado] = useState('Aprobado');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/revisiones/por-resultado?resultado=${encodeURIComponent(resultado)}`);
      setItems(res.data.data || res.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right","bottom","left"]}>
      <View style={styles.form}>
        <Text style={styles.label}>Resultado (ej: aprobado)</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={resultado} onValueChange={(v) => setResultado(String(v))} style={styles.picker} itemStyle={{height:44}}>
            <Picker.Item label="Aprobado" value="Aprobado" />
            <Picker.Item label="Rechazado" value="Rechazado" />
            <Picker.Item label="Observado" value="Observado" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={fetch}>
          <Text style={styles.primaryText}>CONSULTAR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i)=>String(i.id_revision||i.fecha)}
        renderItem={({item})=> (
          <View style={styles.item}>
            <Text style={styles.itemDate}>{item.fecha}</Text>
            <Text style={styles.itemResult}>{String(item.resultados ?? item.resultado ?? '')}</Text>
          </View>
        )}
        contentContainerStyle={{padding:12}}
        ListEmptyComponent={<Text style={{textAlign:'center'}}>No hay revisiones</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f3f6fb'},
  form:{padding:12,backgroundColor:'#fff',margin:12,borderRadius:10},
  label: { fontSize:13, color:'#333' },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, marginTop: 8, marginBottom: 12, overflow: 'hidden', borderWidth:1, borderColor:'#e0e6ef' },
  picker: { width: '100%' },
  primaryBtn: { backgroundColor:'#0b78d1', paddingVertical:12, borderRadius:8, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'700' },
  item:{backgroundColor:'#fff',padding:12,borderRadius:8,marginBottom:10},
  itemDate: { color:'#0b3b5c', fontWeight:'700' },
  itemResult: { color:'#555', marginTop:6 }
});
