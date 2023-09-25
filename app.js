import fs from "fs/promises";
import http, { validateHeaderName } from "http";
//import { parse } from "path";
import url from "url";
import { generate_id, validateTaskData } from "./utils/index.js"
import { parse } from "path";

const port = 8080;
const server = http.createServer(async (req,res)=>{
    
  try {
    //it extracts pathname and search params from req.url
    const parsedURL = url.parse(req.url, true);
    /*
  APP Endpoint : /api/tasks
  HTTP Method : GET
  Data Verifications : None
  Desc : Read all the tasks from data.json and send the data as response 
  */
    if(req.method=="GET" && parsedURL.pathname==="/api/tasks") {
        const data = await fs.readFile("data.json");
        res.writeHead(200, {'Content-Type':"application/json"});
        res.end(data);
        /*
  APP Endpoint : /api/tasks/add
  HTTP Method : POST 
  Data Verifications : taskname, deadline , status
  Desc : Read all the tasks from data.json and send the data as response 
  */
    }else if (req.method==="POST" && parsedURL.pathname==="/api/tasks/add"){
        let body = '';
        req.on("data",(chunk)=>{
            body += chunk;
        });
        req.on("end",()=>{
            body = JSON.parse(body);
            body._id = generate_id(10);
            //Data Validation Middleware
            let validationResult = validateTaskData(body);
            if(validationResult.message){
              res.writeHead(400, {'Content-Type': "application/json"});
              res.end(JSON.stringify(validationResult));
            }else {
              //Read the file, parse the file data 
              //append the body obj into parsed data
              //fs write the updated data 
              res.writeHead(200, {'Content-Type': "application/json"});
              res.end(JSON.stringify({message: "Taskname has been inserted into DB"}))
            }
            //Create/Generate _id according to data validation rules
            //Algo : Perform Body Objects Data Validations
            //If Validation rules are passed, then append the above body 
        });
        
    }else if (req.method==="PUT" && parsedURL.pathname==="/api/tasks/edit"){
        res.end("You are hitting at PUT method");
    }else if (req.method === "DELETE" && parsedURL.pathname === "/api/tasks/delete"){
        res.end("You are hitting DELETE method");
    }else if(req.method === "GET" && parsedURL.pathname === "/") {
        res.writeHead(200, {'Contet-Type' : "application/json"});
        let message = { message : "Hello World. Welcome to My App"};
        res.end(JSON.stringify(message));
    }
    else {
        res.writeHead(404, {'Content-Type': "application/json"});
        let message = {status:"Not Found. Invalid Path"};
        res.end(JSON.stringify(message));
    }
  } catch (error) {
    res.writeHead(500, {'Content-Type': "application/json"});
    res.end(JSON.stringify({error: "Something went wrong,Please try again"}));
  }
});
server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});