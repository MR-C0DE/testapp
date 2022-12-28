import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE)

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;

    await connection.exec(
        `
        CREATE TABLE IF NOT EXISTS suggestion(
            id_suggestion INTEGER PRIMARY KEY,
            sermon TEXT NOT NULL UNIQUE,
            link_listen TEXT NOT NULL,
            link_download TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS contenu(
            id_contenu INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            sousTitle TEXT NOT NULL,
            paragraph INTEGER NOT NULL,
            link_about INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS message (
            id_message INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom     TEXT    NOT NULL,
            nom        TEXT    NOT NULL,
            courriel   TEXT    NOT NULL,
            message    TEXT    NOT NULL,
            status     TEXT    NOT NULL,
            ip_address TEXT    NOT NULL,
            date_send  TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS visiteur (
            id_visiteur INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_visiteur TEXT    NOT NULL,
            date_visite TEXT    NOT NULL
        );


        CREATE TABLE IF NOT EXISTS interaction (
            id_interaction   INTEGER PRIMARY KEY AUTOINCREMENT,
            action_effectuee TEXT    NOT NULL,
            element          TEXT    NOT NULL,
            lien             TEXT    NOT NULL,
            ip_visiteur      TEXT    NOT NULL,
            date_interaction TEXT    NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS admin (
            id_admin INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            username TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL
        );
        
        
        
        INSERT INTO suggestion (sermon, link_listen, link_download) VALUES 
            ('62-0531 - Le conflit entre Dieu et Satan', 'https://branham.org/fr/messagestream/FRN=62-0531', 'https://s3.amazonaws.com/omega-public-audio/repo/1fb/1fb295e0580e396884893c8f493d5d1d8012b8779db80d077444610eb1a2a8c830243a8fc5988f834896196691e481205a10642485da964031b138e9014a06e9.m4a');
            
        INSERT INTO contenu (title, sousTitle, paragraph, link_about) VALUES 
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000'),
            ('Titre du tableau', 'Seconde titre', 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.', '1662508800000');
        `
    );

    return connection;
}

// Base de données dans un fichier
let connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;