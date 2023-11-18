import React, { useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Light from '../../utils/Theme/Light';
import Dark from '../../utils/Theme/Dark';
import { useTheme } from '../../utils/Theme/ThemeContext';

export const AvatarImage = ({ image, size=40 }: { image: string, size?: number }) => {
  const { theme } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const styles = createStyles(theme);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image style={{ ...styles.image, width: size, height: size, borderRadius: size * (size/40), borderWidth: (size/40) }} source={{ uri: image }} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <Image style={styles.fullscreenImage} source={{ uri: image }} />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    image: {
      borderColor: theme.QUATERNARY,
      width: 40, 
      height: 40,
      borderWidth: 1,
      borderRadius: 25,
      marginHorizontal: 7.5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullscreenImage: {
      borderColor: theme.PRIMARY,
      borderWidth: 5,
      borderRadius: 100,
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
  });
