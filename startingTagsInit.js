function startingTagsInit(){
    //first make tagArray an array of all tag types, just the color codes
    let tagArray = [ 1, 7, 2, 8, 3, 9, 4, 10, 11, 5 ];
    let thisTag;

    //for each in array do this
    tagArray.forEach(function(colorCode, index){
        //grab pseudo image
        thisTag = createPreviewImg({
            colorCode: colorCode,
            thirdLine: ""
        });
        
        //append it with appropriate id
        $("#starting-tag-types").append(
            "<div class='col col-12 col-md-6 col-lg-4 p-2' id='starting-tag-" + colorCode + "'>" + 
                "<div class='row justify-content-center'>" +
                    "<div class='col p-0'></div>" +
                        "<div class='col p-0 start-tag'>" + 
                            thisTag + 
                        "</div>" +
                    "<div class='col p-0'></div>" +
                "</div>" +
            "</div>"
        );

        
        
    }); //end foreach



    

    //this section writes into the admin center 2 line
    tagArray = [ 1, 2, 3 ];
    tagArray.forEach(function(colorCode){
        ////grab pseudo image
        thisTag = createPreviewImg({
            colorCode: colorCode,
            name: "2 LINES",
            secondLine: "",
            thirdLine: ""
        });

        //work-left-todo append 2 line
        $("#work-left-todo").append(
            "<div class='admin-todo-class'>" +
                "<div class='row py-2'>" +
                    "<div class='col'>" + thisTag + "</div>" +
                    "<div class='col col-data'>" +
                        //2 cell default table
                        "<table id='admin-table-" + colorCode + "'></table>" +
                    "</div>" +
                    "<div class='col col-12 col-h4'><h4 class='admin-table-copied-class'></h4></div>" +
                "</div>" +
            "</div>"
        );
    });


    //this section writes into the admin center 3 line
    tagArray = [ 1, 2, 3 ];
    tagArray.forEach(function(colorCode){
        ////grab pseudo image
        thisTag = createPreviewImg({
            colorCode: colorCode,
            name: "3 LINES",
            secondLine: "",
            thirdLine: ""
        });

        //work-left-todo append 3 line
        $("#work-left-todo").append(
            "<div class='admin-todo-class'>" +
                "<div class='row py-2'>" +
                    "<div class='col'>" + thisTag + "</div>" +
                    "<div class='col col-data'>" +
                        //3 cell default table
                        "<table id='admin-table-3-" + colorCode + "'></table>" +
                    "</div>" +
                    "<div class='col col-12 col-h4'><h4 class='admin-table-copied-class'></h4></div>" +
                "</div>" +
            "</div>"
        );
    });

    //this section writes a single entry for basket check
    thisTag = createPreviewImg({
        colorCode: 11,
        name: "<p style='font-size:60px;margin-top:-20px;'>&#8226;</p>",
        secondLine: "<p style='font-size:22px;margin-top:-20px;'>Basket Check</p>",
        thirdLine: ""
    });
    //work-left-todo append basket check
    $("#work-left-todo").append(
        "<div class='admin-todo-class'>" +
            "<div class='row py-2'>" +
                "<div class='col'>" + thisTag + "</div>" +
                "<div class='col col-data'>" +
                    "<table id='admin-table-" + 11 + "'></table>" +
                "</div>" +
                "<div class='col col-12 col-h4'><h4 class='admin-table-copied-class'></h4></div>" +
            "</div>" +
        "</div>"
    );

    //now for outdoor tags, #4 and #10, iterate thru all with print fn
    $("#work-left-todo").append(
        "<div class='outdoor-tag-to-print' id='admin-table-" + 4 + "'></div>"
    );

    //now for signs, #5, has to iterate thru all, like outdoor tags

    //now for basket check, #11*/

};