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

router.use(bodyParser.json());

router.options('/*', function(req, res){
  addCorsHeaders(res);
  res.status(200).send("ok");
});

router.post('/users', (req, res) => { // register new user
  addCorsHeaders(res);
  User.findOne({useremail: req.body.useremail}, (e, u)=>{
    if (!u) {// not found
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, 8);
      User.create({
          useremail: req.body.useremail,
          password: hash
        },
        (e, user)=>{
            if (e) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send({result: "ok"});
            return ;
        }
      );
    } else {
      res.status(200).send({result: "userexists"});
    }
    
  }) ;

  
//  res.status(200).send('API works.');
});

function makeJwtToken(method, payload, secret){
    var token = jwt.sign(payload, secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    return token ;
}

  router.get('/authenticate/:useremail/:password', (req, res)=>{
  addCorsHeaders(res);
    User.findOne({useremail: req.params.useremail}, (e, u)=>{
      if (u) {// found user
        if (bcrypt.compareSync(req.params.password, u.password)){
          let token = makeJwtToken(null, {id: u._id}, "MySecret") ;
          res.header("Authorization", "Bearer " + token);
          return res.status(200).send({result: "ok"});
        }
      }
      return res.status(200).send({result: "nosuchaccount"});
      console.log(u)
    }) ;
    
  })

module.exports = router;