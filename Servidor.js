//npm install ex+ress-session
const session = require('express-session');
//npm install express
const express = require('express');
//o sha1 serve para encriptar a palavra pass
//npm install sha1
const sha1 = require('sha1');
//npm install fs
const fs = require('fs');
// fornece um conjunto de métodos que permitem manipular caminhos de maneira independente da plataforma
//npm install uuid path
const path = require('path');
//para salvar os ficheiros na base de dados
//npm install express-fileupload
const upload = require('express-fileupload')
//para criar id's únicos para os posts
//npm install uuid
const { v4: uuidv4 } = require('uuid');

const servidor = express();
var porto = 8080;

servidor.use(express.urlencoded({
    extended: true
}));

servidor.use(express.static('public')); //definir pasta

servidor.use(session({ //define variáveis entre cliente e servidor
    secret: "supercalifragilisticexpialidocious",
    resave: false,
    saveUninitialized: true
}));

servidor.listen(porto, function () {
    console.log("servidor a ser executado em http://localhost:" + porto + "/login");
});

//para configurar o upload de ficheiros para a local storage!
servidor.use(upload())

servidor.use(express.static(__dirname + '/public'));

//estas 3 variaveis são para salvar dados comuns para não estar sempre a repeti-los em todas as sessões!
var navbar1 = '';
navbar1 += '<!DOCTYPE html>\n';
navbar1 += '<html>\n';
navbar1 += '<head>\n';
navbar1 += '<meta charset="utf-8">\n';
navbar1 += '<style>';
navbar1 += '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap");'
navbar1 += 'body {background: #FDE9EA;margin: 0;font-family: "Poppins";}'
navbar1 += 'header {background: #fff;}';
navbar1 += 'header .container {max-width: 1400px;margin: 0 auto;padding: 10px 20px;display: flex;align-items: center;justify-content: space-between;}'
navbar1 += 'header a {color: #FF91A4;text-decoration: none;}';
navbar1 += 'header span {margin: 0 15px;font-size: 25px;}'
navbar1 += '.nav {display: flex;align-items: center;}'
navbar1 += '.nav a {margin-left: 10px;}'
navbar1 += '.navbar li {display: inline-block;margin-right: 20px;}'
navbar1 += '.navbar li:last-child {margin-right: 0;}'
navbar1 += '.navbar a {color: #FF91A4;text-decoration: none;font-weight: bold;font-size: 20px;text-transform: uppercase;margin-left: 10px;}'
navbar1 += '</style>';
navbar1 += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">';
navbar1 += '</head>';
navbar1 += '<body>';
navbar1 += '<header>';
navbar1 += '<div class="container">'
navbar1 += '<h1><a href="/forum">MyForum</a></h1>'
navbar1 += '<nav>'
navbar1 += '<div>'
navbar1 += '<span><a href="/chat"><i class="fas fa-comment"></i></a></span>'
navbar1 += '<span><a href="/perfil"><i class="fas fa-user"></i></a></span>'
navbar1 += '</nav>'
navbar1 += '</div>'
navbar1 += '</header>';
navbar1 += '</body>\n';



navbar2 = ''
navbar2 += '<!DOCTYPE html>\n';
navbar2 += '<html>\n';
navbar2 += '<head>\n';
navbar2 += '<meta charset="utf-8">\n';
navbar2 += '<style>';
navbar2 += '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap");'
navbar2 += 'body {background: #FDE9EA;margin: 0;font-family: "Poppins";}'
navbar2 += 'header {background: #fff;}';
navbar2 += 'header .container {max-width: 1400px;margin: 0 auto;padding: 10px 20px;display: flex;align-items: center;justify-content: space-between;}'
navbar2 += 'header a {color: #FF91A4;text-decoration: none;}';
navbar2 += 'header span {margin: 0 15px;}';
navbar2 += '.nav {display: flex;align-items: center;}';
navbar2 += '.nav a {margin-left: 10px;}';
navbar2 += '.navbar li {display: inline-block;margin-right: 20px;}';
navbar2 += '.navbar li:last-child {margin-right: 0;}';
navbar2 += '.navbar a {color: #FF91A4;text-decoration: none;font-weight: bold;font-size: 18px;text-transform: uppercase;margin-left: 10px;}';
navbar2 += '</style>';
navbar2 += '</head>';
navbar2 += '<body>';
navbar2 += '<header>';
navbar2 += '<div class="container">';
navbar2 += '<h1>MyForum</h1>';
navbar2 += '<nav>';
navbar2 += '<div>';
navbar2 += '<span><a href="/login"><b>Login</b></a></span>';
navbar2 += '<span><a href="/registo"><b>SignIn</b></a></span>';
navbar2 += '</nav>';
navbar2 += '</div>';
navbar2 += '</header>';
navbar2 += '</body>\n';

var topo = '';
topo += '<!DOCTYPE html>\n';
topo += '<html>\n';
topo += '<head>\n';
topo += '<meta charset="utf-8">\n';
topo += '<title>Sign In &amp; Autentication</title>\n';
topo += '<style>';
topo += '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap");';
topo += 'body {background: #FDE9EA;margin: 0;font-family: "Poppins";}';
topo += '</style>';
topo += '</head>\n';
topo += '<body>\n';

var fundo = '';
var fundo = '</body>'
var fundo = '</html>'


servidor.get('/', function (req, res) {
    var html = '';
    html += navbar2;
    html += topo;

    html += '<p>\n';
    html += fundo;
    res.type('html');
    res.send(html);
});

servidor.get('/registo', (req, res) => {
    res.sendFile(__dirname + '/html/registo.html');
});

