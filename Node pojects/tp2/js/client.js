var socket = io();// Création d'un socket.io

// Demande à l'utilisateur son pseudo et l'envoie au serveur
socket.emit('set-pseudo', prompt("Pseudo ?"));

// Récupération des éléments du DOM
var messageContainer = document.getElementById('message-container');
var usersContainer = document.getElementById('utilisateurs');
var form = document.getElementById('form');
var input = document.getElementById('input');

// Définition des variables
var id_salon = 'salon'; // Variable définissant le salon général comme destinataire
var lesMessages = []; // Tableau qui va contenir l'ensemble des messages envoyés 
var user = null;

// Gestion de l'envoi de message par le formulaire
form.addEventListener('submit', (e) => {
  console.log("voici e"+JSON.stringify(e))
  console.log("message"+JSON.stringify(message));
  e.preventDefault();
  
  // Création de l'objet message à envoyer
  var message = {
    emmet_id: user,
    msg: input.value,
    id_utilisateur_destI:id_client
  }
  
  // Envoi du message au serveur via le socket
  socket.emit('emission_message', message);

   // Vidage du champ de saisie
  input.value = '';
}); 

// Réception d'un message envoyé par le serveur
socket.on('reception_message', (message) => {
  console.log("msg" + JSON.stringify(message));
  // Ajout du message à l'interface
  const messageElem = document.createElement('div');
  messageElem.innerHTML = '<p>' + message.msg + '</p>';
  messageContainer.appendChild(messageElem);
});

// Réception de la liste des utilisateurs connectés envoyée par le serveur
socket.on('reception_utilisateurs', (utilisateurs) => {
  // Vidage de la liste des utilisateurs affichée  
  usersContainer.innerHTML = '';
  

  // Ajout du salon général nommé salon à la liste des utilisateurs affichée
  const salonElem = document.createElement('div');
  salonElem.innerHTML = '<a href="#"> Salon </a>';
  usersContainer.appendChild(salonElem);
   
  // Parcours de la liste des utilisateurs
  utilisateurs.forEach((utilisateur) => {
    // Récupération de l'ID de l'utilisateur
    user = utilisateur.id_client;
    
    // Si l'utilisateur n'est pas la personne connecté, on l'ajoute à la liste des utilisateurs affichée
    if (user !== socket.id && utilisateur.pseudo_client !=='Salon') {
      const userElem = document.createElement('div');
      userElem.innerHTML = '<a href="#" onClick="salon(id_utilisateur_dest)" >' + utilisateur.pseudo_client + '</a>';
      //utilisateur.pseudo_client.onClick="salon(id_utilisateur_dest)";
      usersContainer.appendChild(userElem);
    } 



    // Si l'utilisateur est seul, on affiche un message spécifique
    else if (utilisateurs.length == 1) {
      const userElem = document.createElement('div')
      userElem.innerHTML = '<p> Vous êtes seul(e) </p>';
      usersContainer.appendChild(userElem);
    }
  });
});

//affichage des messages en fonction du choix de l'utilisateur
//Soit les messages du salon général
//Soit les messages d'une conversation privée avec un autre utilisateur

function salon(id){
  // Vérification si l'ID correspond à une conversation privée ou au salon général
  var isPrivate = id !== 'salon';
  console.log(id);
  // Récupération de la liste des messages en fonction de l'ID
  var messages = isPrivate ? lesMessages.filter(msg => msg.to_id === id || msg.from_id === id) : lesMessages;

  // Vidage du conteneur des messages
  messageContainer.innerHTML = '';

  // Ajout des messages à l'interface
  messages.forEach((message) => {
    const messageElem = document.createElement('div');
    messageElem.innerHTML = '<p>' + message.msg + '</p>';
    messageContainer.appendChild(messageElem);
  });
}

//Vérifier les messages non-lus ,puis affiche un badge de notificiation
//incrémenté a côté de l'utilisateur

function check_unread() {
   // Récupération de la liste des messages non-lus
  var unreadMessages = lesMessages.filter(msg => !msg.isRead);

   
  // Affichage du badge de notification
  var badge = document.getElementById('badge');
  if (unreadMessages.length > 0) {
    badge.style.display = 'inline-block';
    badge.innerHTML = unreadMessages.length.toString();
  } else {
    badge.style.display = 'none';
    badge.innerHTML = '';
  }

  // Supprime le badge lorsque les messages sont lus
  messageContainer.addEventListener('click', (e) => {
    if (e.target.nodeName === 'P') {
      const msgText = e.target.textContent;
      lesMessages.forEach((msg) => {
        if (msg.msg === msgText) {
          msg.isRead = true;
        }
      });
      check_unread();
    }
  });
 }
