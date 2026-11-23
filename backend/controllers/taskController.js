import mongoose from 'mongoose';
import Task from '../models/Task.js';

// Récupérer toutes les tâches
export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Ajouter une tâche
export const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Le titre est obligatoire'
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description || '',
            completed: false
        });

        res.status(201).json(task);

    } catch (error) {
        next(error);
    }
};

// Modifier une tâche
export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID invalide'
            });
        }

        const task = await Task.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Tâche introuvable'
            });
        }

        res.status(200).json(task);

    } catch (error) {
        next(error);
    }
};

// Supprimer une tâche
export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID invalide'
            });
        }

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                message: 'Tâche introuvable'
            });
        }

        res.status(200).json({
            message: 'Tâche supprimée avec succès'
        });

    } catch (error) {
        next(error);
    }
};