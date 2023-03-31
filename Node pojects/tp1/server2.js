const express=require('express');
const app= express();
const http= require('http');
const server=http.createServer(app);


app.get('/',(req,res)=>{
    
    res.send('<h1>Hello World! Salut!</h1>');
    });



server.listen(8080,()=>{
    console.log("Serveur demarré sur le port 8080");
    });

 app.get('/page1',(req,res)=>{
     res.sendFile(__dirname+'/page1.html');
     //res.sendFile('page1.html', { root: __dirname });
 });


 app.use((req,res,next)=>{
     res.setHeader('Content-Type','text/plain');
     res.status(404).send("Erreur,Page Introuvable !");
  });
 