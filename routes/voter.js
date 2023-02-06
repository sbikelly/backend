const express = require('express');
const eController = require('../controllers/electionController');
const pController = require('../controllers/positionController');
const uController = require('../controllers/userController');
const cController = require('../controllers/candidateController');
const vController = require('../controllers/voteController');
//const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
//router.use(requireAuth)

// GET all workouts
//router.get('/', uController.vote);

router.post('/vote', vController.vote_post);
router.get('/index', uController.voter_get);
router.get('/report', uController.get_statistics);
//router.post('/details', uController.user_details_get);//voter profile fetch



module.exports = router