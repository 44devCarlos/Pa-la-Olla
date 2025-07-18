import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Filters = ({ filters, activeFilter, setActiveFilter }) => (
    <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
    >
        {filters.map((filter) => (
            <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                    styles.button,
                    activeFilter === filter ? styles.buttonActive : styles.buttonInactive,
                ]}
            >
                <Text style={[
                    styles.text,
                    activeFilter === filter ? styles.textActive : styles.textInactive,
                ]}>
                    {filter}
                </Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    button: {
        marginRight: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 9999,
        borderWidth: 1,
    },
    buttonActive: {
        backgroundColor: '#f97316',
        borderColor: '#f97316',
    },
    buttonInactive: {
        backgroundColor: '#ffffff',
        borderColor: '#f97316',
    },
    text: {
        fontWeight: '600',
    },
    textActive: {
        color: '#ffffff',
    },
    textInactive: {
        color: '#ea580c',
    },
});

export default Filters;