servidor.get('/processa_registo', function (req, res) {
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;

    var html = '';
    html += topo;
    html += navbar2;
    html += '<h1 style="text-align:center;">Status Registo</h1>\n';
    if (username && password) {
        //os dados utilizados
        var registoUtilizador = { "username": username, "email": email, "password": sha1(password) };
        var registosFicheiro = new Array();

        try {
            var dadosFicheiro = fs.readFileSync("dados.json", "utf-8"); //conteúdo do ficheiro
            registosFicheiro = JSON.parse(dadosFicheiro);
            // se, por algum motivo, o ficheiro não continha um array JSON
            if (!Array.isArray(registosFicheiro)) {
                registosFicheiro = new Array();
            }
        }
        catch (error) {
            console.error("Ficheiro inexistente ou sem registos anteriores");
            registosFicheiro = new Array();
        }

        //Se o user já exister vai dar erro
        var usernameExistente = false;
        for (var i = 0; i < registosFicheiro.length; i++) {
            if (registosFicheiro[i].username == registoUtilizador.username) {
                html += '<h3 style="text-align:center;"> Username já existente!<br></h3>\n';
                html += '<h4 style="text-align:center;"> Por favor, escolha outro. </h4>'
                html += '<div style="text-align:center;">'
                html += '<a href="registo">'
                html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Registo</button>'
                html += '</a><br>\n';
                html += '</div>'
                usernameExistente = true;
                break;
            }
        }
        //Se o user não exister vai criar um array para este!
        if (!usernameExistente) {
            registosFicheiro.push(registoUtilizador);
            var dadosFicheiro = JSON.stringify(registosFicheiro);
            var sucesso = true;
            try {
                fs.writeFileSync("dados.json", dadosFicheiro);
            }
            catch (error) {
                console.error("erro ao guardar o registo");
                console.error(error);
                sucesso = false;
            }
            if (sucesso) {
                //login feito com sucesso
                req.session.username = registoUtilizador.username;
                req.session.email = registoUtilizador.email;
                req.session.password = registoUtilizador.password;
                res.redirect("/forum"); // Redirect the user to the created post
                return;

            }
            else {
                //erro no login
                html += '<h3 style="text-align:center;">Falha ao adicionar registo</h3>\n';
                html += '<div style="text-align:center;">'
                html += '<a href="registo">'
                html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Registo</button>'
                html += '</a><br>\n';
                html += '</div>'
            }
        }
    }
    else {
        //se não preencheres tudo
        html += '<h3 style="text-align:center;">Por favor, preencha os dados todos</h3>\n';
        html += '<div style="text-align:center;">'
        html += '<a href="registo">'
        html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Registo</button>'
        html += '</a><br>\n';
        html += '</div>'
    }
    html += fundo;
    res.send(html);
});

servidor.get('/login', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
});

servidor.get('/processa_login', function (req, res) {
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;

    var html = '';
    html += topo;
    if (username && password) {

        //dados necessarios
        var registoUtilizador = { "username": username, "email": email, "password": sha1(password) };
        var registosFicheiro = new Array();

        try {
            var dadosFicheiro = fs.readFileSync("dados.json", "utf-8");
            registosFicheiro = JSON.parse(dadosFicheiro);
            // se, por algum motivo, o ficheiro não continha um array JSON
            if (!Array.isArray(registosFicheiro)) {
                registosFicheiro = new Array();
            }
        }
        catch (error) {
            console.error("ficheiro inexistente ou sem registos anteriores");
            registosFicheiro = new Array();
        }
        //se os dados inseridos estiverem corretos o utilizador vai ser validado!
        var utilizadorAutenticado = false;
        for (var i = 0; i < registosFicheiro.length; i++) {
            if (registosFicheiro[i].username == registoUtilizador.username && registosFicheiro[i].password == registoUtilizador.password && registosFicheiro[i].email == registoUtilizador.email) {
                utilizadorAutenticado = true;
                break;
            }
        }
        if (utilizadorAutenticado) {
            req.session.username = registoUtilizador.username;
            req.session.email = registoUtilizador.email;
            req.session.password = registoUtilizador.password;
            res.redirect("/forum"); // Redirect the user to the created post
            return;

        }
        else {
            //se os dados estiverem errados vai dizer que o utilizador não foi autenticado!
            html += navbar2;
            html += '<h1 style="text-align:center;">Login Status</h1>\n';
            html += "<h3 style=text-align:center;>Utilizador não autenticado</p>\n";
            html += '<div style="text-align: center;">'
            html += '<a href="login">'
            html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Login</button>'
            html += '</a><br>\n';
            html += '</div>'
        }
    }
    else {
        html += '<p style=text-align:center;>Por favor, preencha os dados todos</p>\n';
    }
    res.send(html);
});

servidor.get('/processa_logout', function (req, res) {
    req.session.destroy();; //a sessão deixa de existir e passa tudo ao normal
    res.redirect("/login"); // Redirect the user to the created post
    return;
});

