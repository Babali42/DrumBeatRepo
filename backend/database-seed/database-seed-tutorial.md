# Seed Database Tutorial

## 1. Set environment variable

- windows : 
Run powershell : ``powershell`` ``$Env:DATABASE_CONNECTION_STRING = "value"``

- mac :
In terminal : ``export DATABASE_CONNECTION_STRING="mongodb://<user>:<password>@<host>:27017"``

## 2. Run script (in the same terminal)

``cd \backend\mongoDB\``

``node seed.js``
