var express = require('express');
var router = express.Router();
let catController = require('../controllers/catController');
let auth = require('../controllers/auth');

/**
 * @GET cats
    Header: authToken, browser info
    Body: (optional search fields)
    - externalId: String?
    - name: String?
    - username: String?
    Returns: array of cats (birthdate: Date, breed: String, username: String, externalId: String,
    imageUrl: String?, name: String) matching that criteria, sorted by lastSeenAt.
    Errors:
    - authToken invalid
    - invalid search criteria
 */

router.get('/', (req, res, next) => {
  if(!req.headers['authtoken']){
    return res.status(401).send({
      'Error': 'No token in the headers'
    });
  }
  auth.isValidToken(req.headers.authtoken, (err, isAuthorized) => {
    if(err || !isAuthorized){
      return res.status(401).send({
        'Error': 'Invalid token.'
      });
    }
    let allowedCriteria = ['externalId', 'name', 'username'];
    for(let criteria in req.query){
      if(allowedCriteria.indexOf(criteria) == -1){
        return res.status(400).send({
          'Error': 'Invalid search criteria: '+criteria
        });
      }
    }
    // I am assuming the optional search parameters will come in query string
    let externalId = req.query.externalId ? req.query.externalId : null;
    let name = req.query.name ? req.query.name : null;
    let username = req.query.username ? req.query.username : null;
    catController.getCats(externalId, name, username, (err, result) => {
      if(err) {
        return res.status(500).send({
          'Error': 'Unable to get cats.'
        });
      }
      return res.status(200).json(result);
    });
  });
});

 /**
  * @GET cats/random
    Body: empty
    Returns: imageUrl: String, name: String, and breed: String for a random cat
  */
router.get('/random', (req, res, next) => {
  if(!req.headers['authtoken']){
    return res.status(401).send({
      'Error': 'No token in the headers'
    });
  }
  auth.isValidToken(req.headers.authtoken, (err, isAuthorized) => {
    if(err || !isAuthorized){
      return res.status(401).send({
        'Error': 'Invalid token.'
      });
    }
    catController.getRandomCat((err, catInfo) => {
      if(err) {
        return res.status(500).send({
          'Error': 'Cannot return random cat.'
        });
      }
      return res.status(200).json(catInfo);
    });
  });
});


module.exports = router;