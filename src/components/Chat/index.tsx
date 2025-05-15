import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { screens } from '../../navigation/ScreenProps';
import { navigate } from '../../navigation/NavigationUtils';
import Light from '../../utils/Theme/Light';
import Dark from '../../utils/Theme/Dark';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { AvatarImage } from '../AvatarImage';

export const Chat = ({ id, image, name, message, navigation, isAuthenticated, user, is_group_chat }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <TouchableOpacity onPress={() => {
      navigate(
        navigation,
        screens.SocialChatStack.name as keyof RootStackParamList,
        isAuthenticated,
        user, { chat_id: id, name: name, image: image, is_group_chat: is_group_chat })
    }} style={styles.chat_button}>
      <AvatarImage image={image}/>
      <View style={styles.chat_content}>
        <Text style={styles.chat_text_title}>{name}</Text>
        <Text style={styles.chat_text_subtitle}>{message}</Text>
      </View>
    </TouchableOpacity>
  )
}

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    chat_button: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderColor: theme.TERTIARY,
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
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    chat_text_title: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
    chat_text_subtitle: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
  });