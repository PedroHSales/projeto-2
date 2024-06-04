
 'use strict' //modo estrito

/********************************************** 
* Renomeie este arquivo para firebase.js!
***********************************************/

// Cole as informações do seu RealTime Database do Firebase abaixo:
const firebaseConfig = {
  apiKey: "AIzaSyCz5bhwFRRlB43IPv8mTuD53G51BdqqExE",
  authDomain: "projeto-pi-ba17c.firebaseapp.com",
  databaseURL: "https://projeto-pi-ba17c-default-rtdb.firebaseio.com",
  projectId: "projeto-pi-ba17c",
  storageBucket: "projeto-pi-ba17c.appspot.com",
  messagingSenderId: "924188071049",
  appId: "1:924188071049:web:32f6c689744cb5e95d2258"
};


/*
* Nas regras do Realtime Database, informe:
* {
  "rules": {
    "clientes":{
    ".read": "auth != null",
    ".write": "auth != null"
  },
    "usuarios":{
    ".read": "auth != null",
    ".write": "auth != null"
  }
 }
}
*/

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
// Crie uma referência para o Realtime Database do Firebase
const database = firebase.database();
// Crie uma referência para o armazenamento do Firebase
const storageRef = firebase.storage().ref();
