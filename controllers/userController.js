const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
let formidable = require('formidable');
let fs = require('fs');


const User = require('../models/userModel');
const Electn = require('../models/electionModel');
const Positn = require('../models/positionModel');
const Candt = require('../models/candidateModel');
const Vote = require('../models/voteModel');
const Faclty = require('../models/facultyModel');
const Dept = require('../models/deptModel');
const vController = require('../controllers/voteController');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const Resize = require('../middleware/Resize');



const jwt = require('jsonwebtoken');
var session = require('express-session');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '5m' })
}

const check_session = (req, res, next) => {
  const user = req.session.user;

  if(user){
    next();
  }else{
    res.redirect('/');
  }

}

const login_page = async(req, res) => {
  
  
  res.render('index', 
    { 
      title: 'Sign In',
      msg: '',
      layout: 'index'
    }
  );
  
}

// login a user
const loginUser = async (req, res) => {  
  const {email, password} = req.body;
  try {
    const user = await User.login(email, password, res);
    
    if(user){
      session = req.session;
      session.user = user;

      // create a token
      const token = createToken(user._id)
      
      if(user.isAdmin == "0"){

        get_admin_dashboard(req, res);         

      }else{
        voter_get(req, res);
      }
    }else{
      res.send('invalid Username or password')
    }
  } catch (error) {
    //res.status(400).send({error: error.message})
    console.log('==login error == '+error);
  }
}

const get_admin_dashboard = async(req, res) => {
  
  const user = req.session.user;
  Electn.find()
        .then(result => {
          Positn.find()
            .then(pResult => {
              User.find()
              .then(users => {
                res.render(
                  'admin/home',{
                    title:'Dashboard',
                    Electn: result, 
                    positions: pResult, 
                    User: user,  //current user
                    Users: users
                  }
                );
              })
            })
        })
}

const get_statistics = async(req, res) => {

  const user = req.session.user;

  try {

    await Electn.findOne({status: 'Active'})
      .then(result =>{
        Positn.find()
            .then(pResult => {
                Candt.find({e_id: result._id})
                  .then(cResult => {
                    User.find()
                    .then(users => {
                      Vote.distinct("v_id")
                        .then(voted => {
                          Vote.find()
                            .then(votes => {
                              res.render('voters/report', 
                                { 
                                  Electn: result, 
                                  positions: pResult, 
                                  candidates: cResult, 
                                  User: user,  //current user
                                  Users: users,
                                  Voted: voted,
                                  Votes: votes, 
                                  title: 'Election Report', 
                                  layout: 'voters/index' 
                                }
                              );
                            })
                        })
                    }) 
                  })
              })
        })

  } catch (error) {
    
    res.render('404',
      { 
        title: 'Error', 
        errorCode: 'Report Error',
        User: user, 
        main: '404', 
        additnMessage: error
      }            
    );

  }

}

const voter_get = async (req, res) => { 

  const user = req.session.user;
  const id = user._id;
  
  
      await Electn.findOne({status: 'Active'})
        .then(result => {
          if(result){
                        
            Vote.countDocuments({v_id: id}, function(err, c) {

              if( c > 0 ){

                Vote.find({v_id: id}) //getting the current voter's votes
                .then(votes => {

                    vote_get(req, res, result, votes);
  
                })
  
              }else{
                not_voted(req, res, result); //render voting page
              }
              
            });            
            
          }else{
            res.render('404', 
            { title: 'Election Not Found', 
            errorCode: '404',
            User: user,  
            main: 'No Election is Currently Active', 
            additnMessage: err,
            layout: 'voters/index' });
          }
            
        })
        .catch(err => {
          
          res.render('404', 
          { title: 'Election Not Found', 
          errorCode: '404',
          User: user, 
          main: 'No Election is Currently Active', 
          additnMessage: err,
          layout: 'voters/index' });

        });

}

