import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { VehiculoDto } from '../interfaces/serviciosInterface';

interface Props {
  vehiculo: VehiculoDto;
  onPress?: (v: VehiculoDto) => void;
}

export const VehiculoCard: React.FC<Props> = ({ vehiculo, onPress }) => {
  const activoValue = (() => {
    const a = (vehiculo as any)?.activo;
    if (a === undefined || a === null) return true;
    if (typeof a === 'boolean') return a;
    if (typeof a === 'number') return a !== 0;
    if (typeof a === 'string') return a.toLowerCase() === 'true' || a === '1';
    return Boolean(a);
  })();

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(vehiculo)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContainer}>
        <ImageBackground
          source={require('../../assets/1___________________________________1____________4.jpg')}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay} />
          <View style={styles.inner}>
            <View style={styles.top} />
            <View style={styles.row}>
              <View style={styles.content}>
                <Text style={styles.id}>ID: {vehiculo.id_vehiculo}</Text>
                <Text style={styles.prop} numberOfLines={1} ellipsizeMode="tail">Propietario: {vehiculo.propietario}</Text>
                <Text style={styles.placas} numberOfLines={1} ellipsizeMode="tail">Placas: {vehiculo.placas}</Text>
                <Text style={styles.marca} numberOfLines={2} ellipsizeMode="tail">Marca: {vehiculo.marca} - {vehiculo.modelo}</Text>
                <Text style={styles.anio} numberOfLines={1} ellipsizeMode="tail">Año: {vehiculo.anio}</Text>
                <Text style={[styles.activo, { color: activoValue ? '#27ae60' : '#e74c3c' }]} numberOfLines={1}>Estado: {activoValue ? 'Activo' : 'Inactivo'}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    alignSelf: 'center'
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 0.86,
    justifyContent: 'flex-start'
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: 12,
    width: '100%',
    height: '100%'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,32,0.34)'
  },
  inner: {
    padding: 12,
    justifyContent: 'flex-start'
  },
  top: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    paddingRight: 8,
    minHeight: 70,
    justifyContent: 'space-between'
  },
  placas: { fontSize: 16, fontWeight: '700', color: '#fff' },
  marca: { fontSize: 14, color: '#e6eef8', marginTop: 4 },
  anio: { fontSize: 13, color: '#d6e3f2', marginTop: 6 },
  activo: { fontSize: 12, fontWeight: '700', marginTop: 6, color: '#b6f1c2' },
  id: { fontSize: 12, color: '#cfd8e6' },
  prop: { fontSize: 13, color: '#e1eaf4', marginTop: 4 }
});
