import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StatusBar, 
    SafeAreaView,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

import { 
    fetchPopularRecipes, 
    fetchAllRecipes, 
    fetchMainIngredients, 
    fetchRecipesByIngredient 
} from '../../services/api';

import Header from '../../components/Header';
import RecipeCardHorizontal from '../../components/RecipeCardHorizontal';
import RecipeCardVertical from '../../components/RecipeCardVertical';
import Filters from '../../components/Filters';

const HomeScreen = () => {
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    
    const [loading, setLoading] = useState(true); // Carga inicial de la página
    const [recipesLoading, setRecipesLoading] = useState(false); // Carga para la lista de recetas al filtrar
    const [error, setError] = useState(null);

    const [activeFilter, setActiveFilter] = useState('Todos');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [popularData, allData, ingredientsData] = await Promise.all([
                    fetchPopularRecipes(),
                    fetchAllRecipes(),
                    fetchMainIngredients()
                ]);
                
                setPopularRecipes(popularData);
                setAllRecipes(allData);
                setIngredients(ingredientsData);

            } catch (e) {
                setError('No se pudieron cargar los datos. Inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleFilterSelect = async (filter) => {
        if (filter === activeFilter) return;

        setActiveFilter(filter);
        setRecipesLoading(true);
        setError(null);

        try {
            const filteredRecipes = filter === 'Todos'
                ? await fetchAllRecipes()
                : await fetchRecipesByIngredient(filter);
            setAllRecipes(filteredRecipes);
        } catch (e) {
            setError('Error al filtrar las recetas.');
            setAllRecipes([]);
        } finally {
            setRecipesLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color="#991b1b" />
                    <Text style={styles.loadingText}>Cargando recetas...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && !recipesLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header />
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Recetas Populares</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
                        {popularRecipes.map(recipe => (
                            <RecipeCardHorizontal key={recipe.id_receta} recipe={recipe} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <Filters 
                        ingredients={ingredients}
                        activeFilter={activeFilter}
                        onSelectFilter={handleFilterSelect}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Todas las Recetas</Text>
                    {recipesLoading ? (
                        <ActivityIndicator size="large" color="#991b1b" style={{ marginTop: 20 }} />
                    ) : (
                        allRecipes.map(recipe => (
                            <RecipeCardVertical key={recipe.id_receta} recipe={recipe} />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff7ed' },
    sectionContainer: { paddingVertical: 12 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#991b1b', marginBottom: 16, paddingHorizontal: 16 },
    horizontalScrollView: { paddingLeft: 16 },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#4b5563' },
    errorText: { fontSize: 16, color: '#ef4444', textAlign: 'center' }
});

export default HomeScreen;
