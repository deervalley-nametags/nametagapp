function textValidation(inputString, minChar){
    //this will automatically convert input text and return with validated text
    //console.log("textValidation called with: " + inputString);

    /*
    //check undefined
    if(inputString == undefined){
        //input was undefined
        return 0;
    }else if(inputString == " "){
        //input was an empty string
        return 0;
    }else if(inputString == ""){
        //input was an empty string
        return 0;
    };*/

    //1st step: check all the string to make sure it has no special characters
    //this is for db security purposes, only 0-9, a-Z, and !@.,?
    let outputString = regexDelete(inputString);

    //1st and half step: check and cut short if string is under the minimum character limit
    let stringLength = inputString.length;
    if(stringLength < minChar){
        //doesnt meet requirement
        return 0;
    };

    //2nd step: add spaces after commas
    outputString = addCommaSpaces(outputString);

    //3rd step: title caps everything
    outputString = titleCapsify(outputString);

    //4th step: check state names and shorten to abbreviation
    outputString = stateToAbbv(outputString);

    //console.log(outputString);
    return outputString;
};

function regexDelete(string){
    //check if string is empty
    if(string===""){
        //if empty, do nothing
        return "";
    }else{
        //check an entire string for valid characters, then return only those
        const regex = /\w|\n|\r|\t|\d|\.|\!|\,| |@|\&/g;
        let found = string.match(regex);

        //because it returns an array of all the characters, need to compile them into
        //a string, join("") works but join() nor toString() works without adding commas
        let compiledString = found.join("");

        //console.dir(compiledString);
        return compiledString;
    }
    
};

function addCommaSpaces(inputString){
    //add appropriate spacing after commas if not exist

    //split spaces into array
    let splitString = inputString.split(",");

    //check length of array, 1 for no comma, 2 for one comma
    if(splitString.length > 1){
        //has at least one comma
        let stringSelection = splitString[1];

        //check if the string on 2nd word starts with a space, delete if so
        if(stringSelection[0] === " "){
            //has space already, join only with comma
            splitString = splitString.join(",");
        }else{
            //doesnt have space, add one
            splitString = splitString.join(", ");
        };
        //console.log(splitString);
        
        return splitString;
    } else{
        //has no commas, can just return w/ no modification
        return inputString;
    };
    
};

function titleCapsify(inputString){
    //title caps first letter of each word
    //console.log(inputString);

    //split spaces into array
    let splitString = inputString.split(" ");

    //if the following is nothing it will throw an error, so delete it
    //before it throws an error, this is a temporary state before adding another word
    //console.dir(splitString[splitString.length - 1]);
    if(splitString[splitString.length - 1] === ""){
        //remove it from array
        splitString.pop();
    };
    
    let combinedString = splitString.map(function(word){
        //make first character uppercase
        let firstChar = word[0].toUpperCase();

        //delete that first lowercase character
        //slice in this case actually saves the remaining char's instead
        word = word.slice(1);

        //combine characters into a word
        word = firstChar + "" + word;
        return word;
    });

    //join all words together to form full name before returning
    combinedString = combinedString.join(" ");
    //console.log(combinedString);
    return combinedString;
};

function stateToAbbv(inputString){
    //compile a list of all state names
    const stateFull = ["Alabama", "Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
    const stateAbbv = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
    const stateAbbvTitleCaps = ["Al","Ak","Az","Ar","Ca","Co","Ct","De","Dc","Fl","Ga","Hi","Id","Il","In","Ia","Ks","Ky","La","Me","Md","Ma","Mi","Mn","Ms","Mo","Mt","Ne","Nv","Nh","Nj","Nm","Ny","Nc","Nd","Oh","Ok","Or","Pa","Ri","Sc","Sd","Tn","Tx","Ut","Vt","Va","Wa","Wv","Wi","Wy"];
    //console.log(stateFull.length); //stateAbbvTitleCaps is just for searching purposes

    //split and grab the 2nd item in array, check to see if its a state name
    let splitString = inputString.split(",");

    //get rid of the first character which is a space thanks to add comma spaces
    //only if splitString[1] exists
    let splicedString;
    if(splitString.length === 2){
        //
        splicedString = splitString[1].slice(1);
    };
    
    
    let stateSearch = stateFull.indexOf(splicedString); //-1 if no result, # of index if match
    if(stateSearch != -1){
        //found match
        return splitString[0] + ", " + stateAbbv[stateSearch];
    }else{
        //no match found in the statefull

        //start a new search for searching stateabbv for capitalization purposes
        let innerStateSearch = stateAbbvTitleCaps.indexOf(splicedString);
        if(innerStateSearch != -1){
            //found inner match
            return splitString[0] + ", " + stateAbbv[innerStateSearch];
        }else{
            //in 2 searches, found nothing
            return inputString;
        };
    };
};
