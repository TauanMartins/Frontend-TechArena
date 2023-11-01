import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';

const Notification = ({ message, success, visible, onClose }) => {
    const [fadeAnim] = useState(new Animated.Value(1));
    const { theme } = useTheme();
    useEffect(() => {
        if (visible) {
            // Faz a notificação aparecer suavemente
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                // Faz a notificação desaparecer suavemente
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(onClose);
            }, 2500);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [visible, onClose]);

    return visible ? (
        <Animated.View style={[styles.notification, success ? styles.success : styles.error, { opacity: fadeAnim }]}>
            <Text style={{...styles.message, color: theme.TERCIARY}}>{message}</Text>
        </Animated.View>
    ) : null;
};

const styles = StyleSheet.create({
    notification: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    success: {
        backgroundColor: 'green',
    },
    error: {
        backgroundColor: 'red',
    },
    message: {
        color: 'white',
        fontSize: 16,
    },
});

export default Notification;
