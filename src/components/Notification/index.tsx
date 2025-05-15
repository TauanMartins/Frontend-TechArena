import React, {useState, useEffect, useRef} from 'react';
import {Text, StyleSheet, Animated, ViewStyle} from 'react-native';
import {useTheme} from '../../utils/Theme/ThemeContext';

const Notification = ({message, success = false, visible = false, onClose}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const {theme} = useTheme();
  const isAnimating = useRef(false);

  const animateNotification = (toValue: number, callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (callback) {
        callback();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      if (!isAnimating.current) {
        isAnimating.current = true;
        animateNotification(1);
      }
      const hideTimer = setTimeout(() => {
        animateNotification(0, () => {
          isAnimating.current = false;
          onClose();
        });
      }, 2000);
      return () => {
        clearTimeout(hideTimer);
      };
    }
  }, [visible, onClose, fadeAnim]);

  const dynamicStyle: ViewStyle = success
    ? {backgroundColor: 'green'}
    : {backgroundColor: 'red'};

  return (
    <Animated.View
      style={[styles.notification, dynamicStyle, {opacity: fadeAnim}]}>
      <Text style={[styles.message, {color: theme.TERTIARY}]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  message: {
    fontSize: 16,
  },
});

export default Notification;