//render voting page
const not_voted = async(req, res, result) => {

  const user = req.session.user;

  Positn.find()
    .then(pResult => {
        Candt.find()
          .then(cResult => {
            User.find()
            .then(users => {
              Vote.distinct("v_id")
                .then(voted => {
                  Vote.find()
                    .then(votes => {
                      res.render('voters/home', 
                        { 
                          Electn: result, 
                          positions: pResult, 
                          candidates: cResult, 
                          User: user,  //current user
                          Users: users,
                          Voted: voted,
                          Votes: votes, 
                          title: 'Voter', 
                          layout: 'voters/index' 
                        }
                      );
                    })
                })
            }) 
          })
          .catch(err => {
            res.render('404', { title: 'candidates Error!!!', errorMessage: err });
          })
    })
    .catch(err => {
      res.render('404', { title: 'position Error!!!', errorMessage: err });
    })
}

//Getting the user/voter's votes
const vote_get = async(req, res, result, votes) => {
  1
  const user = req.session.user;
 
  await Positn.find() //will improve so that this will not be necessary by just saving the position along with the vote instead of the position id
    .then(pos => {
      Candt.find()
        .then(candt => {
          User.find()
            .then(users => {
              Vote.distinct("v_id")
                .then(voted => {
                  res.render('voters/Voted', 
                      { 
                        Electn: result,
                        positions: pos, 
                        candidates: candt, 
                        User: user, //current user
                        Users: users,
                        Voted: voted,
                        Votes: votes, 
                        title: 'Voter', 
                        layout: 'voters/index' 
                      }
                    );
                })
            })         
    
        })
    })

}

// signup a user
const signupUser = async (req, res) => {
  const {name, gender, dept, dob, phone, photo, email, password} = req.body

  try {
    const user = await User.signup(name, gender, dept, dob, phone, photo, email, password)

    // create a token
    const token = createToken(user._id)

    if(user.isAdmin = "0"){
      res.status(200).render('admin/index', {title: 'Admin', User: user});
    }else{
      res.status(200).render('users/index', {title: 'User_Home', User: user});
    }

  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

const user_index = (req, res) => {
  const user = req.session.user;
  User.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('admin/voters', 
        { 
          User: user, //current user
          users: result, 
          title: 'All Voters' 
        }
      );
    })
    .catch(err => {
      res.render('404', { title: 'Page Error!!!', errorMessage: err });
    });
}

const user_create_post = async (req, res) => {

  const imagePath = path.join(__dirname, '../public/images');
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const photo = await fileUpload.save(req.file.buffer);

  const {name, gender, dept, dob, phone, email, password} = req.body

  try {
    const user = await User.signup(name, gender, dept, dob, phone, photo, email, password)

    if(user){

      res.status(201).redirect('/voters');

    }
  }catch (error) {
    res.render('admin/404',
      { 
        title: 'Error!!!', 
        errorCode: '404',
        User: user, 
        main: 'Error Adding User', 
        additnMessage: err
      }            
    );
  }
}

const user_create_get = (req, res) => {
  res.render('users/new_user', { title: 'Create a new user' });
}

const update_user = async (req, res) => {

  const user = req.session.user;

  const {id, name, dept, phone, email} = req.body;  
  

  try {
    
    if(user.isAdmin == "0"){

      const voter = await User.findOneAndUpdate({_id: id}, {
        ...req.body      
      });
      if(voter){
        res.send(voter); 
      }
    }else{ //user is not an admin
      
      const { id } = req.params;

      let photo = '';
      const imagePath = path.join(__dirname, '../public/images/users');
      const fileUpload = new Resize(imagePath);

      if(!req.file) {
          res.send('image not found');
          res.end();
      }else{
        photo = await fileUpload.save(req.file.buffer);
      }
      
      const voter = await User.findOneAndUpdate({_id: id}, {name, dept, phone, email, photo});
      
      if(voter){
        res.redirect('/voter/profile');
      }
      
    }

  } catch (err) {
    res.send(err);
  }
}

