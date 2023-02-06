const express = require('express');
const eController = require('../controllers/electionController');
const pController = require('../controllers/positionController');
const uController = require('../controllers/userController');
const cController = require('../controllers/candidateController');
const vController = require('../controllers/voteController');
const fController = require('../controllers/facultyController');

var session = require('express-session');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const Resize = require('../middleware/Resize');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();
const app = express();





/*router.get('/', (req, res) => {
    var data = [
        { name: "John", position: "Developer", office: "New York" },
        { name: "Jane", position: "Designer", office: "London" },
        { name: "Bob", position: "Manager", office: "Paris" }
      ];
      res.render('test', { data:data})
  });
  */


router.get('/', uController.login_page); 

router.get('/register', (req, res) => {
    res.render('signup');
});

router.post('/login', uController.loginUser);
router.get('/logout', uController.logoutUser);
router.post('/signup', uController.signupUser);

//verifications
//router.use(requireAuth);
router.use(uController.check_session);
router.post('/check/pass', uController.check_password);
router.post('/change/pass/:id', uController.change_password);//admin change password
router.post('/change/pass', uController.change_password);

//election routes
router.get('/elections', eController.election_index);
router.post('/new_election', eController.election_create_post);
router.get('/election/:id', eController.election_details);
router.get('/election/update/:id/:status', eController.election_status);
router.get('/election/report/:id', eController.pdf_report);
router.get('/election/generate/report', eController.generate_report);
router.get('/election/delete/:id', eController.election_delete);



//voters/Users routes
router.get('/home', uController.get_admin_dashboard);
router.get('/voters', uController.user_index);
router.post('/new_voter', upload.single('photo'), uController.user_create_post);
router.get('/index', uController.voter_get);
router.get('/voter/:id', uController.user_details); // admin voter profile view
router.get('/voter/profile', uController.user_details); //voter profile view
router.post('/details', (req, res) => { res.send(req.session.user);});//voter profile fetch
router.post('/details/:id', uController.user_detail_fetch);
router.post('/voter/edit/:id', upload.single('photo'), uController.update_user);
router.post('/user/update', uController.update_user);
router.get('/report', uController.get_statistics);

//faculty routes
router.get('/faculties', fController.faculty_index);
router.post('/faculty/details', fController.faculty_details_fetch);
router.post('/faculty/depts', fController.faculty_depts_fetch);
router.post('/new_faculty', fController.faculty_create_post);
router.post('/faculty/update', fController.faculty_update);
router.get('/faculty/delete/:id', fController.faculty_delete);


//departments routes
router.get('/departments', fController.department_index);
router.post('/department/new', fController.department_create_post);
router.post('/department/update', fController.department_update);
router.get('/department/delete/:id', fController.department_delete);


//positions routes
router.get('/positions', pController.position_index);
router.post('/new_position', pController.position_create_post);
router.get('/position/delete/:id', pController.position_delete);

//candidate Routes
router.post('/candidate/new', cController.candidate_create_post);
router.get('/candidate/delete/:id/:eId', cController.candidate_delete);
router.post('/candidate/update/:id', upload.single('photo'), cController.candidate_update);
router.post('/candidate/details/:id', cController.candidate_details );//candidate's profile fetch



module.exports = router