/*
  A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzE1ODQyOTIzNzM4NjkzNjU1.DJMWMw.XqkaM7_-Km6inpn3jSUvvgLalYU';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted

// Importation de la librairie steam-id-convertor
var convertor = require('steam-id-convertor');

// SQLite3
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('mix_tf2.sqlite');

mx_slot = 1; //Variable de nombre de slot de joueur pour le mix, si nombre impaire : dernier joueur considéré comme commentateur
mx_type = 0; //Variable de configuration des team : 0:arangement, 1:last spec med, 2: team full random, 3: pseudo-random(mmr) --- Par défaut, en cas de mix comp team team pseudo random.
mx_serv = 0; //Liste des serveurs disponible
mx_comp = 0; //Variable d'activation du mode compétitif 0:casual 1:comp
mx_map = 'Aucune map';
mx_launch = 0; //Variable pour savoir si un mix est en cours


client.on('ready', () => {
  console.log('Bot lancé');
}
);

// Create an event listener for messages
client.on('message', message => {

  //Commandes modo
    if (message.channel.name === 'commandes_orga'){
        let orga=0
        for (const [id, role] of message.member.roles) {
            if ('organisation' === role.name) {
                orga=1;
            }
        }
        if (orga===1){
        
            if (message.content === '//viewconfig') {
                // Affiche la config du bot pour le serveur
                let slot_s=mx_slot%2; //Nombre de commentateur/viewvers
                let slot_j=mx_slot-slot_s; //Nombre de joueurs
                let team_S;
                
                message.channel.send('Voici les configurations du mix : ');
                message.channel.send('\t Slot =======================');
                message.channel.send('\t\t Slot joueurs : '+slot_j+'\n\t\tSlot commentateur(s)/viewver(s) : '+slot_j);
                message.channel.send('\t Type de jeu =======================');
                switch(mx_type){
                    case 0:
                        team_S='arrangement (les deux équipes voient se débrouillent entre elles pour le choix des joueurs)';
                        break;
                    case 1:
                        team_S='last spec med';
                        break;
                    case 2:
                        team_S='team full random';
                        break;
                    case 3:
                        team_S='team équilibré par mmr (comp obligatoire)';
                        break;
                }
                message.channel.send('\t\t Choix des équipes : '+team_S+'\n\t\t TEAM RED : '+slot_j/2+'\n\t\t TEAM BLU : '+slot_j/2+'\n\t\t Spectateur/commentateur : '+slot_s+'\n Map : '+mx_map);
                
            }

            if (message.content === '//preparemix') {
                if (mx_launch === 0){
                    mx_launch = 1;
                }else{
                    message.channel('Un mix est déjà en cours, vous nepouvez pas en lancer un deuxième.');
                }
                
            }

            if (message.content === '//launch') {
                if (mx_launch === 1){
                    mx_launch = 2;
                    message.channel.send('Lancement du mix');
                }else{
                    message.channel('Un mix est déjà en cours, vous nepouvez pas en lancer un deuxième.');
                }
            }

            if (message.content === '//stop') {
                mx_lauch = 0;
                //Arrêt instantané du bot pour le mix en cours de préparation/lancé
                message.channel.send('Voici les configurations du mix : ');
            }

            if (message.content === '//end') {
                //Termine tout la phase d'arrêt standart d'un mix
                message.channel.send('Voici les configurations du mix : ');
            }
            if (message.content.substring(0,6) === '//slot'){
                //Indique le nombre de slot dans le serv
                mx_slot=parseInt(message.content.substring(7,message.content.length),10);
                message.channel.send('Slot = '+mx_slot);
            }
            if (message.content.substring(0,6) === '//type'){
                //Indique le type de jeu du serv
                switch(message.content.substring(7,8)){
                    case '0':
                        mx_type=0;
                        break;
                    case '1':
                        mx_type=1;
                        break;
                    case '2':
                        mx_type=2;
                        break;
                    case '3':
                        mx_type=3;
                        comp =1;
                        break;
                    default:
                        message.channel.send('Erreur commande //type');
                        break;
                }
                message.channel.send('Type='+mx_type);
            }
            if (message.content.substring(0,6) === '//serv'){
                //Indique le nombre conrespondant à l'id du serveur
            }
            if (message.content.substring(0,6) === '//comp'){
                //Boolean pour savoir si les points sont activés
                switch(message.content.substring(8)){
                    case '0':
                        mx_comp=0;
                        break;
                    case '1':
                        mx_comp=1;
                        break;
                    default:
                        message.channel.send('Erreur commande //comp');
                        message.channel.send('Comp='+mx_comp);
                        break;
                }
            }
            if (message.content.substring(0,5) === '//map'){
                mx_map=message.content.substring (6,message.content.length);
            }
        }
    }



  //Commandes standard
    if (message.channel.name === 'commandes_bot'){
        if (message.content.substring(0,1) !== '//' && message.author.username !== 'bottest'){
            //message.delete();
        }
        
        if (message.content.substring(0, 8) === '//report') {
            // Affiche la config du bot pour le serveur
            for (const [id, user] of message.mentions.users) {
                    if(id>3){
                        message.channel.send('Vous avez déjà voté 3 fois.');
                        break;
                    }
                    
                    
                    // Requête SQL de chaque personne
                    try{
                        
                    }
                    catch(e){
                        console.log('erreur requete SQL '+e);
                    }
                }
            message.channel.send('Joueur reporté');
        }

        if (message.content.substring(0, 7) === '//honor') {
            // Commande d'honneur
            message.channel.send('Joueur honoré');
            let arobaz=message.content.charAt(9);
            if ('@'===arobaz){
                for (const [id, user] of message.mentions.users) {
                    
                    // Requête SQL de chaque personne
                    try{
                        
                    }
                    catch(e){
                        console.log('erreur requete SQL '+e);
                    }
                    
                }
                message.channel.send('Joueurs honoré');
            }
            else if ('all'===message.content.substring(9, 11)){
                //Honneur tout le monde
                message.channel.send('Tout les joueurs honorés');
                try{
                    
                }
                catch(e){
                    console.log('erreur requete SQL '+e);
                }
            }
            else {
                message.channel.send('Erreur synthaxe commande //honor');
            }
            
        }
        

        if (message.content === '//rank') {
            // Affiche la config du bot pour le serveur
            message.author.send("Vous pouvez acceder à votre rang ici : http://www.exemple.com");
        }

        if (message.content === '//info') {
            // Affiche la config du bot pour le serveur
            message.author.send("Voici toutes les informations à propos de ce bot.");
        }

        if (message.content.substring(0, 4) === '//id') {
            let id=message.content.substring(5,message.content.length);
            if(id.length === 17){
                let comp =0;
                for (const [id, role] of message.member.roles) {
                if ('competitif' === role.name) {
                    comp=1;
                }
                }
                if(comp === 1){
                    // L'utilisateur rentre de nouveau son ID steam
                    db.run("INSERT INTO discorduser (discordid,steamid32,steamid64) VALUES ("+message.user.id+','+convertor.to32(id)+','+id+')');
                    
                }else{
                    // Première fois que l'utilisateur rentre son ID steam
                    
                    
                }
                message.channel.send('ID correct');
            }else{
                //Id de mauvaise taille
                message.channel.send('id éronné');
            }
        }
    }
});

// Log our bot in
client.login(token);


// Envoyer un msg avec le tts message.channel.send('Je suis parti en allemagne voir des drôles de gens...',{tts: true});
//message.member.role.name
/*
for (const [id, role] of message.member.roles) {
    if (name === role.name) {
         
    }
}

 */

