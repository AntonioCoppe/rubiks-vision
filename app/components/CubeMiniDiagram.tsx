import React from 'react';
import { View } from 'react-native';

const colorToHex = { W:'#ffffff', Y:'#ffd500', R:'#c41e3a', O:'#ff5800', B:'#0051ba', G:'#009e60' } as const;

export default function CubeMiniDiagram({stickers}:{stickers: Array<'W'|'R'|'B'|'O'|'G'|'Y'>}) {
  return (
    <View style={{width:96, height:96, flexWrap:'wrap', flexDirection:'row'}}>
      {stickers.map((c,i)=>(
        <View key={i} style={{width:32, height:32, borderWidth:1, borderColor:'#333', backgroundColor:colorToHex[c]}}/>
      ))}
    </View>
  );
}
