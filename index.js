
require('dotenv').config();
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
const server = http.createServer(app);


const logger = morgan('dev');
const HOST = 'localhost';
const PORT = 3500

//Register Middleware
app.use(logger);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(session({
    store: new FileStore(),  // no options for now
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');
const { Hero, Sidekick } = require('./models');

const { layout } = require('./utils');

app.get('/', (req, res) =>{
    res.send('Hello World')
});

app.get('/list', async (req,res)=>{
    const heroes = await Hero.findAll({
        include: Sidekick,
        order: [
            ['name', 'asc']
        ]
    })
    console.log(JSON.stringify(heroes, null, 4));
    //res.json(heroes)
    res.render('list', {
        locals: {
            heroes,
        },
        ...layout
    })
})

app.get('/hero/:id/sidekick', async (req, res) =>{
    const { id } = req.params;
    const hero = await Hero.findByPk(id)
    const sidekicks = await Sidekick.findAll({
        order: [
            ['name', 'asc']
        ]
    })
    console.log(JSON.stringify(sidekicks, null, 4));
    res.render('form', {
        locals: {
            hero,
            sidekicks
        },
        ...layout
    })
})

app.post('/hero/:id/sidekick', async (req,res)=>{
    const { id } = req.params;
    const { sidekickId } = req.body;

    const hero = await Hero.findByPk(id);
    await hero.setSidekick(sidekickId);
    await hero.save();

    res.redirect('/list')
});

//catch all if website doesn't
app.get('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>');
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});

