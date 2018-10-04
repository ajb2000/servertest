const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const fillPdf = require("fill-pdf");
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const pako = require('pako');
const base64 = require('base64topdf');

// middleware (body-parser)to read the body of post
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
express.static('temp');
console.log('Server Running');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'banana12',
    database : 'webprofile'
  }
});

// receives request from browser for empty warning files and rends them to Browser
app.get('/getVW', function (req, res) {
        var file = path.join(__dirname, '0202-Verbal_warning.pdf');
        res.sendFile(file, function (err) {
       if (err) {
           console.log("Error VW file not found");
           console.log(err);
       } else {
            console.log("Blank VW Sent");
           // console.log(file)
       }
});
});
app.get('/getWW', function (req, res) {
        var file = path.join(__dirname, '0203-Written_warning.pdf');
        res.sendFile(file, function (err) {
       if (err) {
           console.log("Error WW file not found");
           console.log(err);
       } else {
            console.log("Blank WW Sent");
           // console.log(file)
       }
});
});
app.get('/getFWW', function (req, res) {
        var file = path.join(__dirname, '0204-Final_written_warning.pdf');
        res.sendFile(file, function (err) {
       if (err) {
           console.log("Error FWW file not found");
           console.log(err);
       } else {
            console.log("Blank FWW Sent");
           // console.log(file)
       }
});
});
app.get('/getnoticeofpostponementdh', function (req, res) {
        var file = path.join(__dirname, '0218-Notice_of_postponement_of_disciplinary_hearing.pdf');
        res.sendFile(file, function (err) {
       if (err) {
           console.log("Error Notice of postponement file not found");
           console.log(err);
       } else {
            console.log("Blank notice of postponement Sent");
           // console.log(file)
       }
});
});
app.get('/getnoticeofdh:id', function (req, res) {
        var file = path.join(__dirname, '0210-Notice_of_disciplinary_hearing-'+req.params.id+'.pdf');
        res.sendFile(file, function (err) {
       if (err) {
           console.log("Error Notice of DH file not found");
           console.log(err);
       } else {
            console.log("Blank notice of DH for"+req.params.id+"charges postponement Sent");
           // console.log(file)
       }
});
});
// receives request for file from browser, selects file+string from DB, decodes string with base64
//  and saves file in server folder
app.get('/warningfilebacks/:id', function(req, res, next) {
  knex('warningstable').where({
      warningno: req.params.id,
    }).select('warningno','warningtype', 'warningstring')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].warningstring, result[0].warningno+result[0].warningtype+'.pdf');
          var file = path.join(__dirname, result[0].warningno+result[0].warningtype+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                  } else {console.log("Success Warning file no"+req.params.id+"sent to Browser");}
          });
      });
  });
  // receives request for file from browser, selects file+string from DB, decodes string with base64
  //  and saves file in server folder
  app.get('/dhtabletempfilebacks/:id', function(req, res, next) {
    knex('dhtable').where({
        dhnumber: req.params.id,
      }).select('tempdoc')
        .then( function (result) {
            let decodedBase64 = base64.base64Decode(result[0].tempdoc, req.params.id+'.pdf');
            var file = path.join(__dirname, +req.params.id+'.pdf');
            res.sendFile(file, function (err) {
                if (err) {
                    console.log("Error");
                      console.log(err);
                    } else {console.log("Success postponement file for dh No"+req.params.id+"sent to Browser");}
            });
        });
    });
  // receives request for file from browser, selects file+string from DB, decodes string with base64
  //  and saves file in server folder
  app.get('/compwarningfilebacks/:id', function(req, res, next) {
    // console.log('After uploading the completed warning the file being requeste back t show in browser is: '+req.params.id )
    knex('warningstable').where({
        warningno: req.params.id,
      }).select('warningno','warningtype', 'compwarningstring')
        .then( function (result) {
            let decodedBase64 = base64.base64Decode(result[0].compwarningstring, result[0].warningno+result[0].warningtype+'_temp.pdf');
            var file = path.join(__dirname, result[0].warningno+result[0].warningtype+'_temp.pdf');
            res.sendFile(file, function (err) {
                if (err) {
                    console.log("Error");
                      console.log(err);
                      } else {console.log("Sent warning no: "+result[0].warningno+' to the browser');}
         });
    });
});
// receives request for the 6 types of DH files from browser, selects file+string from DB, decodes string with base64
//  and saves file in server folder
app.get('/dhdocbacks1/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'noticeofdisciplinaryhearing_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].noticeofdisciplinaryhearing_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Notice of Disciplinary Hearing to Browser");}
});})});
app.get('/dhdocbacks2/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'noticeofsuspention_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].noticeofsuspention_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Notice Notice of Suspention to Browser");}
});})});
app.get('/dhdocbacks3/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'minutesofhearing_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].minutesofhearing_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Minutes of Hearing to Browser");}
});})});
app.get('/dhdocbacks4/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'noticeofpostponement_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].noticeofpostponement_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Notice of Postponement to Browser");}
});})});
app.get('/dhdocbacks5/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'noticeofsuspention_s_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].noticeofsuspention_s_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Notice of Suspention_s to Browser");}
});})});
app.get('/dhdocbacks6/:id', function(req, res, next) {
      knex('dhtable').where({
          dhnumber: req.params.id,
        }).select('dhnumber','employeeid' ,'noticeofsumarydismissal_doc')
          .then( function (result) {
              let decodedBase64 = base64.base64Decode(result[0].noticeofsumarydismissal_doc, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              var file = path.join(__dirname, result[0].dhnumber+'_'+result[0].employeeid+'_temp_.pdf');
              res.sendFile(file, function (err) {
                  if (err) {console.log("Error");} else {console.log("Sent Notice of Sumarydismissal to Browser");}
});})});
  // receives request for document file from browser, selects file+string from DB, decodes string with base64
  //  and saves file in server folder
  app.get('/documentfilebacks/:id', function(req, res, next) {
    knex('doctable').where({
        docnumber: req.params.id,
      }).select('docnumber', 'docstring')
        .then( function (result) {
            let decodedBase64 = base64.base64Decode(result[0].docstring, result[0].docnumber+'.pdf');
            var file = path.join(__dirname, result[0].docnumber+'.pdf');
            res.sendFile(file, function (err) {
                if (err) {
                    console.log("Error");
                      console.log(err);
                      } else {console.log("Success");}
            });
        });
    });
// receives request for Labour Lib File from browser, selects filename+string from DB, decodes string with base64
//  and sends file to browser
app.get('/labourlibdocsback/:id', function(req, res, next) {
  knex('documenttable').where({
      documentnumber: req.params.id,
    }).select('documentname', 'documentstring')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].documentstring, result[0].documentname+'.pdf');
          var file = path.join(__dirname, result[0].documentname+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                    } else {console.log("Success");}
        });
    });
});
// Reseives request for iddocument form eetable and sends it to browser
app.get('/iddocumentfileback/:id', function(req, res, next) {
  knex('empperinftable').where({
      employeeid: req.params.id,
    }).select('name','surname', 'iddocument')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].iddocument, result[0].name+'_'+result[0].surname+'ID'+'.pdf');
          var file = path.join(__dirname, result[0].name+'_'+result[0].surname+'ID'+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                  } else {console.log("ID Document for employeeno "+req.params.id+" sent to browser");}
        });
    });
});
// Reseives request for Workpermit form eetable and sends it to browser
app.get('/workpermitfileback/:id', function(req, res, next) {
  knex('empperinftable').where({
      employeeid: req.params.id,
    }).select('name','surname', 'workpermit')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].workpermit, result[0].name+'_'+result[0].surname+'workpermit'+'.pdf');
          var file = path.join(__dirname, result[0].name+'_'+result[0].surname+'workpermit'+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                  } else {console.log("Workpermit for employeeno "+req.params.id+" sent to browser");}
        });
    });
});
// Reseives request for Contracts of Employment form eetable and sends it to browser
app.get('/contractofemploymentfileback/:id', function(req, res, next) {
  knex('empperinftable').where({
      employeeid: req.params.id,
    }).select('name','surname', 'contractofemployment')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].contractofemployment, result[0].name+'_'+result[0].surname+'contractofemployment'+'.pdf');
          var file = path.join(__dirname, result[0].name+'_'+result[0].surname+'contractofemployment'+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                  } else {console.log("Contract of employment for employeeno "+req.params.id+" sent to browser");}
        });
    });
});

