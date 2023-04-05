//COnfiguration du serv et des modules
const express =require('express');
const app = express();
const http = require('http');
const server =http.createServer(app);
const {Server} = require("socket.io");
const io =new Server(server);
var path = require("path");
let PORT =8080;
//var typingUsers = [];

//Port d'écoute
server.listen(PORT,()=>  {
    console.log('Serveur démarré sur le Port',+PORT);
});

//direction route page d'accueil
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','index.html'));
});

//direction route page css
app.get('/css/style.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','/css/style.css'));
});

//direction route page client
app.get('/js/client.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','/js/client.js'));
});

// Gestion des connexions des clients 
io.on('connection',(socket)=>{
    socket.on('set-pseudo',(pseudo)=>{
        console.log(pseudo+" vient de se connecter à "+new Date());
        
        socket.nickname= pseudo;
        
       

        //Permet de récupérer la liste des clients connectés
        io.fetchSockets().then((room)=>{
            
            var utilisateurs=[];
            room.forEach((item)=>{
                utilisateurs.push({
                    id_client:item.id,
                    pseudo_client:item.nickname,
                  

                });
            });
            console.table(utilisateurs);
            io.emit('reception_utilisateurs',utilisateurs);
        })
    });

    socket.on('emission_message',(message)=>{
 
        console.log(socket.nickname+':'+message);

        //socket.broadcast.emit(socket.nickame+':'+message);
        io.emit('reception_message', message);
       
    });

   //Permet d'afficher les utilisateurs qui ce déconnecte 
    socket.on('disconnect',()=>{
         console.log(socket.nickname+" vient de se déconnecter à "+new Date());
         const pseudo=socket.nickname;
         socket.broadcast.emit('left_user', {pseudo});

    });

});
