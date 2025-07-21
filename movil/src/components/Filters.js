import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Filters = ({ ingredients, activeFilter, onSelectFilter }) => (
    <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
    >
        <TouchableOpacity
            onPress={() => onSelectFilter('Todos')}
            style={[
                styles.button,
                activeFilter === 'Todos' ? styles.buttonActive : styles.buttonInactive,
            ]}
        >
            <Text style={[
                styles.text,
                activeFilter === 'Todos' ? styles.textActive : styles.textInactive,
            ]}>
                Todos
            </Text>
        </TouchableOpacity>

        {ingredients.map((ing) => (
            <TouchableOpacity
                key={ing.ingrediente_principal}
                onPress={() => onSelectFilter(ing.ingrediente_principal)}
                style={[
                    styles.button,
                    activeFilter === ing.ingrediente_principal ? styles.buttonActive : styles.buttonInactive,
                ]}
            >
                <Text style={[
                    styles.text,
                    activeFilter === ing.ingrediente_principal ? styles.textActive : styles.textInactive,
                ]}>
                    {ing.ingrediente_principal}
                </Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
);

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16 },
    button: { marginRight: 8, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 9999, borderWidth: 1 },
    buttonActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
    buttonInactive: { backgroundColor: '#ffffff', borderColor: '#f97316' },
    text: { fontWeight: '600' },
    textActive: { color: '#ffffff' },
    textInactive: { color: '#ea580c' },
});

export default Filters;
