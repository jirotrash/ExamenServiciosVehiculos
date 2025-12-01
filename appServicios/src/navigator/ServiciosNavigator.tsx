import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View } from 'react-native';
import { VehiculosScreen } from '../screens/VehiculosScreen';
import { VehiculoDetailScreen } from '../screens/VehiculoDetailScreen';
import { VehiculoFormScreen } from '../screens/VehiculoFormScreen';
import { VehiculoServiciosScreen } from '../screens/VehiculoServiciosScreen';
import { VehiculosActivosScreen } from '../screens/VehiculosActivosScreen';
import { ServiciosPorVehiculoScreen } from '../screens/ServiciosPorVehiculoScreen';
import ServicioFormScreen from '../screens/ServicioFormScreen';
import RevisionFormScreen from '../screens/RevisionFormScreen';
import RevisionDetailScreen from '../screens/RevisionDetailScreen';
import { CostoPorTipoScreen } from '../screens/CostoPorTipoScreen';
import { RevisionesPorVehiculoScreen } from '../screens/RevisionesPorVehiculoScreen';
import { VehiculosPorAnioScreen } from '../screens/VehiculosPorAnioScreen';
import { ContarServiciosPorCostoScreen } from '../screens/ContarServiciosPorCostoScreen';
import { RevisionesPorResultadoScreen } from '../screens/RevisionesPorResultadoScreen';
import { VehiculosConServiciosScreen } from '../screens/VehiculosConServiciosScreen';
import { HamburgerButton } from '../components/HamburgerButton';
import { CustomDrawerContent } from './CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const VehiculosStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0b3b5c' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' }
    }}
  >
    <Stack.Screen
      name="Vehiculos"
      component={VehiculosScreen}
      options={({ navigation }) => ({
        title: 'Vehículos',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        )
      })}
    />
    <Stack.Screen name="VehiculoDetail" component={VehiculoDetailScreen} options={{ title: 'Detalle vehículo' }} />
    <Stack.Screen name="VehiculoForm" component={VehiculoFormScreen} options={{ title: 'Formulario vehículo' }} />
    <Stack.Screen name="VehiculoServicios" component={VehiculoServiciosScreen} options={{ title: 'Servicios del vehículo' }} />
  </Stack.Navigator>
);

export const ServiciosNavigator: React.FC = () => {
  
  const ServicesStack: React.FC = () => (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: '#0b3b5c' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => {
          if (route?.name === 'ServiciosPorVehiculo') {
            return (
              <TouchableOpacity onPress={() => navigation.getParent?.()?.toggleDrawer?.()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
              <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
            </TouchableOpacity>
          );
        }
      })}
    >
      <Stack.Screen name="ServiciosPorVehiculo" component={ServiciosPorVehiculoScreen} options={{ title: 'Servicios' }} />
      <Stack.Screen name="ServicioForm" component={ServicioFormScreen} options={{ title: 'Crear servicio' }} />
    </Stack.Navigator>
  );

  const RevisionesStack: React.FC = () => (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: '#0b3b5c' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => {
          if (route?.name === 'RevisionesPorVehiculo') {
            return (
              <TouchableOpacity onPress={() => navigation.getParent?.()?.toggleDrawer?.()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
              <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
            </TouchableOpacity>
          );
        }
      })}
    >
      <Stack.Screen name="RevisionesPorVehiculo" component={RevisionesPorVehiculoScreen} options={{ title: 'Revisiones' }} />
      <Stack.Screen name="RevisionDetail" component={RevisionDetailScreen} options={{ title: 'Detalle revisión' }} />
      <Stack.Screen name="RevisionForm" component={RevisionFormScreen} options={{ title: 'Crear/Editar revisión' }} />
    </Stack.Navigator>
  );

  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerIcon: () => null, headerShown: false }}
    >
      <Drawer.Screen
        name="Inicio"
        component={VehiculosStack}
        options={{
          title: 'Inicio / Vehículos',
          drawerIcon: () => null,
          drawerLabel: 'Vehículos'
        }}
      />
        <Drawer.Screen
        name="Revisiones"
        component={RevisionesStack}
          options={({ navigation }) => ({
            title: 'Revisiones',
            drawerIcon: () => null,
            headerShown: false
          })}
        />
        <Drawer.Screen
          name="VehiculosActivos"
          component={VehiculosActivosScreen}
          options={({ navigation }) => ({
            title: 'Vehículos Activos',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="ServiciosPorVehiculo"
          component={ServicesStack}
          options={({ navigation }) => ({
            title: 'Servicios',
            drawerIcon: () => null,
            headerShown: false,
            drawerLabel: 'Servicios'
          })}
        />
        <Drawer.Screen
          name="CostoPorTipo"
          component={CostoPorTipoScreen}
          options={({ navigation }) => ({
            title: 'Costo por Tipo',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="RevisionesPorVehiculo"
          component={RevisionesStack}
          options={({ navigation }) => ({
            title: 'Revisiones por Vehículo',
            drawerIcon: () => null,
            headerShown: false
          })}
        />
        <Drawer.Screen
          name="VehiculosPorAnio"
          component={VehiculosPorAnioScreen}
          options={({ navigation }) => ({
            title: 'Vehículos por Año',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="ContarServiciosPorCosto"
          component={ContarServiciosPorCostoScreen}
          options={({ navigation }) => ({
            title: 'Contar Servicios por Costo',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="RevisionesPorResultado"
          component={RevisionesPorResultadoScreen}
          options={({ navigation }) => ({
            title: 'Revisiones por Resultado',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 8, padding: 6 }}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>☰</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        />
        <Drawer.Screen
          name="VehiculosConServicios"
          component={VehiculosConServiciosScreen}
          options={({ navigation }) => ({
            title: 'Vehículos con Servicios',
            drawerIcon: () => null,
            headerShown: true,
            headerStyle: { backgroundColor: '#0b3b5c' },
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
              </TouchableOpacity>
            )
          })}
        />
      </Drawer.Navigator>
  );
};