// Reseives request for Contracts of Employment form eetable and sends it to browser
app.get('/contractofemployment_blankfileback/:id', function(req, res, next) {
  knex('empperinftable').where({
      employeeid: req.params.id,
    }).select('name','surname', 'contractofemployment_blank')
      .then( function (result) {
          let decodedBase64 = base64.base64Decode(result[0].contractofemployment_blank, result[0].name+'_'+result[0].surname+'contractofemployment_blank'+'.pdf');
          var file = path.join(__dirname, result[0].name+'_'+result[0].surname+'contractofemployment_blank'+'.pdf');
          res.sendFile(file, function (err) {
              if (err) {
                  console.log("Error");
                    console.log(err);
                  } else {console.log("Blank Contract of employment for employeeno "+req.params.id+" sent to browser");}
        });
    });
});

// receives request for employees from browser, selects employees from DB, and returns to info to Browser
app.get('/employeelist/:id', function(req, res, next) {
    knex('empperinftable').where({
        employerid: req.params.id
      }).select('employeeid','name', 'surname', 'idnumber', 'address', 'jobtitle')
        .orderBy('surname')
        .then( function (result) {
          res.send(result);
          });
});

// receives request for employees from browser, selects employees from DB, and returns to info to Browser
app.get('/employeeinfo/:id', function(req, res, next) {
    knex('empperinftable').where({
        employeeid: req.params.id
      }).select('employeeid','name', 'surname', 'idnumber', 'address', 'jobtitle', )
        .select(knex.raw('to_char("employmentstartdate", \'DD Mon YYYY\') as "employmentstartdate"'))
        .then( function (result) {
          res.send(result);
          });
});

