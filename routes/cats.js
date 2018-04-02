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
  if(!req.headers['authToken']){
    return res.status(401).send({
      'Error': 'No token in the headers'
    });
  }
  auth.isValidToken(req.headers.authToken, (err, isAuthorized) => {
    if(err || !isAuthorized){
      return res.status(401).send({
        'Error': 'Invalid token.'
      });
    }
    let externalId = req.body.externalId ? req.body.externalId : null;
    let name = req.body.name ? req.body.name : null;
    let username = req.body.username ? req.body.username : null;
    console.log('extId: '+externalId+', name: '+name+', username: '+username);
    catController.getCats(externalId, name, username, (err, result) => {
      if(err) {
        return res.status(500).send({
          'Error': 'Unable to get cats.'
        });
      }
      
    });
  });
});

 /**
  * @GET cats/random
    Body: empty
    Returns: imageUrl: String, name: String, and breed: String for a random cat
  */
router.get('/random', (req, res, next) => {

});


module.exports = router;