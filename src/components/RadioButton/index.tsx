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
  value: User['prefered_theme'];
  selectedOption: string;
  handleSelectedOption: (option: User['prefered_theme']) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
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
      marginHorizontal: 10,
      marginVertical: 7.5,
    },
    radioDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: isSelected ? colours.SECONDARY : 'transparent',
      borderWidth: 2,
      borderColor: colours.SECONDARY,
      marginRight: 10,
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

export default RadioButton;