// receives a request for Lablib SECTIONS from browser, selects unique Documents section names form DB and sends them to browser
app.get('/getlablibsections/', function(req, res, next) {
    knex('documenttable')
    .distinct('documentsection')
    .select()
    .orderBy('documentsection')
    .then( function (result) {
          res.send(result);
          });
});
// receives a request for OptionNames from browser, selects unique Documents section names form DB and sends them to browser
app.get('/getcontractoptionnames/:id', function(req, res, next) {
    knex('contracttable')
    .where({
      contractname: req.params.id,
      itemtype: 'Option'
    })
    .distinct('options')
    .select('options')
    .then( function (result) {
      console.log(result)
          res.send(result);
          });
});
//receives request for employeedetails from browser, selects info from the DB and ends it t browser
app.get('/employeedetails/:id', function(req, res, next) {
    knex('empperinftable').where({
        employeeid: req.params.id
      }).select('title','name', 'surname', 'initials','idnumber','gender','ethnicity','bloodtype','maritalstatus','hasdependants',
                  'dependants', 'passportnumber','nationality', 'telephonenumber','faxnumber','cellphonenumber','email','taxnumber','driverslicencenumber',
                  'foreignnational','disability','disabilitydescription','address','postalcode','ecdname','ecdsurname','relation','celnumber','homenumber','worknumber',
                  'employeenumber','jobtitle','branch','department','employmenttype','employmentcategory','manager','extentionnumber', 'contractofemployment_doc', 'contractofemployment_blank_doc','iddocument_doc','workpermit_doc',
                  'psiragrade','psiranumber','accountholder','bankname','branchname','branchcode','accountnumber','accounttype','medicalaidname','medicalaidplan','medicalaidnumber')
        .select(knex.raw('to_char("driverslicenceexpirydate", \'DD Mon YYYY\') as "driverslicenceexpirydate"'))
        .select(knex.raw('to_char("employmentstartdate", \'DD Mon YYYY\') as "employmentstartdate"'))
        .select(knex.raw('to_char("employmentenddate", \'DD Mon YYYY\') as "employmentenddate"'))
        .select(knex.raw('to_char("dateofbirth", \'DD Mon YYYY\') as "dateofbirth"'))
        .then( function (result) {
          res.send(result);
          });
});
// receives request for an employees warnings from server , selects data from DB and returns info to browser
app.get('/getwarnings/:id', function(req, res, next) {
        knex('warningstable')
          .select(knex.raw('to_char("misconductdate", \'DD Mon YYYY\') as "misconductdate"'))
          .select(knex.raw('to_char("warninglapsdate", \'DD Mon YYYY\') as "warninglapsdate"'))
          .select('misconducttype','chargefixeddescription','warningno', 'warningtype', 'chargedescription', 'warningduration', 'warningfile', 'oldwarning')
          .where({employeeid: req.params.id})
          .then( function (result) {
            console.log('Employee No '+req.params.id+' warning data sent')
            res.send(result);
            });
});
// receives request for DH for employee from server , selects data from DB and returns info to browser
app.get('/pupulatedhcontainer/:id', function(req, res, next) {
        knex('dhtable')
          .select(knex.raw('to_char("misconductdate", \'DD Mon YYYY\') as "misconductdate"'))
          .select(knex.raw('to_char("hearingdate", \'DD Mon YYYY\') as "hearingdate"'))
          .select(knex.raw('to_char("hearingtime", \'HH:MM\') as "hearingtime"'))
          .select('misconducttype','chargefixeddescription','dhnumber', 'chargedescription','status', 'finding', 'sanction','duration', 'outcomesubmitted','noticeofdisciplinaryhearing','noticeofsuspention','minutesofhearing','noticeofsumarydismissal','noticeofpostponement','noticeofsuspention_s')
          .where({employeeid: req.params.id})
          .then( function (result) {
            console.log('Employee No '+req.params.id+' DH data sent')
            res.send(result);
            });
});

// receives request for DH Outcome data from server , selects data from DB and returns info to browser
app.get('/pupulatedhinsertoutcome/:id', function(req, res, next) {
        knex('dhtable')
          // .select(knex.raw('to_char("misconductdate", \'DD Mon YYYY\') as "misconductdate"'))
          // .select(knex.raw('to_char("hearingdate", \'DD Mon YYYY\') as "hearingdate"'))
          .select('chargefixeddescription','dhnumber','chargedescription')
          .where({dhnumber: req.params.id})
          .then( function (result) {
            console.log('Disciplinary Hearing No '+req.params.id+' data sent')
            res.send(result);
            });
});
// Reveices request from browser to send Misconduct Types and fixedchargedesc (both normal and A ones)
app.get('/misconducttype', function(req, res, next) {
      knex('disciplinarycodetable')
      .distinct('misconducttype')
      .select()
          .then( function (result) {
            res.send(result);
            });
});
app.get('/fixedchargedesc/:id', function(req, res, next) {
      // console.log(req.params);
      // console.log(req);
      knex('disciplinarycodetable')
      .where({misconducttype: req.params.id})
      .distinct('fixedchargedescription')
      .select()
      .then( function (result) {
        res.send(result);
    });
});
// Reveices request from browser to send Misconduct Types and fixedchargedesc (both normal and A ones)
app.get('/getbranches/:id', function(req, res, next) {
      knex('employertable')
      .where({employerid: req.params.id})
      .select('branches')
          .then( function (result) {
            res.send(result);
            });
});




