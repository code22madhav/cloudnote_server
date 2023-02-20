require ("./db");
const express = require('express');
var cors = require('cors');
const PORT= process.env.PORT || 8977;

const app=express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get("/",(req,res)=>{
    res.send("hello");
})

app.listen(PORT,()=>{
    console.log("lsteinf to 8977");
})