servidor.get('/forum', function (req, res) {
    var html = '';
    html += topo;
    //Se o utilizador tiver a sessão iniciada:
    if (req.session.username) {
        //header
        html += '<!DOCTYPE html>\n';
        html += '<html>\n';
        html += '<head>\n';
        html += '<meta charset="utf-8">\n';
        html += '<style>';
        html += '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap");'
        html += 'body {background: #FDE9EA;margin: 0;font-family: "Poppins";}'
        html += 'header {background: #fff;}';
        html += 'header .container {max-width: 1400px;margin: 0 auto;padding: 10px 20px;display: flex;align-items: center;justify-content: space-between;}'
        html += 'header a {color: #FF91A4;text-decoration: none;}';
        html += 'header span {margin: 0 15px;font-size: 25px;}'
        html += '.nav {display: flex;align-items: center;}'
        html += '.nav a {margin-left: 10px;}'
        html += '.navbar li {display: inline-block;margin-right: 20px;}'
        html += '.navbar li:last-child {margin-right: 0;}'
        html += '.navbar a {color: #FF91A4;text-decoration: none;font-weight: bold;font-size: 20px;text-transform: uppercase;margin-left: 10px;}'
        html += '</style>';
        html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">';
        html += '</head>';
        html += '<body>';

        //navbar
        html += '<header>';
        html += '<div class="container">'
        html += '<h1><a href="/forum">MyForum</a></h1>'
        html += '<nav>'
        html += '<div>'
        html += '<span><a href="/chat"><i class="fas fa-comment"></i></a></span>'
        html += '<span><a href="/perfil"><i class="fas fa-user"></i></a></span>'
        html += '</nav>'
        html += '</header>';

        //forum
        html += '</body>\n';
        html += '<h1 style="text-align:center;">Welcome, ' + req.session.username + '</h1>\n'
        html += '<div style="margin: 0 auto; height: 80px; width: 1030px; text-align: center;">'
        html += '<form action="/search" method="GET" style="display: inline-block; ">'
        html += '<input type="text" name="search" style="padding: 10px; margin-left: 100px; width: 450px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">';
        html += '<button type="submit" style="text-align: center; background: #FF91A4; border: 0; color: #fff; padding: 8px; font-family: \'Poppins\'; border-radius: 4px; cursor: pointer;">Search</button>';
        html += '</form>'
        html += '<a href="create" style="float: right;">'
        html += '<button style="background: #FF91A4; border: 0; color: #fff; padding: 8px; font-family: \'Poppins\'; border-radius: 4px; cursor: pointer;">Create Topic</button>'
        html += '</a>'
        html += '</div>'

        try {
            var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
            var publicarFicheiro = JSON.parse(dadosFicheiro);
            var privacidadeSelectinada = req.query.privacy || 'all'; // default to all

            //para mostrar se é publico ou privado
            var topicPublico = [];
            var topicPrivado = [];

            for (var i = 0; i < publicarFicheiro.length; i++) {
                if (publicarFicheiro[i].privacy === '') {
                    topicPublico.push(publicarFicheiro[i]);
                } else if (publicarFicheiro[i].privacy.includes(req.session.username)) {
                    topicPrivado.push(publicarFicheiro[i]);
                } else if (publicarFicheiro[i].user === req.session.username && publicarFicheiro[i].privacy !== '') {
                    topicPrivado.push(publicarFicheiro[i]);
                }
            }
            console.log(topicPublico);

            //seleção radio
            var TopicsMostrar = [];
            if (privacidadeSelectinada === 'public') {
                TopicsMostrar = topicPublico;
            } else if (privacidadeSelectinada === 'private') {
                TopicsMostrar = topicPrivado;
            } else {
                TopicsMostrar = topicPublico.concat(topicPrivado);
            }

            html += '<div style="text-align: center;">'
            html += '<form action="/forum" method="GET">';
            html += '<input type="radio" name="privacy" value="all" ' + (privacidadeSelectinada === 'all' ? 'checked' : '') + '>All ';
            html += '<input type="radio" name="privacy" value="public" ' + (privacidadeSelectinada === 'public' ? 'checked' : '') + '>Public ';
            html += '<input type="radio" name="privacy" value="private" ' + (privacidadeSelectinada === 'private' ? 'checked' : '') + '>Private ';
            html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 8px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Filter</button>';
            html += '</form>';
            html += '</div>'

            for (var i = 0; i < TopicsMostrar.length; i++) {
                html += '<a href="/topic/' + TopicsMostrar[i].id + '" style="text-decoration:none;">';
                html += '<div style="position: relative; max-width: 1000px;background: #fff;border-radius: 4px;margin: 20px auto;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">'
                html += '<h4 style="margin: 0 0 10px 0;font-size: 1.2em;color: #FF91A4;">' + TopicsMostrar[i].title + '</h4>\n';
                html += '<p style="margin: 0;font-size: 0.9em;color: #555;">' + TopicsMostrar[i].content + '</p>\n';
                html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">Creator: ' + TopicsMostrar[i].user + '</h6>\n';
                //esta parte é para colocar privado ou publico no canto!
                if (TopicsMostrar[i].privacy === '') {
                    html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Public</b></p>'
                } else {
                    if (TopicsMostrar[i].user === req.session.username || TopicsMostrar[i].privacy.includes(req.session.username)) {
                        html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Private</b></p>'
                    }
                }
                html += '</div>'
                html += '</a>\n';
            }
        } catch (error) {
            console.error("Ficheiro inexistente ou sem registos anteriores");
        }
    }
    else {
        //caso não exista um utilizador logado!
        html += navbar2;
        html += '<h1 style="text-align:center;">Welcome!</h1>\n';
        html += `<p style="text-align:center;">I'd love to get to know you better! Register or log in to our forum!</p > `
    }
    html += fundo;
    res.type('html');
    res.send(html);
});

