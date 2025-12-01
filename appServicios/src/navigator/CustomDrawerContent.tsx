import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import backgrounds from '../assets/carBackgrounds';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ state, navigation }) => {
  const items = state.routes.map((r) => ({ name: r.name, key: r.key }));

  const [bgIndex, setBgIndex] = useState<number>(() => Math.floor(Math.random() * backgrounds.length));

  const drawerStatus = useDrawerStatus?.();

  useEffect(() => {
    const pick = () => setBgIndex(Math.floor(Math.random() * backgrounds.length));
    
    pick();

    
    if (drawerStatus === 'open') pick();

    
    const unsubscribe = navigation.addListener?.('drawerOpen', pick);
    return () => unsubscribe && unsubscribe();
    
  }, [drawerStatus]);

  const bg = backgrounds[bgIndex] || require('../../assets/2026-Porsche-911-GT3-with-Manthey-Kit-001.jpg');

  return (
    <ImageBackground source={bg} style={styles.containerBg} imageStyle={styles.containerBgImage}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vehículos</Text>
        </View>

        <View style={styles.list}>
          {items.map((it, idx) => {
            const focused = state.index === idx;
            return (
              <TouchableOpacity
                key={it.key}
                onPress={() => navigation.navigate(it.name)}
                style={[styles.button, focused ? styles.buttonActive : null]}
                activeOpacity={0.85}
              >
                <View style={[styles.sideBar, focused ? styles.sideBarActive : null]} />
                <Text style={[styles.buttonText, focused ? styles.buttonTextActive : null]}>{formatLabel(it.name)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

function formatLabel(name: string) {
  const map: Record<string, string> = {
    Vehiculos: 'Vehículos',
    Revisiones: 'Revisiones',
    VehiculosActivos: 'Vehículos Activos',
    Servicios: 'Servicios',
    ContarServiciosPorCosto: 'Costo por Tipo',
    RevisionesPorVehiculo: 'Revisiones por Vehículo',
    VehiculosPorAnio: 'Vehículos por Año',
    ContarServicios: 'Contar Servicios por Costo',
    RevisionesPorResultado: 'Revisiones por Resultado',
    VehiculosConServicios: 'Vehículos con Servicios'
  };
  return map[name] || name;
}

const styles = StyleSheet.create({
  container: { paddingTop: 0, backgroundColor: 'transparent', flexGrow: 1 },
  containerBg: { flex: 1 },
  containerBgImage: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.12)' },
  header: { backgroundColor: '#0b3b5c', paddingVertical: 18, paddingHorizontal: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  list: { paddingTop: 12, paddingHorizontal: 8 },
  button: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  buttonActive: { backgroundColor: '#eaf6ff' },
  sideBar: { width: 6, height: '100%', backgroundColor: 'transparent', borderTopRightRadius: 6, borderBottomRightRadius: 6, marginRight: 10 },
  sideBarActive: { backgroundColor: '#0b78d1' },
  buttonText: { fontSize: 16, color: '#333' },
  buttonTextActive: { color: '#0b3b5c', fontWeight: '700' }
});
