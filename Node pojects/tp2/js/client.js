var socket = io(); // Création d'un socket.io

// Demande à l'utilisateur son pseudo et l'envoie au serveur
socket.emit('set-pseudo', prompt("Pseudo ?"));

// Récupération des éléments du DOM
const messageContainer = document.getElementById('message-container');
var usersContainer = document.getElementById('utilisateurs');
var form = document.getElementById('form');
var input = document.getElementById('input');

// Définition des variables
var id_salon = 'salon'; // Variable définissant le salon général comme destinataire
var lesMessages = []; // Tableau qui va contenir l'ensemble des messages envoyés
var user = null;
var pseudotest =null;
var id_utilisateur_dest=null;
// Gestion de l'envoi de message par le formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault();
  var laDate=new Date();
  //Création de l'objet message à envoyer


  var message = {
    emmet_id: socket.id,
    dest_id:id_salon,
    pseudo: pseudotest,
    msg: input.value,
    dest_id: id_utilisateur_dest, // Correction de la variable de destination
    date:laDate.toLocaleDateString()+' - '+laDate.toLocaleTimeString(),
    recu:false
  }

  console.log('pseudo'+pseudotest)
  // Envoi du message au serveur via le socket

  console.log(JSON.stringify(message))
  socket.emit('emission_message', (message));
  socket.emit('emision_privé',(message));
  // Vidage du champ de saisie
  input.value = '';

});

// Réception d'un message envoyé par le serveur
socket.on('reception_message', (message) => {

  
// Ajout du message à l'interface
const messageElem = document.createElement('div');
messageElem.innerHTML = '<p>'+ message.pseudo +": "+message.msg + '</p>';
messageContainer.appendChild(messageElem);

// Ajout du message au tableau de messages
lesMessages.push(message);

// Vérification des messages non-lus
});

// Fonction pour vider le champ des messages
function clearMessages() {
    messageContainer.innerHTML = '';
 }
  // Réception de la liste des utilisateurs connectés envoyée par le serveur
  socket.on('reception_utilisateurs', (utilisateurs) => {
  // Vidage de la liste des utilisateurs affichée
  usersContainer.innerHTML = '';

  // Ajout du salon général nommé salon à la liste des utilisateurs affichée
  const salonElem = document.createElement('div');
  salonElem.innerHTML = '<a href="#" onClick="salon(\'salon\')"> Salon :</a>'; // Correction du paramètre de la fonction salon
  usersContainer.appendChild(salonElem);

  // Parcours de la liste des utilisateurs
  utilisateurs.forEach((utilisateur) => {
  // Récupération de l'ID de l'utilisateur
  user = utilisateur.id_client;

  // Si l'utilisateur n'est pas la personne connectée, on l'ajoute à la liste des utilisateurs affichée
  if (user !== socket.id && utilisateur.pseudo_client !=='salon') {
    console.log("a"+utilisateur.pseudo_client)
    //pseudotest = utilisateur.pseudo_client;
    console.log('pseudo'+pseudotest)
    const userElem = document.createElement('div');
    userElem.setAttribute('pseudo',utilisateur.pseudo_client) 
    userElem.innerHTML = '<a href="#" onClick="salon(\'' + utilisateur.id_client + '\')" >' + utilisateur.pseudo_client + '</a>';
    // Correction du paramètre de la fonction salon
    usersContainer.appendChild(userElem);

  } 

  if(socket.id== utilisateur.id_client){
    pseudotest = utilisateur.pseudo_client;
  }


  // Si l'utilisateur est seul, on affiche un message spécifique
  else if (utilisateurs.length == 1) {
    console.log("b"+utilisateur.pseudo_client)

    const userElem = document.createElement('div')
    userElem.innerHTML = '<p> Vous êtes seul(e) </p>';
    usersContainer.appendChild(userElem);
  }

  });
  });

/*
function envoyerMessagePrive(dest_id,message){

  var laDate = new Date();
  var messagePrive = {
    emmet_id: socket.id,
    dest_id: dest_id,
    pseudo: pseudotest,
    msg: message,
    date: laDate.toLocaleDateString() + ' - ' + laDate.toLocaleTimeString(),
    recu: false
  };
  
  socket.emit('emission_privé',message);
}
*/


// Ecoute de l'événement 'reception_message'
socket.on('reception_message', (message) => {
  console.log(`Message reçu de ${message.emet_id}: ${message.contenu}`);
});

// Ecoute de l'événement 'emission_privé'
socket.on('emission_privé', (message) => {
  console.log(`Message privé reçu de ${message.emet_id}: ${message.msg}`);
  // Si le message est destiné à l'utilisateur actuel, on l'affiche
  if (message.dest_id === socket.id) {
    const messageElem = document.createElement('div');
    messageElem.innerHTML = '<p>' + message.pseudo + ": " + message.msg + '</p>';
    messageContainer.appendChild(messageElem);
    lesMessages
  }
});


// Affichage des messages en fonction du choix de l'utilisateur
// Soit les messages du salon général
// Soit les messages d'une conversation privée avec un autre utilisateur


function salon(id) {
  // Vérification si l'ID correspond à une conversation privée ou au salon général
  var isPrivate = id !== 'salon';
  console.log(id);
  messageContainer.innerHTML = '';

  // Récupération de la liste des messages en fonction de l'ID
  var messages = isPrivate ? lesMessages.filter(msg => msg.to_id === id || msg.from_id === id) : lesMessages;

  // Vidage du conteneur des messages
  function clearMessages() {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Suppression des éléments dans le conteneur de messages
  }
  // Ajout des messages à l'interface
  messages.forEach((message) => {
    const messageElem = document.createElement('div');
    messageElem.innerHTML = '<p>' + message.msg + '</p>';
    messageContainer.appendChild(messageElem);
  });
}