servidor.get('/chat', function (req, res) {
    var search = req.query.search;
    var username = req.query.username; // Retrieve the username from the URL parameter
    var html = '';

    if (req.session.username) {

        try {
            var dadosFicheiro = fs.readFileSync('conversa.json', 'utf-8');
            var dadosConversa = JSON.parse(dadosFicheiro);
        } catch (error) {
            console.error('falha ao ler ficheiro', error);
            var dadosConversa = {};
        }

        html += navbar1;
        html += topo;
        html += '<h1 style="text-align:center;">Chat</h1>';
        html += '<div style="margin-left: 10%;">';
        html += '<form action="/chat" method="GET">';
        html += '<input type="text" name="search" placeholder="Look for your friends!" style="padding: 10px;margin-top: 10px;margin-bottom: 20px;width: 24.5%;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">';
        html += '<input type="hidden" name="username" value="' + username + '">'; // Include the username as a hidden input field
        html += '</form>';
        html += '</div>';
        html += '<div style="width: 50%; float:right; margin-top: -4.5%; margin-right: 15%;">'; // added style attribute with float:right
        html += '<textarea name="content" readonly style="width: 100%; height: 500px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; cursor: default; resize: none;"></textarea>\n';
        html += '</div>';

        var dadosUser = fs.readFileSync("dados.json", "utf-8"); //conteúdo do ficheiro
        var pesquisarUser = JSON.parse(dadosUser);
        var dadosConv = fs.readFileSync("dados.json", "utf-8"); //conteúdo do ficheiro
        var convExists = JSON.parse(dadosConv);

        for (var i = 0; i < pesquisarUser.length; i++) {
            var user = pesquisarUser[i].username.toLowerCase();
            if (search && user.includes(search) && user !== req.session.username) {
                html += '<a href="/privatechat/' + pesquisarUser[i].username + '/' + req.session.username + '" style="text-decoration:none;">';
                html += '<div style="margin-left: 10%; max-width: 20%;background: #fff;border-radius: 4px;margin-top: 20px;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">';
                html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">' + pesquisarUser[i].username + '</h6>\n';
                html += '</div>';
                html += '</a>\n';
            }
        }
        if (!search) {
            for (var i = 0; i < convExists.length; i++) {
                var conversationId = [convExists[i].username, req.session.username].sort().join('-');
                if (dadosConversa[conversationId] && dadosConversa[conversationId].conversa !== '') {
                    html += '<a href="/privatechat/' + convExists[i].username + '/' + req.session.username + '" style="text-decoration:none;">';
                    html += '<div style="margin-left: 10%; max-width: 20%;background: #fff;border-radius: 4px;margin-top: 20px;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">';
                    html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">' + convExists[i].username + '</h6>\n';
                    html += '</div>';
                    html += '</a>\n';
                }
            }
        }

    } else {
        html += navbar2;
        html += topo;
        html += '<h1 style="text-align:center;">Não é possível aceder-se ao chat</h1>'
        html += '<div style="text-align: center;">'
        html += '<a href="login">'
        html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Login</button>'
        html += '</a><br>\n';
        html += '</div>'
    }

    html += fundo;
    res.type('html');
    res.send(html);
});

servidor.get('/privatechat/:username/:sessionUsername', function (req, res) {
    var username = req.params.username;
    var sessionUsername = req.params.sessionUsername;
    var search = req.query.search;
    var conversationId = [sessionUsername, username].sort().join('-'); // generate a unique id for this conversation
    var html = '';


    if (req.session.username) {
        var registoUtilizadores = [sessionUsername, username];

        try {
            var dadosFicheiro = fs.readFileSync('conversa.json', 'utf-8');
            var dadosConversa = JSON.parse(dadosFicheiro);
        }
        catch (error) {
            console.error('falha ao ler ficheiro', error);
            var dadosConversa = {};
        }

        var registoConversa = '';
        if (dadosConversa[conversationId] && dadosConversa[conversationId].conversa) {
            registoConversa = dadosConversa[conversationId].conversa;
        }

        html += navbar1;
        html += topo;
        html += '<h1 style="text-align:center;">Chat with ' + username + '</h1>';
        html += '<div style="margin-left: 10%;">';
        html += '<form action="/privatechat/' + username + '/' + sessionUsername + '" method="GET">';
        html += '<input type="text" name="search" placeholder="Look for your friends!"  style="padding: 10px;margin-top: 10px;margin-bottom: 20px;width: 24.5%;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">';
        html += '<input type="hidden" name="username" value="' + username + '">'; // Include the username as a hidden input field
        html += '</form>';
        html += '</div>';
        html += '<div style="width: 50%; float:right; margin-top: -4.5%; margin-right: 15%;">'; // added style attribute with float:right

        if (req.session.username === sessionUsername && req.session.username !== username) {
            if (registoUtilizadores && registoConversa !== null) {
                if (registoUtilizadores[0] === sessionUsername && registoUtilizadores[1] === username) {
                    if (req.query.texto) {
                        const currentDate = new Date();
                        const currentDateString = currentDate.toLocaleDateString();
                        const timestamp = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        let messageContent = '';
                        if (!registoConversa.includes(currentDateString)) {
                            messageContent += '\n\n========== ' + currentDateString + ' ==========';
                        }

                        messageContent += '\n\n' + sessionUsername + ' (' + timestamp + '): ' + req.query.texto;
                        registoConversa += messageContent;
                    }
                }

                html += '<form method="get" action="/privatechat/' + username + '/' + sessionUsername + '">\n';
                html += '<textarea name="conversa" id="chatTextArea" readonly style="width: 100%; height: 500px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; cursor: default; resize: none;">' + registoConversa + '</textarea><br>\n';
                //para ficar no fundo da textarea para veres as mensagens mais recentes!
                html += '<script>document.getElementById("chatTextArea").scrollTop = document.getElementById("chatTextArea").scrollHeight;</script>';
                html += '<input type="text" name="texto" autocomplete="off" style="padding: 10px;margin-top: 10px;margin-bottom: 20px;width: 885px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">'
                html += '<button type="submit" value="Send" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 8px;cursor: pointer;">Enter</button>'
                html += '</form>\n';
                try {
                    dadosConversa[conversationId] = { "utilizadores": registoUtilizadores, "conversa": registoConversa };
                    fs.writeFileSync('conversa.json', JSON.stringify(dadosConversa));
                }
                catch (error) {
                    console.error('falha ao gravar ficheiro');
                }
            }
        }
        else {
            html += '<p>Não tens acesso a este chat</p>';
        }

        html += '</div>';

        var dadosUser = fs.readFileSync("dados.json", "utf-8"); //conteúdo do ficheiro
        var pesquisarUser = JSON.parse(dadosUser);
        var dadosConv = fs.readFileSync("dados.json", "utf-8"); //conteúdo do ficheiro
        var convExists = JSON.parse(dadosConv);

        for (var i = 0; i < pesquisarUser.length; i++) {
            var user = pesquisarUser[i].username.toLowerCase();
            if (search && user.includes(search) && user !== req.session.username) {
                html += '<a href="/privatechat/' + pesquisarUser[i].username + '/' + req.session.username + '" style="text-decoration:none;">';
                html += '<div style="margin-left: 10%; max-width: 20%;background: #fff;border-radius: 4px;margin-top: 20px;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">';
                html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">' + pesquisarUser[i].username + '</h6>\n';
                html += '</div>';
                html += '</a>\n';
            }
        }
        if (!search) {
            for (var i = 0; i < convExists.length; i++) {
                var conversationId = [convExists[i].username, req.session.username].sort().join('-');
                if (dadosConversa[conversationId] && dadosConversa[conversationId].conversa !== '') {
                    html += '<a href="/privatechat/' + convExists[i].username + '/' + req.session.username + '" style="text-decoration:none;">';
                    html += '<div style="margin-left: 10%; max-width: 20%;background: #fff;border-radius: 4px;margin-top: 20px;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">';
                    html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">' + convExists[i].username + '</h6>\n';
                    html += '</div>';
                    html += '</a>\n';
                }
            }
        }
        html += fundo;

    } else {
        html += navbar2;
        html += topo;
        html += '<h1 style="text-align:center;">Não é possível aceder-se ao chat</h1>'
        html += '<div style="text-align: center;">'
        html += '<a href="/login">'
        html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Login</button>'
        html += '</a><br>\n';
        html += '</div>'
        html += fundo;

    }

    res.type('html');
    res.send(html);

});

