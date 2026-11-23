import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// Middlewares
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.json());


// Route principale
app.get('/', (req, res) => {
    res.send('API To-Do List fonctionne correctement');
});


// Routes des tâches
app.use('/tasks', taskRoutes);


// Gestion des routes inexistantes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route introuvable'
    });
});


// Gestion générale des erreurs
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        message: 'Erreur interne du serveur'
    });
});


// Démarrer le serveur après la connexion MongoDB
const startServer = async () => {
    try {

        await connectDB();

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });

    } catch (error) {
        console.error('Impossible de démarrer le serveur');
        process.exit(1);
    }
};

startServer();