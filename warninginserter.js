warningFields = {
EmployeeName: [],
EmployeeID: [],
OffenceDate: [],
CombinedDescription: [],
LapseMonths: [],
LapseDate: [],
employeeid: [],
chargedescription: [],
};

var currentDHcards = []
var currentWarningcards = []

// fetches empty warning doc form server, populates it with warningFields and
// creates new waring file  and saves it to warningstable and retrieves it back
// and opend the file in a anew window
function printWarning(){
  console.log('warning file requested froe server is: '+globalS.warningtype)
  fetch("http://localhost:3000/get"+globalS.warningtype)
  .then((resp) => resp.arrayBuffer())
  .then(function(data) {
    filled_pdf = pdfform().transform(data, warningFields);
    console.log(warningFields)
    var blob = new Blob([filled_pdf], {type: 'application/pdf'})
    var reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onload = function(e) {
       var base64Str = btoa(e.target.result);
       var obj = {};
       obj['warningstring'] = base64Str;
       obj['warningno'] = globalS.warnno
       // console.log("globals.warnno is: "+obj)
       fetch('http://localhost:3000/uploadwarningfile/', {
                   method: 'post',
                   headers: {'Content-Type': 'application/json'},
                   body: JSON.stringify(obj)
                    })
          .then(res => {
          // console.log("Completed Warning File Uploaded to Server")
          document.getElementById('viewwarningbox').innerHTML += '<a id="viewwarning'+globalS.warnno+'" href="http://localhost:3000/warningfilebacks/'+globalS.warnno+'" target="_blank">click to view warning</a>';
          var a = document.getElementById('viewwarning'+globalS.warnno);
          a.click();
          getwarnings();
          globalS.warnno = ''
        });
      };
    });
  };

  // fetches empty postponement dh doc form server, populates it with postponedhFields and
  // creates new postponement file  and saves it to dhtable in tempdoc and retrieves it back
  // and opend the file in a new window
  function printpostponementdh(postponedhFields){
    var currenthearingno = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
    console.log('postponement dh file requested froe server is: '+currenthearingno)
    fetch("http://localhost:3000/getnoticeofpostponementdh")
    .then((resp) => resp.arrayBuffer())
    .then(function(data) {
      filled_pdf = pdfform().transform(data, postponedhFields);
      var blob = new Blob([filled_pdf], {type: 'application/pdf'})
      var reader = new FileReader();
      reader.readAsBinaryString(blob);
      reader.onload = function(e) {
         var base64Str = btoa(e.target.result);
         var obj = {};
         obj['tempdoc'] = base64Str;
         obj['dhnumber'] = currenthearingno

         // console.log(obj)
         fetch('http://localhost:3000/uploadpostponedhfile/', {
                     method: 'post',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify(obj)
                      })
            .then(res => {
            // console.log("Completed Warning File Uploaded to Server")
            document.getElementById('postponedhBox').innerHTML += '<a id="viewpostponement'+currenthearingno+'" href="http://localhost:3000/dhtabletempfilebacks/'+currenthearingno+'" target="_blank"></a>';
            var a = document.getElementById('viewpostponement'+currenthearingno);
            a.click();

          });
        };
      });
    };
    // fetches empty postponement dh doc form server, populates it with postponedhFields and
    // creates new postponement file  and saves it to dhtable in tempdoc and retrieves it back
    // and opend the file in a new window
    function printnoticeofdh(currenthearingno, noofcharges, dhFields){
      // var currenthearingno = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
      // console.log('dh file requested froe server is: '+currenthearingno)
      fetch("http://localhost:3000/getnoticeofdh"+noofcharges)
      .then((resp) => resp.arrayBuffer())
      .then(function(data) {
        filled_pdf = pdfform().transform(data, dhFields);
        var blob = new Blob([filled_pdf], {type: 'application/pdf'})
        var reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = function(e) {
           var base64Str = btoa(e.target.result);
           var obj = {};
           obj['tempdoc'] = base64Str;
           obj['dhnumber'] = currenthearingno

           // console.log(obj)
           fetch('http://localhost:3000/uploadnoticeofdhfile/', {
                       method: 'post',
                       headers: {'Content-Type': 'application/json'},
                       body: JSON.stringify(obj)
                        })
              .then(res => {
              // console.log("Completed Warning File Uploaded to Server")
              document.getElementById('postponedhBox').innerHTML += '<a id="viewnoticeofdh'+currenthearingno+'" href="http://localhost:3000/dhtabletempfilebacks/'+currenthearingno+'" target="_blank"></a>';
              var a = document.getElementById('viewnoticeofdh'+currenthearingno);
              a.click();

            });
          };
        });
      };
tempdocfiles = {};
globalS = {};

function getbranchdeptjobt(){
  currentemployerno = 0001
  fetch('http://localhost:3000/getbranchdeptjobt/'+currentemployerno, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       var k = "";
       var n = '<option value="">choose...</option>';
       var q = '<option value="">branch...</option>';
       for(i = 0;i < data[0].branches.length; i++){
       k+= '<li onclick="branchclickmenu(Branch'+i+')" class="test2" value="'+data[0].branches[i]+'" id="Branch'+i+'"><i class="fa fa-bars"></i><a>'+data[0].branches[i]+'</a></li>';
       n+= '<option>'+data[0].branches[i]+'</option>';
       q+= '<option>'+data[0].branches[i]+'</option>';
       };
       document.getElementById('branchcontainer').innerHTML = k;
       document.getElementById('branch').innerHTML = n;
       document.getElementById('filterbranchselect').innerHTML = q;
       var l = "";
       var o = "<option value=''>choose...</option>";
       var r = '<option value="">department...</option>';
       for(i = 0;i < data[0].departments.length; i++){
       l+= '<li onclick="departmentclickmenu(Department'+i+')" class="test2" value="'+data[0].departments[i]+'" id="Department'+i+'"><i class="fa fa-bars"></i><a>'+data[0].departments[i]+'</a></li>';
       o+= '<option>'+data[0].departments[i]+'</option>'
       r+= '<option>'+data[0].departments[i]+'</option>'
       };
       document.getElementById('departmentcontainer').innerHTML = l;
       document.getElementById('department').innerHTML = o;
       document.getElementById('filterdepartmentselect').innerHTML = r;
       var m = "";
       var p = "<option value=''>choose...</option>";
       var s = '<option value="">job title...</option>';
       for(i = 0;i < data[0].jobtitles.length; i++){
       m+= '<li onclick="jobtitleclickmenu(Jobtitle'+i+')" class="test2" value="'+data[0].jobtitles[i]+'" id="Jobtitle'+i+'"><i class="fa fa-bars"></i><a>'+data[0].jobtitles[i]+'</a></li>';
       p+= '<option>'+data[0].jobtitles[i]+'</option>';
       s+= '<option>'+data[0].jobtitles[i]+'</option>';
       };
       document.getElementById('jobtitlecontainer').innerHTML = m;
       document.getElementById('jobtitle').innerHTML = p;
       document.getElementById('filterjobtitleselect').innerHTML = s;
});
};

function dateCompare(date1, date2){
    return new Date(date2) > new Date(date1);
}

// Warnings Tab Javascript - STARTS
function getwarnings() {
    var currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid");
    currentWarningcards = [];
    fetch('http://localhost:3000/getwarnings/'+ currentemployeeno, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        // console.log('getting warnings for '+ currentemployeeno)
        var kk = ''
        document.getElementById('cardcontainer').innerHTML = ''
        if (data.length === 0){
          kk = '<div class="card-header card col-sm-12 col-xs-12"><div class="row"><div class="col-xs-12"></div><div class="col-xs-12 text-center"><strong>No Warnings Found</strong></div><div class="col-xs-12"></div></div></div>';
        } else {

        for(i = 0;i < data.length; i++){
              currentWarningcards.push("card"+data[i].warningno)
              if (data[i].warningtype === 'FWW'){data[i].warningtype = "Final Written Warning"}
              if (data[i].warningtype === 'WW'){data[i].warningtype = "Written Warning"}
              if (data[i].warningtype === 'VW'){data[i].warningtype = "Verbal Warning"}
              data[i].status = ""
              var date1 = data[i].warninglapsdate
              var date2 = Date.today()
              if (dateCompare(date1, date2) === true) {data[i].status = 'Inactive'}
              if (dateCompare(date1, date2) != true) {data[i].status = 'Active'}
              var k =  '<div warningno="'+data[i].warningno+'" oldwarning="'+data[i].oldwarning+'" warningfile="'+data[i].warningfile+'" onclick="warningclickmenu(card'+data[i].warningno+')" id="card'+data[i].warningno+'" class="card col-sm-12" style="">'
              k+=  '<div class="card-header"><div class="container"><div class="row">'
              k+=  '<div class="col-sm-5 text-left"><strong>'+data[i].warningtype+'</strong></div>'
              k+=  '<div class="col-sm-4 text-left"><strong>'+data[i].misconductdate+'</strong></div>'
              k+=  '<div class="col-sm-3 text-left"><strong>Status: '+data[i].status+'</strong></div></div></div></div>'
              k+=  '<div class="container card-body text-dark"><div class="row"><div class="col-sm-12 card-border-right">'
              k+=  '<div class="row"><div class="col-sm-6 card-border-right" style="padding: 0px 10px 0px 10px">'
              k+=  '<p class="card-text1"><strong>Misconduct:</strong></p><p class="card-text2">'+data[i].misconducttype+'</p>'
              k+=  '</div><div class="col-sm-3 text-left card-border-right" style="padding: 0px 10px 0px 10px">'
              k+=  '<p class="card-text1"><strong>Warning Duration:</strong></p><p class="card-text2">'+data[i].warningduration+' Months'+'</p>'
              k+=  '</div><div class="col-sm-3 text-left" style="padding: 0px 10px 0px 10px"><p class="card-text1"><strong>Warning Lapse Date:</strong></p>'
              k+=  '<p class="card-text2">'+data[i].warninglapsdate+'</p></div></div></div></div></div></div>'
                 kk+= k;
        };
        }
        document.getElementById('cardcontainer').innerHTML = kk;
        // console.log(currentWarningcards)
      });
}




var selectedWarningCurrent = "";
var selectedWarningNext = "";

function warningclickmenu(cardnum){
  // viewWarningBoxClose()
  if (selectedWarningCurrent != "") {
    document.getElementById(selectedWarningCurrent).className = "card col-sm-12";
  };
  selectedWarningNext = cardnum.id;
  document.getElementById(selectedWarningNext).className = "card-active col-sm-12";
  selectedWarningCurrent = selectedWarningNext;
  selectedWarningNext = "";
};


// DH Charges Clickmenu
var selectedChargeCurrent = "";
var selecteChargeNext = "";

function chargeclickmenu(cardnum){
  if (selectedChargeCurrent != "") {
    document.getElementById(selectedChargeCurrent).className = "dhcharge row test col-md-12 col-sm-12 col-xs-12";
  };
  selectedChargeNext = cardnum;
  document.getElementById(selectedChargeNext).className = "dhcharge-active row test col-md-12 col-sm-12 col-xs-12";
  selectedChargeCurrent = selectedChargeNext;
  selectedChargeNext = "";
};
var selectedBranchCurrent = "";
var selectedBranchNext = "";
function branchclickmenu(cardnum){
  if (selectedBranchCurrent != "") {
    document.getElementById(selectedBranchCurrent).className = "test2";
  };
  selectedBranchNext = cardnum.id;
  document.getElementById(selectedBranchNext).className = "test3";
  selectedBranchCurrent = selectedBranchNext;
  selectedBranchNext = "";
};
var selectedDepartmentCurrent = "";
var selectedDepartmentNext = "";
function departmentclickmenu(cardnum){
  // viewWarningBoxClose()
  if (selectedDepartmentCurrent != "") {
    document.getElementById(selectedDepartmentCurrent).className = "test2";
  };
  selectedDepartmentNext = cardnum.id;
  document.getElementById(selectedDepartmentNext).className = "test3";
  selectedDepartmentCurrent = selectedDepartmentNext;
  selectedDepartmentNext = "";
};
var selectedJobtitleCurrent = "";
var selectedJobtitleNext = "";
function jobtitleclickmenu(cardnum){
  // viewWarningBoxClose()
  if (selectedJobtitleCurrent != "") {
    document.getElementById(selectedJobtitleCurrent).className = "test2";
  };
  selectedJobtitleNext = cardnum.id;
  document.getElementById(selectedJobtitleNext).className = "test3";
  selectedJobtitleCurrent = selectedJobtitleNext;
  selectedJobtitleNext = "";
};
// WARNINGS TAB Bottom Submenus
newwarning = {};

function issueNewWarning() {
if (selectedEMPCurrent === "") {alert("Please pick an Employee first")} else {
  // console.log(currentWarningcards)
  document.getElementById("viewWarningBox").className = "newWarningIssueBox";
  document.getElementById("oldexistingWarningBox").className = "newWarningIssueBox";
  document.getElementById("issueNewWarningBox").className = "newWarningIssueBox-active";
  document.getElementById("warningtabbuttons").style.display = 'none';
  for(i = 0;i < currentWarningcards.length; i++) {document.getElementById(currentWarningcards[i]).style.display = 'none'}
                                                                              }
};


function oldexistingWarningBox() {
if (selectedEMPCurrent === "") {alert("Please pick an Employee first")} else {
  document.getElementById("viewWarningBox").className = "newWarningIssueBox";
  document.getElementById("issueNewWarningBox").className = "newWarningIssueBox";
  document.getElementById("oldexistingWarningBox").className = "newWarningIssueBox-active";
  document.getElementById("warningtabbuttons").style.display = 'none';
  for(i = 0;i < currentWarningcards.length; i++) {document.getElementById(currentWarningcards[i]).style.display = 'none'}
                                                                              }

};

function issueNewWarningCancel(){
  document.getElementById("warningtabbuttons").style.display = '';
  for(i = 0;i < currentWarningcards.length; i++){document.getElementById(currentWarningcards[i]).style.display = ''}
  document.getElementById("issueNewWarningBox").className = "newWarningIssueBox";
};
function oldexistingWarningBoxCancel(){
  document.getElementById("warningtabbuttons").style.display = '';
  for(i = 0;i < currentWarningcards.length; i++){document.getElementById(currentWarningcards[i]).style.display = ''}
  document.getElementById("oldexistingWarningBox").className = "newWarningIssueBox";
};


function viewWarningBox() {
  if (selectedWarningCurrent === "") {alert("Please select warning first")} else {
    var warningfile = document.getElementById(selectedWarningCurrent).getAttribute("warningfile");
    var warnno = document.getElementById(selectedWarningCurrent).getAttribute("warningno");
    // console.log(warningfile);
    var k = ''
    k+='<div class="row"><div class="col-md-1 col-sm-1 col-xs-1"></div>'
    k+='<div align="center" id="viewwarning'+warnno+'" onclick="window.open('+"'http://localhost:3000/warningfilebacks/"+warnno+"'"+", '_blank');"+'"'+"class='row test col-md-4 col-sm-4 col-xs-4' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;'>"
    k+='<div style="padding-left: 6px; padding-right: 2px">Warning (blank)</div></div>'
    k+='<div align="center" id="viewscannedbackwarning'+warnno+'" onclick="window.open('+"'http://localhost:3000/compwarningfilebacks/"+warnno+"'"+", '_blank');"+'"'+"class='row test col-md-4 col-sm-4 col-xs-4' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 9px; margin-left: 40px; margin-right: 0px;'>"
    k+='<div style="padding-left: 6px; padding-right: 2px">Warning (scanned back)</div></div>'

    document.getElementById('viewwarningbox').innerHTML = k
    // document.getElementById('viewwarningbox').innerHTML = '<a id="viewscannedbackwarning'+warnno+'" href="http://localhost:3000/warningfilebacks/'+warnno+'" target="_blank" style="border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;">Click to view: Served Warning</a>';
    // document.getElementById('viewwarningbox').innerHTML += '<a id="viewwarning'+warnno+'" href="http://localhost:3000/compwarningfilebacks/'+warnno+'" target="_blank" style="border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;">Click to view: Origional Warning</a>'
    var warningfile = document.getElementById(selectedWarningCurrent).getAttribute("warningfile");
    // console.log(warningfile)
    if (warningfile != 'true') {
        console.log("warningfile == false")
        // document.getElementById('viewscannedbackwarning'+warnno+'').onclick = console.log('open upload warning box');
        document.getElementById('viewscannedbackwarning'+warnno+'').setAttribute("onclick", "javascript: runmodal3();")
        document.getElementById('viewscannedbackwarning'+warnno+'').innerHTML = 'click to scan back served warning'
                                }

    var oldwarning = document.getElementById(selectedWarningCurrent).getAttribute("oldwarning");
    if (oldwarning === 'true'){
        console.log("oldwarning == true")
        document.getElementById('viewwarning'+warnno+'').setAttribute("onclick", "")
        document.getElementById('viewwarning'+warnno+'').innerHTML = 'Old Warning - No Document Available'
                              }
    document.getElementById("warningtabbuttons").style.display = 'none';
    // document.getElementById('viewwarningbox').innerHTML = '';
    // console.log(currentWarningcards)
    for(i = 0;i < currentWarningcards.length; i++){
      if (selectedWarningCurrent != currentWarningcards[i]) {document.getElementById(currentWarningcards[i]).style.display = 'none'}}
    document.getElementById("issueNewWarningBox").className = "newWarningIssueBox";
    document.getElementById("oldexistingWarningBox").className = "newWarningIssueBox";
    document.getElementById("viewWarningBox").className = "newWarningIssueBox-active";
  }

  };

function viewWarningBoxClose(){
  // console.log(currentWarningcards)
  document.getElementById("warningtabbuttons").style.display = '';
  for(i = 0;i < currentWarningcards.length; i++){document.getElementById(currentWarningcards[i]).style.display = ''}
  document.getElementById("viewWarningBox").className = "newWarningIssueBox";
};