servidor.get('/search', function (req, res) {
    var search = req.query.search.toLowerCase();;
    var html = '';
    html += topo;
    html += navbar1;
    html += '<h1 style="text-align:center;">Results for "' + search + '"</h1>\n';
    html += '<div style="text-align: center;">'
    html += '<form action="/search" method="GET">'
    html += '<input type="text" name="search" style="padding: 10px;margin-top: 10px;margin-bottom: 20px;width: 450px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">'
    html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Search</button>'
    html += '</form>'
    html += '</div>'
    html += '<div style="text-align: right; margin-right: 420px;">'
    html += '<a href="create">'
    html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Create Topic</button>'
    html += '</a><br>\n';
    html += '</div>'
    try {
        var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
        var publicarFicheiro = JSON.parse(dadosFicheiro);

        //para mostrar se é publico ou privado
        var topicPublico = [];
        var topicPrivado = [];
        for (var i = 0; i < publicarFicheiro.length; i++) {
            if (publicarFicheiro[i].privacy === '') {
                topicPublico.push(publicarFicheiro[i]);
            } else if (publicarFicheiro[i].privacy.includes(req.session.username)) {
                topicPrivado.push(publicarFicheiro[i]);
            }
        }


        for (var i = 0; i < publicarFicheiro.length; i++) {
            var title = publicarFicheiro[i].title.toLowerCase();
            if (title.includes(search)) {
                //aqui, basicamente se a privacidade do post estiver em branco ou tiver o teu user, estes vão aparecer na search! Caso contrário não vai!
                if (publicarFicheiro[i].privacy.includes(req.session.username) || publicarFicheiro[i].privacy === '') {
                    html += '<a href="/topic/' + publicarFicheiro[i].id + '" style="text-decoration:none;">';
                    html += '<div style=" max-width: 1000px;background: #fff;border-radius: 4px;margin: 20px auto;padding: 20px;position: relative;box-shadow: 2px 2px 5px rgba(0,0,0,0.05); cursor:pointer;">'
                    html += '<h4 style="  margin: 0 0 10px 0;font-size: 1.2em;color: #FF91A4;">' + title + '</h4>\n';
                    html += '<p style=" margin: 0;font-size: 0.9em;color: #555;">' + publicarFicheiro[i].content + '</p>\n';
                    html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">Criador: ' + publicarFicheiro[i].user + '</h6>\n';
                    //definir privado ou publico no canto!
                    if (publicarFicheiro[i].privacy === '') {
                        html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Público</b></p>'
                    } else {
                        if (publicarFicheiro[i].privacy.includes(req.session.username)) {
                            html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Privado</b></p>'
                        }
                    }
                    html += '</div>'
                    html += '</a>\n';
                }
            }
        }
    } catch (error) {
        console.error("Ficheiro inexistente ou sem registos anteriores");
    }
    html += fundo;
    res.type('html');
    res.send(html);
});

