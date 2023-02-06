

const Electn = require('../models/electionModel');
const Candt = require('../models/candidateModel');
const Positn = require('../models/positionModel');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const Resize = require('../middleware/Resize');


const candidate_index = (req, res) => {
  Candt.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('candidates/candidates_list', { candidates: result, title: 'All candidates' });
    })
    .catch(err => {
      res.render('404', { title: 'Page Error!!!', errorMessage: err });
    });
}

const candidate_details = async(req, res) => {
  const id = req.params.id;
  
  try {
    
    await Electn.findOne({status: 'Active'})
      .then(electn => {    
        Candt.findOne({_id: id, e_id: electn._id})
          .then(candt => {
            res.send(candt);
          }).catch(er => {
            res.send({manifesto: 'candidate not found   '+er});
          });
      }).catch(er => {
        res.send({manifesto: 'Election Not Found.....   '+er});
      })

  } catch (error) {
    res.send({manifesto: '1  candidate not found     '+error});
    console.log('3  candidate not found     '+error)
  }
}


const candidate_create_post = (req, res) => {
  const user = req.session.user;

  const result = {
    u_id: req.body.uId,
    name: req.body.name,
    dept: req.body.dept,
    dob: req.body.dob,
    gender: req.body.gender,
    manifesto: req.body.manifesto,
    email: req.body.email,
    phone: req.body.phone,
    photo: req.body.photo,
    p_id: req.body.pId,
    e_id: req.body.eId
  };
  const candidate = new Candt(result);
  candidate.save()
    .then(result => {
      res.send('Candidate added Successfully');
    })
    .catch(err => {
      res.send(err);
    });
}

const candidate_update = async (req, res) => {

  const user = req.session.user;

  let photo = '';

  const imagePath = path.join(__dirname, '../public/images/candidates');
  const fileUpload = new Resize(imagePath);

  if (!req.file) {
    console.log("1...   error Updating Candidates")
  }else{
    try {
      photo = await fileUpload.save(req.file.buffer);
    } catch (error) {
      console.log("1.... " + error);
    }
  }

  const {phone, email, manifesto} = req.body;
  let id = req.params.id;
  const candidate = await Candt.findByIdAndUpdate({_id: id}, {photo, phone, email, manifesto });

  if(candidate){
    res.redirect("/voter/profile")
  }

}

const candidate_delete = (req, res) => {
  const id = req.params.id;
  Candt.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/election/'+req.params.eId);
    })
    .catch(err => {
      res.render('404', { title: 'Error Deleting candidate!!!', errorMessage: err });
    });
}

module.exports = {
  
  candidate_index, 
  candidate_details,
  candidate_create_post,
  candidate_update, 
  candidate_delete
}