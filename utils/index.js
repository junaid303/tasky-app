import fs from "fs";
/*
 The generate_id function accepts length and generates alpha-numeric randomstring
*/
function generate_id(maxLength) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < maxLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    //Search if the above random string
    let data = fs.readFileSync("data.json");
    data = JSON.parse(data);
    let idFound = data.find(ele => ele._id === result);
    if (idFound)  return generate_id(maxLength);
    else  return result;
  }


  export  {
    generate_id
  }
  