servidor.get('/topic/:id', function (req, res) {
    var { id } = req.params;
    var html = '';
    html += navbar1;
    html += topo;

    try {
        var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
        var publicarFicheiro = JSON.parse(dadosFicheiro);
        var topic = publicarFicheiro.find(topic => topic.id === id); // find the topic with matching id
        if (topic) {
            //parte para os comentários! vai buscar os comentarios salvos nesse id!
            var comments = [];
            try {
                var commentFile = './comments/' + id + '.json';
                var commentsData = fs.readFileSync(commentFile, 'utf-8');
                comments = JSON.parse(commentsData);
            } catch (error) {
                console.error('Error reading comments file', error);
            }



            if (topic.privacy === '') {
                //vai buscar o que está dentro do file!!
                try {
                    var fileContent = fs.readFileSync('./uploads/' + topic.file, 'utf-8');
                } catch (error) {
                    console.error('Error reading file', error);
                }

                html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
                html += '<h2 style="">' + topic.title + '</h2>\n';
                html += '<h4 style="">Criador: ' + topic.user + '</h4>\n';
                html += '<p style="">' + topic.content + '</p>\n';
                //se o utilizador logado for o criador to topico vai aparecer a opção de delete apenas para ele!!! Outra pessoa nao o pode apaga!!!
                if (req.session.username === topic.user) {
                    html += '<form method="POST" action="/topic/' + id + '/delete" onsubmit="return confirmDelete()">';
                    html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Delete</button>';
                    html += '</form>';
                    html += '<script> function confirmDelete() {return confirm("Are you sure you want to delete this topic?");}</script>'
                }
                html += '</div>'
                html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
                html += '<h4> Edit the content here! </h4>'
                html += '<form method="POST" action="/topic/' + id + '/update" onsubmit="return confirmChange()">'
                html += '<textarea name="content" style="width: 100%; height: 200px; margin-top: 10px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">' + fileContent + '</textarea>\n';
                html += '<div style="text-align: center;">'
                html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Update</button>'
                html += '</div>'
                html += '</form>'
                html += '<script> function confirmChange() {return confirm("Are you sure you want to modify this topic?");}</script>'
                html += '</div>'

                //ficheiros na local storage
                var commentsFilePath = "comments_" + id + ".json"; //este vai ser o nome do ficheiro
                var comments = [];

                // vê se existem comentários e carrega os que já existem!
                if (fs.existsSync(commentsFilePath)) {
                    const commentsData = fs.readFileSync(commentsFilePath, 'utf-8');
                    comments = JSON.parse(commentsData);
                }

                if (req.session.username) {
                    //criar comentário, apenas se exister um utilizador! A sessão de comentários nao aparece se não exister um utilizador logado!
                    html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">';
                    html += '<h2>Add a comment:</h2>';
                    html += '<form method="POST" action="/topic/' + id + '/comment" onsubmit="return confirmSubmission()">';
                    html += '<textarea name="content" style="width: 100%; max-width: 100%; min-width: 100%; height: 100px; margin-top: 10px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;"></textarea>\n';
                    html += '<button type="submit" style="position: absolute; right: 22px; top: 60px; text-align: center; background: #FF91A4; border-radius: 4px; border: 0; color: #fff; padding: 10px; font-family: \'Poppins\'; border-radius: 4px; cursor: pointer;">Comment</button>';
                    html += '</form>';
                    html += '<script> function confirmSubmission() {return confirm("Are you sure you want to send this comment?");}</script>'

                    // mostra comentários existentes!
                    if (comments.length > 0) {

                        html += '<h2>Comentários:</h2>';

                        comments.forEach(comment => {
                            html += '<p><strong>' + comment.user + ': </strong>' + comment.content + '</p>';;
                        });

                    }
                    html += '</div>';
                    html += fundo;
                }


            } else {
                //se for um topico privado vai ver os nomes de todos os utilizadores separados por uma virgula!
                var allowedUsers = topic.privacy.split(',');
                for (var i = 0; i < allowedUsers.length; i++) {
                    //isto divide a privacidade em diferentes partes para podermos aceder aos diferentes nomes!
                    allowedUsers[i] = allowedUsers[i].trim();
                }
                if (req.session.username && !allowedUsers.includes(req.session.username)) {
                    allowedUsers.push(req.session.username);
                }
                //se o utilizador estiver entre os nomes têm acesso aos comentários
                if (allowedUsers.includes(req.session.username)) {
                    //vai buscar o que está dentro do file!!
                    try {
                        var fileContent = fs.readFileSync('./uploads/' + topic.file, 'utf-8');
                    } catch (error) {
                        console.error('Error reading file', error);
                    }

                    //ficheiros na local storage
                    var commentsFilePath = `comments_${id}.json`; // file name for comments
                    var comments = [];

                    // vê se existem comentários e carrega os que já existem!
                    if (fs.existsSync(commentsFilePath)) {
                        const commentsData = fs.readFileSync(commentsFilePath, 'utf-8');
                        comments = JSON.parse(commentsData);
                    }

                    html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
                    html += '<h2 style="">' + topic.title + '</h2>\n';
                    html += '<h4 style="">Criador: ' + topic.user + '</h4>\n';
                    html += '<p style="">' + topic.content + '</p>\n';

                    //apenas o utilizador que criou o post pode ver o botao de delete
                    if (req.session.username === topic.user) {
                        html += '<form method="POST" action="/topic/' + id + '/delete" onsubmit="return confirmDeletePriv()">';
                        html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Delete</button>';
                        html += '</form>';
                        html += '<script> function confirmDeletePriv() {return confirm("Are you sure you want to delete this topic?");}</script>'
                    }

                    html += '</div>'
                    html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
                    html += '<h4> Edit the content here! </h4>'
                    html += '<form method="POST" action="/topic/' + id + '/update" onsubmit="return confirmChangePriv()">'
                    html += '<textarea name="content" style="width: 100%; height: 200px; margin-top: 10px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;">' + fileContent + '</textarea>\n';
                    html += '<div style="text-align: center;">'
                    html += '<button type="submit" style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Update</button>'
                    html += '</div>'
                    html += '</form>'
                    html += '<script> function confirmChangePriv() {return confirm("Are you sure you want to modify this topic?");}</script>'
                    html += '</div>'
                    if (req.session.username) {
                        // submissao de comentario
                        html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">';
                        html += '<h2>Add a comment:</h2>';
                        html += '<form method="POST" action="/topic/' + id + '/comment" onsubmit="return confirmSubmissionPriv()">';
                        html += '<textarea name="content" style="width: 100%; max-width: 100%; min-width: 100%; height: 100px; margin-top: 10px;border: 1px solid #ddd;border-radius: 4px;box-sizing: border-box;"></textarea>\n';
                        html += '<input type="hidden" name="timestamp" value="' + Date.now() + '">';
                        html += '<button type="submit" style="position: absolute; right: 22px; top: 60px; text-align: center; background: #FF91A4; border-radius: 4px; border: 0; color: #fff; padding: 10px; font-family: "Poppins"; border-radius: 4px; cursor: pointer;">Comment</button>';
                        html += '<script> function confirmSubmissionPriv() {return confirm("Are you sure you want to send this comment?");}</script>'
                        html += '</form>';
                        // comentarios existentes!
                        if (comments.length > 0) {

                            html += '<h2>Comentários:</h2>';

                            comments.forEach(comment => {
                                html += '<p><strong>' + comment.user + ': </strong>' + comment.content + '</p>';
                            });

                        }
                        html += '</div>';
                        html += fundo;
                    }
                }
            }
        } else {
            //Se não for encontrado um topico com esse nome
            html += '<h3 style="text-align:center;">Tópico não encontrado</h3>\n';
        }
    } catch (error) {
        console.error("Ficheiro inexistente ou sem registos anteriores");
    }

    html += fundo;
    res.type('html');
    res.send(html);
});

