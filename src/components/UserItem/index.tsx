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
import { AvatarImage } from '../AvatarImage';

export const UserItem = ({ id, image, name, subtitle, action, border = true }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, border);
  return (
    <TouchableOpacity onPress={() => { action() }} style={styles.chat_button}>
      <AvatarImage image={image} />
      <View style={styles.chat_content}>
        <Text style={styles.chat_text_title}>{name}</Text>
        <Text style={styles.chat_text_subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

const createStyles = (theme: typeof Light | typeof Dark, border: boolean) =>
  StyleSheet.create({
    chat_button: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
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
      flex: 1,
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
    chat_text_subtitle: {
      flex: 1,
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
  });