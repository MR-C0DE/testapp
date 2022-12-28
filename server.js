import 'dotenv/config'
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import cors from 'cors';

import { engine  } from 'express-handlebars';
import { 
    addContenu, 
    addInteraction, 
    addVisitor, 
    delateContenu, 
    getContenu, 
    getDistinctInteraction, 
    getInteractionSearch, 
    getMessage, 
    getNumberVisite, 
    getSuggestion, 
    reveciedMessage,
    updateMessageStatus, 
    updateSuggestion 
    } 
    from './models/connector.js';
import { isTexteValide } from './validation.js';
import './authentification.js';
const MemoryStore = memorystore(session);

// Création du serveur
const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// Ajout de middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(json());

app.use(session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', async (request, response) => {

    if(request.user){
        response.render('home', {
            titre: 'Accueil',
            texte: 'Ceci est un petit paragraphe de texte',
            nombre: (await getNumberVisite()).number_visite,
            selects: await getDistinctInteraction(),
            styles: ['/css/home.css'],
            scripts:['/js/home.js'],
            user: request.user,
            adminName: request.user.name
        });
    }else{
        response.redirect('/connexion');
    }

});

app.get('/suggestion', async (request, response) => {
    if(request.user){
        response.render('suggestion', {
            titre: 'Suggestion',
            data:await getSuggestion(),
            scripts:['/js/suggestion.js'],
            user: request.user,
            adminName: request.user.name
        });
    }else{
        response.redirect('/connexion');
    }
});

app.get('/contenu', async (request, response) => {

    if(request.user){
        response.render('contenu', {
            titre: 'Contenu',
            contenu:await getContenu(),
            scripts:['/js/contenu.js'],
            user: request.user,
            adminName: request.user.name
        });
    }else{
        response.redirect('/connexion');
    }
});
app.get('/message', async (request, response) => {


    if(request.user){
        response.render('message', {
            titre: 'Message',
            styles:['/css/message.css'],
            messages:await getMessage(),
            scripts:['/js/message.js'],
            user: request.user,
            adminName: request.user.name
        });
    }else{
        response.redirect('/connexion');
    }
});


app.get('/connexion', (request, response) => {
    if(!request.user){
        response.render('connexion', {
            titre: 'Connexion',
            scripts: ['/js/connexion.js'],
            user: request.user
        });
    }else{
        response.redirect('/');
    }
});


app.post('/suggestion', async (request, response)=>{
    if(request.body){
        await updateSuggestion(request.body);
        response.status('200').end();
    }else{
        response.status('401').end();
    }
});

app.post('/contenu', async (request, response)=>{
   
    if(request.body){
        await addContenu(request.body);
        response.status('200').end();
    }else{
        response.status('401').end();
    }
});

app.post('/lecture', async (request, response)=>{
   
    if(request.body){
        await updateMessageStatus(request.body);
        response.status('200').end();
    }else{
        response.status('401').end();
    }
});

app.post('/interaction', async (request, response)=>{
   
    if(request.body){
        const ip = (request.connection.remoteAddress).replace('::ffff:', '');
        await addInteraction(request.body, ip);
        response.status('200').end();
    }else{
        response.status('401').end();
    }
});

app.post('/interaction_recherche', async (request, response)=>{
   
    if(request.body){
        const result = await getInteractionSearch(request.body);
        response.status('200').json(result);
    }else{
        response.status('401').end();
    }
});


app.post('/connexion', (request, response, next) => {


    // On vérifie le le courriel et le mot de passe
    // envoyé sont valides

    if (isTexteValide(request.body.username) &&
        isTexteValide(request.body.password)) {

        // On lance l'authentification avec passport.js
        passport.authenticate('local', (error, user, info) => {

            if (error) {
                // S'il y a une erreur, on la passe
                // au serveur

                next(error);
            }
            else if (!user) {
                // Si la connexion échoue, on envoit
                // l'information au client avec un code
                // 401 (Unauthorized)
                
                response.status(401).json(info);
            }
            else {
                // Si tout fonctionne, on ajoute
                // l'utilisateur dans la session et
                // on retourne un code 200 (OK)

                request.logIn(user, (error) => {
                    if (error) {
                        next(error);
                    }

                    response.sendStatus(200);
                });
            }


        })(request, response, next);
    }
    else {
        response.sendStatus(400);
    }
});

app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    })
});

app.delete('/contenu', async (request, response)=> {
    if(request.body){
        await delateContenu(request.body);
        response.status('200').end();
    }else{
        response.status('401').end();
    }
})


//Les routes vers l'exterieur 


app.route('/api/suggestion')
    .get(async (request, response) => {

        //Une fois qu'une suggestion est faite, on enregistre le visiteur
        const ip = (request.connection.remoteAddress).replace('::ffff:', '');
        const date = new Date();
        await addVisitor({ip_visiteur: ip, date_visite:date.toLocaleDateString()}); 
        response.status('200').json(await getSuggestion());
    });

app.route('/api/contenu')
    .get(async (request, response) => {
        response.status('200').json(await getContenu());
    });
app.route('/api/message')
    .post(async (request, response) => {
        if(request.body){
            const ip = (request.connection.remoteAddress).replace('::ffff:', '');
            const date = new Date();
            const format = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            await reveciedMessage(request.body, ip, format );
            response.status('200').json(await getContenu());
        }else{
            response.status('401').end();
        }
        
    });
// Démarrage du serveur
app.listen(process.env.PORT);
 