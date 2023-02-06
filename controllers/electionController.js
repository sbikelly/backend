
const Electn = require('../models/electionModel');
const Positn = require('../models/positionModel');
const Candt = require('../models/candidateModel');
const User = require('../models/userModel');
const Vote = require('../models/voteModel');
const path = require('path');

const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const faker = require('faker');




let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();

const current_date = date + "-" + month + "-" + year + " " + hours + ":" + minutes;



const election_index = async(req, res) => {
  const user = req.session.user;

  await User.find()
    .then(users => {
      Electn.find().sort({ created_on: -1 })
      .then(result => {
        res.render('admin/elections', { 
          elections: result, 
          User: user, 
          Users: users, 
          title: 'All elections' });
      })
    })
    .catch(err => {
      res.render('404', { title: 'Page Error!!!', errorMessage: err });
    });
}

const election_details = async (req, res) => {
  const id = req.params.id;
  const user = req.session.user;

  await User.find()
  .then(users => {
    Electn.findById(id)
    .then(result => {
      Positn.find()
        .then(pResult => {
          Candt.find()
            .then(cResult => {
              res.render('admin/election_details', 
                { 
                  Electn: result, 
                  positions: pResult, 
                  candidates: cResult, 
                  Users: users,
                  User:user, 
                  title: 'election Details' 
                });
                           
            })
            .catch(err => {
              res.render('404', { title: 'candidates Error!!!', errorMessage: err });
            })
        })
        .catch(err => {
          res.render('404', { title: 'position Error!!!', errorMessage: err });
        })
      })
    .catch(err => {
      res.render('404', { title: 'election not found', errorMessage: err });
    });
  })
}

const election_create_post = (req, res) => {
  const {title, name, status} = req.body;
  const result = {title: title, name: name, status: 'inActive', created_on: current_date}
  const election = new Electn(result);
  election.save()
    .then(result => {
      res.redirect('/elections');
    })
    .catch(err => {
      res.render('404', { title: 'Error Creating a new election!!!', errorMessage: err });
    });
}

const election_status = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  if(status == 'Active'){

   await Electn.findOneAndUpdate({status: 'Active'}, {status: 'inActive'}, {updated_on: current_date})
      .catch(err => {
        res.render('404', { title: 'Error updating election 1 !!!', errorMessage: err });
      });

  }

  await Electn.findByIdAndUpdate({_id: id},{status: status}, {updated_on: current_date})
    .then(result => {
      res.redirect('/elections')
    })
    .catch(err => {
      res.render('404', { title: 'Error updating election !!!', errorMessage: err });
    });
}

const generate_report = async(req, res, next) => {

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

                              pdf_report(
                                res,
                                result, 
                                pResult, 
                                cResult,
                                users,
                                voted,
                                votes
                              )

                            })
                        })
                    }) 
                  })
              })
        })

  } catch (err) {
    
    res.send('==Error Generating Report== '+err);

  }
}

