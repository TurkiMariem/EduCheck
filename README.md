# EduCheck
This repository contains the source code of the Educheck solution
This guide explains how to set up and run the project by using three terminal windows. Follow these steps:

1. First Terminal: Starting the Server
Open the first terminal.

Navigate to the project folder.

Run the following command to install all required dependencies:

npm install

After the dependencies are installed, start the server with:

node server.js

This command allows to connect to the Mongodb server..


2. Second Terminal: Running Truffle
Open the second terminal.

Ensure that Truffle is installed. If not, you can install it globally with:


npm install -g truffle

Start the Truffle development environment by running:

truffle develop

Once in the Truffle console, migrate the smart contracts by typing:

migrate


3. Third Terminal: Running the Frontend
Open the third terminal.

Navigate to the frontend folder.

Install the dependencies by running:

npm install

After installation, start the frontend application with:

npm start


4- You have to install and run the IPFS Desktop to get a distributed database locally
