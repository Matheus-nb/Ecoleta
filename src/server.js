const express = require ("express")
const server = express ()


// PEGAR O BANCO DE DADOS
const db = require("./database/db")

// CONFIGURAR PASTA PUBLICA
server.use(express.static("public"))

// HABILITAR O USO DO REQ.BODY
server.use(express.urlencoded({extended:true}))


// UTILIZANDO TEMPLATE ENGINE (FAZ O HTML PARAR DE SER APENAS MARCAÇÕES --- COMEÇA A ACEITAR VARIAVEIS)
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// CONFIGURAR CAMINHOS DA MINHA APLICAÇÃO
// PÁGINA INICIAL
// REQ: REQUISIÇÃO -- RES: RESPOSTA
server.get("/", (req,res) => {
    return res.render("index.html")
})

server.get("/create-point", (req,res) => {

    //REQ.QUERY:QUERY STRINGS DA NOSSA URL 
    console.log(req.query)

    return res.render("create-point.html")
}) 

server.get("/edit/:id", (req,res) => {

    //REQ.QUERY:QUERY STRINGS DA NOSSA URL 
    const id = req.params.id;

    db.all(`SELECT * FROM places WHERE id LIKE '%${id}%' `, function(err,rows) {
        if(err) {
            return console.log(err)
        }

        // MOSTRAR A PAGINA HTML COM OS DADOS DO BANCO DE DADOS
        console.log(rows)
        return res.render("edit-entity.html", { places: rows} )
    })
}) 

server.post("/editpoint/:id", (req,res) => {

    // REQ.BODY: O CORPO DO NOSSO FORMULÁRIO
    // console.log(req.body)
    const id = req.params.id
    // INSERIR DADOS NO BANCO DE DADOS
    const query = `
        UPDATE places SET 
            image=?,
            name=?,
            address=?,
            address2=?,
            state=?,
            city=?,
            items=? 
        WHERE id = ${id}
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("index.html",{ Nsaved:true })
        }

        console.log("Editado com sucesso")
        console.log(this)

        return res.render("index.html", { saved:true })
    }


    db.run(query, values, afterInsertData)

})

server.post("/savepoint", (req,res) => {

    // REQ.BODY: O CORPO DO NOSSO FORMULÁRIO
    // console.log(req.body)

    // INSERIR DADOS NO BANCO DE DADOS
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("create-point.html",{ Nsaved:true })
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved:true })
    }


    db.run(query, values, afterInsertData)

})


server.get("/search", (req,res) => {

    const search = req.query.search

    if( search == "" ) {
        // PESQUISA VAZIA
        return res.render("search-results.html", { total: 0 })
    }



    // PEGAR OS DADOS DO BANCO DE DADOS
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%' `, function(err,rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // MOSTRAR A PAGINA HTML COM OS DADOS DO BANCO DE DADOS
        return res.render("search-results.html", { places: rows, total })
    })
})

server.get("/search/:id", function(req,res) {

    const id = req.params.id;

    const query = `
        DELETE FROM places where id = ${id};
    `;
  
    db.run(query, function(err) {
        if(err) {
            console.log(err);
            return res.send("Erro ao deletar no banco de dados!");
        }

        return res.redirect("/")
    })
})




// LIGA O SERVIDOR
server.listen(3000)