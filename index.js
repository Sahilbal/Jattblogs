import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogs",
    password: "Sahil_123",
    port: 5432,
  });
  db.connect();

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.get("/compose",(req,res)=>{
    res.render("compose.ejs");
});
async function checkTitle() {
    const result = await db.query("SELECT title FROM blogrecords");
    let titles = [];
    result.rows.forEach((ttl) => {
      titles.push(ttl.title);
    });
    return titles;
  }
  async function checkContent() {
    const result = await db.query("SELECT message FROM blogrecords");
    let contents = [];
    result.rows.forEach((msg) => {
      contents.push(msg.message);
    });
    return contents;
  }


app.get("/blogs",async(req,res)=>{
    const titles=await checkTitle();
    const contents=await checkContent();
    console.log(titles);
    console.log(contents);
    try{
        res.render('blogs',{
            title:titles,
            content:contents
        });
    }catch(err){
        console.log(err);
    }  
});

app.post("/blogs", async(req,res)=>{
    const titlebody=req.body["title"];
    const contentbody=req.body["content"];
    try{
        await db.query("INSERT INTO blogrecords (title, message) VALUES ($1,$2) ", [titlebody,contentbody]);
        res.redirect("/blogs");
    }catch(err){
        console.log(err);
    }
    
})

app.listen(3000),()=>{
    console.log("Server running on port 3000.");
};