// DH TAB Bottom Submenus
function viewdhdocsBox() {
  if (selectedDHCurrent === ""){alert("Please pick an Disiplinary hearing first")} else {
  document.getElementById("dhtabbuttons").style.display = 'none';
  viewDHdocs();
  document.getElementById("postponedhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox";
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhdocsBox").className = "newWarningIssueBox-active";
  // console.log(currentDHcards)
  for(i = 0;i < currentDHcards.length; i++){
    if (selectedDHCurrent != currentDHcards[i]) {document.getElementById(currentDHcards[i]).style.display = 'none'}
  }
}
};

function issuenewdhBox() {
  if (selectedEMPCurrent === ""){alert("Please pick an Employee first")} else {
  document.getElementById("postponedhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhdocsBox").className = "newWarningIssueBox";
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox";
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox-active";
  document.getElementById("dhtabbuttons").style.display = 'none';
  for(i = 0;i < currentDHcards.length; i++) {document.getElementById(currentDHcards[i]).style.display = 'none'}
}
};
function learnmisconductBoxOpen() {
  document.getElementById("learnmisconductBox").className = "newWarningIssueBox-active";
  document.getElementById("learnmisonductdesc").style.display = 'none';
  document.getElementById("learnmisconductselector").style.display = 'none';
  var heading = '<strong>'+document.getElementById('learnmisconducttype').value+'</strong>'
  document.getElementById('learnmisconductBox-heading').innerHTML = heading
};

function learnmisconductBoxClose() {
  document.getElementById("learnmisconductBox").className = "newWarningIssueBox";
  document.getElementById("learnmisonductdesc").style.display = '';
  document.getElementById("learnmisconductselector").style.display = '';
  document.getElementById('learnmisconducttype').value = "select"
};
function learnfixedchargeBoxOpen() {
  document.getElementById("learnfixedchargeBox").className = "newWarningIssueBox-active";
  document.getElementById("fixedchargedesc").style.display = 'none';
  document.getElementById("learnfixedchargeselector").style.display = 'none';
  var heading = '<strong>'+document.getElementById('learnfixedcharge').value+'</strong>'
  document.getElementById('learnfixedcharge-heading').innerHTML = heading
};

function learnfixedchargeBoxClose() {
  document.getElementById("learnfixedchargeBox").className = "newWarningIssueBox";
  document.getElementById("fixedchargedesc").style.display = '';
  document.getElementById("learnfixedchargeselector").style.display = '';
  document.getElementById('learnfixedcharge').value = "select"
};





function viewdhdocsBoxClose(){
  document.getElementById("viewdhdocsBox").className = "newWarningIssueBox";
  document.getElementById("dhtabbuttons").style.display = '';
  for(i = 0;i < currentDHcards.length; i++){document.getElementById(currentDHcards[i]).style.display = ''}
};
function postponedhBoxClose(){
  document.getElementById("dhtabbuttons").style.display = '';
  for(i = 0;i < currentDHcards.length; i++){document.getElementById(currentDHcards[i]).style.display = ''}
  document.getElementById("postponedhBox").className = "newWarningIssueBox";
};

function issuenewdhBoxClose(){
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox";
  document.getElementById("dhtabbuttons").style.display = '';
  for(i = 0;i < currentDHcards.length; i++){document.getElementById(currentDHcards[i]).style.display = ''}
};

function viewdhoutcomeBox() {
if (selectedDHCurrent === "") {alert("Please pick an Disciplinary Hearing first")} else {
  if (document.getElementById(selectedDHCurrent).getAttribute("outcomesubmitted") === 'true'){runmodal5()} else {
  alldhboxesclose();
  pupulatedhinsertoutcome();
  document.getElementById("dhtabbuttons").style.display = 'none';
  document.getElementById("postponedhBox").className = "newWarningIssueBox";
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox-active";
  for(i = 0;i < currentDHcards.length; i++){
    if (selectedDHCurrent != currentDHcards[i]) {document.getElementById(currentDHcards[i]).style.display = 'none'}
  }}
}
}

function postponedhBox() {
if (selectedDHCurrent === "") {alert("Please pick an Disciplinary Hearing first")} else {
  alldhboxesclose();
  document.getElementById("dhtabbuttons").style.display = 'none';
  document.getElementById("postponedhBox").className = "newWarningIssueBox";
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox";
  document.getElementById("postponedhBox").className = "newWarningIssueBox-active";
  for(i = 0;i < currentDHcards.length; i++){
    if (selectedDHCurrent != currentDHcards[i]) {document.getElementById(currentDHcards[i]).style.display = 'none'}
  }
}
}

function resubmitoutcome(){
  alldhboxesclose();
  pupulatedhinsertoutcome();
  document.getElementById("dhtabbuttons").style.display = 'none';
  document.getElementById("issuenewdhBox").className = "newWarningIssueBox";
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox-active";
  for(i = 0;i < currentDHcards.length; i++){
    if (selectedDHCurrent != currentDHcards[i]) {document.getElementById(currentDHcards[i]).style.display = 'none'}
}
  closemodal5()
};
function viewdhoutcomeBoxClose(){
  document.getElementById("dhtabbuttons").style.display = '';
  document.getElementById("viewdhoutcomeBox").className = "newWarningIssueBox";
  if (currentDHcards.length != 0){for(i = 0;i < currentDHcards.length; i++){document.getElementById(currentDHcards[i]).style.display = ''};}

};

function getlapsedate(){
var warningduration = String(document.getElementById("warningduration").value);
if (warningduration == 12){
document.getElementById("warninglapsedate").value = Date.today().add(12).months().toString('yyyy/M/d');
} else {
document.getElementById("warninglapsedate").value = Date.today().add(6).months().toString('yyyy/M/d');
}
};
function getlapsedateA(){
var warningduration = String(document.getElementById("Awarningduration").value);
var miscdate = document.getElementById('Amisconductdate').value
var d = new Date(miscdate);
if (warningduration == 12){d.setMonth(d.getMonth() + 12)
document.getElementById("Awarninglapsedate").value = d.toString('yyyy/M/d')
} else {d.setMonth(d.getMonth() + 6)
document.getElementById("Awarninglapsedate").value = d.toString('yyyy/M/d')
}
};

function alldhboxesclose(){
  viewdhoutcomeBoxClose();
  issuenewdhBoxClose();
  viewdhdocsBoxClose();
  postponedhBoxClose();
}

function allwarningboxesclose(){
  viewWarningBoxClose()
  oldexistingWarningBoxCancel()
  issueNewWarningCancel()
}
// EMP Tab Javascript - STARTS
var selectedEMPCurrent = "";
var selectedEMPNext = "";

function EMPclickmenu(cardnum){
  currentDHcards = []
  currentWarningcards = []
  alldhboxesclose()
  allwarningboxesclose()

  // var currentWarningcards = []
  if (selectedEMPCurrent != "") {
    document.getElementById(selectedEMPCurrent).className = "card col-sm-12";
  };
  selectedEMPNext = cardnum.id;
  // console.log("EMPclickmenu: selectedEMPNext= "+selectedEMPNext)
  document.getElementById(selectedEMPNext).className = "card-active col-sm-12";
  selectedEMPCurrent = selectedEMPNext;
  selectedEMPNext = "";
  selectedWarningCurrent = "";
  selectedDHCurrent = "";
  selectedGRCurrent = "";
  selectedILLCurrent = "";
  selectedPWPCurrent = '';
  getemployeedetails();
  if (document.getElementById('Tab5').style.display === "block") {getwarnings(); pupulatedhcontainer()};
  // get ill healths
  // get Grievance
  // get pwp
};
// EMP Tab Javascript - ENDS

// DH Tab Javascript - STARTS
var selectedDHCurrent = "";
var selectedDHNext = "";

function DHclickmenu(cardnum){
  if (selectedDHCurrent != "") {
    document.getElementById(selectedDHCurrent).className = "card col-sm-12";
  };
  selectedDHNext = cardnum.id;
  document.getElementById(selectedDHNext).className = "card-active col-sm-12";
  selectedDHCurrent = selectedDHNext;
  selectedDHNext = "";
  alldhboxesclose()
};
// DH Tab Javascript - ENDS

// Lablib Tab Javasctipt STARTS
var selectedLablibCurrent = "";
var selectedLablibNext = "";

function Lablibclickmenu(cardnum){
  if (selectedLablibCurrent != "") {
    document.getElementById(selectedLablibCurrent).className = "card col-sm-12";
  };
  selectedLablibNext = cardnum.id;
  document.getElementById(selectedLablibNext).className = "card-active col-sm-12";
  selectedLablibCurrent = selectedLablibNext;
  selectedLablibNext = "";
};
// Lablib Tab Javasctipt STARTS

// PWP Tab Javascript - STARTS
var selectedPWPCurrent = "";
var selectedPWPNext = "";

function PWPclickmenu(cardnum){
  if (selectedPWPCurrent != "") {
    document.getElementById(selectedPWPCurrent).className = "card col-sm-12";
  };
  selectedPWPNext = cardnum.id;
  document.getElementById(selectedPWPNext).className = "card-active col-sm-12";
  selectedPWPCurrent = selectedPWPNext;
  selectedPWPNext = "";
};
// PWP Tab Javascript - ENDS

// ILL Health Tab Javascript - STARTS
var selectedILLHCurrent = "";
var selectedILLHNext = "";

function ILLHclickmenu(cardnum){
  if (selectedILLHCurrent != "") {
    document.getElementById(selectedILLHCurrent).className = "card col-sm-12";
  };
  selectedILLHNext = cardnum.id;
  document.getElementById(selectedILLHNext).className = "card-active col-sm-12";
  selectedILLHCurrent = selectedILLHNext;
  selectedILLHNext = "";
};
// ILL HEALTH Tab Javascript - ENDS

// GRIEVANCE Health Tab Javascript - STARTS
var selectedGRCurrent = "";
var selectedGRNext = "";

function GRclickmenu(cardnum){
  if (selectedGRCurrent != "") {
    document.getElementById(selectedGRCurrent).className = "card col-sm-12";
  };
  selectedGRNext = cardnum.id;
  document.getElementById(selectedGRNext).className = "card-active col-sm-12";
  selectedGRCurrent = selectedGRNext;
  selectedGRNext = "";
};
// GRIEVANVE HEALTH Tab Javascript - ENDS

// Fetch misconducttype and fixed charge discritions from Server and populates New Warning dropdowns
function getcontractoptionnames(){
  contractname = document.getElementById('contractname').value
  fetch('http://localhost:3000/getcontractoptionnames/'+contractname, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {

       var kk = "<option>choose option</option>";
       var k = "";
       // console.log(data)
       // console.log(data.length)

               for(i = 0; i < data.length; i++){
                  // console.log(data[i].options.length)
                  if (data[i].length != 'null'){
                      // console.log("i is op oomblik= "+i)
                       for(j = 0; j < data[i].options.length; j++){
                        k+= '<option>'+data[i].options[j]+'</option>';
                        };
                   }
               }
               kk+= k;
               document.getElementById('contoptionname').innerHTML = kk;

});
};

// Fetch misconducttype and fixed charge discritions from Server and populates New Warning dropdowns
function getmisconducttype(){
  fetch('http://localhost:3000/misconducttype/', {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data[0].misconducttype)
       var kk = "<option>select</option>";
       var k = "";
       // // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].misconducttype+'</option>';

       };
       kk+= k;
       document.getElementById('misconducttype').innerHTML = kk;
});
};

function getmisconducttypeA(){
  fetch('http://localhost:3000/misconducttype/', {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data[0].misconducttype)
       var kk = "<option>select</option>";
       var k = "";
       // // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].misconducttype+'</option>';

       };
       kk+= k;
       document.getElementById('Amisconducttype').innerHTML = kk;
});
};
function dhmisconducttype(){
  fetch('http://localhost:3000/misconducttype/', {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data[0].misconducttype)
       var kk = "<option>select</option>";
       var k = "";
       // // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].misconducttype+'</option>';

       };
       kk+= k;
       document.getElementById('dhmisconducttype').innerHTML = kk;
});
};
function getmisconducttypeB(){
  fetch('http://localhost:3000/misconducttype/', {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data[0].misconducttype)
       var kk = "<option>select</option>";
       var k = "";
       // // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].misconducttype+'</option>';

       };
       kk+= k;
       document.getElementById('learnmisconducttype').innerHTML = kk;
});
};

function getfixedchargedesc(){
  var tempmisconducttype = document.getElementById('misconducttype').value;
  fetch('http://localhost:3000/fixedchargedesc/' + tempmisconducttype, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = "<option>select</option>";
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].fixedchargedescription+'</option>';
       };
       kk+= k;
       document.getElementById('chargefixeddescription').innerHTML = kk;
});
};

function getfixedchargedescA(){
  var tempmisconducttype = document.getElementById('Amisconducttype').value;
  fetch('http://localhost:3000/fixedchargedesc/' + tempmisconducttype, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = "<option>select</option>";
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].fixedchargedescription+'</option>';
       };
       kk+= k;
       document.getElementById('Achargefixeddescription').innerHTML = kk;
});
};
function dhfixedchargedesc(){
  var tempmisconducttype = document.getElementById('dhmisconducttype').value;
  fetch('http://localhost:3000/fixedchargedesc/' + tempmisconducttype, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = "<option>select</option>";
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].fixedchargedescription+'</option>';
       };
       kk+= k;
       document.getElementById('dhfixedchargedesc').innerHTML = kk;
});
};
function dhfixedchargedescB(){
  console.log('fixed charge started')
  var tempmisconducttype = document.getElementById('learnmisconducttype').value;
  fetch('http://localhost:3000/fixedchargedesc/' + tempmisconducttype, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = "<option>select</option>";
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].fixedchargedescription+'</option>';
       };
       kk+= k;
       document.getElementById('learnfixedcharge').innerHTML = kk;
});
};

// Gets list of ee names and provides it to the seclect emm input on Add New Document TabB1
function getees(){
  var currentemployerno = '0001'
  fetch('http://localhost:3000/employeelist/' + currentemployerno, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = '<option value="" selected>choose...</option>';
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option>'+data[i].name+' '+data[i].surname+'</option>';
       };
       kk+= k;
       document.getElementById('employeename_doc').innerHTML = kk;

});
};

function sumbmitoldwarning(){
  if (document.getElementById("Amisconducttype").value === 'select'||document.getElementById("Amisconductdate").value === ''||
      document.getElementById("Achargefixeddescription").value === 'select'||document.getElementById("Awarningduration").value === '') {
      alert("Please complete all the fields")} else {

      uploadwarningdata(document.getElementById(selectedEMPCurrent).getAttribute("employeeid"),
                        document.getElementById("Amisconducttype").value,document.getElementById("Achargefixeddescription").value,
                        document.getElementById("Awarningtype").value,
                        document.getElementById("Amisconductdate").value,
                        document.getElementById("Achargedescription").value,
                        document.getElementById("Awarningduration").value,
                        document.getElementById("Awarninglapsedate").value,
                        true);
      document.getElementById("oldexistingWarningBox").className = "newWarningIssueBox";
      getwarnings()
      clearwarningfields();
      // setTimeout(clickcurrentemployeecard, 50);
      // document.getElementById(selectedEMPCurrent).click();

  }
}

// Issue Warning Button
function issuewarningbuton(){
  if (document.getElementById("misconducttype").value === 'select'||document.getElementById("misconductdate").value === ''||
      document.getElementById("chargefixeddescription").value === 'select'||document.getElementById("warningduration").value === '') {
      alert("Please complete all the fields")
    } else {
      globalS.misconducttype = document.getElementById("misconducttype").value;
      globalS.chargefixeddescription = document.getElementById("chargefixeddescription").value;
      globalS.warningtype = document.getElementById("warningtype").value;
      globalS.misconductdate = document.getElementById("misconductdate").value;
      globalS.chargedescription = document.getElementById("chargedescription").value;
      globalS.warningduration = document.getElementById("warningduration").value;
      globalS.warninglapsedate = document.getElementById("warninglapsedate").value;
      globalS.employeename = document.getElementById(selectedEMPCurrent).innerHTML;
      globalS.idnumber = document.getElementById(selectedEMPCurrent).getAttribute("idnumber");
      globalS.employeeid = document.getElementById(selectedEMPCurrent).getAttribute("employeeid");
      globalS.reccommendation = '';
      detirminecorrectsanction(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype);
      // console.log(globalS);
    }
  };

function runcorrectmodal(){
      if (globalS.reccommendation === globalS.warningtype) {
                console.log(globalS.warningtype + " Issued");
                uploadwarningdata(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype,globalS.misconductdate,
                globalS.chargedescription,globalS.warningduration,globalS.warninglapsedate, false);
                var date = globalS.misconductdate
                var datea = new Date(date).toString('d MMM yyyy');
                var date2 = globalS.warninglapsedate
                var dateb = new Date(date2).toString('d MMM yyyy');

                warningFields = {
                EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
                EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
                OffenceDate: [datea],
                CombinedDescription: [globalS.chargefixeddescription+" "+globalS.chargedescription],
                LapseMonths: [globalS.warningduration],
                LapseDate: [dateb],
                warningtype: [globalS.warningtype],
                };
                printWarning();
                clearwarningfields();
                setTimeout(clickcurrentemployeecard, 50);
                // document.getElementById(selectedEMPCurrent).click();
            }
      else if (globalS.reccommendation === "VW") {
            // console.log("popup box 1 must be used");
            runmodal();
          }
      else if (globalS.reccommendation === "WW") {
            // console.log("popupbox 1 must be used");
            runmodal();
          }
      else if (globalS.reccommendation === "FWW") {
            // console.log("popupbox 1 must be used");
            runmodal();
          }
      else if (globalS.reccommendation === "DH") {
            // console.log("popupbox 2 must be used");
            runmodal1();
          }

};
// get labour library docuemnts from Server
function getlablibdocs(){
  var section = document.getElementById(selectedLablibCurrent).getAttribute("documentsection")
  console.log(section);
  fetch('http://localhost:3000/getlablibdocs/' + section, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       var kk = "";
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
       k+= '<a href="http://localhost:3000/labourlibdocsback/'+data[i].documentnumber+'" target="_blank"><h5>'+data[i].documentname+'</h5></a>';
       //
       };
       kk+= k;
       document.getElementById('documentcontainer').innerHTML = kk;
});
}

// get labour library docuemnts from Server
function getdocuments(){
  currentemployerno = '0001'
  fetch('http://localhost:3000/getdocuments/' + currentemployerno, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       let kk = "";
       let k = "";
       k =    '<div class="x_title"><h2>Documents</h2><div class="clearfix"></div></div><div class="row" style="margin-left: 0px; margin-right: 0px">'
       k+=    '<div class="col-md-1 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Date</strong></h5></div>'
       k+=    '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Type</strong></h5></div>'
       k+=    '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Description</strong></h5></div>'
       k+=    '<div class="col-md-3 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Subject</strong></h5></div>'
       k+=    '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Created By</strong></h5></div>'
       k+=    '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px"><h5><strong>Employee Name</strong></h5></div></div>'
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
         kk+=  '<div onclick='+'"window.open('+"'http://localhost:3000/documentfilebacks/"+data[i].docnumber+"'"+",'"+"_blank');"+'"'+'class="row test" style="border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;">'
         kk+=  '<div class="col-md-1 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px">'+data[i].date+'</div>'
         kk+=  '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px" >'+data[i].doctype+'</div>'
         kk+=  '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px" >'+data[i].docdescription+'</div>'
         kk+=  '<div class="col-md-3 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px" >'+data[i].docsubject+'</div>'
         kk+=  '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px" >'+data[i].createdby+'</div>'
         kk+=  '<div class="col-md-2 col-sm-10 col-xs-9" style="padding-left: 6px; padding-right: 2px" >'+data[i].employeename+'</div></div>'
       //
       };
       k+= kk;
       document.getElementById('documentspage').innerHTML = k;
});
}

// Posts INFO to Server to detirmine correct sanction
function detirminecorrectsanction(employeeidA,misconducttypeA,fixedchargedescriptionA,wanttoissueA){
  fetch('http:/localhost:3000/detirminecorrectsanction', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          employeeid: employeeidA,
          misconducttype: misconducttypeA,
          currentdate: Date.today().toString('yyyy/M/d'),
          fixedchargedescription: fixedchargedescriptionA,
          wanttoissue: wanttoissueA,
        })
        })
        .then(response => response.json())
        .then(function(data) {
              // console.log("Sanction details sent")
              // console.log(data[0].suggestedoutcome)
              globalS.reccommendation = data[0].suggestedoutcome
              console.log('globalS.reccommendation = '+globalS.reccommendation)
            })
        .then(function(data) {
          runcorrectmodal();
            })
};

// uploads new warning data to server
function uploadwarningdata(employeeidA,misconducttypeA,chargefixeddescriptionA,warningtypeA,
  misconductdateA,chargedescriptionA,warningdurationA,warninglapsdateA,oldwarningA){
  fetch('http:/localhost:3000/uploadwarningdata', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          employeeid: employeeidA,
          misconducttype: misconducttypeA,
          chargefixeddescription: chargefixeddescriptionA,
          warningtype: warningtypeA,
          misconductdate: misconductdateA,
          chargedescription: chargedescriptionA,
          warningduration: warningdurationA,
          warninglapsdate: warninglapsdateA,
          oldwarning: oldwarningA,
                  })
        })
        .then(response => response.json())
        .then(function(data) {
            // console.log("response form server op upload of warning data: "+data.warningno)
            globalS.warnno = data.warningno['0']
        console.log("Warning Data Uploaded to DB. Warning No:"+globalS.warnno)
        // console.log(res)
      })
      setTimeout(clickcurrentemployeecard, 50);
};

// Delete waring from DB
function deletewarningfrombd(){
  if (selectedWarningCurrent === "") {alert("Please select a Warning first")} else {
    var warningno = document.getElementById(selectedWarningCurrent).getAttribute("warningno");
           fetch('http://localhost:3000/deletewarning/' + warningno, {
                           method: 'post',
                           headers: {'Content-Type': 'application/json'},
                  })
                  .then(res => {
                  console.log("Warning "+warningno+" Deleted from Server")
                  // getwarnings()
                  console.log(res.status)
                  setTimeout(clickcurrentemployeecard, 50)
                   });
    selectedWarningCurrent = "";

}
}
// Delete Disciplinary Hearing from DB
function deletedh(){
  if (selectedDHCurrent === "") {alert("Please select a Disciplinary Hearing first")} else {
    var hearingno = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
           fetch('http://localhost:3000/deletedh/' + hearingno, {
                           method: 'post',
                           headers: {'Content-Type': 'application/json'},
                  })
                  .then(res => {
                  console.log("Disciplinary Hearing No "+hearingno+" deleted from Server")
                  // getwarnings()
                  console.log(res.status)
                   setTimeout(clickcurrentemployeecard, 50);
                   });

    selectedDHCurrent = "";
}
}

// uploads warning file to Serverfunction getempdetails2(){

 function uploadcompletedwarningdocument(){
     var warningno = document.getElementById(selectedWarningCurrent).getAttribute("warningno");
     var idfile = document.getElementById('uploadwarningfile').files[0];
                // create reader
                var reader = new FileReader();
                reader.readAsBinaryString(idfile);
                reader.onload = function(e) {
                // browser completed reading file - display it
                var base64Str = btoa(e.target.result);
                var obj = {};
                obj['warningno'] = warningno
                obj['compwarningstring'] = base64Str;
                fetch('http://localhost:3000/uploadcompletedwarning/', {
                            method: 'post',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(obj)
                   })
                   .then(res => {
                   console.log("Completed and Signed Warning File Uploaded to Server")
                   document.getElementById(selectedWarningCurrent).setAttribute("warningfile", true);
                   getwarnings();
                   viewWarningBoxClose();
                   viewWarningBox();
                   document.getElementById('viewwarningboxbutton').click()
                   console.log(res.status)
                    });
                  }

      let modal = document.getElementById('myModal3');
      modal.style.display = "none";
      document.getElementById('uploadwarningfile').value = '';

      ;

}
// Uploads Labour Library Document to server (currently for Achive Tab)
function submitlablibdoc(){
    var documentsection = document.getElementById('documentsection').value;
    var documentname = document.getElementById('documentname').value;
    var documentstring = document.getElementById('documentstring').files[0];
               // create reader
               var reader = new FileReader();
               reader.readAsBinaryString(documentstring);
               reader.onload = function(e) {
               // browser completed reading file - display it
               var base64Str = btoa(e.target.result);
               var obj = {};
               var documentstring = 'documentstring'
               obj[documentstring] = base64Str;
               obj['documentname'] = documentname;
               obj['documentsection'] = documentsection;
               console.log(obj);
               fetch('http://localhost:3000/uploadlablibdoc/', {
                           method: 'post',
                           headers: {'Content-Type': 'application/json'},
                           body: JSON.stringify(obj)
                  })
                  .then(res => {
                  console.log("Document File Uploaded to Server")
                  console.log(res.status)
                   });
                 }
                 document.getElementById('documentsection').value = '';
                 document.getElementById('documentname').value = '';
                 document.getElementById('documentstring').files[0] = '';
}

