# Assignment Login and Register
A simple web application for user registration and login functionality.
## Features
- User registration with validation
- Secure login system
- Password hashing
- Error handling and feedback
## Technologies Used
- Node.js
- Express.js
- Express-Session
- Bycript
- Dotenv
- MongoDB (or your chosen database)
- ejs/CSS/JavaScript (Frontend)
## Getting Started
1. **Clone the repository:**
    ```bash
    git clone https://github.com/manojbmgr/loginandresister-mongodb.git
    cd assignmentLoginAndRegister
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Configure environment variables:**
    - Create a `.env` file and add your database URI and other secrets.
4. **Run the application:**
    ```bash
    npm start
    ```
5. **Open in browser:**
    - Visit `http://localhost:3000`
6. **Live Demo:**
    - Visit `https://loginandresister-mongodb.onrender.com`
## Folder Structure
```
/public         # Static files (CSS, JS)
/modules        #custom modules
/views          #ejs files
index.js        # Main server file
.env            #database and other credentials
