function createPreviewImg(imgObj){
    /*
    this function allows reusable psuedo tag image creation
    for status and both preview window types
    -
    data struc of arrayObject(in): 
    imgObj = { colorCode, name, secondLine, thirdLine }
    if imgObj did not come with a secondLine or thirdLine or name, place default 
    provided by the colorcode defName and defSecond
    -
    data struc of output:
    return "string", where string a single contained div row with all info
    */

    //translate color code
    let tagTypeObj = colorCodeToClass(imgObj.colorCode);

    //check if imgObj came with a name, if not, then grab defName, defSecond, etc
    if(!imgObj.hasOwnProperty("name")){
        //doesn't have it, so add it in
        imgObj.name = tagTypeObj.defName;
        imgObj.secondLine = tagTypeObj.defSecond;
    };


    //concatenate return string--start row
    let returnString = "<div class='col col-md-6 col-lg-4 p-0'><div class='row justify-content-center " + tagTypeObj.bg + "'>" +

    //col A
    "<div class='col col-auto " + tagTypeObj.img + "'></div>" +

    //col B
    "<div class='col' style='max-width:185px;'>" + 
    
        //row B1
        "<p style='min-width:60px;' class='row justify-content-center title-text'>" +
        imgObj.name + 
        "</p>" +

        //row B2
        "<p class='row justify-content-center smaller-text'>" +
        imgObj.secondLine + 
        "</p>" +

        //row B3
        "<p class='row justify-content-center smaller-text'>" +
        imgObj.thirdLine + 
        "</p>" +
    
    //end col B
    "</div>" +


    //col D for quantity, obsolete
    /*
    "<div style='position:relative;right:5px;top:75%;font-size:18px;'>" +
    tagTypeObj.quantity +
    "</div>" +*/

    //end row and col
    "</div></div>";

    //return
    return returnString;
};