// Uploads new document to server and
function submitnewdoc(){
    var employerno = '0001'
    var doctype = document.getElementById('doctype').value;
    var docdescription = document.getElementById('docdescription').value;
    var docsubject = document.getElementById('docsubject').value;
    var createdby = "Current User"
    var docemployeename = document.getElementById('employeename_doc').value;
    var documentname = document.getElementById('documentname').value;
    var docstring = document.getElementById('docstring').files[0];
               // create reader
               var reader = new FileReader();
               reader.readAsBinaryString(docstring);
               reader.onload = function(e) {
               // browser completed reading file - display it
               var base64Str = btoa(e.target.result);
               var obj = {};
               obj['docstring'] = base64Str;
               obj['doctype'] = doctype;
               obj['docdescription'] = docdescription;
               obj['docsubject'] = docsubject;
               obj['employeename'] = docemployeename;
               obj['createdby'] = createdby;
               obj['date'] = Date.today();
               obj['employerno'] = employerno;
               console.log(obj);
               fetch('http://localhost:3000/submitnewdoc/', {
                           method: 'post',
                           headers: {'Content-Type': 'application/json'},
                           body: JSON.stringify(obj)
                  })
                  .then(res => {
                  console.log("Document File Uploaded to Server")
                  console.log(res.status)
                   });
                 }
}

// Fetch Employees from server And constructs EMPcards in EMPcardcontainer
function getemployees() {
    document.getElementById('EMPcardcontainer').innerHTML = '';
    var currentemployerno = '0001';
   fetch('http://localhost:3000/employeelist/'+ currentemployerno, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        // console.log(data)
        var kk = "";
        var p = "";
        var pp = '<option value="">choose...</option>';
        // Insert data into HTML Cards
        for(i = 0;i < data.length; i++){
          p+= '<option>'+data[i].name+' '+data[i].surname+'</option>'
          var k = '<div name="'+data[i].name+'" surname="'+data[i].surname+'" employeeid="'+data[i].employeeid+'" idnumber="'+data[i].idnumber+'" address="'+data[i].address+'" jobtitle="'+data[i].jobtitle+'" onclick="EMPclickmenu(EMPcard'+data[i].employeeid+')" id="EMPcard'+data[i].employeeid+'" class="card col-sm-12" ';
           k+= 'style="padding-top: 2px; padding-right: 3px; padding-bottom: 2px; padding-left: 5px">'+data[i].name+' '+data[i].surname+'</div>';
           kk+= k;
           pp+= p
         };
        document.getElementById('EMPcardcontainer').innerHTML = kk;
        document.getElementById('manager').innerHTML = pp
});
};
// Fetch Labour Lib doc Sections an constructs LabLibcards in LabLibcardcontainer
function getlablibsections() {
    document.getElementById('Lablibcardcontainer').innerHTML = '';
   fetch('http://localhost:3000/getlablibsections/', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        // console.log(data)
        var kk = "";
        // Insert data into HTML Cards
        for(i = 0;i < data.length; i++){
          var k = '<div documentsection="'+data[i].documentsection+'" onclick="Lablibclickmenu(Lablibcard'+i+'), getlablibdocs()" id="Lablibcard'+i+'" class="card col-sm-12"';
           k+= 'style="padding-top: 2px; padding-right: 3px; padding-bottom: 2px; padding-left: 5px">'+data[i].documentsection+'</div>';
           kk+= k;
         };
        document.getElementById('Lablibcardcontainer').innerHTML = kk;
});
};


// fetch emplloyee details from server and populate the employee tab accordingly
function getemployeedetails() {
    var currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid");
   fetch('http://localhost:3000/employeedetails/'+ currentemployeeno, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        console.log(data)
        if (data[0].name == ""||data[0].name == null) {document.getElementById('EPname').innerHTML = "name", document.getElementById('EPname').className = "employeedetailsph"} else {document.getElementById('EPname').innerHTML = data[0].name; document.getElementById('EPname').className = ""};
        if (data[0].surname == ""||data[0].surname == null ) {document.getElementById('EPsurname').innerHTML = "surname", document.getElementById('EPsurname').className = "employeedetailsph"} else {document.getElementById('EPsurname').innerHTML = data[0].surname; document.getElementById('EPsurname').className = ""}
        if (data[0].initials == ""||data[0].initials == null) {document.getElementById('EPinitials').innerHTML = "initials", document.getElementById('EPinitials').className = "employeedetailsph"} else {document.getElementById('EPinitials').innerHTML = data[0].initials; document.getElementById('EPinitials').className = ""}
        if (data[0].dateofbirth == ""||data[0].dateofbirth == null) {document.getElementById('EPdateofbirth').innerHTML = 'date of birth', document.getElementById('EPdateofbirth').className = "employeedetailsph"} else {document.getElementById('EPdateofbirth').innerHTML = data[0].dateofbirth; document.getElementById('EPdateofbirth').className = ""}
        if (data[0].gender == ""||data[0].gender == null) {document.getElementById('EPgender').innerHTML = 'gender', document.getElementById('EPgender').className = "employeedetailsph"} else {document.getElementById('EPgender').innerHTML = data[0].gender; document.getElementById('EPgender').className = ""}
        if (data[0].ethnicity == ""||data[0].ethnicity == null) {document.getElementById('EPethnicity').innerHTML = 'ethnicity', document.getElementById('EPethnicity').className = "employeedetailsph"} else {document.getElementById('EPethnicity').innerHTML = data[0].ethnicity; document.getElementById('EPethnicity').className = ""}
        if (data[0].bloodtype == ""||data[0].bloodtype == null) {document.getElementById('EPbloodtype').innerHTML = 'bloodtype', document.getElementById('EPbloodtype').className = "employeedetailsph"} else {document.getElementById('EPbloodtype').innerHTML = data[0].bloodtype; document.getElementById('EPbloodtype').className = ""}
        if (data[0].maritalstatus == ""||data[0].maritalstatus == null) {document.getElementById('EPmaritalstatus').innerHTML = 'maritalstatus', document.getElementById('EPmaritalstatus').className = "employeedetailsph"} else {document.getElementById('EPmaritalstatus').innerHTML = data[0].maritalstatus; document.getElementById('EPmaritalstatus').className = ""}
        if (data[0].passportnumber == ""||data[0].passportnumber == null) {document.getElementById('EPpassportnumber').innerHTML = 'passportnumber', document.getElementById('EPpassportnumber').className = "employeedetailsph"} else {document.getElementById('EPpassportnumber').innerHTML = data[0].passportnumber; document.getElementById('EPpassportnumber').className = ""}
        if (data[0].nationality == ""||data[0].nationality == null) {document.getElementById('EPnationality').innerHTML = 'nationality', document.getElementById('EPnationality').className = "employeedetailsph"} else {document.getElementById('EPnationality').innerHTML = data[0].nationality; document.getElementById('EPnationality').className = ""}
        if (data[0].telephonenumber == ""||data[0].telephonenumber == null) {document.getElementById('EPtelephonenumber').innerHTML = 'telephone number', document.getElementById('EPtelephonenumber').className = "employeedetailsph"} else {document.getElementById('EPtelephonenumber').innerHTML = data[0].telephonenumber; document.getElementById('EPtelephonenumber').className = ""}
        if (data[0].faxnumber == ""||data[0].faxnumber == null) {document.getElementById('EPfaxnumber').innerHTML = 'fax number', document.getElementById('EPfaxnumber').className = "employeedetailsph"} else {document.getElementById('EPfaxnumber').innerHTML = data[0].faxnumber; document.getElementById('EPfaxnumber').className = ""}
        if (data[0].cellphonenumber == ""||data[0].cellphonenumber == null) {document.getElementById('EPcellphonenumber').innerHTML = 'cellphone number', document.getElementById('EPcellphonenumber').className = "employeedetailsph"} else {document.getElementById('EPcellphonenumber').innerHTML = data[0].cellphonenumber; document.getElementById('EPcellphonenumber').className = ""}
        if (data[0].email == ""||data[0].email == null) {document.getElementById('EPemail').innerHTML = 'email', document.getElementById('EPemail').className = "employeedetailsph"} else {document.getElementById('EPemail').innerHTML = data[0].email; document.getElementById('EPemail').className = ""}
        if (data[0].taxnumber == ""||data[0].taxnumber == null) {document.getElementById('EPtaxnumber').innerHTML = 'taxnumber', document.getElementById('EPtaxnumber').className = "employeedetailsph"} else {document.getElementById('EPtaxnumber').innerHTML = data[0].taxnumber; document.getElementById('EPtaxnumber').className = ""}
        if (data[0].driverslicencenumber == ""||data[0].driverslicencenumber == null) {document.getElementById('EPdriverslicencenumber').innerHTML = 'driverslicencenumber', document.getElementById('EPdriverslicencenumber').className = "employeedetailsph"}else {document.getElementById('EPdriverslicencenumber').innerHTML = data[0].driverslicencenumber; document.getElementById('EPdriverslicencenumber').className = ""}
        if (data[0].driverslicenceexpirydate == ""||data[0].driverslicenceexpirydate == null) {document.getElementById('EPdriverslicenceexpirydate').innerHTML = 'drivers licence expiry date', document.getElementById('EPdriverslicenceexpirydate').className = "employeedetailsph"} else {document.getElementById('EPdriverslicenceexpirydate').innerHTML = data[0].driverslicenceexpirydate; document.getElementById('EPdriverslicenceexpirydate').className = ""}
        if (data[0].address == ""||data[0].address == null) {document.getElementById('EPaddress').innerHTML = 'address'; document.getElementById('EPaddress').className = "employeedetailsph"} else {document.getElementById('EPaddress').innerHTML = data[0].address; document.getElementById('EPaddress').className = ""}
        if (data[0].postalcode == ""||data[0].postalcode == null) {document.getElementById('EPpostalcode').innerHTML = 'postal code', document.getElementById('EPpostalcode').className = "employeedetailsph"} else {document.getElementById('EPpostalcode').innerHTML = data[0].postalcode; document.getElementById('EPpostalcode').className = ""}
        if (data[0].ecdname == ""||data[0].ecdname == null) {document.getElementById('EPecdname').innerHTML = 'name', document.getElementById('EPecdname').className = "employeedetailsph"} else {document.getElementById('EPecdname').innerHTML = data[0].ecdname; document.getElementById('EPecdname').className = ""}
        if (data[0].ecdsurname == ""||data[0].ecdsurname == null) {document.getElementById('EPecdsurname').innerHTML = 'surname', document.getElementById('EPecdsurname').className = "employeedetailsph"} else {document.getElementById('EPecdsurname').innerHTML = data[0].ecdsurname; document.getElementById('EPecdsurname').className = ""}
        if (data[0].relation == ""||data[0].relation == null) {document.getElementById('EPrelation').innerHTML = 'relation', document.getElementById('EPrelation').className = "employeedetailsph"}else {document.getElementById('EPrelation').innerHTML = data[0].relation; document.getElementById('EPrelation').className = ""}
        if (data[0].celnumber == ""||data[0].celnumber == null)  {document.getElementById('EPcelnumber').innerHTML = 'cellphone number', document.getElementById('EPcelnumber').className = "employeedetailsph"} else {document.getElementById('EPcelnumber').innerHTML = data[0].celnumber; document.getElementById('EPcelnumber').className = ""}
        if (data[0].homenumber == ""||data[0].homenumber == null) {document.getElementById('EPhomenumber').innerHTML = 'home number', document.getElementById('EPhomenumber').className = "employeedetailsph"} else {document.getElementById('EPhomenumber').innerHTML = data[0].homenumber; document.getElementById('EPhomenumber').className = ""}
        if (data[0].worknumber == ""||data[0].worknumber == null) {document.getElementById('EPworknumber').innerHTML = 'work number', document.getElementById('EPworknumber').className = "employeedetailsph"} else {document.getElementById('EPworknumber').innerHTML = data[0].worknumber; document.getElementById('EPworknumber').className = ""}
        if (data[0].employeenumber == ""||data[0].employeenumber == null){document.getElementById('EPemployeenumber').innerHTML = 'employee number', document.getElementById('EPemployeenumber').className = "employeedetailsph"} else {document.getElementById('EPemployeenumber').innerHTML = data[0].employeenumber; document.getElementById('EPemployeenumber').className = ""}
        if (data[0].jobtitle == ""||data[0].jobtitle == null) {document.getElementById('EPjobtitle').innerHTML = 'jobtitle', document.getElementById('EPjobtitle').className = "employeedetailsph"} else {document.getElementById('EPjobtitle').innerHTML = data[0].jobtitle, document.getElementById('EPjobtitle').className = ""}
        if (data[0].employmentstartdate == ""||data[0].employmentstartdate == null) {document.getElementById('EPemploymentstartdate').innerHTML = 'employment start date', document.getElementById('EPemploymentstartdate').className = "employeedetailsph"} else {document.getElementById('EPemploymentstartdate').innerHTML = data[0].employmentstartdate; document.getElementById('EPemploymentstartdate').className = ""}
        if (data[0].employmentenddate == ""||data[0].employmentenddate == null) {document.getElementById('EPemploymentenddate').innerHTML = 'employmentenddate', document.getElementById('EPemploymentenddate').className = "employeedetailsph"} else {document.getElementById('EPemploymentenddate').innerHTML = data[0].employmentenddate; document.getElementById('EPemploymentenddate').className = ""}
        if (data[0].branch == ""||data[0].branch == null) {document.getElementById('EPbranch').innerHTML = 'branch', document.getElementById('EPbranch').className = "employeedetailsph"} else {document.getElementById('EPbranch').innerHTML = data[0].branch; document.getElementById('EPbranch').className = ""}
        if (data[0].department == ""||data[0].department == null){document.getElementById('EPdepartment').innerHTML = 'department', document.getElementById('EPdepartment').className = "employeedetailsph"} else {document.getElementById('EPdepartment').innerHTML = data[0].department; document.getElementById('EPdepartment').className = ""}
        if (data[0].employmenttype == ""||data[0].employmenttype == null){document.getElementById('EPemploymenttype').innerHTML = 'employmenttype', document.getElementById('EPemploymenttype').className = "employeedetailsph"} else {document.getElementById('EPemploymenttype').innerHTML = data[0].employmenttype; document.getElementById('EPemploymenttype').className = ""}
        if (data[0].employmentcategory == ""||data[0].employmentcategory == null) {document.getElementById('EPemploymentcategory').innerHTML = 'employment category', document.getElementById('EPemploymentcategory').className = "employeedetailsph"} else {document.getElementById('EPemploymentcategory').innerHTML = data[0].employmentcategory; document.getElementById('EPemploymentcategory').className = ""}
        if (data[0].manager == ""||data[0].manager == null) {document.getElementById('EPmanager').innerHTML = 'manager', document.getElementById('EPmanager').className = "employeedetailsph"} else {document.getElementById('EPmanager').innerHTML = data[0].manager; document.getElementById('EPmanager').className = ""}
        if (data[0].extentionnumber == ""||data[0].extentionnumber == null) {document.getElementById('EPextentionnumber').innerHTML = 'extentionnumber', document.getElementById('EPextentionnumber').className = "employeedetailsph"} else {document.getElementById('EPextentionnumber').innerHTML = data[0].extentionnumber; document.getElementById('EPextentionnumber').className = ""}
        if (data[0].psiragrade == ""||data[0].psiragrade == null){document.getElementById('EPpsiragrade').innerHTML = 'psira grade', document.getElementById('EPpsiragrade').className = "employeedetailsph"} else {document.getElementById('EPpsiragrade').innerHTML = data[0].psiragrade; document.getElementById('EPpsiragrade').className = ""}
        if (data[0].psiranumber == ""||data[0].psiranumber == null) {document.getElementById('EPpsiranumber').innerHTML = 'psira number', document.getElementById('EPpsiranumber').className = "employeedetailsph"} else {document.getElementById('EPpsiranumber').innerHTML = data[0].psiranumber; document.getElementById('EPpsiranumber').className = ""}
        if (data[0].accountholder == data[0].accountholder == null) {document.getElementById('EPaccountholder').innerHTML = 'accountholder', document.getElementById('EPaccountholder').className = "employeedetailsph"} else {document.getElementById('EPaccountholder').innerHTML = data[0].accountholder; document.getElementById('EPaccountholder').className = ""}
        if (data[0].bankname == ""||data[0].bankname == null) {document.getElementById('EPbankname').innerHTML = 'bankname', document.getElementById('EPbankname').className = "employeedetailsph"} else {document.getElementById('EPbankname').innerHTML = data[0].bankname; document.getElementById('EPbankname').className = ""}
        if (data[0].branchname == ""||data[0].branchname == null) {document.getElementById('EPbranchname').innerHTML = 'branchname', document.getElementById('EPbranchname').className = "employeedetailsph"} else {document.getElementById('EPbranchname').innerHTML = data[0].branchname; document.getElementById('EPbranchname').className = ""}
        if (data[0].branchcode == ""||data[0].branchcode == null) {document.getElementById('EPbranchcode').innerHTML = 'branch code', document.getElementById('EPbranchcode').className = "employeedetailsph"} else {document.getElementById('EPbranchcode').innerHTML = data[0].branchcode; document.getElementById('EPbranchcode').className = ""}
        if (data[0].accountnumber == ""||data[0].accountnumber == null) {document.getElementById('EPaccountnumber').innerHTML = 'account number', document.getElementById('EPaccountnumber').className = "employeedetailsph"} else {document.getElementById('EPaccountnumber').innerHTML = data[0].accountnumber; document.getElementById('EPaccountnumber').className = ""}
        if (data[0].accounttype == ""||data[0].accounttype == null) {document.getElementById('EPaccounttype').innerHTML = 'account type', document.getElementById('EPaccounttype').className = "employeedetailsph"} else {document.getElementById('EPaccounttype').innerHTML = data[0].accounttype; document.getElementById('EPaccounttype').className = ""}
        if (data[0].medicalaidname == ""||data[0].medicalaidname == null){document.getElementById('EPmedicalaidname').innerHTML = 'medicalaid name', document.getElementById('EPmedicalaidname').className = "employeedetailsph"} else {document.getElementById('EPmedicalaidname').innerHTML = data[0].medicalaidname; document.getElementById('EPmedicalaidname').className = ""}
        if (data[0].medicalaidplan == ""||data[0].medicalaidplan == null) {document.getElementById('EPmedicalaidplan').innerHTML = 'medicalaid plan', document.getElementById('EPmedicalaidplan').className = "employeedetailsph"} else {document.getElementById('EPmedicalaidplan').innerHTML = data[0].medicalaidplan; document.getElementById('EPmedicalaidplan').className = ""}
        if (data[0].medicalaidnumber == ""||data[0].medicalaidnumber == null) {document.getElementById('EPmedicalaidnumber').innerHTML = 'medicalaid number', document.getElementById('EPmedicalaidnumber').className = "employeedetailsph"} else {document.getElementById('EPmedicalaidnumber').innerHTML = data[0].medicalaidnumber; document.getElementById('EPmedicalaidnumber').className = ""}
        if (data[0].idnumber == ""||data[0].idnumber == null) {document.getElementById('EPidnumber').innerHTML = 'idnumber', document.getElementById('EPidnumber').className = "employeedetailsph"} else {document.getElementById('EPidnumber').innerHTML = data[0].idnumber; document.getElementById('EPidnumber').className = ""}

        var k = ''
        k += '<legend class="border"><h4>Documents</h4></legend>'
        k += '<div align="center" id="viewid'+currentemployeeno+'" onclick="window.open('+"'http://localhost:3000/iddocumentfileback/"+currentemployeeno+"'"+", '_blank');"+'"'+"class='row test col-md-12 col-sm-12 col-xs-12' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;'>ID document</div>"
        k += '<div align="center" id="viewwp'+currentemployeeno+'" onclick="window.open('+"'http://localhost:3000/workpermitfileback/"+currentemployeeno+"'"+", '_blank');"+'"'+"class='row test col-md-12 col-sm-12 col-xs-12' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;'>Workpermit</div>"
        k += '<div align="center" id="viewcoe'+currentemployeeno+'" onclick="window.open('+"'http://localhost:3000/contractofemploymentfileback/"+currentemployeeno+"'"+", '_blank');"+'"'+"class='row test col-md-12 col-sm-12 col-xs-12' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;'>Contract of Employment(Signed)</div>"
        k += '<div align="center" id="viewcoeb'+currentemployeeno+'" onclick="window.open('+"'http://localhost:3000/contractofemployment_blankfileback/"+currentemployeeno+"'"+", '_blank');"+'"'+"class='row test col-md-12 col-sm-12 col-xs-12' style='border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;'>Contract of Employment (Blank)</div>"
        document.getElementById('employeedocs').innerHTML = k



        if (data[0].iddocument_doc != true) {
              document.getElementById('viewid'+currentemployeeno+'').setAttribute("onclick", "javascript: runmodal2(event, 'iddocument', 'ID document');")
              document.getElementById('viewid'+currentemployeeno+'').innerHTML = 'click to upload ID document'}
        if (data[0].workpermit_doc != true) {
              document.getElementById('viewwp'+currentemployeeno+'').setAttribute("onclick", "javascript: runmodal2(event, 'workpermit', 'workpermit');")
              document.getElementById('viewwp'+currentemployeeno+'').innerHTML = 'click to upload workpermit'}
        if (data[0].contractofemployment_doc != true) {
              document.getElementById('viewcoe'+currentemployeeno+'').setAttribute("onclick", "javascript: runmodal2(event, 'contractofemployment', 'contract of employment');")
              document.getElementById('viewcoe'+currentemployeeno+'').innerHTML = 'click to upload Contract of Employment(Signed)'}
        if (data[0].contractofemployment_blank_doc != true) {
              document.getElementById('viewcoeb'+currentemployeeno+'').setAttribute("onclick", "")
              document.getElementById('viewcoeb'+currentemployeeno+'').innerHTML = 'No contract has been generated'}
})
}


