const {Client}= require('pg');

const client =new Client ("postgres://localhost:5432/juicebox-dev")

async function createUser({
username, 
password,
name,
location
}){
    
    try{
        const {rows:[user]} = await client.query(`
        INSERT INTO users (username, password, name, location) 
        VALUES($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
        `,[username, password, name, location])
        
        return user;
    }catch(err){
        throw err
    }
}
async function createPost ({
    authorId,
    title,
    content
}){
    try{
        const {rows:[user]}=await client.query(`
        INSERT INTO users (authorId, title, content)
        VALUES($1, $2, $3)
        RETURNING *;
        `, [authorId, title, content])
        
        return user;
    }catch(err){
        throw err;
    }
}

async function updateUser(id, fields = {}) {
    
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (err) {
      console.error("There seems to be an error when updating the user", err)  
      throw err;
    }
  }

  async function updatePost(id, fields = {}){
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0){
      return;
    }
    try{
      const {rows : [user] }= await client.query(`
      UPDATE post
      SET ${setString}
      WHERE id = ${id}
      RETURNING*;
      `, Object.values(fields))

    }catch(err){
        console.error("There seems to be an error when updating your post", err)
        throw err;
    }
  }


async function getAllUsers(){
    const {rows}= await client.query(
        `SELECT id, username, name, location, active
        FROM users;`
        );
        
        return rows;
    }
async function getAllPost(){
  const {rows}=await client.query(`
    SELECT *
    FROM post;
  `);
  return rows
}

async function getPostByUser(userId){
  try{
    const {rows}=await client.query(`
      SELECT * FROM post
      WHERE "authorId"=$1;
    `,[userId])
    return rows;
  }catch(err){
    throw err;
  }
}


async function getUserById(userId){
  try{
    const {rows}=await client.query(`
    SELECT *
    FROM post
    WHERE "authorId"=${userId}
    `)
    return rows
  }catch(err){
    throw err
  }
}
    
    module.exports={
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPost,
    getPostByUser,
    getUserById
    }