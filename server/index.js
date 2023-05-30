import express from "express";
import dotenv from "dotenv";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:  process.env.DATABASE
});

app.get("/", (req,res) => res.json({message: "Welcome to my server!"}));

app.get("/books",(req,res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err,data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    });
});

app.post("/books",(req,res) => {
    const { title, description } = req.body;
    const q = "INSERT INTO `books` (`title`, `description`) VALUES (?)";
    const values = [title, description];

    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.status(201).json({data, message:`${title} book has been created successfully`});
    });
});

app.put("/books/:id",(req,res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const q = "UPDATE books SET `title`= ?, `description`= ? WHERE `id`= ?";
    const values = [title, description, id];

    db.query(q, values, (err, data) => {
        if(err) return res.json(err);
        return res.status(201).json({data, message:` book with id:${id} has been updated successfully`});
    });
});

app.delete("/books/:id",(req,res) => {
    const { id } = req.params;
    const q = 'DELETE FROM books WHERE id= ?';

    db.query(q, [id], (err, data) => {
        if(err) return res.json(err);
        return res.status(201).json({data, message:` book with id:${id} has been deleted successfully`});
    });
});

const PORT = process.env.PORT || 1313;

app.listen(PORT, () => console.log(`server is running on port : ${PORT}`));
    