idd = "";
workp = "";
// ADD NEW EMPLOYEE BUTTON = Javascript - STARTS
function getempdetails(){
  var dateofbirth = ""
  var driverslicenceexpirydate = ''
  var employmentstartdatee = ''
  var employmentenddate = ""

 if (document.getElementById("dateofbirth").value === '') {dateofbirth = null} else {dateofbirth = document.getElementById("dateofbirth").value}
 if (document.getElementById("driverslicenceexpirydate").value === '') {driverslicenceexpirydate = null} else {driverslicenceexpirydate = document.getElementById("driverslicenceexpirydate").value}
 if (document.getElementById("employmentstartdate").value === '') {employmentstartdate = null} else {employmentstartdate = document.getElementById("employmentstartdate").value}
 if (document.getElementById("employmentenddate").value === '') {employmentenddate = null} else {employmentenddate = document.getElementById("employmentenddate").value}
 if (document.getElementById("name").value === ''||document.getElementById("name").value === null||
     document.getElementById("surname").value === ''||document.getElementById("surname").value === null||
     document.getElementById("idnumber").value === ''||document.getElementById("idnumber").value === null){alert("Please complete the required fields.")} else {

  fetch('http://localhost:3000/uploadnewemployee', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          employerid: '0001',
          title: document.getElementById("title").value,
          name: document.getElementById("name").value,
          surname: document.getElementById("surname").value,
          initials: document.getElementById("initials").value,
          dateofbirth: dateofbirth,
          idnumber: document.getElementById("idnumber").value,
          gender: document.getElementById("gender").value,
          ethnicity: document.getElementById("ethnicity").value,
          bloodtype: document.getElementById("bloodtype").value,
          maritalstatus: document.getElementById("maritalstatus").value,
          hasdependants: document.getElementById("hasdependants").checked,
          dependants: document.getElementById("dependants").value,
          passportnumber: document.getElementById("passportnumber").value,
          nationality: document.getElementById("nationality").value,
          telephonenumber: document.getElementById("telephonenumber").value,
          faxnumber: document.getElementById("faxnumber").value,
          cellphonenumber: document.getElementById("cellphonenumber").value,
          email: document.getElementById("email").value,
          taxnumber: document.getElementById("taxnumber").value,
          driverslicencenumber: document.getElementById("driverslicencenumber").value,
          driverslicenceexpirydate: driverslicenceexpirydate,
          foreignnational: document.getElementById("foreignnational").checked,
          disability: document.getElementById("disability").checked,
          disabilitydesription: document.getElementById("disabilitydesription").value,
          address: document.getElementById("address").value,
          postalcode: document.getElementById("postalcode").value,
          ecdname: document.getElementById("ecdname").value,
          ecdsurname: document.getElementById("ecdsurname").value,
          relation: document.getElementById("relation").value,
          celnumber: document.getElementById("celnumber").value,
          homenumber: document.getElementById("homenumber").value,
          worknumber: document.getElementById("worknumber").value,
          employeenumber: document.getElementById("employeenumber").value,
          jobtitle: document.getElementById("jobtitle").value,
          employmentstartdate: employmentstartdate,
          employmentenddate: employmentenddate,
          branch: document.getElementById("branch").value,
          department: document.getElementById("department").value,
          employmenttype: document.getElementById("employmenttype").value,
          employmentcategory: document.getElementById("employmentcategory").value,
          manager: document.getElementById("manager").value,
          extentionnumber: document.getElementById("extentionnumber").value,
          psiragrade: document.getElementById("psiragrade").value,
          psiranumber: document.getElementById("psiranumber").value,
          accountholder: document.getElementById("accountholder").value,
          bankname: document.getElementById("bankname").value,
          branchname: document.getElementById("branchname").value,
          branchcode: document.getElementById("branchcode").value,
          accountnumber: document.getElementById("accountnumber").value,
          accounttyp: document.getElementById("accounttype").value,
          medicalaidname: document.getElementById("medicalaidname").value,
          medicalaidplan: document.getElementById("medicalaidplan").value,
          medicalaidnumber: document.getElementById("medicalaidnumber").value,
          // iddocument: tempdocfiles.iddocument,
          // workpermit: tempdocfiles.workpermit,
          // workpermit_doc: tempdocfiles.workpermit_doc,
          // iddocument_doc: tempdocfiles.iddocument_doc,
        })
        })
              .then(response => response.json())
              .then(function(data) {
                getemployees();
                // console.log(data.employeeid)
                // console.log("response form server op upload of warning data: "+data)
                newee = 'EMPcard'+data.employeeid
                // console.log(newee)
                console.log("Emp details sent");
                showEMPlist();
                document.getElementById('employeestab').click();
                clearnewemployeefields();
                setTimeout(clicknewemployee, 50);
            })

};
}
function clickcurrentemployeecard(){
  document.getElementById(selectedEMPCurrent).click()

}

function clicknewemployee(){
  alert("New Employee Added Succesfully");
  document.getElementById(newee).click();
}
// function waitfordomelement(cardno){
//   setTimeout(clicknewemployee, 100);
// }
// tempdocfiles.iddocument_doc = "";
// tempdocfiles.workpermit_doc = "";
// tempdocfiles.workpermit = "";
// tempdocfiles.iddocument = "";
function getempdetails1(){
    var wpfile = document.getElementById('workpermit').files[0];
    if (wpfile) {     // create reader
                      var reader = new FileReader();
                      reader.readAsBinaryString(wpfile);
                      reader.onload = function(e) {
                        var base64Str = btoa(e.target.result);
                        tempdocfiles.workpermit = base64Str
                        // console.log('*** workpermit file ***')
                        // console.log(tempdocfiles.workpermit);
                      }
                } else {
        console.log("no workpermit loaded emply string being sent");
        tempdocfiles.workpermit = "";
        tempdocfiles.workpermit_doc = false};
};


function getempdetails2(){
    var idfile = document.getElementById('iddocument').files[0];
    if (idfile) {                 // create reader
                                  var reader = new FileReader();
                                  reader.readAsBinaryString(idfile);
                                  reader.onload = function(e) {
                                    // browser completed reading file - display it
                                    //console.log(e)
                                    var base64Str = btoa(e.target.result);
                                    tempdocfiles.iddocument = base64Str
                                    tempdocfiles.iddocument_doc = true
                                    // iddocument = id
                                    // console.log('*** iddocument file ***')
                                    // console.log(idd);
                                    }
                }  else {
        console.log("no id document loaded emply string being sent");
        tempdocfiles.iddocument = "";
        tempdocfiles.iddocument_doc = false};
  };

function clearnewemployeefields(){
  document.getElementById("title").value = '';
  document.getElementById("name").value = '';
  document.getElementById("surname").value = '';
  document.getElementById("initials").value = '';
  document.getElementById("dateofbirth").value = '';
  document.getElementById("idnumber").value = '';
  document.getElementById("gender").value = '';
  document.getElementById("ethnicity").value = '';
  document.getElementById("bloodtype").value = '';
  document.getElementById("maritalstatus").value = '';
  document.getElementById("hasdependants").checked = false
  document.getElementById("dependants").value = '';
  document.getElementById("passportnumber").value = '';
  document.getElementById("nationality").value = '';
  document.getElementById("telephonenumber").value = '';
  document.getElementById("faxnumber").value = '';
  document.getElementById("cellphonenumber").value = '';
  document.getElementById("email").value = '';
  document.getElementById("taxnumber").value = '';
  document.getElementById("driverslicencenumber").value = '';
  document.getElementById("driverslicenceexpirydate").value = '';
  document.getElementById("foreignnational").checked = false
  document.getElementById("disability").checked = false
  document.getElementById("disabilitydesription").value = '';
  document.getElementById("address").value = '';
  document.getElementById("postalcode").value = '';
  document.getElementById("ecdname").value = '';
  document.getElementById("ecdsurname").value = '';
  document.getElementById("relation").value = '';
  document.getElementById("celnumber").value = '';
  document.getElementById("homenumber").value = '';
  document.getElementById("worknumber").value = '';
  document.getElementById("employeenumber").value = '';
  document.getElementById("jobtitle").value = '';
  document.getElementById("employmentstartdate").value = '';
  document.getElementById("employmentenddate").value = '';
  document.getElementById("branch").value = '';
  document.getElementById("department").value = '';
  document.getElementById("employmenttype").value = '';
  document.getElementById("employmentcategory").value = '';
  document.getElementById("manager").value = '';
  document.getElementById("extentionnumber").value = '';
  document.getElementById("psiragrade").value = '';
  document.getElementById("psiranumber").value = '';
  document.getElementById("accountholder").value = '';
  document.getElementById("bankname").value = '';
  document.getElementById("branchname").value = '';
  document.getElementById("branchcode").value = '';
  document.getElementById("accountnumber").value = '';
  document.getElementById("accounttype").value = '';
  document.getElementById("medicalaidname").value = '';
  document.getElementById("medicalaidplan").value = '';
  document.getElementById("medicalaidnumber").value = '';
  // document.getElementById('iddocument').files[0] = '';
  // document.getElementById('workpermit').files[0] = '';
}

// ADD NEW EMPLOYEE BUTTON = Javascript - ENDS
// Modal JavaScript
function runmodal(){
  // Get the modal
  let modal = document.getElementById('myModal');
  var tempname = ""
  if (globalS.warningtype === "VW"){tempname = 'Verbal Warning'}
  if (globalS.warningtype === "WW"){tempname = "Written Warning"}
  if (globalS.warningtype === "FWW"){tempname = "Final Written Warning"}
  if (globalS.reccommendation === "VW"){tempname1 = "Verbal Warning"}
  if (globalS.reccommendation === "WW"){tempname1 = "Written Warning"}
  if (globalS.reccommendation === "FWW"){tempname1 = "Final Written Warning"}

  m1btn1_content1 = ["Accept Recommendation " + "Issue the "+tempname1];
  m1btn2_content1 = ["Reject Recommendation " + "Issue the "+ tempname];
  document.getElementById("mBtn1").value = m1btn1_content1;
  document.getElementById("mBtn2").value = m1btn2_content1;
  content1 = ["You are about to Issue " + globalS.employeename + " with a " + tempname +
              ". According to the Disciplinary Code, and considering the relative seriousness of the offence and previous warnings issued to the employee for same or similar offences, Progressive Discipline dictates that you should rather issue the employee with a " + tempname1 + "."];
  document.getElementById('content').innerHTML = content1;
  modal.style.display = "block";
}

function runmodal1(){
  // Get the modal
  let modal1 = document.getElementById("myModal1");
  modal1.style.display = "block";
  // modul2 body content
  var tempname = ""
  if (globalS.warningtype === "VW"){tempname = "Verbal Warning"}
  if (globalS.warningtype === "WW"){tempname = "Written Warning"}
  if (globalS.warningtype === "FWW"){tempname = "Final Written Warning"}

  content2 = ["You are about to Issue " + globalS.employeename + " with a " + tempname +
              ". According to the Disciplinary Code, and considering the relative seriousness of the offence and previous warnings issued to the employee for same or similar offences, Progressive Discipline dictates that you should rather hold a formal Disciplinary Hearing for the employee."]
  content2a = ["If you choose not to proceed with a Disciplinary Hearing at this time we recommend that you issue the employee with a " + tempname]
  content2b = ["If you choose to proceed with a Disciplinary Hearing for the employee it is our recommendation that you contact your local Seesa Office for assistance."]
  document.getElementById('content1').innerHTML = content2;
  document.getElementById('content1a').innerHTML = content2a;
  document.getElementById('content1b').innerHTML = content2b;
  // Contents of buttons
  // Modul 1 button 1 accept Recommendation
  m2btn1_content1 = ["Accept Recommendation " + "Contact Seesa to book Disciplinary Hearing"];
  m2btn2_content1 = ["Accept Recommendation " + "Issue Final Written Warning"];
  m2btn3_content1 = ["Reject Recommendation " + "Issue Notice of Disciplinary Hearing"];
  m2btn4_content1 = ["Reject Recommendation " + "Issue the "+ tempname];

  document.getElementById("mBtn3").value = m2btn1_content1;
  document.getElementById("mBtn4").value = m2btn2_content1;
  document.getElementById("mBtn5").value = m2btn3_content1;
  document.getElementById("mBtn6").value = m2btn4_content1;
  // Get the <span> element that closes the modal
  // let span1 = document.getElementById("close1");

}

function runmodal2(event, fieldid, fieldname){
  // Get the modal
  let modal = document.getElementById('myModal2');
  let editfieldid = fieldid
  let fieldname1 = fieldname
  let test = "'"+editfieldid+"'"
  let k = ""
  let l = ""
  console.log(editfieldid)
  l += '<button class="btn" onclick="submiteefieldchange('+test+')">Submit</button><button class="btn" onclick="close_myModal_editeefiled()">Cancel</button>'
  document.getElementById('mymodal2buttons').innerHTML = l

  if (editfieldid === 'name'||editfieldid === 'surname'||editfieldid === 'initials'||editfieldid === 'idnumber'||editfieldid === 'dependants'||editfieldid === 'passportnumber'
  ||editfieldid === 'nationality'||editfieldid === 'telephonenumber'||editfieldid === 'faxnumber'||editfieldid === 'cellphonenumber'||editfieldid === 'email'||editfieldid === 'taxnumber'
  ||editfieldid === 'driverslicencenumber'||editfieldid === 'disabilitydesription'||editfieldid === 'address'||editfieldid === 'postalcode'||editfieldid === 'ecdname'||editfieldid === 'ecdsurname'
  ||editfieldid === 'celnumber'||editfieldid === 'homenumber'||editfieldid === 'worknumber'||editfieldid === 'employeenumber'||editfieldid === 'extentionnumber'
  ||editfieldid === 'psiragrade'||editfieldid === 'psiranumber'||editfieldid === 'accountholder'||editfieldid === 'branchname'||editfieldid === 'branchcode'||editfieldid === 'accountnumber'
  ||editfieldid === 'medicalaidname'||editfieldid === 'medicalaidplan'||editfieldid === 'medicalaidnumber') {
     k+= '<p>Please enter a new value for '+fieldname1+'</p><input class="form-control" id="newdata" placeholder="" type="text"/>'
     document.getElementById('editeefieldidbody').innerHTML = k
  }
  else if (editfieldid === 'gender'||editfieldid === 'bloodtype'||editfieldid === 'title'||editfieldid === 'ethnicity'||editfieldid === 'maritalstatus'||editfieldid === 'relation'||editfieldid === 'jobtitle'
  ||editfieldid === 'branch'||editfieldid === 'department'||editfieldid === 'employmenttype'||editfieldid === 'employmentcategory'||editfieldid === 'manager'||editfieldid === 'bankname'||editfieldid === 'accounttype') {
    k+= '<p>Please enter a new value for '+fieldname1+'</p><select id="newdata" class="form-control">'
    k+= document.getElementById(editfieldid).innerHTML
    k+= '</select>'
    document.getElementById('editeefieldidbody').innerHTML = k
  }

  else if (editfieldid === 'dateofbirth'||editfieldid === 'driverslicenceexpirydate'||editfieldid === 'employmentstartdate'||editfieldid === 'employmentenddate') {
    k+= '<p>Please enter a new value for '+fieldname1+'</p><input class="form-control" id="newdata" placeholder="'+editfieldid+'" type="date"></input>'
    document.getElementById('editeefieldidbody').innerHTML = k
  }

  else if (editfieldid === 'iddocument'||editfieldid === 'workpermit'||editfieldid === 'contractofemployment') {
    let p = ''
    k += '<p>Please select a new file to upload for '+fieldname1+'</p><input type="file" id="newdata" class="form-control"></input>'
    document.getElementById('editeefieldidbody').innerHTML = k
    p += '<button class="btn" onclick="submiteefieldchange_doc('+test+')">Submit</button><button class="btn" onclick="close_myModal_editeefiled()">Cancel</button>'
    document.getElementById('mymodal2buttons').innerHTML = p
  }
  modal.style.display = "block";
}

function runmodal3(){
  // Get the modal
  let modal = document.getElementById('myModal3');
  modal.style.display = "block";
}

function runmodal5(){
  // Get the modal
  let modal = document.getElementById('myModal5');
  modal.style.display = "block";
}

function closemodal5(){
  // Get the modal
  let modal = document.getElementById('myModal5');
  modal.style.display = "none";
}
function closemodal3(){
  // Get the modal
  let modal = document.getElementById('myModal3');
  modal.style.display = "none";
}

function close_myModal4() {
  let modal = document.getElementById('myModal4');
  modal.style.display = "none";
}

function closemodal6() {
  let modal = document.getElementById('myModal6');
  modal.style.display = "none";
}

function close_myModal_editeefiled() {
              document.getElementById('editeefieldidbody').innerHTML = ''
              let modal1 = document.getElementById('myModal2');
              modal1.style.display = "none";
}

function submiteefieldchange(fieldname){
  let currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid")
  let newdata = document.getElementById('newdata').value
  fetch('http:/localhost:3000/updateeinfo/'+ fieldname, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          employeeid: currentemployeeno,
          newdata: newdata,
              })
       })
       .then(res => {
       // console.log("Updated "+fieldname+" sent to server")
       // console.log(res.status)
       getemployeedetails()
       if (fieldname === 'name'){
         document.getElementById(selectedEMPCurrent).innerHTML = newdata+' '+document.getElementById(selectedEMPCurrent).getAttribute("surname");
         document.getElementById(selectedEMPCurrent).setAttribute("name", newdata)}
       if (fieldname === 'surname'){
         document.getElementById(selectedEMPCurrent).innerHTML = document.getElementById(selectedEMPCurrent).getAttribute("name")+' '+newdata;
         document.getElementById(selectedEMPCurrent).setAttribute("surname", newdata)}
     })
  document.getElementById('editeefieldidbody').innerHTML = '';
  let modal1 = document.getElementById('myModal2');
  modal1.style.display = "none";
}


function submiteefieldchange_doc(fieldname){
  let currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid")
  let newdata = document.getElementById('newdata').value
  fieldname_doc = fieldname+"_doc"
  var wpfile = document.getElementById('newdata').files[0];
  if (wpfile) {     // create reader
                    var reader = new FileReader();
                    reader.readAsBinaryString(wpfile);
                    reader.onload = function(e) {
                    var base64Str = btoa(e.target.result);
                    var obj = {}
                    obj['newdata'] = base64Str
                    obj['employeeid'] = currentemployeeno
                    obj[fieldname_doc] = true
                    console.log(obj)
                    fetch('http:/localhost:3000/updateeinfo_doc/'+ fieldname, {
                                method: 'post',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(obj)
                                 })
                      .then(res => {
                          getemployeedetails()
                                    })
                                                }
      }
document.getElementById('editeefieldidbody').innerHTML = '';
let modal1 = document.getElementById('myModal2');
modal1.style.display = "none";
}

function runmodal6(type, type2){
  // Get the modal

  if (type2 === 'add'||type === 'branch' & document.getElementById(selectedBranchCurrent) != null||type === 'department' & document.getElementById(selectedDepartmentCurrent) != null||
  type === 'jobtitle' &  document.getElementById(selectedJobtitleCurrent) != null) {

  let modal = document.getElementById('myModal6');
  modal.style.display = "block";
  var heading = ""
  var body = ""
  var buttons = ""
  var newdata = ""
  var deldata = ""
// if (document.getElementById('newbranchdata') != null) {newdata = document.getElementById('newbranchdata').value}


if (type === 'branch'&type2 === 'add') {heading = 'Add Branch';
                                        body = '<p>Please enter the new Branch name</p><input class="form-control" id="newbranchdata" placeholder="new branch name" type="text"></input>';
                                        buttons = '<button  class="btn" onclick="addmodal6('+"'"+'branches'+"'"+')"> Submit</button><button class="btn" onclick="closemodal6()">Cancel</button>'
                                      } else if
 (type === 'department'&type2 === 'add') {heading = 'Add Department';
                                          body = '<p>Please enter the new Department name</p><input class="form-control" id="newbranchdata" placeholder="new department name" type="text"></input>';
                                          buttons = '<button class="btn" onclick="addmodal6('+"'"+'departments'+"'"+')"> Submit</button><button class="btn" onclick="closemodal6()">Cancel</button>'

                                          } else if
 (type === 'jobtitle'&type2 === 'add') {
                                        heading = 'Add Job Title';
                                        body = '<p>Please enter the new Job Title</p><input class="form-control" id="newbranchdata" placeholder="new job title" type="text"></input>';
                                        buttons = '<button class="btn" onclick="addmodal6('+"'"+'jobtitles'+"'"+')"> Submit</button><button class="btn"  onclick="closemodal6()">Cancel</button>'}

if (type === 'branch'&type2 === 'edit') {heading = 'Edit Branch';
                                        body = '<p>Please enter the new value for Branch <strong>' + document.getElementById(selectedBranchCurrent).getAttribute("value") +'</strong></p><input class="form-control" id="newbranchdata" type="text"></input>' ;
                                        buttons = '<button class="btn" onclick="edmodal6('+"'"+'branches'+"'"+')"> Submit</button><button class="btn" onclick="closemodal6()">Cancel</button>'
                                        } else if
  (type === 'department'&type2 === 'edit') {heading = 'Edit Department';
                                            body = '<p>Please enter the new value for Department <strong>' + document.getElementById(selectedDepartmentCurrent).getAttribute("value") + '</strong></p><input class="form-control" id="newbranchdata" placeholder="new department name" type="text"></input>';
                                            buttons = '<button class="btn" onclick="edmodal6('+"'"+'departments'+"'"+')"> Submit</button><button class="btn" onclick="closemodal6()">Cancel</button>'
                                        } else if
  (type === 'jobtitle'&type2 === 'edit') {heading = 'Edit Job Title';
                                         body = '<p>Please enter the new value for Job Title <strong>' + document.getElementById(selectedJobtitleCurrent).getAttribute("value") +'</strong></p><input class="form-control" id="newbranchdata" placeholder="new department name" type="text"></input>';
                                         buttons = '<button class="btn" onclick="edmodal6('+"'"+'jobtitles'+"'"+')"> Submit</button><button class="btn" onclick="closemodal6()">Cancel</button>'}


if (type === 'branch'&type2 === 'remove') {heading = 'Remove Branch';
                                            body = '<p>Are you sure you want to delete the Branch?</p><strong>' +document.getElementById(selectedBranchCurrent).getAttribute("value")+'</strong>';
                                            buttons = '<button class="btn" onclick="remmodal6('+"'"+'branches'+"'"+')">Remove</button><button class="btn" onclick="closemodal6()">Cancel</button>'} else if
   (type === 'department'&type2 === 'remove') {heading = 'Remove Department';
                                               body = '<p>Are you sure you want to remove this Department?</p><strong>' +document.getElementById(selectedDepartmentCurrent).getAttribute("value")+'</strong>';
                                               buttons = '<button class="btn" onclick="remmodal6('+"'"+'departments'+"'"+')">Remove</button><button class="btn" onclick="closemodal6()">Cancel</button>'} else if
   (type === 'jobtitle'&type2 === 'remove') {heading = 'Remove Jobtitle';
                                             body = '<p>Are you sure you want to delete the Job Title?</p><strong>' +document.getElementById(selectedJobtitleCurrent).getAttribute("value")+'</strong>';
                                              buttons = '<button class="btn" onclick="remmodal6('+"'"+'jobtitles'+"'"+')">Remove</button><button class="btn" onclick="closemodal6()">Cancel</button>'}


   document.getElementById('modal6heading').innerHTML = heading
   document.getElementById('modal6body').innerHTML = body
   document.getElementById('modal6buttons').innerHTML = buttons
} else {alert("Please select a "+type+" first")}
}

