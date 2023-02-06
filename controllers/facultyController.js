
const Faclty = require('../models/facultyModel');
const Dept = require('../models/deptModel');
var session = require('express-session');

// faculty controls
const faculty_index = (req, res) => {
  
  const user = req.session.user;

  try{
    Faclty.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('admin/faculties', 
          { 
            User: user, //current user
            faculties: result, 
            title: 'All faculties' 
          }
        );
      });
  }catch (error) {
    res.render('admin/404',
      { 
        title: 'Error!!!', 
        errorCode: '404',
        User: user, 
        main: 'Error fetching faculties', 
        additnMessage: err
      }            
    );
  }
    
}

const faculty_details_fetch = (req, res) => {
  
  const user = req.session.user;

  try{
    Faclty.find().sort({ createdAt: -1 })
      .then(result => {
        res.send(result);
      });
  }catch (err) {
    res.send('==Error fetching Faculties== '+err);
    console.log('==Error fetching Faculties== '+err);
  }
    
}

const faculty_create_post = async (req, res) => {
  const { name } = req.body;

  const exists = await Faclty.findOne( {name});

  if (exists) {
    res.status(404).json({ error: 'faculty Already Exists!!!'});
  }
  else{
    
    const faculty = new Faclty(req.body);
    faculty.save();
    res.redirect('/faculties');
  }
    
}

const faculty_update = async(req, res) => {
  
  const {id, name} = req.body;


  try{
    await Faclty.findByIdAndUpdate({_id: id}, {name})
      .then(faculty => {                
        if(faculty){
          res.redirect('/faculties');
        }
      });
  }catch(err){
    res.send('==faculty Update error== '+err);
    console.log('==faculty Update error== '+err);
  }

}

const faculty_depts_fetch = async(req, res) => {

  try{
    await Dept.find()
    .then(dept => {
      res.send(dept);
    });

  }catch(err){
    res.send('==Error Fetching Departments== '+err)
  }
}

const faculty_delete = (req, res) => {
  const id = req.params.id;
  Faclty.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/faculties');
    })
    .catch(err => {
      res.render('404', { title: 'Error Deleting faculty!!!', errorMessage: err });
    });
}


// departments controls
const department_index = (req, res) => {
  
  const user = req.session.user;

  try{
    Dept.find().sort({ f_name: +1 })
          .then(dResult => {
            res.render('admin/departments', 
              { 
                User: user, //current user
                departments: dResult, 
                title: 'All departments' 
              }
            );
          });
  }catch(err){
    res.send('==Error Fetching Departments== '+err);
  }
  
}

const department_create_post = async (req, res) => {
  const { f_id, name } = req.body;

  try{
    const exists = await Dept.findOne( {name, f_id});

    if (exists) {
      res.status(404).json({ error: 'department Already Exists!!!'});
    }
    else{
      const department = new Dept(req.body);
      department.save();
      res.send(department);
    }
  }catch(err){
    res.send('==Error Adding Dept== '+err);
  }
    
}

const department_update = async(req, res) => {
  
  const {id, name, f_id, f_name} = req.body;

  try{
    Dept.findByIdAndUpdate({_id: id}, {name, f_id, f_name})
      .then(dept => {                
        if(dept){
          res.redirect('/departments');
        }
      });
  }catch(err){
    res.send('==dept Update error== '+err);
    console.log('==dept Update error== '+err);
  }

}

const department_delete = (req, res) => {
  const id = req.params.id;
  Dept.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/departments');
    })
    .catch(err => {
      res.render('404', { title: 'Error Deleting department!!!', errorMessage: err });
    });
}

module.exports = {
  
  faculty_index,
  faculty_details_fetch, 
  faculty_create_post,
  faculty_update,
  faculty_depts_fetch, 
  faculty_delete,
  department_index, 
  department_create_post,
  department_update,
  department_delete
}