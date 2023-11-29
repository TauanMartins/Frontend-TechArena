import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {User} from '../../utils/Model/User';

interface RadioButtonProps {
  colours: {
    PRIMARY: string;
    SECONDARY: string;
    TERTIARY: string;
    QUATERNARY: string;
  };
  label: string;
  description: string;
  value: string; // Tipo genérico
  selectedOption: string;
  handleSelectedOption: (option: string) => void; // Tipo genérico
}

const RadioButton2: React.FC<RadioButtonProps> = ({
  colours,
  label,
  description,
  value,
  selectedOption,
  handleSelectedOption,
}) => {
  const styles = createStyles(colours, selectedOption === value);

  return (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => handleSelectedOption(value)}>
      <View style={styles.radioDot} />
      <View style={styles.containerText}>
        <Text style={styles.text}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (
  colours: RadioButtonProps['colours'],
  isSelected: boolean,
) =>
  StyleSheet.create({
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 7.5,
      flex: 1,
    },
    radioDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: isSelected ? colours.SECONDARY : 'transparent',
      borderWidth: 2,
      borderColor: colours.SECONDARY,
      marginHorizontal: 10
    },
    containerText: {
      flex: 1
    },
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: colours.SECONDARY,
    },
    description: {
      flex:1,
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: colours.SECONDARY,
    },
  });

export default RadioButton2;
