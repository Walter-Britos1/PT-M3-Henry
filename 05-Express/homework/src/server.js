// const bodyParser = require("body-parser");
const express = require("express");


const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests

server.post('/posts', (req, res) => {
    const { author, title, contents } = req.body;
    if (!author || !title || !contents) return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    const newPost = {
        id: posts.length +1,
        author,
        title,
        contents
    }
    posts.push(newPost);
    res.send(newPost);
});

server.post('/posts/author/:author', (req, res) => {
    const { title, contents } = req.body;
    const { author } = req.params;
    if (!author || !title || !contents) return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    const newPost = {
        id: posts.length +1,
        author,
        title,
        contents
    }
    posts.push(newPost);
    res.send(newPost);
});

server.get('/posts', (req, res) => {
    const { term } = req.query;
    if (!term) return res.send(posts);
    const postsFiltrados = posts.filter(p => p.title.includes(term) || p.contents.includes(term));
    res.json(postsFiltrados);
});

server.get('/posts/:author', (req, res) => {
    const { author } = req.params;
    const postDeAutor = posts.filter(p => p.author === author);
    if (!postDeAutor.length) return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});
    res.json(postDeAutor);
});

server.get('/posts/:author/:title', (req, res) =>{
    const { author, title } = req.params;
    const postAuthorTitle = posts.filter(p => p.author === author && p.title === title);
    if (!postAuthorTitle.length) return res.status(STATUS_USER_ERROR).json({error:"No existe ningun post con dicho titulo y autor indicado"});
    res.json(postAuthorTitle);
});

server.put('/posts', (req, res) => {
    const { id, title, contents } = req.body;
    if (!id || !title || !contents) return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
    const idPost = posts.find(p => p.id === id);
    if (!idPost) return res.status(STATUS_USER_ERROR).json({error: 'Su id no corresponde a ningún post'});
    post.title = title;
    post.contents = contents;
    res.json(post);
});

server.delete('/posts', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(STATUS_USER_ERROR).json({error:'No se encontro ni un post correspondiente a ese ID'});
    const idPost = posts.find(p => p.id === id);
    if (!idPost) return res.status(STATUS_USER_ERROR).json({error: 'Su id no corresponde a ningún post'});
    post = post.filter(p => p.id !== id)
    res.json({success: true });
});

server.delete('/author', (req, res) => {
    const { author } = req.body;
    if (!author) return res.status(STATUS_USER_ERROR).json({error: 'No se encontro ningún author'});
    const deleteAutor = posts.filter(p => p.author === author);
    if (!deleteAutor.length) return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});
    posts = posts.filter( p => p.author !== author);
    res.json(deleteAutor);
});

module.exports = { posts, server };