servidor.post('/topic/:id/update', function (req, res) {
    //para atualizar um topico
    var { id } = req.params;
    var { content } = req.body;

    try {
        var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
        var publicarFicheiro = JSON.parse(dadosFicheiro);
        var topicIndex = publicarFicheiro.findIndex(topic => topic.id === id); // encontra o index do topic com o mesmo id!
        if (topicIndex >= 0) {
            // faz um update do conteudo do documento
            fs.writeFileSync('./uploads/' + publicarFicheiro[topicIndex].file, content);
            // update o ficheiro guardado na base de dados
            fs.writeFileSync("criado.json", JSON.stringify(publicarFicheiro));
            //és redirecionado novamente para a pagina inicial
            res.redirect('/topic/' + id);
        } else {
            res.status(404).send('Tópico não encontrado');
        }
    } catch (error) {
        console.error("Erro ao ler o ficheiro", error);
        res.status(500).send('Erro ao atualizar o tópico');
    }
});

servidor.post('/topic/:id/delete', function (req, res) {
    var { id } = req.params;

    try {
        var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
        var publicarFicheiro = JSON.parse(dadosFicheiro);
        // encontra o index do topic com o mesmo id!
        var index = publicarFicheiro.findIndex(topic => topic.id === id);

        if (index !== -1 && publicarFicheiro[index].user === req.session.username) {
            // apaga o topico do array de topicos
            publicarFicheiro.splice(index, 1);

            //  escreve o novo array sem o topico apagado
            fs.writeFileSync("criado.json", JSON.stringify(publicarFicheiro));

            // és redirecionado para a pagina do forum
            res.redirect('/forum');
        } else {
            // não é necessario, mas é uma dupla segurança para outros utilizador nao poderem apagar o post
            res.status(403).send('Forbidden');
        }
    } catch (error) {
        console.error("Ficheiro inexistente ou sem registos anteriores");
        res.status(500).send('Internal Server Error');
    }
});

servidor.post('/topic/:id/comment', function (req, res) {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.session.username;

    // create new comment object
    const newComment = { user, content };
    const commentsFilePath = `comments_${id}.json`;

    // check if comments file exists, and load existing comments
    let comments = [];
    if (fs.existsSync(commentsFilePath)) {
        const commentsData = fs.readFileSync(commentsFilePath, 'utf-8');
        comments = JSON.parse(commentsData);
    }

    // add new comment to comments array
    if (content !== '') {
        comments.push(newComment);
    }

    // write comments array to comments file
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments));

    res.redirect('/topic/' + id);
});

servidor.get('/create', function (req, res) {
    res.sendFile(__dirname + '/html/create.html');
});

servidor.post('/processa_create', function (req, res) {
    var user = req.session.username
    var title = req.body.title;
    var content = req.body.content;
    var privacy = req.body.privacy;
    var id = "";


    //files
    if (req.files) {
        console.log(req.files)
        var file = req.files.file;
        var originalFilename = file.name;
        var fileExtension = path.extname(originalFilename);
        var newFilename = uuidv4() + '_' + Date.now() + fileExtension;
        var uploadPath = './uploads/' + newFilename;

        file.mv(uploadPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                // cria um ficheiro com o conteudo dado!
                var id = uuidv4();
                var post = { "id": id, "title": title, "content": content, "file": newFilename, "privacy": privacy };
                var postData = JSON.stringify(post);
                var postPath = './uploads/' + id + '.json';
                fs.writeFileSync(postPath, postData);
            }
        })
    }

    var html = '';
    html += topo;
    html += navbar1;
    html += '<h1 style="text-align:center;">Status Create Topic</h1>\n';
    if (title && content) {

        const id = uuidv4();
        var publicarTópico = { "user": user, "id": id, "title": title, "content": content, "file": newFilename, "privacy": privacy };
        var publicarFicheiro = new Array();

        try {
            var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
            publicarFicheiro = JSON.parse(dadosFicheiro);
            // se, por algum motivo, o ficheiro não continha um array JSON...
            if (!Array.isArray(publicarFicheiro)) {
                publicarFicheiro = new Array();
            }
        }
        catch (error) {
            console.error("Ficheiro inexistente ou sem registos anteriores");
            publicarFicheiro = new Array();
        }

        var usernameExistente = true;

    }
    if (usernameExistente) {
        publicarFicheiro.push(publicarTópico);
        var dadosFicheiro = JSON.stringify(publicarFicheiro);
        var sucesso = true;
        try {
            fs.writeFileSync("criado.json", dadosFicheiro);
        }
        catch (error) {
            console.error("erro ao guardar o registo");
            console.error(error);
            sucesso = false;
        }
        if (sucesso) {
            id = publicarTópico.id; // Store the ID of the created post
            res.redirect("/topic/" + id); // Redirect the user to the created post
            return; // Exit the function to prevent further execution

        }
        else {
            html += '<h3 style="text-align:center;">Failed to create topic.</h3>\n';
            html += '<div style="text-align:center;">'
            html += '<a href="create">'
            html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Criar</button>'
            html += '</a><br>\n';
            html += '</div>'
        }
    }
    html += fundo;
    res.send(html);

});