function addmodal6(type){
  newdata = document.getElementById('newbranchdata').value
  addbranchdeptjobtitle(type, newdata)
  closemodal6()
  setTimeout(getbranchdeptjobt, 75);
}
function remmodal6(type){
      if (type === 'branches') {deldata = document.getElementById(selectedBranchCurrent).getAttribute("value"); selectedBranchCurrent = "" }
      if (type === 'departments') {deldata = document.getElementById(selectedDepartmentCurrent).getAttribute("value"); selectedDepartmentCurrent = ""}
      if (type === 'jobtitles') {deldata = document.getElementById(selectedJobtitleCurrent).getAttribute("value"); selectedJobtitleCurrent= ""}
   removebranchdeptjobtitle(type,deldata)
   closemodal6()
   setTimeout(getbranchdeptjobt, 75);
}


function closemodal7(){
  let modal = document.getElementById('myModal7');
  modal.style.display = "none";
}

function edmodal6(type){
  console.log(type)
  if (type === 'branches') {deldata = document.getElementById(selectedBranchCurrent).getAttribute("value"); selectedBranchCurrent = "" }
  if (type === 'departments') {deldata = document.getElementById(selectedDepartmentCurrent).getAttribute("value"); selectedDepartmentCurrent = ""}
  if (type === 'jobtitles') {deldata = document.getElementById(selectedJobtitleCurrent).getAttribute("value"); selectedJobtitleCurrent= ""}
 removebranchdeptjobtitle(type,deldata)

 addmodal6(type)
 }
// clear warning fields
function clearwarningfields(){
  globalS.misconducttype = '';
  document.getElementById("misconducttype").value = '',
  document.getElementById("Amisconducttype").value = '',
  globalS.chargefixeddescription = '';
  document.getElementById("chargefixeddescription").value = '';
  document.getElementById("Achargefixeddescription").value = '';
  globalS.warningtype = '';
  document.getElementById("warningtype").value = '';
  document.getElementById("Awarningtype").value = '';
  globalS.misconductdate = '';
  document.getElementById("misconductdate").value = '';
  document.getElementById("Amisconductdate").value = '';
  globalS.chargedescription = '';
  document.getElementById("chargedescription").value = '';
  document.getElementById("Achargedescription").value = '';
  globalS.warningduration = '';
  document.getElementById("warningduration").value = '';
  document.getElementById("Awarningduration").value = '';
  globalS.warninglapsedate = '';
  document.getElementById("warninglapsedate").value = '';
  document.getElementById("Awarninglapsedate").value = '';
  globalS.employeename = '';
  globalS.reccommendation = '';
  // globalS.warnno = '';
}

// MODUL BUTTON FUNCTIONS
function mBtn1() {
              let modal = document.getElementById('myModal');
              console.log("modsl button 1 pressed");
              modal.style.display = "none";
              globalS.warningtype = globalS.reccommendation;
              console.log("Warning Type changed to "+globalS.reccommendation);
              uploadwarningdata(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype,globalS.misconductdate,
              globalS.chargedescription,globalS.warningduration,globalS.warninglapsedate, false);
              console.log("New "+globalS.warningtype+ " uploaded to DB");
              var date2 = globalS.warninglapsedate
              var dateb = new Date(date2).toString('d MMM yyyy');
              var date = globalS.misconductdate
              var datea = new Date(date).toString('d MMM yyyy');
              warningFields = {
              EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
              EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
              OffenceDate: [datea],
              CombinedDescription: [globalS.chargefixeddescription+" "+globalS.chargedescription],
              LapseMonths: [globalS.warningduration],
              LapseDate: [dateb],
              warningtype: [globalS.reccommendation],
              };
              printWarning();
              console.log("New "+globalS.warningtype+"Warning PDF Created");
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
              // document.getElementById(selectedEMPCurrent).click();
};

function mBtn2() {
              let modal = document.getElementById('myModal');
              modal.style.display = "none";
              uploadwarningdata(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype,globalS.misconductdate,
              globalS.chargedescription,globalS.warningduration,globalS.warninglapsedate, false);
              console.log("New "+globalS.warningtype+ " Uploaded to DB");
              var date = globalS.misconductdate
              var datea = new Date(date).toString('d MMM yyyy');
              var date2 = globalS.warninglapsedate
              var dateb = new Date(date2).toString('d MMM yyyy');
              warningFields = {
              EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
              EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
              OffenceDate: [datea],
              CombinedDescription: [globalS.chargefixeddescription+" "+globalS.chargedescription],
              LapseMonths: [globalS.warningduration],
              LapseDate: [dateb],
              warningtype: [globalS.warningtype],
              };
              printWarning();
              console.log("New"+globalS.warningtype+"Warning PDF CreatedD");
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
};

function mBtn3() {
              let modal1 = document.getElementById('myModal1');
              modal1.style.display = "none";
              // createNewWarning();
              console.log("COPY ENTERED DETAILS INTO EMAIL AND SEND TO SEESA BRANCH / OR NAVIGATE TO CONTACT SEESA SCREEN");
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
};

function mBtn4() {
              let modal1 = document.getElementById('myModal1');
              modal1.style.display = "none";
              globalS.warningtype = "FWW";
              console.log("Warning changed to FWW");
              uploadwarningdata(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype,globalS.misconductdate,
              globalS.chargedescription,globalS.warningduration,globalS.warninglapsedate, false);
              console.log("New FWW Uploaded to DB");
              var date = globalS.misconductdate
              var datea = new Date(date).toString('d MMM yyyy');
              var date2 = globalS.warninglapsedate
              var dateb = new Date(date2).toString('d MMM yyyy');
              warningFields = {
              EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
              EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
              OffenceDate: [datea],
              CombinedDescription: [globalS.chargefixeddescription+" "+globalS.chargedescription],
              LapseMonths: [globalS.warningduration],
              LapseDate: [dateb],
              warningtype: [globalS.reccommendation],
              };
              printWarning();
              console.log("New FWW Warning PDF Created");
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
};
function mBtn5() {
              let modal1 = document.getElementById('myModal1');
              modal1.style.display = "none";
              console.log("MUST ISSUE NEW NOTICE OF DH / OR NAVIGATE TO DISCIPLINARY HEARING SCREEN");
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
};

function mBtn6() {
              let modal1 = document.getElementById('myModal1');
              modal1.style.display = "none";
              uploadwarningdata(globalS.employeeid,globalS.misconducttype,globalS.chargefixeddescription,globalS.warningtype,globalS.misconductdate,
              globalS.chargedescription,globalS.warningduration,globalS.warninglapsedate, false);
              console.log("New "+globalS.warningtype+ " created");
              var date = globalS.misconductdate
              var datea = new Date(date).toString('d MMM yyyy');
              var date2 = globalS.warninglapsedate
              var dateb = new Date(date2).toString('d MMM yyyy');
              warningFields = {
              EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
              EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
              OffenceDate: [datea],
              CombinedDescription: [globalS.chargefixeddescription+" "+globalS.chargedescription],
              LapseMonths: [globalS.warningduration],
              LapseDate: [dateb],
              warningtype: [globalS.warningtype],
              };
              printWarning();
              clearwarningfields();
              setTimeout(clickcurrentemployeecard, 50);
};

function  deletecharge(){
  if (selectedChargeCurrent != ''){
  var charges = document.getElementsByClassName('dhcharge')
  var charges2 = document.getElementsByClassName('dhcharge-active')
  currentCharge = selectedChargeCurrent
  deletechargeno = document.getElementById(selectedChargeCurrent).getAttribute("chargeno")
  document.getElementById(selectedChargeCurrent).outerHTML = "";
  for(i = 0;i < charges.length; i++){
  var  thischargenumber = charges[i].getAttribute("chargeno")
    if (thischargenumber > deletechargeno) {
            var newchargeno = thischargenumber -1
            var newid = "Charge"+newchargeno
            var newonclick = "chargeclickmenu('Charge"+newchargeno+"')"
            charges[i].setAttribute("chargeno", newchargeno)
            charges[i].setAttribute("onclick", newonclick)
            charges[i].setAttribute("id", newid)
            var newinnerhtml = '<strong>Charge '+newchargeno+':</strong>'+' '+charges[i].getAttribute("chargefixeddescription")+" "+charges[i].getAttribute("chargedescription")
            charges[i].innerHTML = newinnerhtml
  }
}
selectedChargeCurrent = '';
}}

function addcharge(){
  var k = ""
  var charges = document.getElementsByClassName('dhcharge').length
  var charges2 = document.getElementsByClassName('dhcharge-active').length
  var currentnoofcharges = charges + charges2
  console.log("Current number of Charges: "+currentnoofcharges)
  var nexcchargeno = currentnoofcharges+1;
  if (nexcchargeno === 11) {alert("There is a maximum of 10 charges allowed per Disciplinary Hearing")} else {
  var mt = document.getElementById('dhmisconducttype').value
  var cfd = document.getElementById('dhfixedchargedesc').value
  var cd = document.getElementById('dhchargedescription').value
  k += '<p id="Charge'+nexcchargeno+'" chargeno="'+nexcchargeno+'" onclick="chargeclickmenu('+"'"+'Charge'+nexcchargeno+"'"+')" misconducttype="'+mt+'" chargefixeddescription="'+cfd+'" chargedescription="'+cd+'" class="dhcharge row test col-md-12 col-sm-12 col-xs-12"><strong>Charge '+nexcchargeno+':</strong>'+' '+cfd+' '+cd+'</p>';
  document.getElementById('dhchargecontainer').innerHTML += k
  var k = ""
  var nexcchargeno = ''
  document.getElementById('dhmisconducttype').value = ''
  document.getElementById('dhfixedchargedesc').value = ''
  document.getElementById('dhchargedescription').value = ''
}
}

function editcharge(){
  chargeno = document.getElementById(selectedChargeCurrent).getAttribute("chargeno") -1
  document.getElementById('dhchargedescription').value = document.getElementById(selectedChargeCurrent).getAttribute("chargedescription")
  document.getElementById('dhmisconducttype').value = document.getElementById(selectedChargeCurrent).getAttribute("misconducttype")
  document.getElementById('dhfixedchargedesc').value =  document.getElementById(selectedChargeCurrent).getAttribute("chargefixeddescription")
  deletecharge()
}

function cleardhfields(){
  document.getElementById('dhmisconductdate').value = "";
  document.getElementById('hearingdate').value = "";
  document.getElementById('hearingtime').value = "";
  document.getElementById('hearingvenue').value = "";
  document.getElementById('dhchargecontainer').innerHTML = "";
}

function submitnewdh(){
  dhFields = {}
  // var currenthearingno = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
  if (document.getElementById('dhmisconductdate').value === ""||document.getElementById('hearingdate').value === ""||
      document.getElementById('hearingtime').value === ""||document.getElementById('hearingvenue').value === ""
    ) {alert("Please complete all the fields")}
  if (document.getElementsByClassName('dhcharge').length === 0) {alert("Please add at least one charge")}
  else {
  var obj = {}
  var obj1 = []
  var mt = []
  var cfd = []
  var cd = []
  obj['misconductype'] = "";
  obj['chargefixeddescription'] = '';
  obj['chargedescription'] = "";
  var charges = document.getElementsByClassName('dhcharge')
  for(i = 0;i < charges.length; i++){
      mt.push(document.getElementsByClassName('dhcharge')[i].attributes[1].textContent)
      cfd.push(document.getElementsByClassName('dhcharge')[i].attributes[4].textContent)
      cd.push(document.getElementsByClassName('dhcharge')[i].attributes[5].textContent)
}
for(i = 0;i < charges.length; i++){
    obj1.push(document.getElementsByClassName('dhcharge')[i].attributes[4].textContent+' '+document.getElementsByClassName('dhcharge')[i].attributes[5].textContent)
    // console.log(obj1)
}
obj['misconductype'] = mt
obj['chargefixeddescription'] = cfd
obj['chargedescription'] = cd
obj['misconductdate'] = document.getElementById('dhmisconductdate').value
obj['hearingdate'] = document.getElementById('hearingdate').value
obj['hearingtime'] = document.getElementById('hearingtime').value
obj['hearingvenue'] = document.getElementById('hearingvenue').value
obj['status'] = "Awaiting Hearing Date"
obj['employerid'] = 0001
obj['employeeid'] = document.getElementById(selectedEMPCurrent).getAttribute("employeeid")
// console.log(obj)
var date1 = document.getElementById('hearingdate').value
var datea = new Date(date1).toString('d MMM yyyy');
dhFields = {
  EmployeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
  EmployeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
  DisciplinaryHearingAddress: [document.getElementById('hearingvenue').value],
  HearingDate: [datea],
  HearingTime: [document.getElementById('hearingtime').value],
  UserDescription1: ['Charge 1 '+obj1[0]],
  UserDescription2: ['Charge 2 '+obj1[1]],
  UserDescription3: ['Charge 3 '+obj1[2]],
  UserDescription4: ['Charge 4 '+obj1[3]],
  UserDescription5: ['Charge 5 '+obj1[4]],
  UserDescription6: ['Charge 6 '+obj1[5]],
  UserDescription7: ['Charge 7 '+obj1[6]],
  UserDescription8: ['Charge 8 '+obj1[7]],
  UserDescription9: ['Charge 9 '+obj1[8]],
  UserDescription10: ['Charge 10 '+obj1[9]],
  };
// console.log(dhFields)
var noofcharges = charges.length
fetch('http://localhost:3000/submitnewdh/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obj)
   })
     .then(response => response.json())
     .then(function(data) {
         // console.log("response form server op upload of warning data: "+data.warningno)
         globalS.dhno = data.dhnumber['0']
         console.log("DH Data Uploaded to DB. DH No:"+globalS.dhno)
        // console.log(res.status)
        printnoticeofdh(globalS.dhno, noofcharges ,dhFields)
        alldhboxesclose()
        cleardhfields();
        setTimeout(clickcurrentemployeecard, 50);
    });
}
}

// populate insert outcome section of DH
function pupulatedhinsertoutcome() {
    var currentdhnumber = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
    fetch('http://localhost:3000/pupulatedhinsertoutcome/'+ currentdhnumber, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        console.log(data)
        var noofcharges = data["0"].chargefixeddescription.length
        var k =  ''
        for(i = 0;i < noofcharges; i++){
              var chargeno = i + 1
               k += '<div id="dhcharge'+chargeno+'" class="row"><div class="outcome form-group col-md-6 col-sm-6 col-sx-12"><label>Charge '+chargeno+'</label>'
               k += '<p  id="dhcharge'+chargeno+'charge" class="" style="overflow-x: hidden; overflow-y: auto;">'+data["0"].chargefixeddescription[i]+' '+data["0"].chargedescription[i]+'</p></div>'
               k += '<div class="form-group col-md-2 col-sm-6 col-sx-12"><label>Finding</label><select onchange="setoutcomesanctionoptions('+"'"+'dhcharge'+chargeno+"'"+')" id="dhcharge'+chargeno+'finding" class="form-control">'
               k += '<option value="" selected>choose...</option><option>Guilty</option><option>Not Guilty</option><option>Abandoned</option></select>'
               k += '</div><div class="form-group col-md-2 col-sm-6 col-sx-12"><label>Sanction</label><select  onchange="setoutcomedurationoptions('+"'"+'dhcharge'+chargeno+"'"+')" id="dhcharge'+chargeno+'sanction" class="form-control">'
               k += '<option value="" selected>choose...</option><option>Verbal Warning</option><option>Written Warning</option><option>Final Written Warning</option>'
               k += '<option>Suspention</option><option>Demotion</option><option>Summary Dismissal</option><option>n/a</option></select></div><div class="form-group col-md-2 col-sm-6 col-sx-12">'
               k += '<label>Duration</label><select dhnumber="'+data["0"].dhnumber+'" id="dhcharge'+chargeno+'duration" class="form-control"><option value="" selected>choose...</option><option>6 Months</option>'
               k += '<option>12 Months</option><option>n/a</option></select></div></div>'
      //            kk+= k;
         };
         document.getElementById('dhoutcomecontainer').innerHTML = k;
      // });
})
}

function setoutcomesanctionoptions(chargeno){
  var finding = document.getElementById(chargeno+'finding').value
  var id1 = chargeno+'sanction'
  var id2 = chargeno+'duration'
  if (finding === "Not Guilty"||finding === "Abandoned"){
          document.getElementById(id1).value = "n/a"
          document.getElementById(id1).disabled = true;
          document.getElementById(id2).value = "n/a"
          document.getElementById(id2).disabled = true;
  } else {
          document.getElementById(id1).disabled = false;
          document.getElementById(id2).disabled = false;
          document.getElementById(id1).value = ""
          document.getElementById(id2).value = ""
  }
};

function setoutcomedurationoptions(chargeno){
    var sanction = document.getElementById(chargeno+'sanction').value
    var id2 = chargeno+'duration'
    if (sanction === "Verbal Warning"||sanction === "Written Warning"||sanction === "Final Written Warning"){
         document.getElementById(id2).disabled = false;
         document.getElementById(id2).value = ""} else {
         document.getElementById(id2).value = "n/a"
         document.getElementById(id2).disabled = true;
         }
}

function submitdhoutcome(){
  var noofoutcomes = document.getElementsByClassName('outcome').length
  var missingfield = ''
  // check that all the fields are Completed
  for(i = 0;i < noofoutcomes; i++){
      var outcomeno = i + 1
      if (document.getElementById('dhcharge'+outcomeno+'finding').value === "")  {console.log('dhcharge'+outcomeno+'finding'); missingfield = true}
      if (document.getElementById('dhcharge'+outcomeno+'sanction').value === "")  {console.log('dhcharge'+outcomeno+'sanction'); missingfield = true}
      if (document.getElementById('dhcharge'+outcomeno+'duration').value === "")  {console.log('dhcharge'+outcomeno+'duration'); missingfield = true}
    }
  if (missingfield === true) {alert("Please complete all the fields")} else {

  var obj = {}
  var finding = []
  var sanction = []
  var duration = []
  for(i = 0;i < noofoutcomes; i++){
      var outcomeno = i + 1
      finding.push(document.getElementById('dhcharge'+outcomeno+'finding').value)
      sanction.push(document.getElementById('dhcharge'+outcomeno+'sanction').value)
      duration.push(document.getElementById('dhcharge'+outcomeno+'duration').value)
    }
    obj['finding'] = finding
    obj['sanction'] = sanction
    obj['duration'] = duration
    obj['dhnumber'] = document.getElementById('dhcharge'+outcomeno+'duration').getAttribute("dhnumber")
    obj['outcomesubmitted'] = true
    obj['status'] = "Finalized (outcome submitted)"
    console.log(obj)
    fetch('http://localhost:3000/submitdhoutcome/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
       })
       .then(res => {
       console.log("DH outcome data uploaded to Server")
       console.log(res.status)
       setTimeout(clickcurrentemployeecard, 100);
      });
  }
}

