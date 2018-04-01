var express = require('express');
var router = express.Router();
var catController = require('../controllers/catController');

/**
 * @PUT cat/register
 * Header: browser info
    Body:
    - birthdate:Date?
    - breed: String?
    - imageUrl: String?
    - name: String
    - password: String
    - username: String
    - weight: Float
    Save the cat in a database:
    - addedAt: Date
    - breed: String?
    - birthdate:Date?
    - externalId: String
    - imageUrl: String?
    - lastSeenAt: Date
    - name: String
    - password: String
    - username: String
    - weight: Float
    Returns: nothing
    Errors:
    - name missing
    - username invalid
    - password < 8 characters
 */
router.put('/register', (req, res, next) => {
  catController.usernameTaken(req.body.username, (err, isTaken) => {
    if(err || isTaken){
      return res.status(400).send({
        'Error': 'Username is taken already. Please choose a different username and try again.'
      });
    }
  });
  if(!req.body.name){
    return res.status(400).send({
      'Error': 'Cat name not specified in the request body. Please ensure request body includes a name parameter.'
    });
  }
  if(req.body.password.length < 8){
    return res.status(400).send({
      'Error': 'Password must be greater than 7 characters. Please try again.'
    });
  }
  catController.saveCat(req.body.birthdate, req.body.breed, req.body.imageUrl, req.body.name, req.body.username, req.body.password, req.body.weight, (err, result) => {
    if(err){
      return res.status(500).send({
        'Error': 'An error occurred when trying to save the cat information. Please try again later.'
      });
    }
    else{
      return res.sendStatus(200);
    }
  });

});

/**
 * @POST cat/login
    Header: browser info
    Body:
    - username: String
    - password: String
    Update the database:
    - lastSeenAt: Date
    Returns: authToken: String
    Errors:
    - no such username
    - password incorrect
 */

router.post('/login', (req, res, next) => {

});

module.exports = router;