// Detirmines existing warings
app.post('/detirminecorrectsanction', (req,res) =>{
  console.log("New warning dertimination request received by server")
  var currentwarning = {}
  var existing_warning = ""
  var wanttoissue = ""
  var suggestedoutcome = ""
  var accordingtodc = ""
  var fixedchargedesc =  req.body.fixedchargedescription
  var wanttoissue =  req.body.wanttoissue
  var employeeid = req.body.employeeid
  var misconducttype = req.body.misconducttype
  console.log("Part 1 Started")
  var accordingtodc = ''
  knex('disciplinarycodetable').where(
           {fixedchargedescription: fixedchargedesc,
            })
            .select('dh','fww','ww','vw')
            .then( function (result) {
              // console.log(result)
              // console.log('Result of DH table search is: DH:'+result[0].dh+'FWW: '+result[0].fww+'WW: '+result[0].ww+'VW: '+result[0].vw);
              if (result[0].dh != 'yes' & result[0].fww != 'yes' & result[0].ww != 'yes' & result[0].vw != 'yes'){accordingtodc = 'VW';} else if
              (result[0].dh === 'yes') {accordingtodc = 'DH';} else if
              (result[0].dh != 'yes' & result[0].fww === 'yes') {accordingtodc = 'FWW';} else if
              (result[0].dh != 'yes' & result[0].fww != 'yes' & result[0].ww === "yes") {accordingtodc = 'WW';} else if
              (result[0].dh != 'yes' & result[0].fww != 'yes' & result[0].ww != 'yes' & result[0].vw ==='yes'){accordingtodc = 'VW';}
              // currentwarning.accordingtodc = accordingtodc
              console.log("Part 1 Finished: accordingtodc ="+accordingtodc)
            })
console.log("Part 2 Started");
knex('warningstable').where(
          {employeeid: employeeid,
          misconducttype: misconducttype,
          })
                      .andWhere(function(){
                        this.where('warninglapsdate', '>', req.body.currentdate)
                      })
                      .select('warningtype')
                      .then( function (result) {
                          // console.log(result)
                          // console.log('Warnings Found = '+result)
                           for (i=0;i<result.length;i++) {
                               if (result[i].warningtype === 'FWW'){var FWW = true}
                               if (result[i].warningtype === 'WW'){var WW = true}
                               if (result[i].warningtype === 'VW'){var VW = true}
                              };
                           if (FWW === true) {existing_warning = 'FWW'}
                              else if (FWW != true & WW === true){existing_warning = 'WW'}
                              else if (FWW != true & WW != true & VW === true){existing_warning = 'VW'}
                              else if (FWW != true & WW != true & VW != true){existing_warning = 'None'}
                              // currentwarning.existing_warning = existing_warning;
                              console.log('Part 2 Finished: Existing Warning = '+existing_warning);
                              var suggestedoutcome = ''

                              console.log("Part 3 Started")
                              console.log("wanttoissue = "+wanttoissue)
                              console.log("existing_warning = "+existing_warning)
                              console.log("accordingtodc = "+accordingtodc)
                              knex('rectable').where(
                                  {wanttoissue: wanttoissue,
                                      accordingtodccode: accordingtodc,
                                      existingwarning: existing_warning,
                                      })
                                        .select('suggestedoutcome')
                                        .then(function (result) {
                                              suggestedoutcome = result[0].suggestedoutcome
                                              console.log("part 3 Finished: suggestedoutcome = "+suggestedoutcome)
                                              res.send(result)
          })
     })
})
// receives pdf encoded in bse64 from browser and saves it in DB
app.get('/getlablibdocs/:id', function(req, res, next) {
        knex('documenttable').where({
            documentsection: req.params.id
          }).select('documentname','documentnumber')
            .then( function (result) {
                res.send(result);
              });
});
// receives request for Branch Department and JobTitle info, get same form DB and sends it to browser
app.get('/getbranchdeptjobt/:id', function(req, res, next) {
  console.log("branch jobtitle department request received for employer no: "+req.params.id)
        knex('employertable').where({
            employerid: req.params.id
          }).select('branches','departments','jobtitles')
            .then( function (result) {
                res.send(result);
              });
});

