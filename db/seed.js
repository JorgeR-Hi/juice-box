const {
    client,
    getAllUsers,
    createUser,
    updateUser
  } = require('./index');
  

  async function createInitialUsers(){
    try{
        console.log("Starting to create users...")

        await createUser({username:"albert", password:"bertie99", location:"Noble", name:"Albert"})
        await createUser({username:"sandra", password:"2sandy4me", location:"Broken Arrow", name:"Sandra"})
        await createUser({username:"glamgal", password:"soglam", location:"Norman", name:"Glamgal"})
    }catch(err){
        console.error("Error creating users! ", err)
        throw err;
    }
  }
  async function createInitialPost(){
    try{
        const [albert, sandra, glamgal]= await getAllUsers();

        await createPost({
            authorId: albert.id,
            title:"First Post",
            content:" this is my frist post."
        })
        await createPost({
            authorId: sandra.id,
            title:"First Post",
            content:" this is my frist post."
        })
        await createPost({
            authorId: glamgal.id,
            title:"First Post",
            content:" this is my frist post."
        })
    }catch(err){
        console.error(err)
    }
  }


  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS post;
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE post (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      throw error;
    }
  }
  
  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      const users = await getAllUsers();
      console.log("getAllUsers:", users);
      console.log("Result:", users)
      
      console.log("Calling updateUser on the first user")
      const updateUserResult = await updateUser(users[0].id,{
        name:"Newname Sogood",
        location:"Lesterville, KY"

      })
      console.log("Results:", updateUserResult)
      
      console.log("Calling getAllPosts");
      const posts =await getAllPost();
      console.log("Result:", posts)

      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
      
      console.log("Calling getUserById with 1")
      const albert = await getUserById(1);
      console.log("Result:", albert);

      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());