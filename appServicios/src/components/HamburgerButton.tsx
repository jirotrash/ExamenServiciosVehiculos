import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const HamburgerButton: React.FC = () => {
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.toggleDrawer()}>
      <Text style={styles.lines}>☰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12 },
  lines: { fontSize: 22 }
});
