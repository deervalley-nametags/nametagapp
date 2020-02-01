function performQuery(namesRef, whereQuery, whereMode, whereQueryData){
    namesRef.where(whereQuery, whereMode, whereQueryData).get().then(function(querySnapshot) {
        $("#admin-table-4").empty();
        $("#status-table").empty();
        $("#admin-table-11").empty();
        querySnapshot.forEach(function(doc) {
            //console.log("f");
            /*
            performQuery can't return all because reads were too high, so it must have some 
            .where filter, by default the status page runs on "datefinished" == 0 to
            collect unfinished documents
            -
            this section runs once PER document found
            doc.data() is never undefined for query doc snapshots
            -
            time data had e+ math expression errors using .toPrecision, so the numbers
            are /8640000 instead of /86400000 (*10), math rounded, then /10 again
            so it has the correct 0.0 precision
            this is because math.round() only rounds to the nearest whole integer
            */

            //compile time data
            let date = new Date();
            let currentTimestamp = date.getTime();
            let requestTimestamp = doc.data().daterequest;
            let reqDaysAgo = (currentTimestamp - requestTimestamp) / 8640000;
            reqDaysAgo = Math.round(reqDaysAgo) / 10;

            //compile status into a string
            let finishStatus;
            let statusColorClass;
            let finishTimestamp = doc.data().datefinished;
            let finDaysAgo;
            let checkmarkDisplay;
            let checkmarkUndoDisplay;
            if(!finishTimestamp){
                //this means it isn't done
                finishStatus = "Still Working...";
                statusColorClass = "status-yellow";

                //update checkmark buttons
                checkmarkDisplay = "block";
                checkmarkUndoDisplay = "none";
            }
            else{
                //this means it has finished, concatenate how many days ago fin'd
                finDaysAgo = (currentTimestamp - finishTimestamp) / 8640000;
                finDaysAgo = Math.round(finDaysAgo) / 10;
                finishStatus = "Finished " + finDaysAgo + " days ago!";
                statusColorClass = "status-green";

                //update checkmark buttons
                checkmarkDisplay = "none";
                checkmarkUndoDisplay = "block";
            }

            //rearrange data so createPreviewImg can do its thing
            let imgObj = {
                name: doc.data().name,
                colorCode: doc.data().color,
                secondLine: doc.data().titlecity,
                thirdLine: doc.data().thirdline
            }

            //debug:: found documents id key
            //console.log(doc.id);
            

            //actually make a li element into normal status table
            $("#status-table").append(
                //start row
                "<li class='row mt-1 justify-content-around'>" +

                //1st section is the pseudo image
                "<div class='col col-12 col-md-5 px-1'>" +
                createPreviewImg(imgObj) +
                "</div>" +

                //2nd section is requestor time info, and comments
                "<div class='col col-12 col-md-5 px-1'>Requestor: " +
                doc.data().requestor +
                "<br />Requested: " +
                reqDaysAgo +
                " Days Ago<br />" +
                "Comments: " +
                doc.data().comments +
                "</div>" +

                //3rd section is for finished status and checkmark box for admin
                "<div class='col col-12 col-md-2 px-1 " +
                statusColorClass +
                "'>STATUS: " +
                finishStatus +
                "<div class='checkmark-block-display' id='" + doc.id + "' style='display:" + globalDisplayCheckmark + ";'>" +
                "<div class='checkmark-button' onclick='checkmarkButtonDbUpdate(event)' style='display:" + checkmarkDisplay + "'><button class='btn btn-primary' style='font-size: 20px;'>&#10004;</button></div>" +
                "<div class='checkmark-undo-button' onclick='checkmarkButtonDbUpdate(event)' style='display:" + checkmarkUndoDisplay + "'><button class='btn btn-light' style='font-size: 20px;'>&#10226;</button></div>" +
                "</div></div>" +

                //end row
                "</li>"
            );

            //translate the color entry to the admin export types
            let translatedDocColor = translateDocColor(doc.data().color);

            

            //this checks if the mode came in as datefinished, which means that it is grabbing all the unfinished tags
            //so it can also add the list to the admin todo tables
            if(whereQuery == "datefinished"){
                //console.log(translatedDocColor);
                //only if the translated tag type is 1, 2, or 3
                if(translatedDocColor == 1 || translatedDocColor == 2 || translatedDocColor == 3){
                    //the tables are already created e.g. admin-table-1 for colorCode 1, just need to find which table
                    //to append into and then append it
                    let adminTableSelector; 

                    //pre make the default 2 column
                    let itemToAppend;

                    //check if doc.data().thirdline is more than an empty string
                    if(doc.data().thirdline === ""){
                        //2 line
                        adminTableSelector = "#admin-table-" + translatedDocColor;

                        //build the 2 line append
                        itemToAppend = "<tr>" +
                            "<td>" +
                                //first cell: name
                                doc.data().name +
                            "</td>" +
                            "<td>" +
                                //second cell: titlecity
                                doc.data().titlecity +
                            "</td>" +
                        "</tr>";
                    } else if(!doc.data().hasOwnProperty("thirdline")){
                        //nothing should be in here, but means 2 line, deprecated since all db has this prop
                        console.log("hey, something made the doc.data().hasOwnProperty(thirdline) pop up");
                    } else{
                        //3 line
                        adminTableSelector = "#admin-table-3-" + translatedDocColor;

                        //build the 3 line append
                        itemToAppend = "<tr>" +
                            "<td>" +
                                //first cell: name
                                doc.data().name +
                            "</td>" +
                            "<td>" +
                                //second cell: titlecity
                                doc.data().titlecity +
                            "</td>" +
                            "<td>" +
                                //third cell: titlecity
                                doc.data().thirdline +
                            "</td>" +
                        "</tr>";
                    };
                    //console.log(adminTableSelector);
                    
                    //now append it
                    $(adminTableSelector).empty();
                    $(adminTableSelector).append(itemToAppend);
                    $(adminTableSelector).append(itemToAppend);
                } else if(translatedDocColor == 11){
                    //this section is for tag type 11, basket check

                    //build the item to append
                    let itemToAppend = "<tr>" +
                        "<td>" +
                            //first cell: name
                            doc.data().name +
                        "</td>" +
                    "</tr>";
                    //$("#admin-table-11").empty();
                    $("#admin-table-11").append(itemToAppend);

                }else if(translatedDocColor == 4){
                    //this section is for tag type 4, outdoor

                    //build the item to append
                    //construct the preview img obj
                    let imgObj = {
                        colorCode: 4,
                        name: doc.data().name,
                        secondLine: doc.data().titlecity,
                        thirdLine: doc.data().thirdline
                    }
                    let itemToAppend = createPreviewImg(imgObj);
                    itemToAppend = "<div>" + itemToAppend + "</div>";
                    $("#admin-table-4").append(itemToAppend);
                };
            };
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
};