// receives request for documents from doctable from browser, gets docs from DB and sends to Browser
app.get('/getdocuments/:id', function(req, res, next) {
                // console.log(req.params.id);
                knex('doctable').where({
                    employerno: req.params.id
                  }).select('docstring','docsubject','doctype', 'docdescription', 'createdby', 'docnumber', 'employeename')
                    .select(knex.raw('to_char("date", \'DD Mon YYYY\') as "date"'))
                    .orderBy('date','desc')
                    .then( function (result) {
                        res.send(result);
                      });
});
// receives labour lib doc pdf encoded in bse64 from browser and saves it in DB
app.post('/uploadlablibdoc/', function(req, res, next) {
    knex('documenttable').insert({
      documentname: req.body.documentname,
      documentstring: req.body.documentstring,
      documentsection: req.body.documentsection,
    })
        .then( function (result) {
            res.end(console.log("File Saved in Labour Library Sectopn: "+req.body.documentsection));
           });
});
// receives completed and signed warning from browser, saves it in Server Folder
app.post('/uploadcompletedwarning//', function(req, res, next) {
  knex('warningstable').where({
    warningno: req.body.warningno,
    })
    .update({
    compwarningstring: req.body.compwarningstring,
    warningfile: true,
      })
    .then( function (result) {
          res.end(console.log("Warning document no "+req.body.warningno+" uploaded to DB"));
        });
})
// Receives new document form browser and uploads it into doctable in DB
app.post('/submitnewdoc/', function(req, res, next) {
    knex('doctable').insert({
      employerno: req.body.employerno,
      date: req.body.date,
      doctype: req.body.doctype,
      docdescription: req.body.docdescription,
      docsubject: req.body.docsubject,
      createdby: req.body.createdby,
      employeename: req.body.employeename,
      docstring: req.body.docstring,
    })
        .then( function (result) {
            res.end(console.log("New Document Uploaded to DB"));
          });
});
// Receives new DH data from browser and uploads it into dhtable in DB
app.post('/submitnewdh/', function(req, res, next) {
    knex('dhtable').insert({
      employeeid: req.body.employeeid,
      employerid: req.body.employerid,
      status: req.body.status,
      misconducttype: req.body.misconductype,
      misconductdate: req.body.misconductdate,
      chargefixeddescription: req.body.chargefixeddescription,
      chargedescription: req.body.chargedescription,
      hearingdate: req.body.hearingdate,
      hearingtime: req.body.hearingtime,
      })
      .returning('dhnumber')
      .then( function (result) {
            console.log(result)
            obj = {}
            obj['dhnumber'] = result
            res.send(obj)
            console.log(obj)
            res.end(console.log("DH data uploaded To DB under dh number "+result));
})
})
// Receives DH outcome data data from browser and uploads it into dhtable in DB
app.post('/submitdhoutcome/', function(req, res, next) {
    knex('dhtable').where({
      dhnumber: req.body.dhnumber
    })
    .update({
      finding: req.body.finding,
      sanction: req.body.sanction,
      status: req.body.status,
      duration: req.body.duration,
      outcomesubmitted: req.body.outcomesubmitted,
    })
        .then( function (result) {
            res.end(console.log("DH outcome data for dhnumber: "+req.body.dhnumber+"uploaded to DB"));
          })
})

// Receives DH postponement data data from browser and uploads it into dhtable in DB
app.post('/submitdhpostponement/', function(req, res, next) {
    knex('dhtable').where({
      dhnumber: req.body.dhnumber
    })
    .update({
      status: 'Postponed',
      hearingdate: req.body.hearingdate,
      hearingtime: req.body.hearingtime,
    })
        .then( function (result) {
            res.end(console.log("Postponement data for dhnumber: "+req.body.dhnumber+" uploaded to DB"));
          })
})

// receives updated EE details from browser and updated the DB record accordingly
app.post('/updateeinfo/:id', (req,res) =>{
  console.log("Updated ee info received by server for employee no "+req.body.employeeid)
  var obj = {}
  obj[req.params.id] = req.body.newdata
  knex('empperinftable').where({
     employeeid: req.body.employeeid
   }).update(obj)
  .then(function (result) {
          res.send(req.params.id+" updated to "+req.body.employeeid)
          res.end(console.log("Employee No: "+req.body.employeeid+" updated"));
            })
})
// receives updated Branch/jobtitle/Depertment info from browser and updates the DB record accordingly
app.post('/addbranchdeptjobtitle/', (req,res) =>{
  console.log(req.body)
  // var abc = req.body.columnname
  // console.log("Updated  info received by server for employee no "+req.body.employeeid)
  // var obj = {}
  if (req.body.columnname === 'branches') {// obj[abc] = req.body.newdata
  knex('employertable').where({
      employerid: req.body.employerid
    }).update({
          branches: knex.raw('array_append(branches, ?)', [req.body.newitem])
        })
        .then(function (result) {
                 res.send(req.params.columnname+" updated by adding "+req.body.newitem)
                 res.end(console.log("Done!"));
                })
  } else if (req.body.columnname === 'departments') {
    knex('employertable').where({
        employerid: req.body.employerid
      }).update({
            departments: knex.raw('array_append(departments, ?)', [req.body.newitem])
          })
          .then(function (result) {
                   res.send(req.params.columnname+" updated by adding "+req.body.newitem)
                   res.end(console.log("Done!"));
                  })
  } else if (req.body.columnname === 'jobtitles') {
    knex('employertable').where({
        employerid: req.body.employerid
      }).update({
            jobtitles: knex.raw('array_append(jobtitles, ?)', [req.body.newitem])
          })
          .then(function (result) {
                   res.send(req.params.columnname+" updated by adding "+req.body.newitem)
                   res.end(console.log("Done!"));
                  })
  }
})
// receives updated Branch/jobtitle/Depertment info from browser and updates the DB record accordingly
app.post('/removebranchdeptjobtitle/', (req,res) =>{
  console.log(req.body)
  // var abc = req.body.columnname
  // console.log("Updated  info received by server for employee no "+req.body.employeeid)
  // var obj = {}
  if (req.body.columnname === 'branches') {// obj[abc] = req.body.newdata
  knex('employertable').where({
      employerid: req.body.employerid
    }).update({
          branches: knex.raw('array_remove(branches, ?)', [req.body.newitem])
        })
        .then(function (result) {
                 res.send(req.params.columnname+" updated by removing "+req.body.newitem)
                 res.end(console.log("Done!"));
                })
  } else if (req.body.columnname === 'departments') {
    knex('employertable').where({
        employerid: req.body.employerid
      }).update({
            departments: knex.raw('array_remove(departments, ?)', [req.body.newitem])
          })
          .then(function (result) {
                   res.send(req.params.columnname+" updated by removing "+req.body.newitem)
                   res.end(console.log("Done!"));
                  })
  } else if (req.body.columnname === 'jobtitles') {
    knex('employertable').where({
        employerid: req.body.employerid
      }).update({
            jobtitles: knex.raw('array_remove(jobtitles, ?)', [req.body.newitem])
          })
          .then(function (result) {
                   res.send(req.params.columnname+" updated by removing "+req.body.newitem)
                   res.end(console.log("Done!"));
                  })
  }
})



