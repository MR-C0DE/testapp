import connectionPromise from './connexion.js';

export const getContenu = async () => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.all(
        'SELECT * FROM contenu'
    );

    // Retourner les résultats
    return results;
}

export const getSuggestion = async () => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.get(
        `SELECT *
        FROM suggestion
        ORDER BY id_suggestion DESC
        LIMIT 1;
        `
    );

    // Retourner les résultats
    return results;
}

export const updateSuggestion = async (data) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `
        UPDATE suggestion
        SET sermon = ?, link_listen = ?,  link_download = ?
        WHERE id_suggestion = 1;
        `,
        [data.sermon, data.link_listen, data.link_download]
    );

}

export const delateContenu = async (data) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `
        DELETE FROM contenu WHERE id_contenu = ?;

        `,
        [data.id_contenu]
    );

}

export const addContenu = async (data) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `INSERT INTO contenu(title, sousTitle, paragraph, link_about)
        VALUES(?, ?, ?, ?)`,
       [data.title, data.sousTitle, data.paragraph, data.link_about]
    );

}

export const reveciedMessage = async (data, ip, date) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `INSERT INTO message(prenom, nom, courriel, raison, message, status, ip_address, date_send)
        VALUES(?, ?, ?, ?, ?, 'non_lue', ?, ?)`,
       [data.prenom, data.nom, data.courriel, data.raison, data.message, ip, date]
    );

}

export const getMessage = async () => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.all(
        'SELECT * FROM message ORDER BY id_message DESC'
    );

    // Retourner les résultats
    return results;
}

export const updateMessageStatus = async (data) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `
        UPDATE message
        SET status = 'lue'
        WHERE id_message = ?;
        `,
        [data.id_message]
    );

}

export const addVisitor = async (data) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `INSERT INTO visiteur(ip_visiteur, date_visite)
        VALUES(?, ?)`,
       [data.ip_visiteur, data.date_visite]
    );

}

export const addInteraction = async (data, ip) => 
{
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Créer le 'orders'
    let result = await connection.run(
        `INSERT INTO interaction(action_effectuee, element, lien, ip_visiteur, date_interaction)
        VALUES(?, ?, ?, ?, ?)`,
       [data.action_effectuee, data.element, data.lien, ip, data.date_interaction]
    );

}

export const getNumberVisite = async () => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.get(
        'SELECT COUNT(*) AS number_visite FROM visiteur'
    );

    // Retourner les résultats
    return results;
}

export const getDistinctInteraction = async () => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.all(
        'SELECT DISTINCT action_effectuee FROM interaction'
    );

    // Retourner les résultats
    return results;
}

export const getInteractionSearch = async (data) => {
    // Attendre que la connexion à la base de données
    // soit établie
    let connection = await connectionPromise;

    // Envoyer une requête à la base de données
    let results = await connection.all(
        'SELECT * FROM interaction WHERE action_effectuee = ?',
        [data.action_effectuee]
    );

    // Retourner les résultats
    return results;
}

export async function getAdmin(username) {
    let connection = await connectionPromise;

    const result = await connection.get(
        `
        SELECT *
        FROM admin
        WHERE username = ?`,
        [username]
    );

    return result;
}