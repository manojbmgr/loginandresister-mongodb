const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function registerUser(username, password) {
  try {
    await client.connect();
    const database = client.db('todosDB');
    const collection = database.collection('users');
    const existingUser = await collection.findOne({ username: username });
    if (!existingUser) {
      console.log('User does not exist, creating new user.');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, password: hashedPassword, createdAt: new Date() };
      const result = await collection.insertOne(user);
      return { success: true, userId: result.insertedId, message: "Registration successful!" };
    } else {
      return { success: false, message: "User already exists!" };
    }
  } catch (err) {
    console.error("Error registering user:", err);
    return { success: false, message: "Server error while registering!" };
  }
}
async function loginUser(username, password) {
  try {
    await client.connect();
    const database = client.db('todosDB');
    const collection = database.collection('users');
    const user = await collection.findOne({ username });
    if (!user) {
      console.log('User not found.');
      return { success: false, message: "Invalid Credentials" };
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return { success: true, user, message: "Login Success" };
    } else {
      return { success: false, message: "Invalid Credentials" };
    }
  } catch (err) {
    console.error("Error logging in:", err);
    return { success: false, message: "Login failed due to server error" };
  }
}
exports.loginUser = loginUser;
exports.registerUser = registerUser;