app.post('/updateeinfo_doc/:id', (req,res) =>{
  console.log("Updated ee info received by server for employee no "+req.body.employeeid)
  // console.log(req)
  fieldname_doc = req.params.id+"_doc"
  var obj = {}
  obj[fieldname_doc] = true
  obj[req.params.id] = req.body.newdata

  knex('empperinftable').where({employeeid: req.body.employeeid})
                        .update(obj)
                        .then( function (result) {
                              res.end(console.log(req.params.id+" uploaded To DB"));
                      });
})
// receives new contract Item form browser and uploads it to DB
app.post('/uploadcontratitem', (req,res) =>{
  console.log("Post with new contract Item received by server")
  console.log(req.body)
  knex('contracttable').insert(
     {heading: req.body.heading,
     headingnumber: req.body.headingnumber,
     headingstyle: req.body.headingstyle,
     headingtext: req.body.headingtext,
     paragraph: req.body.paragraph,
     paragraphnumber: req.body.paragraphnumber,
     paragraphstyle: req.body.paragraphstyle,
     paragraphtext: req.body.paragraphtext,
     itemorder: req.body.itemorder,
     itemrank: req.body.itemrank,
     itemtype: req.body.itemtype,
     itemname: req.body.itemname,
     contractname: req.body.contractname,
     pagebreakafter: req.body.pagebreakafter,
     partofoption: req.body.partofoption,
     linkedoptionname: req.body.contoptionname,
    })
    .then( function (result) {
          res.send(result)
          res.end(console.log("New Contract Item-Data uploaded To DB"));
  });
});

// receives new contract option-item form browser and uploads it to DB
app.post('/uploadcontratoption', (req,res) =>{
  console.log("Post with new contract Item received by server")
  console.log(req.body)
  knex('contracttable').insert(
     {itemtype: req.body.itemtype,
     itemname: req.body.itemname,
     contractname: req.body.contractname,
     options: req.body.options,
     option1fieldnames: req.body.option1fieldnames,
     option1fieldtypes: req.body.option1fieldtypes,
     option2fieldnames: req.body.option2fieldnames,
     option2fieldtypes: req.body.option2fieldtypes,
     option3fieldnames: req.body.option3fieldnames,
     option3fieldtypes: req.body.option3fieldtypes,
     option4fieldnames: req.body.option4fieldnames,
     option4fieldtypes: req.body.option4fieldtypes,
     option5fieldnames: req.body.option5fieldnames,
     option5fieldtypes: req.body.option5fieldtypes,
    })
    .then( function (result) {
          res.send(result)
          res.end(console.log("New Contract Option-Data uploaded To DB"));
  });
});

