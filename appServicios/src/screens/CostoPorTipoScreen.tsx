import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviciosApi } from '../api/serviciosApi';
import { Picker } from '@react-native-picker/picker';

export const CostoPorTipoScreen: React.FC = () => {
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState<number | null>(null);
  const [overrideCosto, setOverrideCosto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TIPOS_SERVICIO = [
    'Cambio de Aceite','Afinación Mayor','Afinación Menor','Cambio de Batería','Cambio de Filtros (Aire/Cabina)','Niveles de Fluidos','Limpieza de Inyectores',
    'Frenos (Balatas/Discos)','Rectificado de Discos','Cambio de Líquido de Frenos','Neumáticos / Llantas','Alineación y Balanceo','Rotación de Neumáticos','Reparación de Ponchaduras',
    'Amortiguadores','Suspensión General','Diagnóstico por Escáner','Revisión de Motor','Cambio de Banda de Distribución','Bomba de Agua','Sistema de Enfriamiento / Radiador','Embrague / Clutch','Transmisión','Sistema de Escape / Mofles',
    'Aire Acondicionado','Sistema Eléctrico','Alternador y Marcha','Luces y Faros','Sensores',
    'Lavado de Motor','Lavado y Engrasado','Hojalatería y Pintura','Pulido y Encerado','Verificación Vehicular'
  ];

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/costo-por-tipo?tipo=${encodeURIComponent(tipo)}`);
      const payload = res.data?.data || res.data;
      const total = payload?.total ?? null;
      let final = (typeof total === 'number' ? total : null);
      try {
        const key = `costo_tipo:${tipo?.toLowerCase()}`;
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          const n = Number(stored);
          if (!Number.isNaN(n)) final = n;
        }
      } catch (e) {}
      setCosto(final);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFor = async (tipoArg: string) => {
    if (!tipoArg) return;
    setLoading(true);
    try {
      const res = await serviciosApi.get(`/costo-por-tipo?tipo=${encodeURIComponent(tipoArg)}`);
      const payload = res.data?.data || res.data;
      const total = payload?.total ?? null;
      let final = (typeof total === 'number' ? total : null);
      try {
        const key = `costo_tipo:${tipoArg?.toLowerCase()}`;
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          const n = Number(stored);
          if (!Number.isNaN(n)) final = n;
        }
      } catch (e) {}
      setCosto(final);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveOverride = async () => {
    if (!tipo) { Alert.alert('Validación','Ingrese el tipo antes de guardar'); return; }
    const key = `costo_tipo:${tipo.toLowerCase()}`;
    const n = Number(overrideCosto);
    if (Number.isNaN(n)) { Alert.alert('Validación','Costo inválido'); return; }
    try {
      await AsyncStorage.setItem(key, String(n));
      setCosto(n);
      Alert.alert('Guardado', 'Costo guardado localmente');
    } catch (e: any) { Alert.alert('Error', e?.message || 'No se pudo guardar'); }
  };

  const removeOverride = async () => {
    if (!tipo) { Alert.alert('Validación','Ingrese el tipo'); return; }
    const key = `costo_tipo:${tipo.toLowerCase()}`;
    try {
      await AsyncStorage.removeItem(key);
      Alert.alert('Eliminado', 'Override eliminado');
      fetch();
    } catch (e: any) { Alert.alert('Error', e?.message || 'No se pudo eliminar'); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right","bottom","left"]}>
      <View style={styles.form}>
        <Text>Tipo (ej: aceite)</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={(v) => { setTipo(String(v)); fetchFor(String(v)); }} style={styles.picker} itemStyle={{height:44}}>
            <Picker.Item label="Seleccionar tipo" value="" />
            {TIPOS_SERVICIO.map((t) => <Picker.Item key={t} label={t} value={t} />)}
          </Picker>
        </View>
        <Button title="Obtener costo" onPress={fetch} />

        <Text style={{marginTop:12}}>Costo manual (Si no existe)</Text>
        <TextInput value={overrideCosto} onChangeText={setOverrideCosto} style={styles.input} keyboardType="numeric" placeholder="0.00" />
        <View style={{flexDirection:'row'}}>
        </View>
        <View style={{height:12}} />
        <Text style={{marginTop:6}}>Guardar</Text>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1, marginRight:8}}>
            <Button title="Guardar" onPress={async () => {
              if (!tipo) { Alert.alert('Validación','Seleccione o escriba el tipo'); return; }
              const n = Number(overrideCosto || costo || 0);
              if (Number.isNaN(n)) { Alert.alert('Validación','Costo inválido'); return; }
              try {
                await serviciosApi.post('/precios-por-tipo', { tipo, precio: n });
                Alert.alert('Guardado', 'Precio guardado');
              } catch (e: any) { Alert.alert('Error', e?.response?.data || e?.message || String(e)); }
            }} />
          </View>
          <View style={{flex:1}}>
            <Button title="Eliminar" onPress={async () => {
              if (!tipo) { Alert.alert('Validación','Seleccione o escriba el tipo'); return; }
              try {
                await serviciosApi.delete(`/precios-por-tipo?tipo=${encodeURIComponent(tipo)}`);
                Alert.alert('Eliminado', 'Precio eliminado');
              } catch (e: any) { Alert.alert('Error', e?.response?.data || e?.message || String(e)); }
            }} color="#e74c3c" />
          </View>
        </View>
      </View>
      {loading && <Text style={{padding:12}}>Cargando...</Text>}
      {error && <Text style={{color:'red',padding:12}}>{error}</Text>}
      {costo !== null && <Text style={{padding:12}}>Costo total: ${costo.toFixed(2)}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f3f6fb'},
  form:{padding:12,backgroundColor:'#fff',margin:12,borderRadius:10},
  input:{borderWidth:1,borderColor:'#ddd',padding:8,marginVertical:8,borderRadius:6,backgroundColor:'#fff'},
  pickerWrapper: { backgroundColor:'#fff', borderRadius:8, overflow:'hidden', borderWidth:1, borderColor:'#ddd', marginTop:8 },
  picker: { width: '100%' }
});