// populate dh container
function pupulatedhcontainer() {
    var currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid");
    fetch('http://localhost:3000/pupulatedhcontainer/'+ currentemployeeno, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .then(function(data) {
        var noofdhs = data.length
        var k = ''
        // var currenrDHcards = []
        document.getElementById('dhcardcontainer').innerHTML = ''
        if (data.length === 0){
          k += '<div class="card-header card col-sm-12 col-xs-12"><div class="row"><div class="col-xs-12"></div><div class="col-xs-12 text-center"><strong>No Disciplinary Hearings Found</strong></div><div class="col-xs-12"></div></div></div>';
        } else {
        for(i = 0;i < noofdhs; i++){
            no_of_inner_loops = data[i].chargedescription.length
            currentDHcards.push("DHcard"+data[i].dhnumber)
            k += '<div dhnumber="'+data[i].dhnumber+'" hearingdate="'+data[i].hearingdate+'" outcomesubmitted="'+data[i].outcomesubmitted+'" onclick="DHclickmenu(DHcard'+data[i].dhnumber+')" id="DHcard'+data[i].dhnumber+'" class="card col-sm-12" noticeofdisciplinaryhearing="'+data[i].noticeofdisciplinaryhearing+'"'
            k += 'noticeofsuspention="'+data[i].noticeofsuspention+'" minutesofhearing="'+data[i].minutesofhearing+'" noticeofsumarydismissal="'+data[i].noticeofsumarydismissal+'" noticeofpostponement="'+data[i].noticeofpostponement+'" noticeofsuspention_s="'+data[i].noticeofsuspention_s+'" style="">'
            k += '<div class="card-header"><div class="container"><div class="row">'
            k += '<div class="col-sm-4 col-xs-12 text-left"><strong>Disciplinary Hearing</strong></div>'
            k += '<div id="dhhearingdate-dhno'+data[i].dhnumber+'" class="col-sm-4 col-xs-12 text-left"><strong>'+data[i].hearingdate+'</strong></div>'
            k += '<div id="dhstatus-dhno'+data[i].dhnumber+'" class="col-sm-4 col-xs-12 text-left"><strong>Status: '+data[i].status+'</strong></div></div></div></div>'
            k += '<div class="container card-body text-dark"><div class="row"><div class="col-sm-6 col-xs-12 card-border-right">'
            k += '<div class="row"><div class="col-sm-12" style="padding: 0px 10px 0px 10px">'
            k += '<p class="card-text1"><strong>Charges:</strong></p>'
            for(j = 0;j < no_of_inner_loops; j++){
              chano = j + 1
              k += '<p id="lineA'+j+'" class="card-text1">'+chano+'. '+data[i].chargefixeddescription[j]+'</p>'}
            k += '</div></div></div>'
            k += '<div class="col-sm-3 col-xs-12 card-border-right"><p class="card-text1"><strong>Finding:</strong></p>'
            for(j = 0;j < no_of_inner_loops; j++){
              if (data[i].outcomesubmitted === true){k += '<p class="card-text1">'+data[i].finding[j]+'</p>'} else {
                k += '<p id="lineB'+j+'"class="card-text1">no finding yet</p>'}}
            k += '</div><div class="col-sm-3 col-xs-12 "><p class="card-text1"><strong>Sanction:</strong></p>'
            for(j = 0;j < no_of_inner_loops; j++){
                if (data[i].outcomesubmitted === true) {k += '<p class="card-text1">'+data[i].sanction[j]+'</p>'} else {
                  k += '<p id="lineC'+j+'"class="card-text1">no sanction yet</p>'}}
            k += '</div></div><p class="card-text"></p></div></div>'
            }}
          document.getElementById('dhcardcontainer').innerHTML = k
      })
      // console.log(currentDHcards)
  }
  function runmodal4(doctype){
    // Get the modal
    var sent = ''
    if (doctype === "noticeofdisciplinaryhearing") {var sent = " Notice of Disciplinary Hearing"}
    if (doctype === "noticeofsuspention") {var sent = " Notice of Suspention (Pre Hearing)"}
    if (doctype === "noticeofsuspention_s") {var sent = " Notice of Suspention (Post Hearing)"}
    if (doctype === "minutesofhearing") {var sent = " Minutes of Disciplinry Hearing"}
    if (doctype === "noticeofpostponement") {var sent = " Notice of Postponement"}
    if (doctype === "noticeofsumarydismissal") {var sent = " Notice of Summary Dismissal"}
    let modal = document.getElementById('myModal4')
    let k = ""
       k+= '<p>Please select a file to upload for the'+sent+'</p><input class="form-control" id="dhdocfile" placeholder="" type="file"/>'
       document.getElementById('upoaddhdocbody').innerHTML = k
       modal.style.display = "block";

    let l = ""
    l +=   '<button class="btn" onclick="uploaddhdocs('+"'"+doctype+"'"+')">Submit</button><button class="btn" onclick="close_myModal4()">Cancel</button>'
    document.getElementById('mymodal4buttons').innerHTML = l

}

function viewDHdocs() {
      var dhno = document.getElementById(selectedDHCurrent).getAttribute("dhnumber");
      var k = ''
      k += '<fieldset class="border"><legend class="border">pre hearing documents</legend><div class="row"><div class="col-md-1 col-sm-1 col-xs-1"></div>'

      k += '<div align="center" id="noticeofdisciplinaryhearing'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks1/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Notice of Disciplinary hearing</div></div>'

      k += '<div align="center" id="noticeofsuspention'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks2/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 40px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Notice of Suspention (pre-hearing)</div></div>'

      k += '<div align="center" id="minutesofhearing'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks3/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 40px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Minutes of Disciplinary Hearing</div></fieldset>'

      k += '<fieldset class="border"><legend class="border">post hearing documents</legend></div><div class="col-md-1 col-sm-1 col-xs-1"></div></div></div>'

      k += '<div align="center" id="noticeofpostponement'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks4/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 0px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Notice of Postponement</div></div>'

      k += '<div align="center" id="noticeofsuspention_s'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks5/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 40px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Notice of Suspention (Post hearing)</div></div>'

      k += '<div align="center" id="noticeofsumarydismissal'+dhno+'" onclick="window.open'+"('http://localhost:3000/dhdocbacks6/"+dhno+"', '_blank')"+';" class="row test col-md-3 col-sm-3 col-xs-3" style='
      k += '"border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 0.25rem;margin-bottom: 3px; margin-left: 40px; margin-right: 0px;"><div style="display:flex;justify-content:center;align-items:center;height: 40px; padding-left: 6px; padding-right: 2px">Notice of Summary Dismissal</div></fieldset>'

      // k += '</div><div class="col-md-1 col-sm-1 col-xs-1"></div></div>'

      document.getElementById('viewdhdocsBoxA').innerHTML = k

  var noticeofdisciplinaryhearing = document.getElementById(selectedDHCurrent).getAttribute("noticeofdisciplinaryhearing");
  var noticeofsuspention = document.getElementById(selectedDHCurrent).getAttribute("noticeofsuspention");
  var minutesofhearing = document.getElementById(selectedDHCurrent).getAttribute("minutesofhearing");
  var noticeofsuspention_s = document.getElementById(selectedDHCurrent).getAttribute("noticeofsuspention_s");
  var noticeofpostponement = document.getElementById(selectedDHCurrent).getAttribute("noticeofpostponement");
  var noticeofsumarydismissal = document.getElementById(selectedDHCurrent).getAttribute("noticeofsumarydismissal");

if (noticeofdisciplinaryhearing != 'true') {
      document.getElementById('noticeofdisciplinaryhearing'+dhno+'').setAttribute("onclick", "javascript: runmodal4('noticeofdisciplinaryhearing');")
      document.getElementById('noticeofdisciplinaryhearing'+dhno+'').innerHTML = 'click to scan back Notice of Disiplinary Hearing'
}
if (noticeofsuspention != 'true') {
      document.getElementById('noticeofsuspention'+dhno+'').setAttribute("onclick", "javascript: runmodal4('noticeofsuspention');")
      document.getElementById('noticeofsuspention'+dhno+'').innerHTML = 'click to scan back Notice of Suspention (Pre Hearing)'
}
if (minutesofhearing != 'true') {
      document.getElementById('minutesofhearing'+dhno+'').setAttribute("onclick", "javascript: runmodal4('minutesofhearing');")
      document.getElementById('minutesofhearing'+dhno+'').innerHTML = 'click to scan back Minutes of Disiplinary Hearing'
}
if (noticeofsuspention_s != 'true') {
      document.getElementById('noticeofsuspention_s'+dhno+'').setAttribute("onclick", "javascript: runmodal4('noticeofsuspention_s');")
      document.getElementById('noticeofsuspention_s'+dhno+'').innerHTML = 'click to scan back Notice of Suspention (Post Hearing)'
}
if (noticeofpostponement != 'true') {
      document.getElementById('noticeofpostponement'+dhno+'').setAttribute("onclick", "javascript: runmodal4('noticeofpostponement');")
      document.getElementById('noticeofpostponement'+dhno+'').innerHTML = 'click to scan back Notice of Postponement'
}
if (noticeofsumarydismissal != 'true') {
      document.getElementById('noticeofsumarydismissal'+dhno+'').setAttribute("onclick", "javascript: runmodal4('noticeofsumarydismissal');")
      document.getElementById('noticeofsumarydismissal'+dhno+'').innerHTML = 'click to scan back Notice of Summary Dismissal'
}
};

function uploaddhdocs(doctype){
      var dhnumber = document.getElementById(selectedDHCurrent).getAttribute("dhnumber");
      var idfile = document.getElementById('dhdocfile').files[0];
                 // create reader
                 var reader = new FileReader();
                 reader.readAsBinaryString(idfile);
                 reader.onload = function(e) {
                 // browser completed reading file - display it
                 var base64Str = btoa(e.target.result);
                 var obj = {};
                 obj['docstring'] = base64Str;
                 obj['doctype'] = doctype;
                 obj['docboolean'] = doctype+'_doc'
                 console.log(obj)
                 fetch('http://localhost:3000/uploaddhfile/' + dhnumber, {
                             method: 'post',
                             headers: {'Content-Type': 'application/json'},
                             body: JSON.stringify(obj)
                    })
                    .then(res => {
                    console.log(doctype+ " uploaded to Server")
                    // getwarnings();
                    document.getElementById(selectedDHCurrent).setAttribute(doctype, true);
                    document.getElementById('dhdocfile').value = '';
                    close_myModal4();
                    viewdhdocsBoxClose();
                    viewdhdocsBox();

                    console.log(res.status)
                     });
                   }
  }

function submitpostponement(){
if (document.getElementById('PPnoticeserveddate').value === ''||document.getElementById(selectedDHCurrent).getAttribute("hearingdate") === ''||document.getElementById('PPreasons').value === ''||
document.getElementById('PPhearingvenue').value === ''||document.getElementById('PPhearingdate').value === ''||document.getElementById('PPhearingtime').value === ''){alert("Please complete all the fields")} else {

var dhcurrent = document.getElementById(selectedDHCurrent).getAttribute("dhnumber")
var hearingtime = document.getElementById('PPhearingtime').value
var hearingdate = document.getElementById('PPhearingdate').value
var date1 = document.getElementById('PPnoticeserveddate').value
var datea = new Date(date1).toString('d MMM yyyy');
var date2 = document.getElementById('PPhearingdate').value
var dateb = new Date(date2).toString('d MMM yyyy');
postponedhFields = {
  employeeName: [document.getElementById(selectedEMPCurrent).innerHTML],
  employeeID: [document.getElementById(selectedEMPCurrent).getAttribute("idnumber")],
  serviceDate: [datea],
  origionalDate: [document.getElementById(selectedDHCurrent).getAttribute("hearingdate")],
  postponementReason: [document.getElementById('PPreasons').value],
  hearingVenue: [document.getElementById('PPhearingvenue').value],
  hearingDate: [dateb],
  hearingTime: [hearingtime],
  };
  // console.log(postponedhFields)

document.getElementById('dhhearingdate-dhno'+dhcurrent).innerHTML = '<strong>'+dateb+'</strong>'
document.getElementById('dhhearingdate-dhno'+dhcurrent).innerHTML = '<strong>'+'Status: Postponed'+'</strong>'

  obj = {}
  obj['dhnumber'] = dhcurrent
  obj['hearingtime'] = hearingtime
  obj['hearingdate'] = hearingdate
  // console.log(obj)
  fetch('http://localhost:3000/submitdhpostponement/', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(obj)
     })
     .then(res => {
                     console.log("DH Postponement data uploaded to Server")
                     console.log(res.status)
                     printpostponementdh(postponedhFields)
                     postponedhBoxClose()
                     setTimeout(clickcurrentemployeecard, 100);
    });
}
}

// Fetch branched from Server and populates New Warning dropdowns
function getbranches(){
    currentemployerno = 0002
    fetch('http://localhost:3000/getbranches/'+currentemployerno, {
       method: 'get',
       headers: {'Content-Type': 'application/json'},
   })
     .then(response => response.json())
     .then(function(data) {
         console.log(data["0"].branches.length)
       });
  };

  function addbranchdeptjobtitle(type ,newitem){
    currentemployerno = 0001
    var obj = {};
    obj['employerid'] = currentemployerno;
    obj['columnname'] = type;
    obj['newitem'] = newitem;
    console.log(obj);
    fetch('http://localhost:3000/addbranchdeptjobtitle/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
       })
       .then(res => {
       console.log("New "+type+"'"+newitem+"' Uploaded to Server")
       console.log(res.status)
        });
  }

  function removebranchdeptjobtitle(type ,deldata){
    currentemployerno = 0001
    var obj = {};
    obj['employerid'] = currentemployerno;
    obj['columnname'] = type;
    obj['newitem'] = deldata;
    console.log(obj);
    fetch('http://localhost:3000/removebranchdeptjobtitle/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
       })
       .then(res => {
       console.log(+deldata+" removed from '"+type+"' column on Server")
       console.log(res.status)
        });
  }