// receives completed warning data from browser and inserts it into DB
app.post('/uploadwarningdata', (req,res) =>{
  console.log("Post received by server")
  knex('warningstable').insert(
     {employeeid: req.body.employeeid,
      misconducttype: req.body.misconducttype,
      chargefixeddescription: req.body.chargefixeddescription,
      warningtype: req.body.warningtype,
      misconductdate: req.body.misconductdate,
      chargedescription: req.body.chargedescription,
      warningduration: req.body.warningduration,
      warninglapsdate: req.body.warninglapsdate,
      oldwarning: req.body.oldwarning,
      warningstring: '',
    })
    .returning('warningno')
    .then( function (result) {
          // console.log(result)
          obj = {}
          obj['warningno'] = result
          res.send(obj)
          res.end(console.log("Warning data uploaded To DB under warningno "+result));
  });
});
//  receives completed DH files (the 6 types of DH files) encoded in base64, from browser and inserts it in DB
app.post('/uploaddhfile/:id', (req,res) =>{
    console.log("DH file for hearing no "+req.params.id+" received by server")
    obj = {}
    obj[req.body.docboolean] = req.body.docstring
    obj[req.body.doctype] = true
    // console.log(obj)
    knex('dhtable').where({
        dhnumber: req.params.id
      }).update(obj)
      .then( function (result) {
            res.end(console.log(req.body.doctype+" uploaded To DB for hearing number: "+req.params.id));;
    });
});
//  receives blank pupulated warning PDF, encoded in base64, from browser and inserts it in DB
app.post('/uploadwarningfile/', (req,res) =>{
    console.log("Blank populated Warning file received by server")
    // console.log(req.params.id)
    // console.log(req.body.warningstring)
    knex('warningstable').where({
        warningno: req.body.warningno
      }).update(
       {warningstring: req.body.warningstring,
      })
      .then( function (result) {
            res.end(console.log("Blank Populated PDF for Warning No"+req.body.warningno+" uploaded To DB"));;
    });
});
//  receives blank pupulated postponement of dh PDF, encoded in base64, from browser and inserts it in DB
app.post('/uploadpostponedhfile/', (req,res) =>{
    console.log("Populated  file received by server")
    // console.log(req.params.id)
    // console.log(req.body.warningstring)
    knex('dhtable').where({
        dhnumber: req.body.dhnumber
      }).update(
       {tempdoc: req.body.tempdoc,
      })
      .then( function (result) {
            res.end(console.log("Blank Populated PDF for postponement in dh No"+req.body.dhnumber+" uploaded To DB"));;
    });
});
//  receives blank pupulated notice of DH PDF, encoded in base64, from browser and inserts it in DB
app.post('/uploadnoticeofdhfile/', (req,res) =>{
    console.log("Populated  file received by server")
    // console.log(req.params.id)
    // console.log(req.body.warningstring)
    knex('dhtable').where({
        dhnumber: req.body.dhnumber
      }).update(
       {tempdoc: req.body.tempdoc,
      })
      .then( function (result) {
            res.end(console.log("Blank Populated PDF for dh No"+req.body.dhnumber+" uploaded To DB"));;
    });
});
//  Delete warning from DB
app.post('/deletewarning/:id', (req,res) =>{
    knex('warningstable').where({
        warningno: req.params.id
      }).delete()
      .then( function (result) {
            res.end(console.log("Warning deleted from DB"));;
    });
});
//  Delete Disciplinary Hearing from DB
app.post('/deletedh/:id', (req,res) =>{
    knex('dhtable').where({
        dhnumber: req.params.id
      }).delete()
      .then( function (result) {
            res.end(console.log("Hearing No:"+req.params.id+"deleted from DB"));;
    });
});

var empperinftable = {};

