import React from 'react';
import {ScreenProps} from '../../../navigation/ScreenProps';
import {StyleSheet, Image, ScrollView, View, Text} from 'react-native';
import {useAuth} from '../../../utils/Auth/AuthContext';
import {NotificationIcon} from '../../../components/IconsButton';
import {useTheme} from '../../../utils/Theme/ThemeContext';

const Recommended: React.FC<ScreenProps<'HomeRecommendedSchedules'>> = () => {
  const {user} = useAuth();
  const {theme} = useTheme();

  return (
    <ScrollView style={{...styles.scrollView, backgroundColor: theme.PRIMARY}}>
      <View style={{...styles.container, backgroundColor: theme.PRIMARY}}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={{...styles.text_1, color: theme.SECONDARY}}>
              Olá, {user.name}!
            </Text>
            <Text style={{...styles.text_2, color: theme.SECONDARY}}>
              Encontre partidas
            </Text>
          </View>
          <View style={styles.col}>
            <View style={styles.row}>
              <NotificationIcon
                style={styles.notification}
                color={theme.SECONDARY}
                size={32}
              />
              {user.picture && (
                <Image
                  style={{...styles.picture, borderColor: theme.SECONDARY}}
                  source={{uri: user.picture}}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col: {
    justifyContent: 'center',
  },
  text_1: {
    fontFamily: 'Sansation Regular',
    marginTop: '10%',
    fontSize: 14,
  },
  text_2: {
    fontFamily: 'Sansation Regular',
    fontSize: 28,
  },
  notification: {
    marginTop: '30%',
  },
  picture: {
    marginTop: '30%',
    marginLeft: '5%',
    borderRadius: 50,
    borderWidth: 2,
    width: 55,
    height: 55,
  },
});
export default Recommended;
