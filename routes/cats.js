var express = require('express');
var router = express.Router();

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
  
});

 /**
  * @GET cats/random
    Body: empty
    Returns: imageUrl: String, name: String, and breed: String for a random cat
  */
router.get('/random', (req, res, next) => {

});


module.exports = router;