const pdf_report = async(res, el, positions, candidates, voters, Voted, votes) => {

  try{

    // Create a document
    const doc = new PDFDocument();
    
      doc.pipe(res);

       
      
   
    var sn = 0;

    positions.forEach(position => {
      /*/ Adding an image in the pdf.
  
      doc.image(path.join(__dirname, '../public/img/sug logo.jpg'), {
        fit: [80, 50],
        align: 'center',
        
      })*/
      doc.font('Times-Bold').fontSize(25).text('Federal College of Education, Pankshin', {align:'center'});
      
      doc.moveDown(0.5);

        doc.fontSize(18).font('Times-Bold');

        //election name
        doc.text(el.title+ ' Result', {align: 'center'});

        doc.moveDown(3);

        doc.fontSize(12).font('Times-Roman'); 

      
      const statTable = {
        title: position.name,
        subtitle: "Summary",
        headers: [ "#", "Items", "Total" ],
        rows: [
          [ 1, "Candidates", candidates.length ],
          [ 2, "Positions", positions.length ],
          [ 3, "Voters", voters.length ],
          [ 4, "Voted", Voted.length],

        ],
      };
      // A4 595.28 x 841.89 (portrait) (about width sizes)
      
      // or columnsSize
      doc.table(statTable, { 
        x: 0, // {Number} default: undefined | To reset x position set "x: null"
        y: 0, // {Number} default: undefined | 
        padding: 8, // {Number} default: 0
        columnSpacing: 3, // {Number} default: 5
        hideHeader: false, 
        minRowHeight: 3,
          
        columnsSize: [ 50, 200, 50 ],
        divider: {
          header: { disabled: false },
		      horizontal: { disabled: false, width: 0.1, opacity: 1},
        },          
         // vertical Divider:
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {

          doc.font("Helvetica").fontSize(8);
          indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'blue' : 'green'), 0.15);

          const {x, y, width, height} = rectCell;

            // first line 
            if(indexColumn === 0){
              doc
              .lineWidth(.5)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();  
            }
            

          doc
            .lineWidth(.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke();


            //doc.fontSize(10).fillColor('#292929');

          },
      });
      // done!

      doc.moveDown(1);

      rowData = [];

      candidates.forEach(candidate => {
        
        var totalVotes = Voted.length;
        var totalCandidates = 0;
                                        
        if(position._id == candidate.p_id ){ 
                                            
          totalCandidates++;
          var x = 0;

          votes.forEach(vo => {
            (vo.c_id == candidate._id)? x++ :'';
            }
          );
          var percentage = Math.round((x / totalVotes) * 100);
          var pcntage = percentage +"%";

          rowData.push(
            [
              sn++,
              candidate.name,
              "",
              x,
              pcntage,
            ],
          );       

        }        

      });
          
    // -----------------------------------------------------------------------------------------------------
    // Complex Table with Object
    // -----------------------------------------------------------------------------------------------------
    // A4 595.28 x 841.89 (portrait) (about width sizes)
        const table = {
          subtitle: 'Result',
          headers: [
            { label: "#", property:"s/n", width: 20 },
            { label:"Candidate", property: 'name', width: 200,  renderer: null },
            { label:"Party", property: 'party', width: 50, renderer: null }, 
            { label:"Votes", property: 'votes', width: 100, renderer: null }, 
            { label:"%", property: 'percentage', width: 100, renderer: null }
          ],
          rows: rowData,

        };
      //});

        doc.table(table, {
          padding: 10, // {Number} default: 0
          columnSpacing: 5, // {Number} default: 5
          hideHeader: false, 
          minRowHeight: 5,

          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
          // {Function}
          // -----------------------------------------------------------------
          // vertical Divider:
          // -----------------------------------------------------------------
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {

            doc.font("Helvetica").fontSize(8);
            indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'blue' : 'green'), 0.15);

            const {x, y, width, height} = rectCell;

            // first line 
            if(indexColumn === 0){
              doc
              .lineWidth(.5)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();  
            }

            doc
            .lineWidth(.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke();


            //doc.fontSize(10).fillColor('#292929');

          },
        
        });

        doc.addPage();

    });
    


      // Apply some transforms and render an SVG path with the
      // 'even-odd' fill rule
      doc
      .scale(0.6)
      .translate(470, -380)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore();


      

      /*===========template for writing a letter ===================/
      const randomName = faker.name.findName();    
      doc.text(randomName, { align: 'right' });
      doc.text(faker.address.streetAddress(), { align: 'right' });
      doc.text(faker.address.secondaryAddress(), { align: 'right' });
      doc.text(faker.address.zipCode() + ' ' + faker.address.city(), { align: 'right' });
      doc.moveDown();
      doc.text('Dear ' + randomName + ',');
      doc.moveDown();
      for(let i = 0; i < 3; i++) {
          doc.text(faker.lorem.paragraph());
          doc.moveDown();
      }
      doc.text(faker.name.findName(), { align: 'right' });

      /*=========end Template =====================*/

  
      // Finalize PDF file
      doc.end();

      //res.send(doc);


  }catch(err){
    console.log('==PDF Error== '+ err);
  }

}


const election_delete = (req, res) => {
  const id = req.params.id;
  Electn.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/elections');
    })
    .catch(err => {
      res.render('404', { title: 'Error Deleting election!!!', errorMessage: err });
    });
}

module.exports = {
  
  election_index, 
  election_details, 
  election_create_post,
  election_status,
  generate_report,
  pdf_report,
  election_delete
}