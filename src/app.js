const express= require('express');
const {engine}= require('express-handlebars');
const myconnection= require('express-myconnection');
const mysql= require('mysql');
const session = require ('express-session');
const bodyParser= require('body-parser')

const loginRoutes= require('./routes/login.js')
const inventarioRoutes= require('./routes/inventario.js')

const app= express();
 
// port
app.set('port', process.env.PORT || 4000)

// Establece la ubicación de las vistas que serán renderizadas
app.set('views', __dirname + '/views')
// configurar para renderizar vistas con extension hbs
app.engine('.hbs', engine({
    extname:'.hbs',
}));
app.set('view engine', 'hbs')
// configura el middleware bodyParser para analizar los datos de las solicitudes entrantes que tengan un tipo de contenido 'application/x-www-form-urlencoded'. Este tipo de contenido se utiliza comúnmente para enviar datos de formularios HTML. La opción extended se establece en true, lo que permite analizar datos más complejos en forma de matrices y objetos.
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(bodyParser.json());
app.use(myconnection(mysql, {
    host:'localhost',
    user:'root',
    password:'',
    port:3306,
    database:'pagekeeperweb'
}));

// configuracion de la sesion
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
// middleware de verificacion de sesion
app.use((req, res, next) => {
    if (req.session.loggedin) {
      // Si hay una sesión activa, agrega los datos del usuario a res.locals
      res.locals.userName = req.session.userName;
    }
    next();
  });
// validar sesion /  renderizar y pasar variables a home
// ----------------------------
app.get('/',(req,res)=>{
    if(req.session.loggedin == true){
        res.render('home', {userName: req.session.userName});
    }else{
        res.redirect('/login')
    }
});
// ------------------------------
app.use('/', loginRoutes)
app.use('/inventario', inventarioRoutes)


// run server
app.listen(app.get('port'),()=>{
    console.log('server listener on port ', app.get('port'));
})