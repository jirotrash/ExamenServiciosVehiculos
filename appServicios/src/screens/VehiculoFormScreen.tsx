import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Switch, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServicios } from '../hooks/useServicios';
import { VehiculoDto } from '../interfaces/serviciosInterface';

interface Props {
  route: any;
  navigation: any;
}

export const VehiculoFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const vehiculoParam = route?.params?.vehiculo as VehiculoDto | undefined;
  
  const isEditing = !!vehiculoParam;
  const { crearVehiculo, updateVehiculo, eliminarVehiculo } = useServicios();

  const [placas, setPlacas] = useState(vehiculoParam?.placas || '');
  const [marca, setMarca] = useState(vehiculoParam?.marca || '');
  const [modelo, setModelo] = useState(vehiculoParam?.modelo || '');
  const [anio, setAnio] = useState(String(vehiculoParam?.anio || ''));
  const [propietario, setPropietario] = useState(vehiculoParam?.propietario || '');
  
  const initialActivo = vehiculoParam?.activo;
  const parsedActivo = initialActivo === undefined
    ? true
    : (typeof initialActivo === 'string' ? (initialActivo === 'true' || initialActivo === '1') : Boolean(initialActivo));
  const [activo, setActivo] = useState<boolean>(parsedActivo);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar vehículo' : 'Crear vehículo' });
  }, []);

  const onSave = async () => {
    const payload: Partial<VehiculoDto> = {
      placas: placas.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: anio ? Number(anio) : undefined,
      propietario: propietario.trim(),
      activo
    };

    try {
      if (isEditing && vehiculoParam?.id_vehiculo) {
        await updateVehiculo(vehiculoParam.id_vehiculo, payload);
      } else {
        await crearVehiculo(payload as VehiculoDto);
      }
        navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo guardar el vehículo');
    }
  };

  const onDelete = () => {
    if (!isEditing || !vehiculoParam?.id_vehiculo) return;
    Alert.alert('Eliminar', '¿Eliminar este vehículo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await eliminarVehiculo(vehiculoParam.id_vehiculo!);
          navigation.goBack();
        } catch (e: any) {
          Alert.alert('Error', e?.message || 'No se pudo eliminar');
        }
      } }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <Text style={styles.label}>Placas</Text>
        <TextInput style={styles.input} value={placas} onChangeText={setPlacas} />

        <Text style={styles.label}>Marca</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={marca}
            onValueChange={(v) => setMarca(String(v))}
            style={styles.picker}
            itemStyle={{ height: 44 }}
          >
            <Picker.Item label="Seleccionar marca" value="" />
            {[
              'Toyota','Nissan','Honda','Ford','Chevrolet','Kia','Hyundai','Volkswagen','Mazda','Subaru','Suzuki','Mitsubishi','BMW','Mercedes-Benz','Audi','Peugeot','Renault','Fiat','Jeep','Dodge','RAM','GMC','Volvo','Land Rover','Porsche','Lexus','Acura','Infiniti','Mini','SEAT','Cupra','Tesla','BYD','MG','JAC'
            ].map((b) => (
              <Picker.Item key={b} label={b} value={b} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Modelo</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={modelo}
            onValueChange={(v) => setModelo(String(v))}
            style={styles.picker}
            itemStyle={{ height: 44 }}
          >
            <Picker.Item label="Seleccionar modelo" value="" />
            {['Sedan','Hatchback','Camioneta','Pickup','SUV','Coupe','Sport'].map((m) => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Año</Text>
        <TextInput style={styles.input} value={anio} onChangeText={setAnio} keyboardType="numeric" />

        <Text style={styles.label}>Propietario</Text>
        <TextInput style={styles.input} value={propietario} onChangeText={setPropietario} />

        <View style={styles.rowSwitch}>
          <Text style={{ fontSize: 14 }}>Activo</Text>
          <Switch value={activo} onValueChange={setActivo} />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button title={isEditing ? 'Guardar cambios' : 'Crear vehículo'} onPress={onSave} />
        </View>

        {isEditing && (
          <View style={{ marginTop: 12 }}>
            <Button title="Eliminar vehículo" onPress={onDelete} color="#e74c3c" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  label: { fontSize: 13, color: '#333', marginTop: 8 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginTop: 6 },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 8, marginTop: 6, overflow: 'hidden' },
  picker: { width: '100%' },
  rowSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }
});
