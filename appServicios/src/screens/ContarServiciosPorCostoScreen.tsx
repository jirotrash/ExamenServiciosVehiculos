import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviciosApi } from '../api/serviciosApi';

export const ContarServiciosPorCostoScreen: React.FC = () => {
  const [costo, setCosto] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const path = `/servicios/contar-por-costo?costo=${encodeURIComponent(costo)}`;
      const res = await serviciosApi.get(path);
      const payload = res.data?.data || res.data || null;
      const count = payload?.count ?? payload?.data?.count ?? null;
      setResult(typeof count === 'number' ? count : null);
    } catch (e: any) {
      const serverMsg = e?.response?.data || e?.message || String(e);
      setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
        

        <View style={styles.card}>
          <Text style={styles.label}>Costo</Text>
          <TextInput
            value={costo}
            onChangeText={(t) => setCosto(t.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="Ej: 364.57"
            style={styles.input}
            editable={!loading}
          />

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={fetch} disabled={loading || costo.trim() === ''}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>CONTAR</Text>}
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {result !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Servicios que superan {costo}:</Text>
            <Text style={styles.resultValue}>{result.toLocaleString()}</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  header: { backgroundColor: '#0b3b5c', padding: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: { margin: 12, padding: 12, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  label: { fontSize: 13, color: '#333' },
  input: { borderWidth: 1, borderColor: '#e0e6ef', padding: 10, borderRadius: 8, marginTop: 8, marginBottom: 12, backgroundColor: '#fcfdff' },
  button: { backgroundColor: '#0b78d1', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700' },
  resultCard: { marginHorizontal: 12, marginTop: 10, backgroundColor: '#fff', padding: 14, borderRadius: 10, alignItems: 'flex-start' },
  resultLabel: { fontSize: 14, color: '#333' },
  resultValue: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  error: { color: 'red', marginTop: 8 }
});
