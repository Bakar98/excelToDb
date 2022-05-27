const mongoose = require("mongoose");
const express = require("express");
const app = express();
const XLSX = require('xlsx') ;
const multer = require('multer');

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

const db = require("./database");
db.init();

var storage = multer.diskStorage({  
destination:(req,file,cb)=>{  
cb(null,'uploads');  
},  
filename:(req,file,cb)=>{  
cb(null,file.originalname);  
}  
});  

var uploads = multer({storage:storage});

let keys = [];
let Sheet = "";

app.get("/", function(req, res){
  res.render('index',{status: false})
})

app.post("/uploadondb", uploads.single("excelfile"), function(req,res)
{  const file = XLSX.readFile(__dirname + '/uploads/' + req.file.filename);

  let response = uploadOnDb(file, req.file.filename)
  res.render("index",{status: response})
})

function uploadOnDb(file, filename){
  let data = [];
  const sheets = file.SheetNames
    
  for(let i = 0; i < sheets.length; i++)
  {
     const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
     
     temp.forEach((res) => {
        data.push(res)
     })
  }  
  console.log(data)

  keys = Object.keys(data[0])

  var keyValue = []
  
  var tempObj = {
    type : 'string'
  }
  
  keys.forEach((key) => {
            if(key=="email"|| key=="email"){
                keyValue.push({
                    type : 'string',
                    unique: true
                  })
            }
            keyValue.push([key,tempObj])
  })
  
  const entries = new Map(keyValue);
  
  const obj = Object.fromEntries(entries);
  
  const excelSchema = new mongoose.Schema(obj);

  Sheet = mongoose.model(filename, excelSchema)  
          data.forEach( async (entry)=>{
            await Sheet.create(entry)
          })        
          return "data saved successfully"
        
}


app.get("/showdata", function(req, res){
    // console.log(keys, keys[0]);

    Sheet.find({}).then(function(data){
        // console.log(data[0].Name);
        res.render('data', {data:data, keys:keys})
    })
    
})


const port = process.env.PORT ||5000;

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
