import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Light from '../../utils/Theme/Light';
import Dark from '../../utils/Theme/Dark';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { ArenaImage } from '../ArenaImage';

export const AppointmentItem = ({ id, image, name, subtitle, sport, distance, players, action, color, border = false }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, border, color);
  return (
    <TouchableOpacity onPress={() => { action() }} style={styles.chat_button}>
      <ArenaImage image={image} />
      <View style={styles.chat_content}>
        <Text style={styles.chat_text_title}>{name}</Text>
        <Text style={styles.chat_text_subtitle}>{subtitle}</Text>
        <Text style={styles.chat_text_subtitle}>{sport}</Text>

        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.chat_text_subtitle}>{distance} Km</Text>
          <Text style={{...styles.chat_text_subtitle, textAlign: 'right'}}>{players}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const createStyles = (theme: typeof Light | typeof Dark, border: boolean, color: string) =>
  StyleSheet.create({
    chat_button: {
      elevation: 4,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 10,
      borderRadius: 15,
      backgroundColor: color,
      ...(border ? { borderBottomWidth: 1, borderColor: theme.TERTIARY } : {})
    },
    image: {
      borderColor: theme.QUATERNARY,
      borderWidth: 1,
      borderRadius: 25,
      width: 40,
      height: 40,
      marginRight: 10,
    },
    chat_content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    chat_text_title: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.QUATERNARY,
    },
    chat_text_subtitle: {
      flex: 1,
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.QUATERNARY,
    },
  });