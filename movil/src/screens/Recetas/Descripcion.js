import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchRecipeRatings, fetchRecipeComments } from '../../services/api';

// Importamos los nuevos componentes que crearemos
import RecipeInfo from '../../components/RecipeInfo';
import CommentsSection from '../../components/CommentsSection';

const Descripcion = () => {
    const route = useRoute();
    const { receta } = route.params; // Recibimos la receta desde la pantalla anterior

    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRecipeDetails = async () => {
        try {
            setLoading(true);
            const [ratingsData, commentsData] = await Promise.all([
                fetchRecipeRatings(receta.id_receta),
                fetchRecipeComments(receta.id_receta)
            ]);
            setRatings(ratingsData);
            setComments(commentsData);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los detalles de la receta.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipeDetails();
    }, [receta.id_receta]); // Se ejecuta cada vez que la receta cambie

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#7F1D1D" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <RecipeInfo receta={receta} ratings={ratings} />
            <CommentsSection 
                recipeId={receta.id_receta}
                initialComments={comments}
                onCommentPosted={loadRecipeDetails} // Función para recargar todo al postear
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff7f4' },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default Descripcion;