servidor.get('/perfil', function (req, res) {
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;

    var html = '';


    html += '<p>\n';
    if (req.session.username) { //o username aqui serve como uma variável de controlo

        html += navbar1;
        html += topo;
        html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
        html += '<h1 style="text-align:center;">Profile</h1>'
        html += '<p style="font-size: 20px;">User: ' + req.session.username + '</p>'
        html += '<p style="font-size: 20px;">Email: ' + req.session.email + '</p>'
        html += '<div style="text-align: right; position: absolute; top: 73%; right: 20px;">'
        html += '<a href="processa_logout">'
        html += '<button style="text-align: left; margin-right: 40px;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Logout</button>'
        html += '</a><br>\n';
        html += '</div>'
        html += '</div>'
        html += '<div style="max-width: 800px;margin: 40px auto;padding: 20px;background: #fff;border-radius: 20px; position:relative;">'
        html += '<h1 style="text-align:center;">My Topics</h1>'

        try {
            var dadosFicheiro = fs.readFileSync("criado.json", "utf-8"); //conteúdo do ficheiro
            var publicarFicheiro = JSON.parse(dadosFicheiro);

            //para mostrar se é publico ou privado
            var publicPosts = [];
            var privatePosts = [];
            for (var i = 0; i < publicarFicheiro.length; i++) {
                if (publicarFicheiro[i].privacy === '') {
                    publicPosts.push(publicarFicheiro[i]);
                } else if (publicarFicheiro[i].privacy.includes(req.session.username)) {
                    privatePosts.push(publicarFicheiro[i]);
                } else if (publicarFicheiro[i].user === req.session.username && publicarFicheiro[i].privacy !== '') {
                    privatePosts.push(publicarFicheiro[i]);
                }
            }


            for (var i = 0; i < publicarFicheiro.length; i++) {
                var title = publicarFicheiro[i].title;
                //aqui, basicamente se a privacidade do post estiver em branco ou tiver o teu user, estes vão aparecer na search! Caso contrário não vai!
                if (publicarFicheiro[i].user.includes(req.session.username) || publicarFicheiro[i].privacy.includes(req.session.username)) {
                    html += '<a href="/topic/' + publicarFicheiro[i].id + '" style="text-decoration:none;">';
                    html += '<div style=" max-width: 1000px;background: #fff; border-radius: 4px;margin: 20px auto;padding: 20px;position: relative;box-shadow: 5px 5px 5px rgba(0,0,0,0.05); cursor:pointer;">'
                    html += '<h4 style="  margin: 0 0 10px 0;font-size: 1.2em;color: #FF91A4;">' + title + '</h4>\n';
                    html += '<p style=" margin: 0;font-size: 0.9em;color: #555;">' + publicarFicheiro[i].content + '</p>\n';
                    html += '<h6 style="margin: 0;font-size: 0.9em;color: #555;">Criador: ' + publicarFicheiro[i].user + '</h6>\n';
                    //definir privado ou publico no canto!
                    if (publicarFicheiro[i].privacy === '') {
                        html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Public</b></p>'
                    } else {
                        if (publicarFicheiro[i].user === req.session.username || publicarFicheiro[i].privacy.includes(req.session.username)) {
                            html += '<p style="text-align: right; margin-right: 60px; margin: 0;font-size: 0.9em;color: #555;"><b>Private</b></p>'
                        }
                    }
                    html += '</div>'
                    html += '</a>\n';
                }
            }
        } catch (error) {
            console.error("Ficheiro inexistente ou sem registos anteriores");
        }
        html += '</div>'

    }
    else {
        html += navbar2;
        html += topo;
        html += '<h1 style="text-align:center;">It is not possible to access the profile.</h1>'
        html += '<div style="text-align: center;">'
        html += '<a href="login">'
        html += '<button style="text-align: center;background: #FF91A4;border: 0;color: #fff;padding: 10px;font-family: \'Poppins\';border-radius: 4px;cursor: pointer;">Login</button>'
        html += '</a><br>\n';
        html += '</div>'
        html += fundo;
    }

    res.type('html');
    res.send(html);
});

//caso o utilizador procure por uma página que não existe
servidor.get('*', function (req, res) {
    var html = '';
    html += topo;
    html += navbar1;
    html += '<h1 style="text-align:center;">404 &ndash; file not found</h1>\n';
    html += '<p style="text-align:center;">Por favor, verifique o endereço</p>\n';
    html += fundo;
    res.status(404).send(html);
});
