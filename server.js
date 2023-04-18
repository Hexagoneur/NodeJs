//COnfiguration du serv et des modules
const express =require('express');
const app = express();
const http = require('http');
const server =http.createServer(app);
const {Server} = require("socket.io");
const io =new Server(server);
var path = require("path");
let PORT =8080;



function salon(id_utilisateur_dest) {
    clearMessages(); // Effacement du contenu de la zone de messages
    socket.join(id_utilisateur_dest);
    socket.emit('changement_salon', id_utilisateur_dest); // Demande au serveur de changer de salon
  
    document.getElementById('titre').innerHTML = 'Salon ' + id_salon; // Modification du titre de la page
    document.getElementById('input').value = ''; // Effacement du champ d'entrée de message
  }
  
  function clearMessages() {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Suppression des éléments dans le conteneur de messages
  }
  

  
  // Port d'écoute
  server.listen(PORT, () => {
    console.log('Serveur démarré sur le Port', +PORT);
  });
  
  // Direction route page d'accueil
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  
  // Direction route page css
  app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/css/style.css'));
  });
  
  // Direction route page client
  app.get('/js/client.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/js/client.js'));
  });
  
  // Gestion des connexions des clients
  io.on('connection', (socket) => {
    socket.join('salon');
    socket.on('set-pseudo', (pseudo) => {
      console.log(pseudo + ' vient de se connecter à ' + new Date());
  
      socket.nickname = pseudo;
  
      //Permet de récupérer la liste des clients connectés
      io.fetchSockets().then((room) => {
        var utilisateurs = [];
        room.forEach((item) => {
          utilisateurs.push({
            id_client: item.id,
            pseudo_client: item.nickname,
          });
        });
        console.table(utilisateurs);
        io.emit('reception_utilisateurs', utilisateurs);
      });
    });
  
    socket.on('emission_message', (message) => {
      console.log(socket.nickname + ':' + message);
  
      //socket.broadcast.emit(socket.nickame+':'+message);
      io.emit('reception_message', message);
    });
  
    socket.on('emission_privé', (message) => {
      console.log(socket.nickname);
      io.to(message.emet_id).to(message.dest_id).emit('reception_message', message);
    });
  
  
  //io.to(id_utilisateur_dest).emit('nouvel_utilisateur', socket.nickname);
  
    //Permet d'afficher les utilisateurs qui se déconnectent
    socket.on('disconnect', () => {
      console.log(socket.nickname + ' vient de se déconnecter à ' + new Date());
      const pseudo = socket.nickname;
      socket.broadcast.emit('left_user', { pseudo });
    });
  });
  