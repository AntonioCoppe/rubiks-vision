import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useCubeStore } from '../store/cubeStore';
import { isMaybeLegal, LegalityResult } from '../lib/legality';
import CubeMiniDiagram from '../components/CubeMiniDiagram';
import { Face } from '../../types/cube';

const FaceOrder: Array<Face> = ['U', 'R', 'F', 'D', 'L', 'B'];
const FaceNames = { U: 'Up', R: 'Right', F: 'Front', D: 'Down', L: 'Left', B: 'Back' };

export default function ReviewFacesScreen({ navigation }: any) {
  const { faces } = useCubeStore();

  const ready = useMemo(
    () => FaceOrder.every((f) => faces[f as any]?.length === 9),
    [faces]
  );

  const legalityResult = useMemo(() => {
    if (!ready) return null;
    const state = { faces: faces as any };
    return isMaybeLegal(state as any);
  }, [faces, ready]);

  const onContinue = () => {
    if (!ready) return;
    const state = { faces: faces as any };
    const result = isMaybeLegal(state as any);
    
    if (!result.isLegal) {
      const overText = result.overCounted.length > 0 ? `Over-counted: ${result.overCounted.join(', ')}` : '';
      const underText = result.underCounted.length > 0 ? `Under-counted: ${result.underCounted.join(', ')}` : '';
      const message = [overText, underText].filter(Boolean).join('\n');
      
      Alert.alert('Scan issue', `Color counts look off.\n\n${message}\n\nRescan the face(s) with incorrect colors.`);
      return;
    }
    navigation.navigate('Solve', { state });
  };

  const onRescanFace = (face: Face) => {
    navigation.navigate('Scan', { face });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Review scans</Text>
      
      <View style={{ gap: 16 }}>
        {FaceOrder.map((face) => {
          const faceStickers = faces[face];
          const isComplete = faceStickers?.length === 9;
          
          return (
            <View key={face} style={{ 
              borderWidth: 1, 
              borderColor: isComplete ? '#ddd' : '#ff6b6b', 
              borderRadius: 8, 
              padding: 12,
              backgroundColor: isComplete ? '#f8f9fa' : '#fff5f5'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {FaceNames[face]} Face {isComplete ? '✅' : '❌'}
                </Text>
                <Pressable 
                  onPress={() => onRescanFace(face)}
                  style={{ 
                    paddingHorizontal: 12, 
                    paddingVertical: 6, 
                    backgroundColor: '#007AFF', 
                    borderRadius: 6 
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>Rescan</Text>
                </Pressable>
              </View>
              
              {isComplete && faceStickers && (
                <CubeMiniDiagram stickers={faceStickers as any} />
              )}
              
              {!isComplete && (
                <Text style={{ color: '#666', fontSize: 14 }}>
                  {faceStickers?.length || 0}/9 stickers scanned
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: 24 }}>
        <Pressable
          disabled={!ready}
          onPress={onContinue}
          style={{
            opacity: ready ? 1 : 0.5,
            backgroundColor: 'black',
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            {ready ? 'Solve Cube' : 'Complete all faces to solve'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

