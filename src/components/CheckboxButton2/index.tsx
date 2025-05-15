import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { User } from '../../utils/Model/User';

interface CheckboxButtonProps {
  colours: {
    PRIMARY: string;
    SECONDARY: string;
    TERTIARY: string;
    QUATERNARY: string;
  };
  label: string;
  value: boolean;
  handleSelectedOption: () => void;
}

const CheckboxButton2: React.FC<CheckboxButtonProps> = ({
  colours,
  label,
  value,
  handleSelectedOption,
}) => {
  const styles = createStyles(colours, value);

  return (
    <TouchableOpacity
      style={styles.checkboxButton}
      onPress={handleSelectedOption}>
      <View style={styles.checkbox}>
        {value && <View style={styles.checkboxInner} />}
      </View>
      <View style={styles.containerText}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (
  colours: CheckboxButtonProps['colours'],
  isSelected: boolean,
) =>
  StyleSheet.create({
    checkboxButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 7.5,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 2,
      backgroundColor: isSelected ? colours.TERTIARY : 'transparent',
      borderWidth: 2,
      borderColor: colours.SECONDARY,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxInner: {
      width: 10,
      height: 10,
      borderRadius: 1,
      backgroundColor: colours.SECONDARY,
    },
    containerText: {
      flex: 1,
    },
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: colours.SECONDARY,
    },
    description: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: colours.SECONDARY,
    },
  });

export default CheckboxButton2;
