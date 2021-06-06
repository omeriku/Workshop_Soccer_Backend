# Assignment 3.2 - Backend


Omer Tagger : 207904616

Omer Niv : 315964734

## Danish Superliga Server

<p align="center">
<img src="https://user-images.githubusercontent.com/73793617/120917876-417f2380-c6ba-11eb-8597-7b4bc76078ed.png" width="30%">
</p>
</br>

This project is a backend server to manage the Danish Soccer Superliga. It uses [Sportmonks API](https://docs.sportmonks.com/football/) to import the real Superliga data to the server. We used [Azure Database](https://portal.azure.com/#home) to create and store our own data - such as Users, Permissions and Soccer Games.

On top of the original requirenemts we implemented <b>BONUS</b> features such as Adding new event to a game and Entering scores to an existing game.


## How To Install
 
1. Install [Node JS](https://nodejs.org/en/download/) 
2. Install [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)
   ```
   npm install
   ```
3. Install Dependent Packages
    ```
   npm i
   ```
4. Run
   ```
   node project/main.js
   ```
5. Your server will be available on http://localhost:3000/ 
6. If everything is installed correctly, your server will respond to [alive test call](http://localhost:3000/alive)

   ![image](https://user-images.githubusercontent.com/73793617/120918876-6de96e80-c6bf-11eb-9a14-577bd6d9541f.png)

## API

To create our API we used [SWAGGER UI Editor](https://editor.swagger.io/). You can find our API documented here:

https://app.swaggerhub.com/apis-docs/OmerNiv123/sport-monks_super_league_api/2.0.0

Alternativly, you can access it locally after cloning this repository, install all dependencies and setting up the Server at http://localhost:3000/api

## .evn 

You can find our .env file [here](https://docs.google.com/document/d/1RJ0bNap55gL2a8BELPp7M7AgTLWcI8xjDVzhOjFWtsY/edit?usp=sharing)

* Please note that this file is only visible to <b>BGU Organization Accounts</b>, so be sure to log in first

To access Manager's Functionalities you will have to be logged in as FIFA Representative


```yaml
{
 "username": "fifaRep"
 "password": "fifa123!"
}
```
</br>
</br>

<p align="center">
<img title="Photo Credit: YouTube" src="https://user-images.githubusercontent.com/73793617/120923486-75b50d00-c6d7-11eb-9977-8b26f77344ac.png" width="100%">
</p>