// received new employee upload from browser and inserts in into DB
app.post('/uploadnewemployee', (req,res) =>{
    empperinftable.employerid =  '0001'
    empperinftable.title =  req.body.title
    empperinftable.name =  req.body.name
    empperinftable.surname =  req.body.surname
    empperinftable.initials =  req.body.initials
    empperinftable.dateofbirth =  req.body.dateofbirth
    empperinftable.idnumber =  req.body.idnumber
    empperinftable.gender =  req.body.gender
    empperinftable.ethnicity =  req.body.ethnicity
    empperinftable.bloodtype =  req.body.bloodtype
    empperinftable.maritalstatus =  req.body.maritalstatus
    empperinftable.hasdependants =  req.body.hasdependants
    empperinftable.dependants =  req.body.dependants
    empperinftable.passportnumber =  req.body.passportnumber
    empperinftable.nationality =  req.body.nationality
    empperinftable.telephonenumber =  req.body.telephonenumber
    empperinftable.faxnumber =  req.body.faxnumber
    empperinftable.cellphonenumber =  req.body.cellphonenumber
    empperinftable.email =  req.body.email
    empperinftable.taxnumber =  req.body.taxnumber
    empperinftable.driverslicencenumber =  req.body.driverslicencenumber
    empperinftable.driverslicenceexpirydate =  req.body.driverslicenceexpirydate
    empperinftable.foreignnational =  req.body.foreignnational
    empperinftable.disability =  req.body.disability
    empperinftable.disabilitydesription =  req.body.disabilitydesription
    empperinftable.address =  req.body.address
    empperinftable.postalcode =  req.body.postalcode
    empperinftable.ecdname =  req.body.ecdname
    empperinftable.ecdsurname =  req.body.ecdsurname
    empperinftable.relation =  req.body.relation
    empperinftable.celnumber =  req.body.celnumber
    empperinftable.homenumber =  req.body.homenumber
    empperinftable.worknumber =  req.body.worknumber
    empperinftable.employeenumber =  req.body.employeenumber
    empperinftable.jobtitle =  req.body.jobtitle
    empperinftable.startdate =  req.body.employmentstartdate
    empperinftable.enddate =  req.body.employmentenddate
    empperinftable.branch =  req.body.branch
    empperinftable.department =  req.body.department
    empperinftable.employmenttype =  req.body.employmenttype
    empperinftable.employmentcatagory =  req.body.employmentcategory
    empperinftable.manager =  req.body.manager
    empperinftable.extentionnumber =  req.body.extentionnumber
    empperinftable.psiragrade =  req.body.psiragrade
    empperinftable.psiranumber =  req.body.psiranumber
    empperinftable.accountholder =  req.body.accountholder
    empperinftable.bankname =  req.body.bankname
    empperinftable.branchname =  req.body.branchname
    empperinftable.branchcode =  req.body.branchcode
    empperinftable.accountnumber =  req.body.accountnumber
    empperinftable.accounttype =  req.body.accounttype
    empperinftable.medicalaidname =  req.body.medicalaidname
    empperinftable.medicalaidplan =  req.body.medicalaidplan
    empperinftable.medicalaidnumber =  req.body.medicalaidnumber
    // empperinftable.workpermit = req.body.workpermit
    // empperinftable.iddocument = req.body.iddocument
    console.log("New employee details received by server")


    knex('empperinftable').insert(
            // { iddocument: empperinftable.iddocument,
            //   workpermit: empperinftable.workpermit,
             {employerid:  '0001',
              title:  empperinftable.title,
              name:  empperinftable.name,
              surname:  empperinftable.surname,
              initials:  empperinftable.initials,
              dateofbirth:  empperinftable.dateofbirth,
              idnumber:  empperinftable.idnumber,
              gender:  empperinftable.gender,
              ethnicity:  empperinftable.ethnicity,
              bloodtype:  empperinftable.bloodtype,
              maritalstatus:  empperinftable.maritalstatus,
              hasdependants:  empperinftable.hasdependants,
              dependants:  empperinftable.dependants,
              passportnumber:  empperinftable.passportnumber,
              nationality:  empperinftable.nationality,
              telephonenumber:  empperinftable.telephonenumber,
              faxnumber:  empperinftable.faxnumber,
              cellphonenumber:  empperinftable.cellphonenumber,
              email:  empperinftable.email,
              taxnumber:  empperinftable.taxnumber,
              driverslicencenumber:  empperinftable.driverslicencenumber,
              driverslicenceexpirydate:  empperinftable.driverslicenceexpirydate,
              foreignnational:  empperinftable.foreignnational,
              disability:  empperinftable.disability,
              disabilitydescription:  empperinftable.disabilitydesription,
              address:  empperinftable.address,
              postalcode:  empperinftable.postalcode,
              ecdname:  empperinftable.ecdname,
              ecdsurname:  empperinftable.ecdsurname,
              relation:  empperinftable.relation,
              celnumber:  empperinftable.celnumber,
              homenumber:  empperinftable.homenumber,
              worknumber:  empperinftable.worknumber,
              employeenumber:  empperinftable.employeenumber,
              jobtitle:  empperinftable.jobtitle,
              employmentstartdate:  empperinftable.startdate,
              employmentenddate:  empperinftable.enddate,
              branch:  empperinftable.branch,
              department:  empperinftable.department,
              employmenttype:  empperinftable.employmenttype,
              employmentcategory:  empperinftable.employmentcatagory,
              manager:  empperinftable.manager,
              extentionnumber:  empperinftable.extentionnumber,
              psiragrade:  empperinftable.psiragrade,
              psiranumber:  empperinftable.psiranumber,
              accountholder:  empperinftable.accountholder,
              bankname:  empperinftable.bankname,
              branchname:  empperinftable.branchname,
              branchcode:  empperinftable.branchcode,
              accountnumber:  empperinftable.accountnumber,
              accounttype:  empperinftable.accounttype,
              medicalaidname:  empperinftable.medicalaidname,
              medicalaidplan:  empperinftable.medicalaidplan,
              medicalaidnumber:  empperinftable.medicalaidnumber,
              iddocument_doc: false,
              workpermit_doc: false,
              contractofemployment_doc: false,
}).returning('employeeid')

.then(function(result) {
  obj = {}
  obj['employeeid'] = result
  res.send(obj)
  console.log('Success!')
  var empperinftable = {}
})
      // res.send(('data received'))
})
// Reveices request for bcea contract from browser
app.get('/getcontract', function(req, res, next) {
      knex('contracttable')
      .where({
        itemname: 'Hours of Work and Overtime'
      })
      .select()
      .orderBy('itemname')
      .orderBy('itemorder')
      .orderBy('itemno')
          .then( function (result) {
            res.send(result);
            // console.log(result)
            });
});
// Reveices request for spesific employer contract from browser
app.get('/getemployercontracts/:id', function(req, res, next) {
  console.log('Request for employer contracts received for employer no: '+req.params.id)
      knex('employertable')
      .where({
        employerid: req.params.id
      })
      .select('contracts')
          .then( function (result) {
            res.send(result);
            // console.log(result)
            });
});
// Reveices request for all paragraph headings in one contract type r
app.get('/getcontractparagrapgheadings/:id', function(req, res, next) {
  console.log("Request received for headers for:"+req.params.id)
      knex('contracttable')
      .where({
        contractname: req.params.id
      })
      // .distinct('itemname')
      .select()
      // .orderBy('itemrank')
      .orderBy('itemrank')
      .orderBy('itemorder')
      .then( function (result) {
            // console.log(result)
            res.send(result);
            });
});
// Receives Contract object from browser and uploads it into contract column of employer table
app.post('/sendcontracttoemployer/', function(req, res, next) {
    knex('employertable').where({
      employerid: req.body.employerid
    })
    .update({
      contracts: knex.raw('array_append(contracts, ?)', [req.body.contract])
      // contracts: req.body.contract,
      })
        .then( function (result) {
            res.end(console.log("Contract object for "+req.params.id+"uploaded to DB"));
          })
})

app.listen(3000)