const user_details = (req, res) => {

  let user = req.session.user;
  let id = user._id;

  User.findById(id)
    .then(user => {      

      
      req.session.user = user;

      if(user.isAdmin == "0"){

          
        const id = req.params.id;
        User.findById(id)
        .then(result => {
          Positn.find()
            .then(pResult => {
              Electn.find()
                .then(eResult => {
                  res.render('admin/voter_details', 
                    { 
                      User: user, 
                      voter: result,
                      positions: pResult,
                      Electn: eResult,
                      title: "Voter's Details"
                    }
                  );
                  }
                )
              }
            )
        })
        .catch(err => {
          res.render('admin/404', 
            { 
              errorCode: '404',
              User: user,  
              main: 'Voter Error', 
              additnMessage: err,
              title: '404'
            }
          );
        });         

      }else{    
        Positn.find()
          .then(pResult => {
            Electn.findOne({status: 'Active'})
              .then(eResult => {
                Candt.findOne({u_id: user._id}, {e_id: eResult._id})
                  .then(cResult => {
                    res.render('voters/profile', 
                      { 
                        User: user,
                        positions: pResult,
                        Electn: eResult,
                        Candt: cResult,
                        title: "Profile",
                        layout: 'voters/index'
                      }
                    );
                  })
                
                }
              )
            }
          )
          .catch(err => {
            res.render('404', 
              { 
                errorCode: '404',
                User: user,  
                main: 'Voter Error', 
                additnMessage: err,
                title: '404'
              }
            );
          });
      }

  }).catch(err => {
    res.send('===error finding user===  '+err);
  });
  
}

const user_detail_fetch = async(req, res) => {
  let user = req.session.user;
  let id = user._id;

  try{
      
    if(user.isAdmin == "0"){
          
        const id = req.params.id;
        await User.findById(id)
        .then(result => {
          Positn.find()
            .then(pResult => {
              Electn.find()
                .then(eResult => {
                  Faclty.find()
                    .then(fResult => {
                      Dept.find()
                      .then(dResult => {
                        res.send({  
                          user: result,
                          Positns: pResult,
                          Electns: eResult,
                          Faclties: fResult,
                          Depts: dResult
                        });
                      })
                    })
                  }
                )
              }
            )
        });      

    }else{    
        await Positn.find()
          .then(pResult => {
            Electn.findOne({status: 'Active'})
              .then(eResult => {
                Candt.findOne({u_id: user._id}, {e_id: eResult._id})
                  .then(cResult => {
                    Faclty.find()
                    .then(fResult => {
                      Dept.find()
                      .then(dResult => {
                        res.send({ 
                          user: user,
                          Positns: pResult,
                          Electns: eResult,
                          Candt: cResult,
                          Faclties: fResult,
                          Depts: dResult
                        });
                      })
                    })
                  })
                
                }
              )
            }
          );
    }

  }catch(err){
    res.send('===error fetching user data===  '+err);
  }
}

const check_password = async(req, res) => {

  const user = req.session.user;
  const pass = req.body.pass;
  const id = user._id;

  User.check_password(user, pass)
    .then(chkPwd => {   
      res.send(chkPwd);
    }).catch(err => {
      console.log(err);
      res.send('Error! '+err);
    })

}

const change_password = async (req, res) => { 

  const user = req.session.user;

  const {id, userNewPass} = req.body;

  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userNewPass, salt);

  if(user.isAdmin == "0"){
    try {
      const user = await User.findByIdAndUpdate({_id: id}, {password: hash});
  
      if(user){  
        res.redirect('/voters')

      }
  
    } catch (error) {
      res.status(400).send(error.message);
      console.log(error);
    }
  }else{    
    
    const userr = await User.findByIdAndUpdate({_id: user._id}, {password: hash});

    if(userr){

      res.redirect('/index');

      //res.send('Password Changed Successfully, n/ Your New Password is " '+userNewPass+' "');

    }

  }

}

const user_delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(result => {
      res.status(201).redirect('/voters');
    })
    .catch(err => {
      res.render('admin/404',
          { 
            title: 'User Not Found', 
            errorCode: '404',
            User: user, 
            main: 'No User with such ID can be found on the database', 
            additnMessage: err
          }            
        );
      }      
    );
}

const image_edit = async(req, res, iPath) => {

  //photo editing and resizing
  let photo = '';
  const imagePath = path.join(__dirname, iPath);
  const fileUpload = new Resize(imagePath);

  if(!req.file) {
      res.send('image not found');
      res.end();
  }else{
    photo = await fileUpload.save(req.file.buffer);
    return photo;
  }

}

module.exports = {
  check_session,
  login_page, 
  signupUser,
  loginUser,
  logoutUser,
  user_index, 
  user_create_post,
  update_user,
  voter_get,
  get_statistics,
  get_admin_dashboard,
  user_details,
  user_detail_fetch, 
  user_create_get,
  check_password,
  change_password,
  user_delete,
}