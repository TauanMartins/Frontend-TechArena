import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoaderUnique = () => {
    return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color="#F4F4F4" />
        </View>
    );
};

const styles = StyleSheet.create({
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25
    },
});

export default LoaderUnique;