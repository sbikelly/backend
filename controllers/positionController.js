
const Positn = require('../models/positionModel');
const Electn = require('../models/electionModel');
const Candt = require('../models/candidateModel');
var session = require('express-session');


const position_index = (req, res) => {
  
  const user = req.session.user;

  Positn.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('admin/positions', 
        { 
          User: user, //current user
          positions: result, 
          title: 'All positions' 
        }
      );
    })
    .catch(err => {
      res.render('404', { title: 'Page Error!!!', errorMessage: err });
    });
  
}

const position_create_post = async (req, res) => {
  const { name } = req.body;

  const exists = await Positn.findOne( {name});

  if (exists) {
    res.status(404).json({ error: 'Position Already Exists!!!'});
  }
  else{
    const position = new Positn(req.body);
    position.save();
    res.redirect('/positions');
  }
    
}



const position_delete = (req, res) => {
  const id = req.params.id;
  Positn.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/positions');
    })
    .catch(err => {
      res.render('404', { title: 'Error Deleting position!!!', errorMessage: err });
    });
}

module.exports = {
  
  position_index, 
  position_create_post, 
  position_delete
}