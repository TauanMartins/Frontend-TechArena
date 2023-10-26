import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';

const PrivacyPolicies_ServiceTems = () => {
    const handleLinkPress = (url: string) => {
        Linking.openURL(url);
    };
    return (
        <Text style={styles.text}>
            Ao prosseguir, você concorda com nossos{' '}
            <TouchableOpacity onPress={() => handleLinkPress('https://techarena.com.br/service-terms')}>
                <Text style={styles.link}>Termos de Serviço</Text>
            </TouchableOpacity>{' '}
            e confirma ter lido nossa{' '}
            <TouchableOpacity onPress={() => handleLinkPress('https://techarena.com.br/privacy-policies')}>
                <Text style={styles.link}>Política de Privacidade</Text>
            </TouchableOpacity>.
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Sansation Regular',
        textAlign: 'center',
        fontSize: 15,
        color: '#F4F4F4',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    link: {
        fontFamily: 'Sansation Regular',
        textDecorationLine: 'underline',
        textAlign: 'center',
        fontSize: 15,
        color: '#0a0a0a',
    },
});

export default PrivacyPolicies_ServiceTems;