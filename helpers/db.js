import  fs  from "fs";
import { logger, canStillWatch } from "./index.js";

export const getDB = () => {
    let res;
    try {
      res = fs.readFileSync("db.json");
      return JSON.parse(res);
    } catch(err) {
      logger(`unable to get from db : ${err.message} `)
      return false;
    }
  };
  
  
 export const writeToDB = (userID, data) => {
    try {
      const db = getDB();
      let isUpdate = false;
  
      if (db[userID]) {
        if (!canStillWatch(db[userID]).status) {
          return false;
        }
  
        db[userID].map((content,key) => {
          if(content.id === data.id){
              db[userID][key].state = data.state
              db[userID][key].time = data.time
              isUpdate = true
          }
        })
        
        if(!isUpdate){
          db[userID].push(data);
        }
    
      } else {
        db[userID] = [data];
      }
  
      fs.writeFileSync("db.json", JSON.stringify(db));
      return true;
    } catch(err){
      logger(`unable to write to  db: ${err.message} `)
      return false;
    }
  };
  
 export  const updateDB = (userID, data) => {
      try {
        const db = getDB();
        if (db[userID]) {
          db[userID].map((i,key) => {
              if(i.id === data.id){
                  db[userID][key].time = data.time 
                  db[userID][key].state = data.state 
              }
          });
        } else {
         return false
        }
    
        fs.writeFileSync("db.json", JSON.stringify(db));
        return true;
      } catch(err) {
        logger(`unable to update db: ${err.message} `)
        return false;
      }
  };
  
  export const deleteFromDB = async (userID, id) => {
    try {
      const db = await getDB();
      if (db[userID]) {
          const newUserContent = []
          db[userID].map(content => {
              if(content.id !== id){
                  newUserContent.push(content)
              }
          })
          db[userID] = newUserContent
          fs.writeFileSync("db.json", JSON.stringify(db));
          return true;
      }
     return false
    } catch(err) {
      logger(`unable to delete from db: ${err.message} `)
      return false;
    }
  };
  