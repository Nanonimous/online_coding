import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();

//middlewares ... 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//other variables
//send code to the server

const pro_lang_ids = [50,54,51,91,93,71];


let options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'content-type': 'application/json',
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': 'ef47c7e580msh980f320be710b71p1e0ebejsne5d0e425b7d7',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  },
  data: {
    submissions: [
      {
        language_id: 0,
        source_code: ''
      }
    ]
  }
};

//ouput getting from the server
let token;
let send_url ='https://judge0-ce.p.rapidapi.com/submissions/';

let output_get = {
  method: 'GET',
  url: "",
  params: {
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'X-RapidAPI-Key': 'ef47c7e580msh980f320be710b71p1e0ebejsne5d0e425b7d7',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  }
};

//get requests .. 
app.get("/", (req,res)=>{
  res.render("index.ejs");
});

let program_display;

//function to decode
function base_text(bs){
  let buff = new Buffer.from(bs, 'base64');
let text = buff.toString('ascii');
return text;
}
app.get("/out", async(req,res)=>{
  output_get.url = send_url+token;
  try{
    const res_output = await axios.request(output_get);
    //let output_data = atob(`${(res_output.data.stdout)}`);
    let output_data=base_text(`${(res_output.data.stdout)}`);
    console.log(output_data);
    let status = res_output.data.status.description;
    res.render("index.ejs",{
      output : output_data,
      status_mesage:status,
      prog:program_display
    });
  }catch(error){
    console.log("something went worng... ",error.message);
  }
});

//post request... 
app.post("/run", async (req,res)=>{
  console.log(req.body.code);
  let data_con = btoa(`${req.body.code}`);
   options.data.submissions[0].source_code =data_con;
   let prog_choice = req.body.programming_languages;
   program_display=prog_choice;
   options.data.submissions[0].language_id = pro_lang_ids[prog_choice];
  try{
      const response = await axios.request(options);
      token = response.data[0].token;
      console.log(token);
      res.redirect("/out");
  }catch(error){
      console.log("the program cannot be executed",error.message);
  }
}); 




app.listen(port,()=>{
  console.log(`server is running in the port ${port}`);
});