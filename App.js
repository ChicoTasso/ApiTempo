import { StyleSheet} from 'react-native';
import React from 'react';
import Home from './components/Home'

export default function App() {
  return (
    <Home/>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box :{
    flex : 1,
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 320,
  },
  temp : {
    color : 'white',
    fontSize :87,
    fontWeight: 'ultralight',
    paddingBottom: 13,
  },
  clima : {
    color :'white',
    opacity: 0.55,
    fontSize: 14,
    fontWeight: 'ultralight'
  },
  weatherIcon: {
    width: 184,
    height: 184,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});
