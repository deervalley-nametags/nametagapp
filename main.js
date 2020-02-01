//global var
let globalTagType; //this works even in multi tag mode since you cant combine types
let globalSubmitArray = []; //this is an array full of submission status, so on submit it doesnt matter if single or multi
// each obj in globalSubmitArray: [{preName,preRequestor,titleCity,thirdLine,comments}],
// item will be 0 if textValidation says it is too short
let globalDisplayCheckmark = "none";



//will it let me do db right here?
//firebase init using firestore
firebase.initializeApp({
    apiKey: 'AIzaSyA1uPdDnmLSWqkuEkFlGH5YF7UvxvszceU',
    authDomain: 'nametags-4019a.firebaseapp.com',
    projectId: 'nametags-4019a'
});

//creation of db
const db = firebase.firestore();
let namesRef = db.collection("names");



function colorCodeToClass(colorCode){
    /*
    tagType obj are the classes to apply and default texts on each
    bg background class, 
    img is the deer head logo, null-space is the default class that deletes the class
    in the event that there is no deer head
    defName: default Name placeholder
    defSecond: default second line text placeholder
    quantity: the default quantity for each tag type(unchangeable, only for info purposes)
    */
    let tagType = {
        bg: "",
        img: "null-space",
        defName: "Name",
        defSecond: "City, ST",
        quantity: "x2"
    };

    //translate color code to image type using classes
    if(colorCode === 1){
                
        //1: green pin no deerhead(normal nametag and default selection)
        tagType.bg = "tag-green";
    } else if(colorCode === 2){

        //2: green magnet deerhead
        tagType.bg = "tag-greenmag";
        tagType.img = "dvgold-img";
    } else if(colorCode === 3){

        //3: bronze magnet engraved deerhead
        tagType.bg = "tag-bronze";
        tagType.img = "dvwhite-img";
    } else if(colorCode === 4){

        //4: outdoor tags
        tagType.bg = "tag-outdoor";
        tagType.quantity = "x3";
    } else if(colorCode === 5){

        //5: sign, add details in comments
        tagType.bg = "tag-sign";
        tagType.defName = "Sign";
        tagType.defSecond = "Put details in the comments";
        tagType.quantity = "";
    } else if(colorCode === 7){

        //7: repeat 1 but with title instead of city, st
        tagType.bg = "tag-green";
        tagType.defSecond = "Title";
    } else if(colorCode === 8){

        //8: repeat 2 but with title instead of city, st
        tagType.bg = "tag-greenmag";
        tagType.img = "dvgold-img";
        tagType.defSecond = "Title";
    } else if(colorCode === 9){

        //9: repeat 3 but with title instead of city, st
        tagType.bg = "tag-bronze";
        tagType.img = "dvwhite-img";
        tagType.defSecond = "Title";
    } else if(colorCode === 10){

        //10: repeat 4 but with title instead of city, st
        tagType.bg = "tag-outdoor";
        tagType.defSecond = "Title";
        tagType.quantity = "x3";
    } else if(colorCode === 11){

        //11: basket check tag
        tagType.bg = "tag-basket";
        tagType.defName = "<p style='font-size:60px;margin-top:-20px;'>&#8226;</p>";
        tagType.defSecond = "<p style='font-size:22px;margin-top:-20px;'>Basket Check</p>";
        tagType.quantity = "";
    } else{

        //anything else, other, details in comments
        tagType.bg = "tag-other";
    }

    //return value, e.g. tagType = { bg: tag-green, img: null-space }
    return tagType;
};

