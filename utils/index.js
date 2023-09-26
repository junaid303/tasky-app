import fs from "fs";
import schedule from "node-schedule";
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
   /*
    The validateTaskData function accepts body object from client
     and performs data-validations like below :
     Validations
            _id*    -> Unique
                    -> alpha-numeric-string with max length as 10 characters

            taskname*
                    -> Max Length  : 200 Chars 
                    -> Min Length     : 5 Chars

            deadline*
                    -> deadline value must be in date-time format
                    -> deadline input date&time cannot be backdated
                    -> deadline input date&time cannot be within in next 15 mins
                    -> deadline input date&time must be within 30 days from current time&date.
                    -> deadline input date&time must be stored in GMT +0000 (UTC)

            status*
                    -> must be data type of boolean
*/

function validateTaskData(body) {
  let { taskname, deadline, status } = body;
  let error = {};
  if (!taskname || !deadline) {
      error.message = "Taskname and/or deadline are required fields."
      return error;
  }
  //Verify taskname : negative check
  if (taskname.length < 5 || taskname.length > 200) {
      error.message = "Taskname must be > 5 Chars and < 200 Chars"
  }
  //Verify deadline
  if (isNaN(Date.parse(deadline))) {
      error.message = "Enter Valid Timestamp for deadline"
      return error;
  }
  let liveTime = new Date(); //Live Time
  let inputTime = new Date(deadline); //Input Time in UTC+0000

  let diff_in_milliseconds = inputTime - liveTime;
  let diff_in_minutes = diff_in_milliseconds / (1000 * 60);
  let diff_in_days = diff_in_milliseconds / (1000 * 60 * 60 * 24);

  if (diff_in_minutes < 15 || diff_in_days > 30) {
      error.message = "Deadline cannot be within next 15 mins OR must within next 30 days OR backdated"
  }
  // //Verify status
  if (status && typeof status !== 'boolean') {
      error.message = "Status must be a boolean"
  }
  return error;
}
  
function serviceWorkers() {
  const timeStamps = ["2023-08-17T02:02:00.822Z", "2023-08-17T02:03:00.822Z", "2023-08-17T02:04:00.822Z"];
  timeStamps.forEach(ele => {
      schedule.scheduleJob(ele, function () {
          console.log(`The answer to life, the universe, and everything! at ${ele}`);
      });
  });
}
/*Inset */
  export  {
    generate_id, validateTaskData
  }
  