function getcontractitem(){
    var pdf = {content:[],styles:{default:{font: 'Helvetica'},
                                  header:{fontSize: 12,	decoration: 'underline', bold: true,margin: [0, 0, 40 , 5]},
                                  topheader: {fontSize: 20,bold: true,alignment: 'center',margin: [0, 4, 0, 0]},
                                  topheader2: {fontSize: 20, bold: true, alignment: 'center',	margin: [0, 4, 0, 40],},
                                  subheader: {fontSize: 13,	bold: true, margin: [10, 6, 40, 0]},
                                  subheader2: {	fontSize: 12,	bold: false,	margin: [10, 6, 40, 0]},
                                  headingtext: {fontSize: 11,	margin: [10, 4, 5, 0], alignment: 'justify'},
                                  subheadingtext: {fontSize: 11, margin: [0, 0, 0, 5], alignment: 'justify'},
                                  // subheadingtext1: {fontSize: 11, margin: [0, 0, 0, 5], alignment: 'justify'}
                                }
}
    fetch('http://localhost:3000/getcontract/', {
       method: 'get',
       headers: {'Content-Type': 'application/json'},
   })
     .then(response => response.json())
     .then(function(data) {
         console.log(data)
         // var docDefinition = "{content:[";
         var num1 = 1
         var num2 = 1
         var num3 = 1
         var tnum2 = ''
         var temp = []
         for(i = 0;i < data.length; i++){

                   if (data[i].heading === true & data[i].headingnumber === '0'){
                     pdf['content'].push({text: data[i].headingtext, style: data[i].headingstyle})
                   }
                   if (data[i].heading === true & data[i].headingnumber === '1'){
                     pdf['content'].push({columns: [{	width: 25,text: num1},	{width: '*',style: data[i].headingstyle,text: data[i].headingtext},]	},)
                   }

                   if (data[i].paragraph = true & data[i].paragraphnumber === '0'){
                       pdf['content'].push({text: data[i].paragraphtext, style: data[i].paragraphstyle})

                  }
                    if (data[i].paragraph = true & data[i].paragraphnumber === '2'){
                      pdf['content'].push({columns: [{width: 25, style: data[i].paragraphstyle, text: num1+'.'+num2},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                      num2++
                      num3 = 1
                    }
                    if (data[i].paragraph = true & data[i].paragraphnumber === '3'){
                      tnum2 = num2-1
                      pdf['content'].push({columns: [{width: 25, style: data[i].paragraphstyle,text: ''},{	width: 35, style: data[i].paragraphstyle, text: num1+'.'+tnum2+'.'+num3},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                      num3++
                    }
       }
         console.log(pdf)
          // pdfMake.createPdf(pdf).open();
         pdfMake.createPdf(pdf).download('test123.pdf')
  })
}


function testdocdef(){
  pdfMake.createPdf(docDefinition).download('test123.pdf')
}

function getcontractparagrapgheadings(){
  contractname = document.getElementById('editscreen_contractname').value
  current_contract = {}
  console.log(contractname)
  fetch('http://localhost:3000/getcontractparagrapgheadings/'+contractname, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {

       current_contract = data
       console.log(current_contract)
       var k = ''
       var cur_itemname = data[0].itemname
       // console.log("starting itemname ="+data[0].itemname)
       var num1 = 1
       var num2 = 1
       var num3 = 1
       var tnum1 = ''
       var tnum2 = ''
       var current_optionnumber = 1
       var currentitemtype = ''
       var previousitemtype = ''
       for(i = 0;i < data.length; i++){
         if (data[i].itemtype != 'Option'){

             currentitemtype = data[i].itemtype

             // if (previousitemtype != '' & previousitemtype != currentitemtype & previousitemtype != 'Paragraph'){num2++}

             k+='<div class="row cardlikeborder">'

             if (data[i].itemname === cur_itemname & i != 0){k+='<div class="col-md-3 col-sm-3 col-xs-3"><strong></strong></div>'}  else
             {k+='<div class="col-md-3 col-sm-3 col-xs-3"><strong style="text-transform: uppercase">'+data[i].itemname+'</strong></div>'
              num1++
              num2 = 1}
                if (data[i].heading = true & data[i].headingnumber === '1'){
                  tnum1 = num1-1
                  k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'.'+num2+'</strong></div>'
                  num2++
                  num3 = 1}

                if (data[i].heading = true & data[i].headingnumber === '0'){
                  tnum1 = num1-1
                  k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'</strong></div>'

                  num3 = 1}

              if (data[i].paragraph = true & data[i].paragraphnumber === '0'){
                tnum1 = num1-1
                k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'.'+num2+'</strong></div>'
                num2++
                num3 = 1}

              if (data[i].paragraph = true & data[i].paragraphnumber === '1'){
                tnum1 = num1-1
                k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'.'+num2+'</strong></div>'
                num2++
                num3 = 1}

             if (data[i].paragraph = true & data[i].paragraphnumber === '2'){
               tnum1 = num1-1
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'.'+num2+'</strong></div>'
               num2++
               num3 = 1}

             if (data[i].paragraph = true & data[i].paragraphnumber === '3'){
               tnum2 = num2-1
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong>'+tnum1+'.'+tnum2+'.'+num3+'</strong></div>'
               // num2++
               num3++
               // num3 = 1
             }
             if (data[i].paragraph = true & data[i].paragraphnumber === '4'){
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong></strong></div>'
             }
             if (data[i].paragraph = true & data[i].paragraphnumber === '5'){
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong></strong></div>'
             }
             if (data[i].paragraph = true & data[i].paragraphnumber === '6'){
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong></strong></div>'
             }
             if (data[i].paragraph = true & data[i].paragraphnumber === '7'){
               k+= '<div class="col-md-1 col-sm-1 col-xs-1" style="display: block"><strong></strong></div>'
             }




             k+='<div dataobjpositionno="'+i+'" align="justify" id="displaypanel_'+data[i].itemno+'" class="col-md-6 col-sm-6 col-xs-6" style="display: block">'
             k+='<div ><strong dataobjpositionno="'+i+'" id="heading_'+data[i].itemno+'">'+data[i].headingtext+'</strong></div>'
             k+='<div dataobjpositionno="'+i+'" id="text_'+data[i].itemno+'" >'+data[i].paragraphtext+'</div></div>'
             k+='<div id="displaypanel1_'+data[i].itemno+'" class="col-md-12 col-sm-12 col-xs-12" style="display: none">'
             k+= '<div><textarea id="edit_heading_'+data[i].itemno+'"name="textarea" class="form-control reminputborder" style="width:1000px; height:auto;"></textarea></div>'
             k+= '<div><textarea id="edit_text_'+data[i].itemno+'"name="textarea" class="form-control reminputborder" rows="5" style="width:1000px;"></textarea></div>'
             k+='<button class="btn btn-xs" onclick="submitedit('+data[i].itemno+','+i+')">Submit</button><button class="btn btn-xs" onclick="closeeditbox('+data[i].itemno+')">Cancel</button></div>'
             k+='<div align="left" id="editoptions_'+data[i].itemno+'" class="editfields col-md-2 col-sm-2 col-xs-2">'
             k+='<div  class="checkbox"><label><input type="checkbox" id="useparagraph_'+data[i].itemno+'" value="" checked>Use paragraph</label></div>'
             k+='<div  class="checkbox"><label><input type="checkbox" id="insertpagebreak_'+data[i].itemno+'" value="" >Insert Pagebreak</label></div>'

             if (data[i].partofoption != true)
             {k+='<button class="btn btn-xs" onclick="editcontractfield('+data[i].itemno+')">Edit Parapraph</button></div></div>'} else
             {k+='<p>Optional Paragraph(Not Editable)</p></div></div>'}

             var cur_itemname = data[i].itemname
             current_optionnumber = data[i].optionnumber
             previousitemtype = currentitemtype
           }
      }
document.getElementById('contrattextcontainer').innerHTML = k
})
}

function editcontractfield(itemno){
  document.getElementById('displaypanel1_'+itemno).style = "display: block"
  document.getElementById('displaypanel_'+itemno).style = "display: none"
  document.getElementById('editoptions_'+itemno).style = "display: none"
  document.getElementById('edit_heading_'+itemno).value = document.getElementById('heading_'+itemno).innerHTML
  document.getElementById('edit_text_'+itemno).value = document.getElementById('text_'+itemno).innerHTML


}

function closeeditbox(itemno){
  document.getElementById('displaypanel1_'+itemno).style = "display: none"
  document.getElementById('displaypanel_'+itemno).style = "display: block"
  document.getElementById('editoptions_'+itemno).style = "display: block"
  // document.getElementById('edit_heading_no').value = document.getElementById('heading_no').innerHTML
  // document.getElementById('edit_text_no').value = document.getElementById('text_no').innerHTML
}
function submitedit(itemno, dataobjpositionno){
  console.log("dataobjpositionno= "+dataobjpositionno)
  current_contract[dataobjpositionno].paragraphtext = document.getElementById('edit_text_'+itemno).value
  current_contract[dataobjpositionno].headingtext = document.getElementById('edit_heading_'+itemno).value
  document.getElementById('displaypanel1_'+itemno).style = "display: none"
  document.getElementById('displaypanel_'+itemno).style = "display: block"
  document.getElementById('editoptions_'+itemno).style = "display: block"
    document.getElementById('heading_'+itemno).innerHTML = document.getElementById('edit_heading_'+itemno).value
    document.getElementById('text_'+itemno).innerHTML = document.getElementById('edit_text_'+itemno).value
    console.log(current_contract)
}
function sendcontracttoemployer(){
  updatecurent_contract()
  obj = {}
  obj['contract'] = JSON.stringify(current_contract)
  obj['employerid'] = 0001
  console.log(obj)
  fetch('http://localhost:3000/sendcontracttoemployer/', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(obj)
     })
     .then(res => {
     console.log("Contract Uploaded to DB")
     console.log(res.status)
      });

}

function getemployercontracts(){
  var currentemployerno = 0001
  fetch('http://localhost:3000/getemployercontracts/'+currentemployerno, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
 })
   .then(response => response.json())
   .then(function(data) {
       // console.log(data)
       contracts = []
       var k = ''
       for(i = 0;i < data[0].contracts.length; i++){
         // console.log(contracts[i])
         contracts.push(JSON.parse(data[0].contracts[i]))

             k+='<div id="contractno_'+i+'" class="row cardlikeborder">'
             k+='<div class="col-md-6 col-sm-6 col-xs-6"><strong>'+contracts[i][0].contractname+'</strong></div>'
             k+='<div class="col-md-3 col-sm-3 col-xs-3"><strong>Version 1.1</strong></div>'
             k+='<div class="col-md-3 col-sm-3 col-xs-3"><strong>Uploaded on 12 Sept 2018</strong></div>'
             k+='<div id="contractnotools_'+i+'" align="right" style="margin-right: 20px;" class="row"><button class="btn btn-xs" onclick="submitedit()">Edit Contract</button><button class="btn btn-xs" onclick="runmodal7(contracts['+i+'],'+i+')">Populate Contract for Employee</button></div></div>'

    }
    document.getElementById('clientcontractcontainer').innerHTML = k

    // console.log(contracts[3])


})}

function getcontractitem1(data, employeeid){
    // updatecurent_contract()
    // console.log(current_contract)
    var pdf = {footer: function(pagenumber, pagecount) {return{margin: [40, 0,40,0],alignment: 'right',fontSize: 9, text: 'Page ' + pagenumber + ' of ' + pagecount  };},content:[],styles:{default:{font: 'Helvetica'},
                                  header:{fontSize: 12,	decoration: 'underline', bold: true,margin: [0, 0, 40 , 5]},
                                  topheader: {fontSize: 20,bold: true,alignment: 'center',margin: [0, 4, 0, 0]},
                                  topheader2: {fontSize: 20, bold: true, alignment: 'center',	margin: [0, 4, 0, 40],},
                                  subheader: {fontSize: 12,	bold: true, margin: [0, 0, 40, 5]},
                                  subheader2: {	fontSize: 12,	bold: false,	margin: [10, 6, 40, 0]},
                                  headingtext: {fontSize: 11,	margin: [10, 4, 5, 0], alignment: 'justify'},
                                  subheadingtext: {fontSize: 11, margin: [0, 0, 0, 5], alignment: 'justify'},
                                  HDtopheader: {fontSize: 20,	bold:true,	alignment: 'center',margin:[0, 40, 0, 0],},
		                              HDtopheader2: {fontSize: 20,bold:true,alignment: 'center',	margin:[0, 4, 0, 40],},
		                              HDheader: {fontSize: 16,bold:true,	margin: [10,6,40,0]},
		                              HDsubheader: {fontSize: 13,	bold:true,	margin: [10,6,40,0]},
		                              HDsubheader2: {fontSize: 12,margin:[0, 6, 40, 0]},
		                              HDheadingtext: {fontSize: 11,margin:[10, 4, 5, 0],	alignment: 'justify'},
		                              HDsubheadingtext: {fontSize: 11,margin:[10, 4, 5, 0],alignment: 'justify'},
                                  HDtextright: {fontSize: 12,	margin:[0, 4, 5, 0], alignment: 'right', bold: true,},
		                              HDtextleft: {fontSize: 11,margin:[0, 4, 5, 7], alignment: 'left',bold: true,},
		                              HDtextleft1: {fontSize: 12,margin:[0, 4, 5, 7],alignment: 'left',bold: true, decoration: 'underline',},
                                  // subheadingtext1: {fontSize: 11, margin: [0, 0, 0, 5], alignment: 'justify'}
                                }
}
       // Insert the Contract heading
       pdf['content'].push({image:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RD4RXhpZgAATU0AKgAAAAgABAE7AAIAAAAPAAAISodpAAQAAAABAAAIWpydAAEAAAAeAAAQ0uocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFudG9uIEEuIEJydW5lAAAABZADAAIAAAAUAAAQqJAEAAIAAAAUAAAQvJKRAAIAAAADOTkAAJKSAAIAAAADOTkAAOocAAcAAAgMAAAInAAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMTg6MDk6MjcgMDk6NDk6NTEAMjAxODowOToyNyAwOTo0OTo1MQAAAEEAbgB0AG8AbgAgAEEALgAgAEIAcgB1AG4AZQAAAP/hCyFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDE4LTA5LTI3VDA5OjQ5OjUxLjk4NzwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5BbnRvbiBBLiBCcnVuZTwvcmRmOmxpPjwvcmRmOlNlcT4NCgkJCTwvZGM6Y3JlYXRvcj48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/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8ddo+Y/yA/GvEa4T0QooooAKKKKACiiigAooooAKKKKACiiigAooooAK9R+EGiAtd61MvKn7PDx06Fj/ACH515dX0T4P07+yvCGm22MP5Id/95/mP86ANuiiikMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPLPH1x53iiSPP+oiRB7Z+b/2auarX8VP5nirUG64lx+QA/pWRTEFFFFABRRRQAUUUUAFdp8NrfdqV7cf884hH/30c/8AstcXXoPw1QCyv37mRR+QP+NAHb14V8Trv7T46uUzlbeOOJf++dxH5sa91r528ZSGTxpqxPa6dfyOB/KuzBr37nDjnamY1FFFeoeOFFFFABRRRQAUUUUAek/By0DahqV5j/VRJED3+Ykn/wBAFes15x8HI8aPqUvdp1X8lz/WvR68bEO9VnvYVWoxPI/jHdl9X06zB4jgaX8WbH/sleb12vxVlMnjh1zny7eNR7dT/wCzVxVYHQFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFrTbX7dq1paYz586R4/3mA/rX0yBgAAYA6V87+DIxL420lTji6RuRnocj+VfRNAwooopAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHjXiRSvibUc/wDPw386zK2vF8fleLb4erq35qD/AFrFpiCiiigAooooAKKKKACvQ/ht/wAg69/66r/KvPK774aSfu9RjJ6GNh/49/hQB3VfOfitSvjDVwTn/TJT+bE/1r6Mr568cQ/Z/HGqKflzOX4/2gG/rXbg/jZwY5e4jCooor0zyAooooAKKKKACiiigD174O/8gC//AOvr/wBkFeiV5l8G5Q1nqsPdZI3/ADDf4V6bXi4j+Kz38NrRR4V8UFK+PLokcNHER9NoH9K5Cu5+LUPleM0f/nraI/5Fh/SuGrE3CiiigAooooAKKKKACiiigAooooAKKKKACiiigDf8D/8AI8aV/wBdx/I19C184+FphB4u0mRugvIgT7FgP619HUMYUUUUgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDzD4hW/leJRIOk0KsT7gkfyArlq7/4k2ubexuwPusY2P1wR/I1wFMQUUUUAFFFFABRRRQAV1/w5nEeuXEJ4EsGQPUgj/E1yFbHhO6+yeKbFyeGfyz/AMCG3+ZFAHsFeH/FS1Nv42aXHFzBHJ6Zxlf/AGWvb68v+Mdj8um36j+/C5+uCo/9CrpwsuWqcuMjzUjy6iiivXPDCiiigAooooAKKKKAPQvg9chNfvrYnHm2wf67WH/xRr2CvAfh/eix8daczfdkYwn/AIEMD9SK99rycXG1S57WClelbseU/GW0IvNLux0eOSI/gQf6mvMq9s+LFj9p8HfaFHzWs6uT/snKn9SPyrxOuU7AooooAKKKKACiiigAooooAKKKKACiiigAooooAlt5mt7qOZPvRuHH1BzX05FIssSSRnKuAwPqD0r5er6H8GX39o+DNLnJyfIEbfVPlP8A6DmgZu0UUUgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDE8X2X27wvdoBlolEy/8BOT+ma8ir3Z0WRGRxuVhgj1FeJalaNYapc2p5MMrID6gHj9KYitRRRQAUUUUAFFFFABTo5GilSRDhkIIPuKbRQB7jZ3K3llBcx/dmjDj2BGa534i6adS8E3mxcvbYuE4/u9T/wB87qf4CvftXhpYmOWtpDH/AMB6j+f6V0M8CXEEkMyh45EKuD3BGCKcHyyTJnHmg0fMVFWdSsm07VLqyk5a3meI++DjP6VWr3k7q584007MKKKKYgooooAKKKKAJLad7S6huIjh4XV0PoQcj9a+lrK6S+sYLqH7k8SyL9GGR/OvmWvcfhjqR1DwXDE5y9nI0B56j7w/RsfhXDjI3ipHo4GVpOJ0Gv6d/a3h++scfNPAyJ6BsfKfzxXzaQVJBGCOoNfUdfPXjjTRpXjPUYEGImk81Po43fpkj8K809YwKKKKBBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXsHwg1Hz9CvNPY/NbTBxn+646fmp/OvH67P4X6mbHxnHCxxHexvCfY/eH6rj8aAPcaKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8u8f2n2fxM0o+7cRLIfqPl/p+teo1w3xKtgbaxugOVZoyfrg/0NAHAUUUUxBRRRQAUUUUAFFFFAHafDe72ajd2h6SRhx9VOP5N+leiV5F4QufsviqyY9HYxn3yMfzr12hgjwz4n2H2LxtNIo2rdRpMPy2n9V/WuQr1H4x2Yxpl6F5y8Tn16ED/wBCry6vZw8uamjwcRHlqsKKKK3OcKKKKACiiigAr0j4O32zUNRsG6SxLMoz02nB/wDQh+Veb103w7vfsfjqxJOFmLQt/wACU4/UCsq0eak0b4eXLVTPfK8k+Mdhs1TT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ooAK9w+F9i1p4JikYYN1M82PQZ2j9F/WvF9PsptS1GCythumnkCL7EnqfbvX0lY2cWn6fb2cAxFBGsa/QDFcOMmlFRPRwMLycixXz144vhqHjbU50bKiYxKR6IAv/ste4eJdXXQfDl5qBIDRx4iB/ic8KPzx+tfOLMXYsxLMTkk96809YSiiigQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV2PwusWuvHEEoHy2sUkzfltH/AKFXHV7J8JdFNloM+pzKRJfPhMj/AJZrwD+Jz+QoA9AooopDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiqmq3n2DSbm7HWKJmHuQDj9aAPNPGusHU9caKM/uLTMS+7fxH+n4VztBJJyTk+popiCiiigAooooAKKKKACu2+HujebcyarMo2w/u4vdiOT+AOPxria9k8NWYsPDdlDj5jEHb6t8x/nQBqZrwf4h+ITrviaSOJs2tmTDF6E/xN+JH5AV7H4k1A6T4av71TteKFih/2iML+pFfOJ5/Ou7BwTbkzzsdOyUULRRRXpHlBRRRQAUUUUAFFFFAI9L+E3h3zJ5deuF+WImK3B/vfxN+Rx+Jr1asfwnpw0rwpp1qBhlgVn/3m+Y/qTWtLKsMLyyHCIpZj6Ada8OtNzm2z6GjBQpJHkXxY8Q/a9Uj0WA/urQ+ZNg/ekI4/IH8yfSvO6s6jeyajqVzezffuJWkb8TnH61WrM1CiiigAooooAKKKKACiiigAooooAKKKKACiiigDS0DR5de1y106DIM74Zv7ijlj+ABr6MtLSGxsobS2XZDCgjRQeigYryv4O6cJNQ1DUXXmGNYUPu3J/wDQR+detUDCiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVzvjmbyvCdwo/5aOif+PA/0roq5X4hf8i0vH/Lwn8moA8xooopiCiiigAooooAKKKKAJIIvOuY4v77hPzOK9zACqFA4HAHoK8S0vA1iz9BcR5z/ALwr26hjOM+KlwYfBEqD/lvOkZ+md3/steIV7J8Xh/xSNrjp9uX/ANFvXjderg/4Z4uN/ihRRRXWcQUUUUAFFFFABU+nwfatStrc9JZVT8yBUFaPhwqvirSi/C/bYck/74pS0TKj8SR9IAYAGOKxvGFwbXwZqsg4P2Z1B/3ht/rW1XNfEL/kQdU/3E/9DFfPn0p4BRRRTEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHtXwktxF4OeXvNdO34AKP6Gu6rj/hcR/wgVtjGRJID9dxrsKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK57xvAZvCdyV6xsj/+PDP8zXQ1Wv7QX2nXFqxwJomjB9MjrQB4hRTpI2ikeORSroxVgexBxim0xBRRRQAUUUUAFFFFAD4pDFOko6owYfhXuaOsiK6nKsMg+orwmvX/AAnfC+8M2j5y0aeU4914/kAfxoGY3xRtjceB53X/AJd5o5D+e3/2avD6+ktc04atoN7YnrPCyLns2OD+eK+bnRo5GSQFWUkMD1BFeng5e64nkY6NpqQlFFFdp54UUUUAFFFFABUtnOba+guO8MiuCPY5qKih6qw07O59QqwZAynIIyCO9Y/i22N34P1WJRybV2A9SBn+lQ+CtTXVfB2nz5BdIvKkGedyfLz9cA/jW66LJGyONysCCD3z2r5+ScZNM+kjJSSaPl2ir2tac+ka3d6fLnNvM0ef7w7H8Rg/jVGgYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAez/CO6EvhOaAn5oLph+BAP8813teP/AAg1MQa5eac7YF1CHQE9WQ9B+BJ/CvYKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPMPHmjmx1n7bGMQ3eSTjo/f8+v51y1e1avpcOsaZLZ3HAcZVx1RuxFePajp1xpd9JaXabZIz9Qw9R6g0xFaiiigAooooAKKKKACux+Huri2v5NNmOEuPmjPo4HT8R/IVx1OileCZJYWKSRncrDqCDkGgD3avD/iZ4fOk+JGvYkxa35MgI6CT+Ifnz+PtXrHhzXY9d0tZsgXEY2zJ6N6/Q0viPQbfxHos1hc/KW+aOTqY3HRh/nkE1tQqeznfoYYil7WDXU+c6WrWp6bdaPqUtjfR+XNE2CDyCOxHseoNVa9pNPVHgO6dmFFFFABRRRQAUUUUAejfCTXxb6hPo1w+Fuf3sOezj7y/Ugf+O163mvmK2uJrO6iuLaQxzROHjcdVIOQa+gPCfiWDxPoqXKbUuEwk8WfuN/geo/8ArV5mLpNPnWx6+CrKUeR7o4b4t+HylzBrtumVkxDcEDowHysfqOPwFeZV9N6hY2+p6fNZXib4JlKOP6j3759a+fPE3h268M6w9lc5aM8wS44kTsf8R2riO8x6KKKACiiigAooooAKKKKACiiigAooooAKKKKALuj6nLo2s2uoQcvbyBwv94d1/EZH419H2V5DqFjBeWr74Z0Do3qD/WvmOvSvhd4tFtKNB1CTEUrFrVmP3WPVPoeo98+tAHrVFFFIYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAB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',width: 350,height: 120,alignment: 'right'},)
       pdf['content'].push({text:'Contract of Employment',style: 'HDtopheader'})
       pdf['content'].push({text:'(BCEA)',style: 'HDtopheader2'})
       pdf['content'].push({text:'BETWEEN:',bold: true, fontSize: 15,margin:[0, 0, 0, 45],alignment:'center',})
       pdf['content'].push({columns:[{width:200,text:"EMPLOYER NAME:",bold: true,margin: [40, 4, 0, 15],},{text: contract_fields.employername,	width: 300,	}]})
       pdf['content'].push({columns:[{width:200,text:'ADDRESS:',bold:true,margin:[40, 4, 0, 10],},{ width: 300,text: contract_fields.employeraddress,}]})
       pdf['content'].push({text:'(Hereinafter referred to as "The Employer")',margin: [40, 4, 0, 20],style: 'HDsubheadingtext'})
       pdf['content'].push({columns:[{width:200,text:'EMPLOYEE NAME:',bold: true,	margin: [40, 4, 0, 15],},{text:contract_fields.nameofemployee,margin:[0, 4, 0, 15],}]},	)
       pdf['content'].push({columns:[{width:200,text:'ADDRESS:',bold:true,margin: [40, 4, 0, 15],},{text: contract_fields.employeeaddress}]})
       pdf['content'].push({columns:[{width:200,text:'ID NUMBER:',	bold:true,margin: [40, 4, 0, 15],},{text: contract_fields.idnumber}]})
       pdf['content'].push({columns:[{width:200,	text:'OCCUPATION:',bold:true,margin: [40, 4, 0,10],},{text: contract_fields.occupation}]})
       pdf['content'].push({text:'(Hereinafter referred to as "The Employee")',margin:[40, 4, 0, 20],style:['HDsubheadingtext']})


         var num1 = 1
         var num2 = 1
         var num3 = 1
         var tnum2 = ''
         var temp = []
         for(i = 0;i < data.length; i++){

                   if (data[i].headingnumber === '0'){
                     pdf['content'].push({columns: [{	width: 35,text: num1},	{width: '*',style: data[i].headingstyle,text: data[i].headingtext},]	},)
                     num1++
                     num2=1
                     num3=1
                   }
                   if (data[i].headingnumber === '1'){

                     tnum1 = num1-1
                     pdf['content'].push({columns: [{	width: 35,text: ''},{	width: 35,text: tnum1+'.'+num2},	{width: '*',style: data[i].headingstyle,text: data[i].headingtext},]	},)

                     num2++
                     num3=1
                   }
                   if (data[i].headingnumber === '2'){
                     tnum1 = num1-1
                     // tnum2 = num2-1
                     pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle,text: ''},{	width: 35,text: tnum1+'.'+num2},	{width: '*',style: data[i].headingstyle,text: data[i].headingtext},]	},)

                     num2++
                     // num2=1
                     num3=1
                   }
                   if (data[i].headingnumber === '3'){

                     pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle,text: ''},{	width: 35,text: num1+'.'+num2},	{width: '*',style: data[i].headingstyle,text: data[i].headingtext},]	},)
                     num1++
                     num2=1
                     num3=1
                   }


                   // Paragraphs With Numbers
                   if (data[i].paragraph = true & data[i].paragraphnumber === '0'){
                       tnum1 = num1-1
                       pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle, text: tnum1+'.'+num2},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                       num2++
                       num3=1
                   }
                   if (data[i].paragraph = true & data[i].paragraphnumber === '1'){
                      tnum1 = num1-1
                      pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle, text:''},{width: 35, style: data[i].paragraphstyle, text: tnum1+'.'+num2},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                      num2++
                      num3=1
                  }
                  if (data[i].paragraph = true & data[i].paragraphnumber === '2'){
                      tnum1 = num1-1
                      tnum2 = num2-1
                      pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle, text:''},{width: 35, style: data[i].paragraphstyle, text:''},{width: 35, style: data[i].paragraphstyle, text: tnum1+'.'+tnum2+'.'+num3},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                      // num2++
                      num3++
                  }
                  if (data[i].paragraph = true & data[i].paragraphnumber === '3'){
                      tnum1 = num1-1
                      tnum2 = num2-1
                      pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle,text: ''},{width: 35, style: data[i].paragraphstyle,text: ''},{width: 35, style: data[i].paragraphstyle,text: ''},{	width: 35, style: data[i].paragraphstyle, text: tnum1+'.'+tnum2+'.'+num3},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                      // num2++
                    num3++
                  }

                    // Paragraphs with No Number
                    if (data[i].paragraph = true & data[i].paragraphnumber === '4'){
                        pdf['content'].push({text: data[i].paragraphtext, style: data[i].paragraphstyle})
                    }
                    if (data[i].paragraph = true & data[i].paragraphnumber === '5'){
                       pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle, text:''},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                    }
                    if (data[i].paragraph = true & data[i].paragraphnumber === '6'){
                      pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle,text: ''},{	width: 35, style: data[i].paragraphstyle, text:''},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)

                   }
                   if (data[i].paragraph = true & data[i].paragraphnumber === '7'){
                     pdf['content'].push({columns: [{width: 35, style: data[i].paragraphstyle,text: ''},{	width: 35, style: data[i].paragraphstyle, text:''},{	width: 35, style: data[i].paragraphstyle, text:''},	{width: '*', style: data[i].paragraphstyle, text: data[i].paragraphtext},]	},)
                   }
       }
         // insert the contract Footer
         pdf['content'].push({text:'SIGNED AT _______________ ON THIS THE ____ DAY OF _____________________ 20___',style:'HDsubheader2'})
         pdf['content'].push({text:'___________________',style:'HDtextright'})
         pdf['content'].push({text:'EMPLOYER',style:'HDtextright'})
         pdf['content'].push({text:'WITNESSES',	style:'HDtextleft1',})
         pdf['content'].push({text:'1.  ___________________',style:'HDtextleft'})
         pdf['content'].push({text:'2.  ___________________',style:'HDtextleft'})
         pdf['content'].push({text:'___________________',style:'HDtextright'})
         pdf['content'].push({text:'EMPLOYER',style:'HDtextright'})
         pdf['content'].push({text:'Both parties and witnesses must initial all the other pages of this contract as well as any ammendments.',margin:[0, 40, 0, 0],fontSize:10,})
          // pdfMake.createPdf(pdf).open();
         pdfMake.createPdf(pdf).download('test123.pdf')

         var dataA;
         pdfMake.createPdf(pdf).getBase64(function(encodedString) {
         dataA = encodedString;
         submitblankemploymentcontrat(employeeid, dataA)
         getemployercontracts()
});

}