function checkmarkButtonDbUpdate(event){
    //update db on a single entry, checkmark cant have any arguments since it is injected html via performQuery.js

    let modeClass = $(event.target).parent().attr("class");
    //DEBUG: modeClass will be either checkmark-button for done, and checkmark-undo-button for undo
    //console.log(modeClass);

    if(modeClass === "checkmark-button"){


        //done, deprecated version was .checkmark-button on click

        //grab document key id
        let docId = $(event.target).parent().parent().attr("id");
        let docIdSelector = "#" + docId;
        console.log(docIdSelector);

        //client only, delete that li
        //the reason this is not in the finished .then section
        //is because the user then has to wait for each individual thing to update
        $(docIdSelector).parent().parent().remove();

        //grab current timestamp
        let date = new Date();
        let currentTimestamp = date.getTime();

        //update entry in db
        db.collection("names").doc(docId).update({
            datefinished: currentTimestamp
        })
        .then(function() {
            console.log("Document " + docId + " successfully updated!");

            
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }else if(modeClass === "checkmark-undo-button"){


        //undo, deprecated version was .checkmark-undo-button on click

        //grab document key id
        let docId = $(event.target).parent().parent().attr("id");
        let docIdSelector = "#" + docId;
        console.log(docIdSelector);

        //client only, delete that li
        //the reason this is not in the finished .then section
        //is because the user then has to wait for each individual thing to update
        $(docIdSelector).parent().parent().remove();

        //update entry in db
        db.collection("names").doc(docId).update({
            datefinished: 0
        })
        .then(function() {
            console.log("Document " + docId + " successfully updated!");

            
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }else{
        //mode not supported
        console.log("checkmarkButtonDbUpdate() was called on an unsupported mode");
    }
};

function updateSubmissionValidity(){
    //check textValidation and validity
    //console.dir(globalSubmitArray);
    //entire function returns true on valid submission
    let pass = true;
    let newStatusText = ["",""];

    globalSubmitArray.forEach(function(arrayItem){
        //console.log(arrayItem.preName + " - " + arrayItem.preRequestor);

        //for each item in the global array, check the following
        if(!arrayItem.preName == 0 && !arrayItem.preRequestor == 0){
            //check preName not 0 AND preRequestor not 0 means VALID

            //if at any point pass becomes false, it cannot become true again
            pass = (!pass) ? false : true;
        }else{
            //anything else is invalid

            //update status text
            if(arrayItem.preName === 0){
                //invalid prename
                newStatusText[0] = "A name is invalid, it must be at least 3 characters. ";
            }
            if(arrayItem.preRequestor === 0){
                //invalid prerequestor
                newStatusText[1] = "There must be a requestor. ";
            };
            
            pass = false;
        };
    });

    //DEBUG: see what status text is doin
    //console.log(newStatusText);
    

    if(pass){
        //passing

        //activate buttons
        $("#request-button").attr("disabled", false);
        $("#request-button-multi").attr("disabled", false);

        //update status text
        $("#sending-monitor").empty();
    }else{
        //not passing
        
        
        //disable buttons
        $("#request-button").attr("disabled", true);
        $("#request-button-multi").attr("disabled", true);

        $("#sending-monitor").html(newStatusText[0] + " " + newStatusText[1]);
    }

    //console.log(pass);
    return pass;
};

function requestSingleTagUpdate(){
    //this function is to grab all the code in the request new modal
    //in a single refresh
    let validatedName = textValidation($("#i-name").val(), 3);
    let validatedSecondLine = textValidation($("#i-titlecity").val(), 3);
    let validatedThirdLine = textValidation($("#i-thirdline").val(), 0);

    //check validatedSecondLine if it says 0 from textValidation, then change it to empty string
    if(validatedSecondLine === 0){
        //
        validatedSecondLine = "";
    };
    //same for name
    if(validatedName === 0){
        //
        validatedName = "";
    };

    //construct the preview img obj
    let imgObj = {
        colorCode: globalTagType,
        name: validatedName,
        secondLine: validatedSecondLine,
        thirdLine: validatedThirdLine
    }

    //change it back to 0 for validity
    if(validatedName === ""){
        //
        validatedName = 0;
    };

    //html both clears and adds just this single tag
    $("#preview-window").html(createPreviewImg(imgObj));

    //update titlecity to reflect which clicked on
    let secondLineLabel = colorCodeToClass(globalTagType);
    $("#i-titlecity").attr("placeholder", secondLineLabel.defSecond);


    //update the globalSubmitArray
    globalSubmitArray = [{
        preName: validatedName,
        preRequestor: textValidation($("#i-requestor").val(), 3),
        titleCity: validatedSecondLine,
        thirdLine: validatedThirdLine,
        comments: textValidation($("#i-comments").val(), 0)
    }];

    //check validity and stuff
    updateSubmissionValidity();
};

function translateDocColor(preTranslated){
    /*
    the following table represents the inputs and their corresponding outputs
    this is only for the admin table, since city, ST, and title are the same thing in terms of engraving templates
    -
    1 -> 1
    7 -> 1
    2 -> 2
    8 -> 2
    3 -> 3
    9 -> 3
    4 -> 4
    10 -> 4

    */
   if( preTranslated > 6 && preTranslated < 11 ){
       //check if value is above 6 and below 11(range of 7-10), if so, minus 6
       preTranslated -= 6;
   };

   //return result
   return preTranslated;
};

function requestMultiTagUpdate(){
    // ------------ start excel grab ---------------
    //grab whole string, split the new lines
    let wholeExcelString = $("#i-excel").val(); //"1 \t a \n 2 \t b \n 3 \t c" \n for new lines, \t new tabs
    let splitOnce = wholeExcelString.split("\n"); //["1 \t a","2 \t b","3 \t c",""] dont know why it copies the last nothing
    
    //check if last element is empty
    let arrayLast = splitOnce.length - 1;
    if(splitOnce[arrayLast] == ""){
        //take off last
        splitOnce.pop(); //["1 \t a","2 \t b","3 \t c"]
    }

    //split it in the tabs now
    let splitThrice, splitObj, firstColumn, secondColumn, thirdColumn;
    let splitTwice = splitOnce.map(function(iterationItem, index){
        //iterate through and remap, e.g. index 0: ["1 \t a"]

        //split
        splitThrice = iterationItem.split("\t"); // e.g. index 0: ["1","a"]

        //check how many tabs there are, how many 'columns' of data
        //console.log(splitThrice.length); //length equals columns, 1 = 1 column, etc
        if(splitThrice.length === 1){
            //1 column, basket check probably
            firstColumn = textValidation(splitThrice[0], 3);
            secondColumn = "";
            thirdColumn = "";
        }else if(splitThrice.length === 2){
            //2 columns, normal 2 line
            firstColumn = textValidation(splitThrice[0], 3);
            secondColumn = textValidation(splitThrice[1], 0);
            thirdColumn = "";
        }else if(splitThrice.length === 3){
            //3 columns, 3 line
            firstColumn = textValidation(splitThrice[0], 3);
            secondColumn = textValidation(splitThrice[1], 0);
            thirdColumn = textValidation(splitThrice[2], 0);
        }else{
            //not in range 1-3 columns, data error
            firstColumn = "";
            secondColumn = "Only 1, 2, or 3 columns of data can be pasted.";
            thirdColumn = "";
        }

        //map data into splitObj, also verify it
        splitObj = {
            preName: firstColumn,
            titleCity: secondColumn,
            thirdLine: thirdColumn,
            preRequestor: textValidation($("#i-requestor-multi").val(), 3),
            comments: textValidation($("#i-comments-multi").val(), 0)
        };
        //console.log(splitObj);
        return splitObj;

    });
    
    //console.dir(splitTwice);

    //also update the global variable so that the submit button can do its thing
    globalSubmitArray = splitTwice;






    // ------------ end excel grab ---------------
    // ------------ start preview update ---------------
    //empty what was there before
    $("#preview-window").empty();
    
    globalSubmitArray.forEach(function(arrayItem){
        //for every index in the wholeArray do this
        //console.log(arrayItem);
        

        //convert the arrayItem to its equivalent object for preview image
        let imgObj = {
            colorCode: globalTagType,
            name: arrayItem.preName,
            secondLine: arrayItem.titleCity,
            thirdLine: arrayItem.thirdLine
        };

        //append
        $("#preview-window").append(createPreviewImg(imgObj));
    });


    //try to validate submission
    updateSubmissionValidity();
};

function copyToClipboard(id){
    //this will copy to clipboard the id e.g. "#admin-table-1"

    //convert to querySelector, jquery nodes dont work here
    let node = document.querySelector(id);

    //do range stuff, select
    let range  =  document.createRange();
    range.selectNodeContents(node);
    let select =  window.getSelection();
    select.removeAllRanges();
    select.addRange(range);

    //finally copy
    document.execCommand('copy');

    //add unselect here if wanted, but it helps to keep it selected
}

function adminLogin(){
    //easy access admin login segment

    //grab pass entered
    let adminPass = $("#i-admin-pass").val();

    //immediately change admin login status to validating..
    $("#admin-login-status").html("Validating...");
    
    //use firebase auth to login, session will end when tab closes
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) //change this to NONE on release, 
    //SESSION will keep logged in on reload for debug, but also can break the admin checkmark buttons
    .then(function() {
        // Existing and future Auth states are now persisted in the current
        // no session means logout on close or reload
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with persistence.
        return firebase.auth().signInWithEmailAndPassword("emeqiss@deervalley.com", adminPass);
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);

        //check if login was incorrect
        if(error.code === "auth/wrong-password"){
            //update admin-login-status
            $("#admin-login-status").html("Invalid Login");
        } else if(error.code === "auth/too-many-requests"){
            //update admin-login-status
            $("#admin-login-status").html("Too Many Requests -- Wait 30 Seconds");
        }
    });
};

function swapModalMode(mode){
    //easy to access modal swap from single to multi or vice versa
    //modes are: normal, excel
    if(mode === "normal"){
        //normal mode

        //swap col 2A
        $("#modal-2A-single").show();
        $("#modal-2A-multi").hide();

        //swap title
        $("#modal-title-single").show();
        $("#modal-title-multi").hide();

        //toggle requestor input
        $("#modal-request-div").show();
        
        //swap col 1B
        $("#modal-1b-single").show();
        $("#modal-1b-multi").hide();
        
        //swap col 2B
        $("#modal-2b-single").show();
        $("#modal-2b-multi").hide();
        
        //swap submit buttons
        $("#request-button-multi").hide();
        $("#request-button").show();

        //swap comment boxes
        $("#i-comments-multi").hide();
        $("#i-comments").show();
    } else if(mode === "excel"){
        //excel mode

        //swap col 2A
        $("#modal-2A-single").hide();
        $("#modal-2A-multi").show();

        //swap title
        $("#modal-title-single").hide();
        $("#modal-title-multi").show();

        //toggle requestor input
        $("#modal-request-div").hide();
        
        //swap col 1B
        $("#modal-1b-single").hide();
        $("#modal-1b-multi").show();
        
        //swap col 2B
        $("#modal-2b-single").hide();
        $("#modal-2b-multi").show();
        
        //swap submit buttons
        $("#request-button-multi").show();
        $("#request-button").hide();

        //swap comment boxes
        $("#i-comments-multi").show();
        $("#i-comments").hide();
    } else{
        //nothing should be outside those entries
        console.log("swapModalMode was called with an invalid property. The only acceptable modes are 'normal' and 'excel'.");
    };

    
};

function swapPageBody(mode){
    //this toggles the getting started tag request page to status page and vice versa
    //modes: "starting", "status"
    if(mode === "starting"){
        //starting
        //toggle status table
        $("#status-table").hide();

        //toggle initial starting tags
        $("#starting-tag-types").show();
        
        //toggle get started bar
        $("#get-started-li").show();

        //toggle search bar
        $("#status-header").hide();
    }else if(mode === "status"){
        //status
        //toggle status table
        $("#status-table").show();

        //toggle initial starting tags
        $("#starting-tag-types").hide();
        
        //toggle get started bar
        $("#get-started-li").hide();

        //toggle search bar
        $("#status-header").show();
    }else{
        //mode not supported
        console.log("swapPageBody() called on a mode that doesn't exist");
    }

    
};

function performSearch(namesRef, searchValue){
    //this searches through all the names, second and third lines, as well as requestor

    //really quickly change status of change bar to Loading..
    $("#search-label").html("Searching...");

    //empty out previous table stuff
    $("#status-table").empty();

    //make searchValue lowercase
    searchValue.toLowerCase();

    //search both requestorarray and namearray, because "Jake Smith Rodriguez" will look like
    //["jake smith rodriguez","jake","smith","rodriguez"] it will grab one or the entire name
    performQuery(namesRef, "namearray", "array-contains", searchValue);
    performQuery(namesRef, "requestorarray", "array-contains", searchValue);

    //update the search status text
    $("#search-label").html("Searching for: '" +
    searchValue +
    "' ");

    //add a li that explains searches
    $("#status-table").append(
        "<li class='row mt-1 justify-content-center smaller-text'>" + 
        "Don't see your tag? Try searching for the full name or one unique name." +
    "</li>");

};

$(document).ready(function(){

    //make the first screen starting tag types
    startingTagsInit();

    //cant do this in css or else there is a li dot, but not doing it this way
    $("#status-header").hide();
    
    //deactivate submit buttons
    $("#request-button").attr("disabled", true);
    $("#request-button-multi").attr("disabled", true);

    //printJS('starting-tag-types', 'html');

    //START key listen events here --------------------------------------------------------------------------

    //firebase auth listen event
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("Logged in as: " + user.email);

            //check which user is signed in
            if(user.email === "emeqiss@deervalley.com"){
                //admin signed in
                globalDisplayCheckmark = "block";

                //change admin modal title
                $("#modal-title-admin").html("Admin Center");

                //hide the password input and login buttons
                $("#i-admin-pass").hide();
                $("#admin-login").hide();

                //update the validation status
                $("#admin-login-status").html("Logged In as: " + user.email);

                //show all admin functions
                $("#work-left-todo").css("display","block");

                //get initial db entries and display
                $("#status-table").empty();
                performQuery(namesRef, "datefinished", "==", 0);

                //set back to starting
                swapPageBody("starting");
            }else if(user.email === "anonymous@deervalley.com"){
                //anon signed in
                //get initial db entries and display
                $("#status-table").empty();
                performQuery(namesRef, "datefinished", "==", 0);
            }else{
                //nothing should be here
                console.log("an unauthorized user is signed in ??");
            }

        } else {
            // No user is signed in.
            console.log("Not currently logged in. Autologging as Anonymous@deervalley.com...");

            globalDisplayCheckmark = "none";
        }
    });

    //admin modal: on shown
    $("#admin-modal").on("shown.bs.modal", function(e){
        //focus on the i-admin input
        $("#i-admin-pass").focus();
    });

    //request modal: on shown
    $("#new-tag-modal").on("shown.bs.modal", function(e){
        //focus on the i-admin input
        $("#i-name").focus();
    });

    
    //outdoor table admin todo class: on click
    $(".outdoor-tag-to-print").click(function(){
        //grab value
        let thisValue = $(this).children("col").children("row");
        console.log(thisValue);
        
        
    });

    //request modal: on hidden
    $("#new-tag-modal").on("hidden.bs.modal", function(e){
        //change back modal mode
        swapModalMode("normal");
    });


    //on excel button click
    $("#excel-button").click(function(){
        //on click, it keeps the same modal, but it swaps out form inputs

        //swap modal using this
        swapModalMode("excel");

        //focus on first field
        $("#i-requestor-multi").focus();
    });

    //requestor multi: on keyup
    $("#i-requestor-multi").keyup(function(){
        //update multi tag
        requestMultiTagUpdate();
    });

    //requestor multi: on keyup
    $("#i-requestor").keyup(function(){
        //update multi tag
        requestSingleTagUpdate();
    });

    //comments on keyup
    $("#i-comments-multi").keyup(function(){
        //update multi tag
        requestMultiTagUpdate();
    });

    //comments on keyup
    $("#i-comments").keyup(function(){
        //update multi tag
        requestSingleTagUpdate();
    });

    //excel button multiple: on keyup
    $("#i-excel").keyup(function(){
        //request update
        requestMultiTagUpdate();

    });

    //excel submit button: on click
    $("#request-button-multi").click(function(){
        //submit info
        requestMultiTagUpdate();
        submitToDb()
    });

    //on admin pass: keyup enter key
    $("#i-admin-pass").keyup(function(e){
        if(e.which == 13){
            //enter key was pressed, call adminLogin function
            adminLogin();
        }
        
    });

    //on admin login button: clicked
    $("#admin-login").click(function(){
        //just call adminLogin
        adminLogin();
    });

    //on search keyup
    $("#i-search").keyup(function(e){
        //only do stuff on enter
        if(e.which == 13){
            //enter key was pressed
            //grab this value
            let searchValue = $(this).val();

            //check if empty
            if(searchValue == ""){
                //detect a keyup backspace

                //hide the reset button
                $("#search-reset").hide();

                //reset search status text
                $("#search-label").html("STATUS for unfinished tags:");
            } else{
                //string means search just that string in db

                //show the reset button
                $("#search-reset").show();

                //perform a search
                performSearch(namesRef, searchValue);
            }
        }
    });

    //on back-to-starting-button: clicked
    $("#back-to-starting-button").click(function(){
        //toggle the status back to first starting page
        swapPageBody("starting");

        //reset the search to start
        $("#status-table").empty();
        performQuery(namesRef, "datefinished", "==", 0);

        //reset search status text
        $("#search-label").html("STATUS for unfinished tags:");
    });
    

    //on order status button: click
    $("#order-status-button").click(function(){
        //swap page back to starting
        swapPageBody("status");

        //delete contents of search bar
        $("#i-search").val("");
    });

    //on request new tag button click
    $("#new-tag-modal-button").click(function(){
        //reset the sending status text to nothing
        $("#sending-monitor").empty();

        //re-activate submit button
        $("#request-button").attr("disabled", false);
        
    });

    //on search reset button click
    $("#search-reset").click(function(){
        location.reload();
    });


    //excel example button: on click
    $("#excel-example-modal").click(function(){
        $(this).show();
    });

    //admin table class: on click
    $(".admin-todo-class").click(function(){
        //this section will copy excel-formatted data into clipboard
        //console.log("clk");

        //erase all data copied labels, then add data copied label to the one it applies to
        $(".admin-table-copied-class").empty();
        $(this).children(".row").children(".col-h4").children("h4").append("DATA COPIED TO CLIPBOARD");

        //copy the table to clipboard
        let idToClipboard = $(this).children(".row").children(".col-data").children("table").attr("id");
        idToClipboard = "#" + idToClipboard;
        copyToClipboard(idToClipboard);
        //console.log(toSelect);
    });

    //admin table class: on mousedown then mouseup
    $(".admin-todo-class").mousedown(function(){
        //this will change styling so its easier to see what was copied
        $(this).css("border","2px solid red");
    }).mouseup(function(){
        $(this).css("border","2px solid #ddd");
    });
    

    //start-tag: on click
    $(".start-tag").click(function(){
        //on click, bring up the modal
        $("#new-tag-modal").modal("show");

        //empty the excel input area
        $("#i-excel").val("");

        //show the second line, just in case they click on basket check tag first and go back
        $("#i-titlecity").show();

        //if the type is 11
        if($(this).parent().parent().attr("id") === "starting-tag-11"){
            //get rid of the second line input so less confusing
            $("#i-titlecity").hide();

            //change default value
            $("#i-name").attr("placeholder", "Single Basket Check Number -- Use Excel Import for Multiples");
        };

        //update global tag type, need to parse int, 2 digits, 
        //even if it doesnt have [14] its fine, it will parse into exactly what it needs to become
        let idString = $(this).parent().parent().attr("id");
        let idNumber = idString[13] + idString[14];
        idNumber = parseInt(idNumber);

        //console.log(idNumber);
        globalTagType = idNumber;
        //console.log(idNumber);

        //do a single tag update for the modal
        requestSingleTagUpdate();
    });

    //request modal: on name input change
    $("#i-name").keyup(function(){

        //update
        requestSingleTagUpdate();
    });

    //request modal: on titlecity input change
    $("#i-titlecity").keyup(function(){
        //update
        requestSingleTagUpdate();
    });

    //request modal: on thirdline input change
    $("#i-thirdline").keyup(function(){
        //update
        requestSingleTagUpdate();
    });

    //request modal add line: on click
    $("#request-modal-addline").click(function(){
        //make third line appear
        $("#modal-thirdline").css("display","flex");
    });

    

    //request modal: on user submit
    $("#request-button").click(function(){
        //grey out submit button immediately, add 'sending' text
        $(this).attr("disabled", true);
        $("#sending-monitor").html("Sending...");

        //create a single submit object
        let submitObj = {
            preName: $("#i-name").val(),
            titleCity: $("#i-titlecity").val(),
            thirdLine: $("#i-thirdline").val(),
            preRequestor: $("#i-requestor").val(),
            comments: $("#i-comments").val()
        };

        //empty array, then push this single entry into it
        globalSubmitArray = [];
        globalSubmitArray.push(submitObj);

        //send single submission to the db
        requestSingleTagUpdate();
        submitToDb();
    });

    function submitToDb(){
        /*
        data in:
        array[{preName,preRequestor,titleCity,thirdLine,comments},{},{}]
        -
        data out:
        */

        //check to see if valid first
        let submitStatus = updateSubmissionValidity();
        //console.log(submitStatus);
        if(submitStatus){
            //valid

            //go for submit
            globalSubmitArray.forEach(function(arrayItem){
                //for each item inside array, do this
         
                //lower casify and split name to an array, searching can be done easilyer
                 let tagName = arrayItem.preName;
                 let tagRequestor = arrayItem.preRequestor;
                 let prependNameArray = tagName.toLowerCase();
                 let prependRequestorArray = tagRequestor.toLowerCase();
         
                 //before split, add temp var and prepend name to array, so "Jake Smith"
                 //looks like ["jake smith","jake","smith"]
                 let nameArray = prependNameArray.split(" ");
                 let requestorArray = prependRequestorArray.split(" ");
                 nameArray.unshift(prependNameArray);
                 requestorArray.unshift(prependRequestorArray);
                 
                 //grab current timestamp
                 let date = new Date();
                 let currentTimestamp = date.getTime();
         
                 //make a new document in db, auto gen id
                 db.collection("names").add({
                     name: tagName,
                     namearray: nameArray,
                     color: globalTagType,
                     titlecity: arrayItem.titleCity,
                     thirdline: arrayItem.thirdLine,
                     requestor: tagRequestor,
                     requestorarray: requestorArray,
                     comments: arrayItem.comments,
                     daterequest: currentTimestamp,
                     datefinished: 0
                 }).then(function(){
                     //when writing is done, reload page
                     location.reload();
                 });
            });
        }else{
            //invalid
        };
    }
    
    
    
    
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function() {
        // Existing and future Auth states are now persisted in the current
        // no session means logout on close or reload
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with persistence.
        let sqrtNonPattern = Math.sqrt(4356);
        sqrtNonPattern = "iamanonymous" + sqrtNonPattern;
        sqrtNonPattern = sqrtNonPattern + "6";
        return firebase.auth().signInWithEmailAndPassword("anonymous@deervalley.com", sqrtNonPattern);
        
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);

        //check if login was incorrect
        if(error.code === "auth/wrong-password"){
            //update admin-login-status
            $("#admin-login-status").html("Invalid Login");
        } else if(error.code === "auth/too-many-requests"){
            //update admin-login-status
            $("#admin-login-status").html("Too Many Requests -- Wait 30 Seconds");
        }
    });

});

