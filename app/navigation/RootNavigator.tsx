import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import ScanFaceScreen from '../screens/ScanFaceScreen';
import ReviewFacesScreen from '../screens/ReviewFacesScreen';
import SolveScreen from '../screens/SolveScreen';
import CenterPickerScreen from '../screens/CenterPickerScreen';
import { Face } from '../../types/cube';
import { HSV } from '../lib/color';

// 1. Stack param list – gives type-safe navigation
export type RootStackParamList = {
  Home: undefined;
  Scan: { face: Face };
  CenterPicker: { face: Face; centerHSV: HSV };
  Review: undefined;
  Solve: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FaceOrder: Array<Face> = ['U', 'R', 'F', 'D', 'L', 'B'];

// 2. Home screen as its own component – avoids TS complaint about missing children
function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {FaceOrder.map((f) => (
        <Pressable
          key={f}
          onPress={() => navigation.navigate('Scan', { face: f })}
          style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8, marginBottom: 8 }}
        >
          <Text>Scan {f} face</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => navigation.navigate('Review')}
        style={{ padding: 12, backgroundColor: 'black', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Review</Text>
      </Pressable>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Scan Faces' }} />
      <Stack.Screen
        name="Scan"
        component={ScanFaceScreen}
        options={({ route }: any) => ({ title: `Scan ${route.params?.face || ''}` })}
      />
      <Stack.Screen name="CenterPicker" component={CenterPickerScreen} options={{ title: 'Pick Center Color' }} />
      <Stack.Screen name="Review" component={ReviewFacesScreen} />
      <Stack.Screen name="Solve" component={SolveScreen} />
    </Stack.Navigator>
  );
}

