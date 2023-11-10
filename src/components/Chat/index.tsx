import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { screens } from '../../navigation/ScreenProps';
import { navigate } from '../../navigation/NavigationUtils';

export const Chat = ({ styles, friend, message, image, id, navigation, isAuthenticated, user }) => {

  return (
    <TouchableOpacity onPress={() => {
      navigate(
        navigation,
        screens.SocialChatStack.name as keyof RootStackParamList,
        isAuthenticated,
        user, { chat_id: id, friend: friend, image: image })
    }} style={styles.chatButton}>
      <Image style={styles.userImage} source={{ uri: image }} />
      <View style={styles.chatContent}>
        <Text style={styles.chat_text_title}>{friend}</Text>
        <Text style={styles.chat_text}>{message}</Text>
      </View>
    </TouchableOpacity>
  )
}