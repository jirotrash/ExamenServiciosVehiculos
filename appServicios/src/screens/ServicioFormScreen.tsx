import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { serviciosApi } from '../api/serviciosApi';

interface Props { navigation: any; route: any }

export const ServicioFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const servicio = route?.params?.servicio;
  const idVehiculoParam = route?.params?.idVehiculo;

  const [idVehiculo, setIdVehiculo] = useState(idVehiculoParam ? String(idVehiculoParam) : (servicio?.id_vehiculo ? String(servicio.id_vehiculo) : ''));
  const [tipo, setTipo] = useState(servicio?.tipo ?? '');
  const [fecha, setFecha] = useState(servicio?.fecha ?? '');
  const [costo, setCosto] = useState(servicio?.costo ? String(servicio.costo) : '');
  const [descripcion, setDescripcion] = useState(servicio?.descripcion ?? '');

  useEffect(() => {
    navigation.setOptions({ title: servicio ? 'Editar servicio' : 'Crear servicio' });
  }, []);

  const onSave = async () => {
    if (!idVehiculo) return Alert.alert('Error', 'El ID del vehículo es requerido');
    if (!tipo.trim()) return Alert.alert('Error', 'El tipo es requerido');
    if (!fecha.trim()) return Alert.alert('Error', 'La fecha es requerida');
    if (!costo || Number(costo) <= 0) return Alert.alert('Error', 'El costo debe ser mayor que 0');

    const payload = {
      id_vehiculo: Number(idVehiculo),
      tipo: tipo.trim(),
      fecha: fecha.trim(),
      costo: Number(costo),
      descripcion: descripcion.trim() || undefined
    };

    try {
      if (servicio && (servicio.id_servicio || servicio.id)) {
        const id = servicio.id_servicio ?? servicio.id;
        await serviciosApi.patch(`/servicios/${id}`, payload);
        Alert.alert('Guardado', 'Servicio actualizado');
      } else {
        await serviciosApi.post('/servicios', payload);
        Alert.alert('Creado', 'Servicio creado correctamente');
      }
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || String(e);
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.form}>
        <Text style={styles.label}>Placa / ID Vehículo</Text>
        <TextInput value={idVehiculo} onChangeText={setIdVehiculo} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={(v) => setTipo(String(v))} style={styles.picker} itemStyle={{height:44}}>
            <Picker.Item label="-- Seleccionar tipo de servicio --" value="" />
            {[
              'Cambio de Aceite','Afinación Mayor','Afinación Menor','Cambio de Batería','Cambio de Filtros (Aire/Cabina)','Niveles de Fluidos','Limpieza de Inyectores',
              'Frenos (Balatas/Discos)','Rectificado de Discos','Cambio de Líquido de Frenos','Neumáticos / Llantas','Alineación y Balanceo','Rotación de Neumáticos','Reparación de Ponchaduras',
              'Amortiguadores','Suspensión General','Diagnóstico por Escáner','Revisión de Motor','Cambio de Banda de Distribución','Bomba de Agua','Sistema de Enfriamiento / Radiador','Embrague / Clutch','Transmisión','Sistema de Escape / Mofles',
              'Aire Acondicionado','Sistema Eléctrico','Alternador y Marcha','Luces y Faros','Sensores',
              'Lavado de Motor','Lavado y Engrasado','Hojalatería y Pintura','Pulido y Encerado','Verificación Vehicular'
            ].map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
        <TextInput value={fecha} onChangeText={setFecha} style={styles.input} placeholder="2025-11-30" />

        <Text style={styles.label}>Costo</Text>
        <TextInput value={costo} onChangeText={setCosto} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput value={descripcion} onChangeText={setDescripcion} style={styles.input} />

        <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
          <Text style={styles.primaryText}>{servicio ? 'GUARDAR CAMBIOS' : 'CREAR SERVICIO'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f3f6fb' },
  form: { margin:12, padding:12, backgroundColor:'#fff', borderRadius:10 },
  label: { fontSize:13, color:'#333' },
  input: { borderWidth:1, borderColor:'#e0e6ef', padding:10, borderRadius:8, marginTop:8, marginBottom:12, backgroundColor:'#fcfdff' },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, marginTop: 8, marginBottom: 12, overflow: 'hidden', borderWidth:1, borderColor:'#e0e6ef' },
  picker: { width: '100%' },
  primaryBtn: { backgroundColor:'#0b78d1', paddingVertical:12, borderRadius:8, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'700' }
});

export default ServicioFormScreen;
