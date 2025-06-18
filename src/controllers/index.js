const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

app.set("view engine", "ejs"); 
app.set("views", "./src/views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const {getTarefas, insertTarefa, editTarefa, deleteTarefa} = require("../models/DAO/tarefaDao");

app.get("/", (req, res) => {
    res.status(200).render("index");
});

//Dados de TodoList
//Enviando os dados das tarefas (read)
app.get("/tarefas", async (req, res) => {
    const tarefas = await getTarefas();
    
    console.log("Tarefas: ", tarefas);
    res.status(200).render("listatarefas", {tarefasDoController: tarefas});
});

// API para enviar os dados das tarefas
app.get("/api/tarefas", async (req, res) => {
    const tarefas = await getTarefas();

    res.status(200).json({sucess: true, tarefas});
});

//Inserindo tarefa (create)
app.get("/novaTarefa", (req, res) => {
    res.status(200).render("formtarefa", {tarefa: {}});
});

app.post("/tarefa", async (req, res) => {
    const {titulo, descricao, data_vencimento, status} = req.body;

    const result = await insertTarefa(titulo, descricao, data_vencimento, status);
    if(result) return res.redirect("/tarefas");
    return res.status(404).send("Não foi possível editar a tarefa!");
});

//Inserindo tarefa via API
app.post("/api/tarefa", async (req, res) => {
    const {titulo, descricao, data_vencimento, status} = req.body;
    const result = await insertTarefa(titulo, descricao, data_vencimento, status);
    if(result){
        return res.status(202).json({sucess: true});
    }
    return res.status(400).json({sucess: false});
});

//Atualizando Tarefa (Update)
app.get("/editartarefa/:idtarefa", async (req, res) => {
    const id = parseInt(req.params.idtarefa, 10);

    const tarefas = await getTarefas();
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
    return res.status(404).send("Tarefa não encontrada");
    }

    res.status(200).render("formtarefa", {tarefa});
});

app.put("/tarefa/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { titulo, descricao, data_vencimento, status } = req.body;

    const result = await editTarefa(id, titulo, descricao, data_vencimento, status);

    if (result) {
        return res.redirect('/tarefas');
    }
    return res.status(404).send("Não foi possível editar a tarefa");
});

// API para editar uma tarefa
app.put("/api/tarefa", async (req, res) => {
    const {id, titulo, descricao, data_vencimento, status} = req.body;
    const result = await editTarefa(id, titulo, descricao, data_vencimento, status);

    if(result){
        return res.status(200).json({sucess: true});
    }
    return res.status(404).json({sucess: false});
});

//Removendo Tarefa (delete)
app.get("/removertarefa/:id", async (req, res) => {
    const id = req.params.id;
    const result = await deleteTarefa(id);
    if(result){
        return res.status(200).redirect("/tarefas");
    }
    return res.status(404).send("Não foi possível remover a tarefa!");
})

app.delete("/tarefa", async (req, res) => {
    const {id} = req.body;
    const result = await deleteTarefa(id);
    if(result){
        return res.status(200).send("tarefa removida com sucesso!");
    }  
    return res.status(404).send("Não foi possível remover a tarefa!");
});

// API para remover a tarefa
app.delete("/api/tarefa", async (req, res) => {
    const {id} = req.body;
    const result = await deleteTarefa(id);
    if(result){
        return res.status(200).json({sucess: true});
    }  
    return res.status(404).json({sucess: false});
});

app.listen(3000, 'localhost', () => {
    console.log("Servidor rodando na porta 3000");
});