function viewcontract(){
      updatecurent_contract()
      getcontractitem1(current_contract)
}

function updatecurent_contract(){
  // updates current contract with use this paragraph and pagebreaks
  for(i = 0;i < current_contract.length; i++){
    if(current_contract[i].itemtype != "Option"){
            // console.log(current_contract[i].itemno)
            var temp1 = document.getElementById('useparagraph_'+current_contract[i].itemno).checked
            var temp2 = document.getElementById('insertpagebreak_'+current_contract[i].itemno).checked
            // console.log('AAAA'+temp1)
            current_contract[i].useparagraph = document.getElementById('useparagraph_'+current_contract[i].itemno).checked
            // console.log('BBBBB'+current_contract[i])
            current_contract[i].insertpagebreak  = temp2
            }

}
current_contract1 = []
for(i = 0;i < current_contract.length; i++){
            if(current_contract[i].itemtype == "Paragraph/Heading" & current_contract[i].useparagraph === true){
                // console.log(current_contract[i])
                current_contract1.push(current_contract[i])
              }
            if(current_contract[i].itemtype == "Option"){
                current_contract1.push(current_contract[i])
                }
}
console.log(current_contract1)
current_contract = current_contract1
}

function getoptions(object){
    var options = {}
    var counter = 0
    lastoption = ''
    for(i = 0;i < current_contract.length; i++){
      if (object[i].itemtype === 'Option' & object[i].optionname != '') {
        options[object[i].optionnumber] = object[i].optionname
      }
    }
}

function contractypeselectA(itemname){
  console.log(itemname)
  // document.getElementsByClassName('contractoptionfields').length = noofscreens
  for(i = 0;i < document.getElementsByClassName('contractoptionfields').length; i++){
      document.getElementsByClassName('contractoptionfields')[i].style.display = 'none'
}
  var temp = document.getElementById(itemname).value
  temp += "_fields"
  console.log(temp)
  document.getElementById(temp).style.display = 'block'
}

function contractypeselect(){

  var x = document.getElementById('contracttype').value
    if (x === 'Fixed Term Appointment') {
      document.getElementById('fixedtermfields').style.display = "block"
      document.getElementById('projectappointmentfields').style.display = "none"
}
    if (x === 'Project Appointment') {
      document.getElementById('projectappointmentfields').style.display = "block"
      document.getElementById('fixedtermfields').style.display = "none"
}
    if (x === 'Permanent Appointment') {
      document.getElementById('fixedtermfields').style.display = "none"
      document.getElementById('projectappointmentfields').style.display = "none"
}
}
function probationselect(){
  var x = document.getElementById('probationperiod').value
    if (x === 'Probation Period') {
      document.getElementById('probationfields').style.display = "block"
      // document.getElementById('projectappointmentfields').style.display = "none"
}
    if (x === 'No Probation Period') {
      document.getElementById('probationfields').style.display = "none"
      // document.getElementById('fixedtermfields').style.display = "none"
}
}
function addoption(num){
  var k = ""
  var optionname = document.getElementById('option'+num+'fieldname').value
  var optiontype = document.getElementById('option'+num+'fieldtype').value
  k += '<p id="contractoption'+num+'" fieldname="'+optionname+'" fieldtype="'+optiontype+'" class="contractoption'+num+' row test col-md-12 col-sm-12 col-xs-12"><strong>'+optionname+' ('+optiontype+')</strong></p>';
  document.getElementById('option'+num+'container').innerHTML += k
  var k = ""
  document.getElementById('option'+num+'fieldname').value = ''
  document.getElementById('option'+num+'fieldtype').value = ''
}

function showcontractoptions(){
    var a = document.getElementById('numberofcontractoptions').value
    if (a == '1'){
      document.getElementById('contractoption1').style.display = "block"
      document.getElementById('contractoption2').style.display = "none"
      document.getElementById('contractoption3').style.display = "none"
      document.getElementById('contractoption4').style.display = "none"
      document.getElementById('contractoption5').style.display = "none"
    }
    if (a == '2'){
      document.getElementById('contractoption1').style.display = "block"
      document.getElementById('contractoption2').style.display = "block"
      document.getElementById('contractoption3').style.display = "none"
      document.getElementById('contractoption4').style.display = "none"
      document.getElementById('contractoption5').style.display = "none"
    }
    if (a == '3'){
      document.getElementById('contractoption1').style.display = "block"
      document.getElementById('contractoption2').style.display = "block"
      document.getElementById('contractoption3').style.display = "block"
      document.getElementById('contractoption4').style.display = "none"
      document.getElementById('contractoption5').style.display = "none"
    }
    if (a == '4'){
      document.getElementById('contractoption1').style.display = "block"
      document.getElementById('contractoption2').style.display = "block"
      document.getElementById('contractoption3').style.display = "block"
      document.getElementById('contractoption4').style.display = "block"
      document.getElementById('contractoption5').style.display = "none"
    }
    if (a == '5'){
      document.getElementById('contractoption1').style.display = "block"
      document.getElementById('contractoption2').style.display = "block"
      document.getElementById('contractoption3').style.display = "block"
      document.getElementById('contractoption4').style.display = "block"
      document.getElementById('contractoption5').style.display = "block"
    }
}

function contractitem(){
  if (document.getElementById('contractitemtype').value == 'Paragraph/Heading') {
        document.getElementById('contractoption1').style.display = "none"
        document.getElementById('contractoption2').style.display = "none"
        document.getElementById('contractoption3').style.display = "none"
        document.getElementById('contractoption4').style.display = "none"
        document.getElementById('contractoption5').style.display = "none"
        document.getElementById('contractoptions').style.display = "none"
        document.getElementById('contractheading').style.display = "block"
        document.getElementById('contractparagraph').style.display = "block"
  }
  if (document.getElementById('contractitemtype').value == 'Option') {
        document.getElementById('contractoptions').style.display = "block"
        document.getElementById('contractheading').style.display = "none"
        document.getElementById('contractparagraph').style.display = "none"
  }
}

function submitcontractoption(){
var numofoptions = document.getElementById('numberofcontractoptions').value
var options1 = document.getElementsByClassName('contractoption1')
var options2 = document.getElementsByClassName('contractoption2')
var options3 = document.getElementsByClassName('contractoption3')
var options4 = document.getElementsByClassName('contractoption4')
var options5 = document.getElementsByClassName('contractoption5')

  var obj = {}
  var options = []
  var option1fieldnames = []
  var option1fieldtypes = []
  var option2fieldnames = []
  var option2fieldtypes = []
  var option3fieldnames = []
  var option3fieldtypes = []
  var option4fieldnames = []
  var option4fieldtypes = []
  var option5fieldnames = []
  var option5fieldtypes = []

for(i = 0;i < options1.length; i++){
      option1fieldnames.push(document.getElementsByClassName('contractoption1')[i].attributes[1].nodeValue)
      option1fieldtypes.push(document.getElementsByClassName('contractoption1')[i].attributes[2].nodeValue)
}
for(i = 0;i < options2.length; i++){
      option2fieldnames.push(document.getElementsByClassName('contractoption2')[i].attributes[1].nodeValue)
      option2fieldtypes.push(document.getElementsByClassName('contractoption2')[i].attributes[2].nodeValue)
}
for(i = 0;i < options3.length; i++){
      option3fieldnames.push(document.getElementsByClassName('contractoption3')[i].attributes[1].nodeValue)
      option3fieldtypes.push(document.getElementsByClassName('contractoption3')[i].attributes[2].nodeValue)
}
for(i = 0;i < options4.length; i++){
      option4fieldnames.push(document.getElementsByClassName('contractoption4')[i].attributes[1].nodeValue)
      option4fieldtypes.push(document.getElementsByClassName('contractoption4')[i].attributes[2].nodeValue)
}
for(i = 0;i < options5.length; i++){
      option5fieldnames.push(document.getElementsByClassName('contractoption5')[i].attributes[1].nodeValue)
      option5fieldtypes.push(document.getElementsByClassName('contractoption5')[i].attributes[2].nodeValue)
}
for(i = 0;i < numofoptions; i++){
      optionnum = i+1
      options.push(document.getElementById('option'+optionnum+'name').value)
}
    obj['option1fieldnames'] = option1fieldnames
    obj['option1fieldtypes'] = option1fieldtypes
    obj['option2fieldnames'] = option2fieldnames
    obj['option2fieldtypes'] = option2fieldtypes
    obj['option3fieldnames'] = option3fieldnames
    obj['option3fieldtypes'] = option3fieldtypes
    obj['option4fieldnames'] = option4fieldnames
    obj['option4fieldtypes'] = option4fieldtypes
    obj['option5fieldnames'] = option5fieldnames
    obj['option5fieldtypes'] = option5fieldtypes
    obj['options'] = options
    obj['contractname'] = document.getElementById('contractname').value
    obj['contractitemtype'] = document.getElementById('contractitemtype').value
    obj['itemname'] = document.getElementById('itemname').value

    // console.log(obj)

    fetch('http://localhost:3000/uploadcontratoption/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
       })
       .then(res => {
       console.log("Contract Option data uploaded to Server")
       console.log(res.status)
      });
  }

function submitcontractitem(){
   obj = {}
   obj['heading'] = document.getElementById('heading').value
   obj['headingnumber'] = document.getElementById('headingnumber').value
   obj['headingstyle'] = document.getElementById('headingstyle').value
   obj['headingtext'] = document.getElementById('headingtext').value
   obj['paragraph'] = document.getElementById('paragraph').value
   obj['paragraphnumber'] = document.getElementById('paragraphnumber').value
   obj['paragraphstyle'] = document.getElementById('paragraphstyle').value
   obj['paragraphtext'] = document.getElementById('paragraphtext').value
   obj['contractname'] = document.getElementById('contractname').value
   obj['itemname'] = document.getElementById('itemname').value
   obj['itemtype'] = document.getElementById('contractitemtype').value
   obj['itemrank'] = document.getElementById('itemrank').value
   obj['itemorder'] = document.getElementById('itemorder').value
   obj['pagebreakbreakafter'] = false
   obj['partofoption'] = document.getElementById('partofoption').value
   obj['contoptionname'] = document.getElementById('contoptionname').value
   fetch('http://localhost:3000/uploadcontratitem/', {
               method: 'post',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(obj)
      })
      .then(res => {
      console.log("Contract Item Uploaded to DB")
      console.log(res.status)

       document.getElementById('heading').value = ''
       document.getElementById('headingnumber').value = ''
       document.getElementById('headingstyle').value = ''
       document.getElementById('headingtext').value = ''
       // document.getElementById('optionname').value = ''
       var xxx = document.getElementById('itemorder').value
       xxx++
       document.getElementById('itemorder').value = xxx

       });

  }
function submitcontract(){
  if (document.getElementById('contractitemtype').value == 'Option'){submitcontractoption()}
  if (document.getElementById('contractitemtype').value == 'Paragraph/Heading'){submitcontractitem()}
}

function runmodal7(contracts, num){
  // console.log(contracts)
  // console.log(num)
  geteesforcontract();
  var kk = '<p>Please make the following selections:</p>'

  for(i = 0;i < contracts.length; i++){

     if (contracts[i].partofoption == true){
            contracts[i].useparagraph = false;
          }
      var k  = ''
     if (contracts[i].itemtype == 'Option'){
       k+= '<div class="form-group col-md-12 col-sm-12 col-sx-12">'
       k+=  '<label>'+contracts[i].itemname+'</label>'
       k+=  '<select id="'+contracts[i].itemname+'_input" class="form-control contractoption" onchange="contractypeselectA('+"'"+contracts[i].itemname+'_input'+"'"+')">'
       k+=    '<option selected>choose...</option>'

       for(j = 0;j < contracts[i].options.length; j++){
         k+=  '<option>'+contracts[i].options[j]+'</option>'
       }
       k+=  '</select>'
       k+= '</div>'

       if (contracts[i].option1fieldtypes.length != 0){
           k+=   '<div id="'+contracts[i].options[0]+'_fields" class="contractoptionfields" style="display: none">'
           k+=   '<div class="clearfix"></div>'
           k+=   '<fieldset class="border"><legend class="border"><h5>'+contracts[i].options[0]+'</h5></legend>'

           for(j = 0;j < contracts[i].option1fieldnames.length; j++){
           k+=    '<div class="form-group col-md-6 col-sm-6 col-sx-12">'
           k+=    '<label>'+contracts[i].option1fieldnames[j]+'</label>'
           k+=    '<input id="'+contracts[i].option1fieldnames[j]+'" class="date-picker form-control fieldoption" type="'+contracts[i].option1fieldtypes[j]+'">'
           k+=    '</div>'
           }
           k+=    '<div class="clearfix">'
           k+=    '</fieldset></div>'
       }
       if (contracts[i].option2fieldnames.length != 0){
           k+=   '<div id="'+contracts[i].options[1]+'_fields" class="contractoptionfields" style="display: none">'
           k+=   '<div class="clearfix"></div>'
           k+=   '<fieldset class="border"><legend class="border"><h5>'+contracts[i].options[1]+'</h5></legend>'

           for(j = 0;j < contracts[i].option2fieldnames.length; j++){
           k+=    '<div class="form-group col-md-6 col-sm-6 col-sx-12">'
           k+=    '<label>'+contracts[i].option2fieldnames[j]+'</label>'
           k+=    '<input id="'+contracts[i].option2fieldnames[j]+'" class="date-picker form-control fieldoption" type="'+contracts[i].option2fieldtypes[j]+'">'
           k+=    '</div>'
           }
           k+=    '<div class="clearfix">'
           k+=    '</fieldset></div>'
       }
       if (contracts[i].option3fieldtypes.length != 0){
           k+=   '<div id="'+contracts[i].options[2]+'_fields" class="contractoptionfields" style="display: none">'
           k+=   '<div class="clearfix"></div>'
           k+=   '<fieldset class="border"><legend class="border"><h5>'+contracts[i].options[2]+'</h5></legend>'

           for(j = 0;j < contracts[i].option3fieldnames.length; j++){
           k+=    '<div class="form-group col-md-6 col-sm-6 col-sx-12">'
           k+=    '<label>'+contracts[i].option3fieldnames[j]+'</label>'
           k+=    '<input id="'+contracts[i].option3fieldnames[j]+'" class="date-picker form-contro fieldoption" type="'+contracts[i].option3fieldtypes[j]+'">'
           k+=    '</div>'
           }
           k+=    '<div class="clearfix">'
           k+=    '</fieldset></div>'
       }
       if (contracts[i].option4fieldtypes.length != 0){
           k+=   '<div id="'+contracts[i].options[3]+'_fields" class="contractoptionfields" style="display: none">'
           k+=   '<div class="clearfix"></div>'
           k+=   '<fieldset class="border"><legend class="border"><h5>'+contracts[i].options[3]+'</h5></legend>'

           for(j = 0;j < contracts[i].option4fieldnames.length; j++){
           k+=    '<div class="form-group col-md-6 col-sm-6 col-sx-12">'
           k+=    '<label>'+contracts[i].option4fieldnames[j]+'</label>'
           k+=    '<input id="'+contracts[i].option4fieldnames[j]+'" class="date-picker form-control fieldoption" type="'+contracts[i].option4fieldtypes[j]+'">'
           k+=    '</div>'
           }
           k+=    '<div class="clearfix">'
           k+=    '</fieldset></div>'
       }
       if (contracts[i].option5fieldtypes.length != 0){
           k+=   '<div id="'+contracts[i].options[4]+'_fields" class="contractoptionfields" style="display: none">'
           k+=   '<div class="clearfix"></div>'
           k+=   '<fieldset class="border"><legend class="border"><h5>'+contracts[i].options[4]+'</h5></legend>'

           for(j = 0;j < contracts[i].option5fieldnames.length; j++){
           k+=    '<div class="form-group col-md-6 col-sm-6 col-sx-12">'
           k+=    '<label>'+contracts[i].option5fieldnames[j]+'</label>'
           k+=    '<input id="'+contracts[i].option5fieldnames[j]+'" class="date-picker form-control fieldoption" type="'+contracts[i].option5fieldtypes[j]+'">'
           k+=    '</div>'

           }
           k+=    '<div class="clearfix">'
           k+=    '</fieldset></div>'
       }
           k+=    '<div class="clearfix"></div>'
           k+=    '</div>'

          kk+= k
}
  document.getElementById('modal7body').innerHTML = kk
  var l = ''
  l+= '<button style="bottom:0px" onclick="fillincontractfields('+num+')">Submit</button>'
  l+= '<button style="bottom:0px" onclick="closemodal7()">Cancel</button>'
    document.getElementById('modal7buttons').innerHTML = l

  let modal = document.getElementById('myModal7');
  modal.style.display = "block";
}
}

function geteesforcontract(){
  var currentemployerno = '0001'
  fetch('http://localhost:3000/employeelist/' + currentemployerno, {
     method: 'get',
     headers: {'Content-Type': 'application/json'},
    })
   .then(response => response.json())
   .then(function(data) {
       var kk = '<option value="" selected>choose...</option>';
       var k = "";
       // Insert data into HTML Cards
       for(i = 0;i < data.length; i++){
        k+= '<option value="'+data[i].employeeid+'">'+data[i].name+' '+data[i].surname+'</option>';
       };
       kk+= k;
       document.getElementById('contractemployeeselect').innerHTML = kk;
});
};

function populatecontract(){
        if (document.getElementById('contractemployeeselect').value == '') {alert("Please choose an employee.")} else {
        employeeid = document.getElementById('contractemployeeselect').value
        fetch('http://localhost:3000/employeeinfo/' + employeeid, {
           method: 'get',
           headers: {'Content-Type': 'application/json'},
        })
         .then(response => response.json())
         .then(function(data) {
           var employername = "ABC Test Company"
           var employeraddress = "123 Erasmus Street, Pretoria, 0064"

           contract_fields = {}
           contract_fields['employername'] = employername
           contract_fields['employeraddress'] = employeraddress
           contract_fields['nameofemployee'] = data[0].name+' '+data[0].surname
           contract_fields['employeeaddress'] = data[0].address
           contract_fields['idnumber'] = data[0].idnumber
           contract_fields['occupation'] = data[0].jobtitle
           contract_fields['employementstartdate'] = data[0].employmentstartdate
          })
}
}

function fillincontractfields(conractno){
    var noofoptions = document.getElementsByClassName('contractoption').length
    var nooffields = document.getElementsByClassName('fieldoption').length
    employeeid = document.getElementById('contractemployeeselect').value
    for(i = 0;i < noofoptions; i++){
        for(j = 0;j < contracts[conractno].length; j++){
            if (contracts[conractno][j].linkedoptionname == document.getElementsByClassName('contractoption')[i].value){
                    contracts[conractno][j].useparagraph = true
                    for(k = 0;k < nooffields; k++){
                          var old_value = document.getElementsByClassName('fieldoption')[k].id
                          if (document.getElementsByClassName('fieldoption')[k].type == 'date'){
                                var d = new Date(document.getElementsByClassName('fieldoption')[k].value);
                                new_value = d.toString('d MMMM yyyy')
                          } else {
                          var new_value = document.getElementsByClassName('fieldoption')[k].value}
                          if (new_value != ''){
                                  contracts[conractno][j].paragraphtext = contracts[conractno][j].paragraphtext.replace(new RegExp(old_value), new_value)
                                  }}
                  }}
                }
    current_contract_temp = []
    for(i = 0;i < contracts[conractno].length; i++){
          if(contracts[conractno][i].useparagraph == true){current_contract_temp.push(contracts[conractno][i])}
                }
    contracts[conractno] = current_contract_temp

getcontractitem1(contracts[conractno],employeeid)

let modal = document.getElementById('myModal7');
modal.style.display = "none";
contract_fields = {}
}

function submitblankemploymentcontrat(employeeid, data){
  console.log(employeeid)
  console.log(data)
  // let currentemployeeno = document.getElementById(selectedEMPCurrent).getAttribute("employeeid")
  // let newdata = document.getElementById('newdata').value
  fetch('http:/localhost:3000/updateeinfo_doc/'+ 'contractofemployment_blank', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          employeeid: employeeid,
          newdata: data,

              })
       })
       .then(res => {cosole.log("Blank Employment Contrat Uploaded to DB")})
}
