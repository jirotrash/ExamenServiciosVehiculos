import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { serviciosApi } from '../api/serviciosApi';

export const RevisionDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const revision = route?.params?.revision;
  const [revisionData, setRevisionData] = useState<any>(revision ?? null);
  const [status, setStatus] = useState<string>(revision?.resultados ?? revision?.resultado ?? '');
  const [saving, setSaving] = useState(false);

  if (!revision) {
    return (
      <SafeAreaView style={styles.container} edges={["right","bottom","left"]}>
        <View style={styles.form}><Text>No hay datos de revisión</Text></View>
      </SafeAreaView>
    );
  }

  const id = revision?.id_revision ?? revision?.id;

  const fetchRevision = async () => {
    if (!id) return;
    try {
      const res = await serviciosApi.get(`/revisiones/${id}`);
      const data = res.data?.data ?? res.data ?? null;
      if (data) {
        setRevisionData(data);
        setStatus(data.resultados ?? data.resultado ?? '');
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    fetchRevision();
  }, [id]);

  const onSaveStatus = async () => {
    if (!id) return Alert.alert('Error', 'ID de revisión no disponible');
    try {
      setSaving(true);
      const res = await serviciosApi.patch(`/revisiones/${id}`, { resultados: status });
      const updated = res.data?.data ?? res.data ?? null;
      if (updated) {
        setRevisionData(updated);
        setStatus(updated.resultados ?? updated.resultado ?? status);
      } else {
        await fetchRevision();
      }
      Alert.alert('Guardado', 'Estado actualizado');
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || String(e);
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally { setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right","bottom","left"]}>
      <View style={styles.form}>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{String(revisionData?.fecha ?? revision?.fecha ?? '')}</Text>

        <Text style={styles.label}>Inspector</Text>
        <Text style={styles.value}>{String(revisionData?.inspector ?? revision?.inspector ?? '')}</Text>

        <Text style={styles.label}>Kilometraje</Text>
        <Text style={styles.value}>{String(revisionData?.kilometraje ?? revision?.kilometraje ?? '')}</Text>

        <Text style={styles.label}>Resultados</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={status} onValueChange={(v) => setStatus(String(v))} style={styles.picker}>
            <Picker.Item label="-- Seleccionar resultado --" value="" />
            <Picker.Item label="Aprobado" value="Aprobado" />
            <Picker.Item label="Rechazado" value="Rechazado" />
            <Picker.Item label="Observado" value="Observado" />
          </Picker>
        </View>

        { (revisionData?.observaciones ?? revision?.observaciones) ? (
          <>
            <Text style={styles.label}>Observaciones</Text>
            <Text style={styles.value}>{String(revisionData?.observaciones ?? revision?.observaciones)}</Text>
          </>
        ) : null}

        <View style={{flexDirection:'row', marginTop:16}}>
          <TouchableOpacity style={[styles.primaryBtn, {flex:1, marginRight:8}]} onPress={onSaveStatus} disabled={saving}>
            <Text style={styles.primaryText}>{saving ? 'GUARDANDO...' : 'GUARDAR ESTADO'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtnOutline, {width:120}]} onPress={() => navigation.navigate('RevisionForm', { revision })}>
            <Text style={styles.primaryTextOutline}>EDITAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f3f6fb' },
  form: { margin:12, padding:12, backgroundColor:'#fff', borderRadius:10 },
  label: { fontSize:13, color:'#333', marginTop:8 },
  value: { fontSize:14, color:'#111', marginTop:4 },
  primaryBtn: { backgroundColor:'#0b78d1', paddingVertical:12, borderRadius:8, alignItems:'center', marginTop:16 },
  primaryText: { color:'#fff', fontWeight:'700' }
});

export default RevisionDetailScreen;
