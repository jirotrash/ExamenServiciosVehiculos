import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { serviciosApi } from '../api/serviciosApi';

interface Props { navigation: any; route: any }

export const RevisionFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const revision = route?.params?.revision;

  const [idServicio, setIdServicio] = useState(revision?.id_servicio ? String(revision.id_servicio) : '');
  const [fecha, setFecha] = useState(revision?.fecha ?? '');
  const [inspector, setInspector] = useState(revision?.inspector ?? '');
  const [kilometraje, setKilometraje] = useState(revision?.kilometraje ? String(revision.kilometraje) : '');
  const [resultados, setResultados] = useState(revision?.resultados ?? '');
  const [observaciones, setObservaciones] = useState(revision?.observaciones ?? '');

  useEffect(() => {
    navigation.setOptions({ title: revision ? 'Editar revisión' : 'Crear revisión' });
  }, []);

  const onSave = async () => {
    if (!idServicio) return Alert.alert('Error', 'El ID del servicio es requerido');
    if (!fecha.trim()) return Alert.alert('Error', 'La fecha es requerida');
    if (!inspector.trim()) return Alert.alert('Error', 'El inspector es requerido');
    if (!kilometraje || Number(kilometraje) <= 0) return Alert.alert('Error', 'Kilometraje debe ser mayor que 0');

    const payload = {
      id_servicio: Number(idServicio),
      fecha: fecha.trim(),
      inspector: inspector.trim(),
      kilometraje: Number(kilometraje),
      resultados: resultados.trim() || undefined,
      observaciones: observaciones.trim() || undefined
    };

    try {
      if (revision && (revision.id_revision || revision.id)) {
        const id = revision.id_revision ?? revision.id;
        await serviciosApi.patch(`/revisiones/${id}`, payload);
        Alert.alert('Guardado', 'Revisión actualizada');
      } else {
        await serviciosApi.post('/revisiones', payload);
        Alert.alert('Creado', 'Revisión creada correctamente');
      }
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || String(e);
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>ID Servicio</Text>
        <TextInput value={idServicio} onChangeText={setIdServicio} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
        <TextInput value={fecha} onChangeText={setFecha} style={styles.input} placeholder="2025-11-30" />

        <Text style={styles.label}>Inspector</Text>
        <TextInput value={inspector} onChangeText={setInspector} style={styles.input} />

        <Text style={styles.label}>Kilometraje</Text>
        <TextInput value={kilometraje} onChangeText={setKilometraje} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Resultados (opcional)</Text>
        <TextInput value={resultados} onChangeText={setResultados} style={styles.input} />

        <Text style={styles.label}>Observaciones (opcional)</Text>
        <TextInput value={observaciones} onChangeText={setObservaciones} style={styles.input} />

        <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
          <Text style={styles.primaryText}>{revision ? 'GUARDAR CAMBIOS' : 'CREAR REVISIÓN'}</Text>
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
  primaryBtn: { backgroundColor:'#0b78d1', paddingVertical:12, borderRadius:8, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'700' }
});

export default RevisionFormScreen;
