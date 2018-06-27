var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

function addCorsHeaders(res){
	res.header("Access-Control-Allow-Origin", "*") ;
	res.header("Access-Control-Allow-Headers", 
		"Accept, Accept-Encoding, Accept-Language, Authorization, Cache-Control, Connection, Content-Length, Content-Type, Host, Origin, Pragma, Referer, User-Agent")	;
	res.header("Access-Control-Expose-Headers", 
		"Accept, Accept-Encoding, Accept-Language, Authorization, Cache-Control, Connection, Content-Length, Content-Type, Host, Origin, Pragma, Referer, User-Agent")	;
	res.header("Access-Control-Allow-Methods", 
		"GET, POST, PUT, DELETE, PATCH")	  ;
}

router.options('/*', function(req, res){
  console.log("auth option");
  addCorsHeaders(res);
  res.status(200).send("ok");
});

router.get('/check', (req, res) => {
  addCorsHeaders(res);
  console.log("checking");
  let auth = req.header("Authorization") ;
  if (auth.indexOf("Bearer ") === 0){
    jwt.verify(auth.substr(7), "MySecret", (e, d)=>{
      if (!e){
        return res.status(200).send({result: "ok"});
      }
    });
  }
  return res.status(401).send({result: "unauth"});
});

module.exports = router;
