
const Candt = require('../models/candidateModel');
const Positn = require('../models/positionModel');
const Electn  = require('../models/electionModel');
const User = require('../models/userModel');
const Vote = require('../models/voteModel');
const uController = require('../controllers/voteController');

const vote_get_index = async(req, res) => {

  Positn.find() //will improve so that this will not be necessary by just saving the position along with the vote instead of the position id
    .then(pos => {
      Candt.find({e_id: result._id})
        .the(candt => {
          Vote.find()
            .then(votes => {
              res.send({Positions: pos, Candidates: candt, })
            })
        })
    });

}

const vote_post = async(req, res) => {
  const user = req.session.user;
  const v_id = user._id;
  
  if(user){
    
    var voteData0 = req.body.data;

    //begin sanitizing the votes data received
    var voteData1 = voteData0.slice(1,-1); // removing '[' from both end

    var voteData2 = voteData1.split(",");

    var voteData3 = [];

    voteData2.forEach(vd2 =>{

      var x = vd2.slice(1,-1); // removing " from both end
      let y = x.split(" ");
      let z = {
        e_id: y[0],
        p_id: y[1],
        c_id: y[2],
        v_id: v_id
      }
      voteData3.push(z);

    });
    console.log(voteData3);

    await Vote.insertMany(voteData3)
      .then(function(){
        res.send("vote Successfully Submitted");
      }).catch(err =>{
        res.send(err);
      });

  }
  else{
    res.send("pleas Login first!!! ");
    //redirect to login page after production
  }

    
}


const vote_get = async(req, res) => {
  
  const user = req.session.user;
 
  Positn.find() //will improve so that this will not be necessary by just saving the position along with the vote instead of the position id
    .then(pos => {
      Candt.find({e_id: result._id})
        .the(candt => {
          res.render('voters/Voted', 
              { 
                Electn: result,
                Votes: votes,
                positions: pos, 
                candidates: candt, 
                Users: user, 
                title: 'Voter', 
                layout: 'voters/index' 
              }
              );
    
        })
    });

}




module.exports = {
  vote_get,
  vote_post
}