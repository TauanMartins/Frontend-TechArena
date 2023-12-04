import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

export const HomeIcon = ({ color, size, isActive }) => {
  return (
    <View style={{ flexDirection: 'column', alignContent: 'center', height: '100%' }}>
      <View
        style={{
          height: 1.8,
          width: 'auto',
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <AntDesign
        style={{ marginTop: '13%' }}
        name="home"
        color={color}
        size={size}
      />
    </View>
  );
};
export const LeagueIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="trophy" color={color} size={size} />
    </View>
  );
};
export const CreateMatchIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="plus" color={color} size={size} />
    </View>
  );
};

export const SettingsIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="gear" color={color} size={size} />
    </View>
  );
};

export const SocialIcon = ({
  color,
  size,
  isActive
}) => {
  return (
    <View style={{ flexDirection: 'column', alignContent: 'center', height: '100%' }}>
      <View
        style={{
          height: 1.8,
          width: 'auto',
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <Ionicons
        style={{ marginTop: '11%' }} name="chatbubbles-outline" size={size} color={color} />
    </View>
  );
};
// Abaixo ícones dispersos pelo aplicativo.
export const NotificationIcon = ({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: ViewStyle;
}) => {
  return (
    <View style={{ ...style }}>
      <Ionicons name="notifications-outline" color={color} size={size} />
    </View>
  );
};

export const BackButton = ({
  onPress,
  style,
  color,
}: {
  onPress: () => void;
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...style, paddingVertical: 10, paddingHorizontal: 10 }}>
      <AntDesign name="left" size={25} color={color} />
    </TouchableOpacity>
  );
};
export const Detail = ({
  color,
}: {
  color: string;
}) => {
  return (
    <AntDesign style={{alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20}} name="ellipsis1" size={35} color={color} />
  );
};

export const CollapseDown = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <AntDesign style={{ ...style }} name="down" size={25} color={color} />
  );
};
export const CollapseRight = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <AntDesign style={{ ...style }} name="right" size={25} color={color} />
  );
};
export const PreferenceIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <FontAwesome5 name="sliders-h" size={20} color={color} />
    </View>
  );
};
export const FavoriteIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Entypo name="star" size={20} color={color} />
    </View>
  );
};
export const SecurityIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Ionicons name="shield-checkmark-outline" size={20} color={color} />
    </View>
  );
};
export const MyProfile = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Feather name="user" size={20} color={color} />
    </View>
  );
};
export const PreferenceThemeIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <FontAwesome5 name="palette" size={20} color={color} />
    </View>
  );
};

export const AddUserFriendIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Feather name="user-plus" size={20} color={color} />
    </View>
  );
};
export const ChatIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10, alignSelf: 'center' }}>
      <Ionicons name="chatbubble" size={24} color={color} />
    </View>
  );
};

export const FriendsIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, alignSelf: 'center' }}>
      <Feather name="user" color={color} size={24} />
    </View>
  );
};
export const TeamsIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, alignSelf: 'center' }}>
      <MaterialIcons name="groups" color={color} size={34} />
    </View>
  );
};