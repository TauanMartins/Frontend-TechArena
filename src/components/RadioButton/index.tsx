import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../utils/Model/User';


interface RadioButtonProps {
    colours: {
        PRIMARY: string;
        SECONDARY: string;
        TERCIARY: string;
        QUATERNARY: string;
    };
    label: string;
    description: string;
    value: User["prefered_theme"];
    selectedOption: string;
    handleSelectedOption: (option: User["prefered_theme"]) => void;

}
export const RadioButton = ({ colours: colours, label: label, description: description, value: value, selectedOption: selectedOption, handleSelectedOption: handleSelectedOption }: RadioButtonProps) => {
    const PRIMARY = colours.PRIMARY;
    const SECONDARY = colours.SECONDARY;
    const TERCIARY = colours.TERCIARY;
    return (
        <View>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center', margin: '3.5%'
            }} onPress={() => handleSelectedOption(value)}>
                <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: selectedOption === value ? SECONDARY : 'transparent',
                    borderWidth: 2,
                    borderColor: SECONDARY,
                    marginRight: 10
                }}></View>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'Sansation Regular', fontSize: 16, color: SECONDARY }}> {label}</Text>
                    <Text style={{ fontFamily: 'Sansation Regular', color: SECONDARY, }}> {description}</Text>
                </View>
            </TouchableOpacity>
        </View >
    )
}