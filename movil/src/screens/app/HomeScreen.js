import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StatusBar, 
    SafeAreaView,
    StyleSheet 
} from 'react-native';

// Importar datos y componentes
import { popularRecipes, allRecipes, filters } from '../../constants/data';
import Header from '../../components/Header';
import RecipeCardHorizontal from '../../components/RecipeCardHorizontal';
import RecipeCardVertical from '../../components/RecipeCardVertical';
import Filters from '../../components/Filters';

const HomeScreen = () => {
    const [activeFilter, setActiveFilter] = useState('Todos');

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* SECCIÓN DE POPULARES (HORIZONTAL) */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Recetas Populares</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.horizontalScrollView}
                    >
                        {popularRecipes.map(recipe => (
                            <RecipeCardHorizontal key={recipe.id} recipe={recipe} />
                        ))}
                    </ScrollView>
                </View>

                {/* SECCIÓN DE FILTROS */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <Filters 
                        filters={filters}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                </View>

                {/* SECCIÓN DE TODAS LAS RECETAS (VERTICAL) */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Todas las Recetas</Text>
                    {allRecipes.map(recipe => (
                        <RecipeCardVertical key={recipe.id} recipe={recipe} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff7ed',
    },
    sectionContainer: {
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#991b1b',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    horizontalScrollView: {
        paddingLeft: 16,
    },
});

export default HomeScreen;
