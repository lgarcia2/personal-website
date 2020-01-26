
//To use, add the following html tag to your page: <div id="boxSection" >

function createMainBox (id, divClass, text) {
    var elementText = document.createTextNode(text);
    var h2 = document.createElement("h2");
    h2.id = id + "Text";
    var boxTextClass = id + "Text " + "boxText";
    h2.setAttribute("class",boxTextClass);
    h2.appendChild(elementText);
    var div = document.createElement("div");
    div.id = id;
    div.setAttribute("class", divClass);
    div.appendChild(h2);
    return div;
}

function createNavBox (id, divClass) {
    var h2 = document.createElement("h2");
    h2.id = id + "Text";
    h2.setAttribute("class","boxText");
    var div = document.createElement("div");
    div.id = id;
    div.setAttribute("class", divClass);
    div.appendChild(h2);
    return div;
}

function decimalToColor(decimalNumber) {
    var hexString = decimalNumber.toString(16);
    if(hexString.length < 6) {
        for(i = 0; i <= (6-hexString.length); i++){
            hexString = "0" + hexString;
        }
    }
    return "#" + hexString;
}

//use this jquery script to enable more than one navbox to have their colors change in tandem
//make sure the boxes have their class set as box{index} where {index} is the box number 1-4
$(document).ready(function () {

    randomColors();

    //these were some original colors I chose at one point
    //var box1Color = '#333333';
    //var box2Color = '#662222';
    //var box3Color = '#991111';
    //var box4Color = '#cc0000';

    document.getElementById("navBoxSection").appendChild(createNavBox("navBox1", "boxNav box1"));
    document.getElementById("navBoxSection").appendChild(createNavBox("navBox2", "boxNav box2"));
    document.getElementById("navBoxSection").appendChild(createNavBox("navBox3", "boxNav box3"));
    document.getElementById("navBoxSection").appendChild(createNavBox("navBox4", "boxNav box4"));

    document.getElementById("boxSection").appendChild(createMainBox("box1", "mainBox box1", "Technical Blog"));
    document.getElementById("boxSection").appendChild(createMainBox("box2", "mainBox box2", "Non-Technical Blog"));
    document.getElementById("boxSection").appendChild(createMainBox("box3", "mainBox box3", "Github"));
    document.getElementById("boxSection").appendChild(createMainBox("box4", "mainBox box4", "Wedding Info"));

    function changeColor(event) {
        console.log("changeColor 1");
        var color = event.data.color;
        var visibleTextIndex = event.data.visibleTextIndex;

        $(".box1").css("background-color", color);
        $(".box2").css("background-color", color);
        $(".box3").css("background-color", color);
        $(".box4").css("background-color", color);

        $(".box1Text").css("opacity", visibleTextIndex == 0 ? 1 : 0);
        $(".box2Text").css("opacity", visibleTextIndex == 1 ? 1 : 0);
        $(".box3Text").css("opacity", visibleTextIndex == 2 ? 1 : 0);
        $(".box4Text").css("opacity", visibleTextIndex == 3 ? 1 : 0);
    }

    function changeBack() {
        $(".box1").css("background-color", box1Color);
        $(".box2").css("background-color", box2Color);
        $(".box3").css("background-color", box3Color);
        $(".box4").css("background-color", box4Color);

        //the standard opacity is in the css
        if($(document).width() < 767)
        {
            $(".box1Text").css("opacity", .65);
            $(".box2Text").css("opacity", .65);
            $(".box3Text").css("opacity", .65);
            $(".box4Text").css("opacity", .65);
        } else {
            $(".box1Text").css("opacity", .25);
            $(".box2Text").css("opacity", .25);
            $(".box3Text").css("opacity", .25);
            $(".box4Text").css("opacity", .25);
        }
    }

    function randomColors() {
        console.log("randomColors func");

        color1 = Math.floor((Math.random() * 16777215));
        color4 = Math.floor((Math.random() * 16777215));
    
        if(color1 > color4){
            tmpcolor = color1
            color1 = color4
            color4 = tmpcolor
        }
    
        color2 = Math.floor(((color4 - color1) / 3) + (color4 - color1) / 3);
        color3 = Math.floor(((color4 - color1) / 3) + (2*(color4 - color1) / 3));
    
        //convert to hex
        box1Color = decimalToColor(color1);
        box2Color = decimalToColor(color2);
        box3Color = decimalToColor(color3);
        box4Color = decimalToColor(color4);

        console.log("decimal " + color1 + " converted to hex color1: " + box1Color);
        console.log("decimal " + color2 + " converted to hex color1: " + box2Color);
        console.log("decimal " + color3 + " converted to hex color1: " + box3Color);
        console.log("decimal " + color4 + " converted to hex color1: " + box4Color);

        //re-initialize
        $(".box1").css("background-color", box1Color);
        $(".box2").css("background-color", box2Color);
        $(".box3").css("background-color", box3Color);
        $(".box4").css("background-color", box4Color);

        $(document).off("mouseover", ".box1");
        $(document).off("mouseover", ".box2");
        $(document).off("mouseover", ".box3");
        $(document).off("mouseover", ".box4");

        $(document).on("mouseover", ".box1", { color: box1Color, visibleTextIndex: 0 }, changeColor);
        $(document).on("mouseover", ".box2", { color: box2Color, visibleTextIndex: 1 }, changeColor);
        $(document).on("mouseover", ".box3", { color: box3Color, visibleTextIndex: 2 }, changeColor);
        $(document).on("mouseover", ".box4", { color: box4Color, visibleTextIndex: 3 }, changeColor);
    }

    function navigate(event) {
        var nav = event.data.ref;
        window.location.href = nav;
    }

    $(document).on("click", "#randomColors", randomColors);

    //Init color
    $(".box1").css("background-color", box1Color);
    $(".box2").css("background-color", box2Color);
    $(".box3").css("background-color", box3Color);
    $(".box4").css("background-color", box4Color);

    $(document).on("mouseover", ".box1", { color: box1Color, visibleTextIndex: 0 }, changeColor);
    $(document).on("mouseover", ".box2", { color: box2Color, visibleTextIndex: 1 }, changeColor);
    $(document).on("mouseover", ".box3", { color: box3Color, visibleTextIndex: 2 }, changeColor);
    $(document).on("mouseover", ".box4", { color: box4Color, visibleTextIndex: 3 }, changeColor);

    $(document).on("mouseout", ".box1", changeBack);
    $(document).on("mouseout", ".box2", changeBack);
    $(document).on("mouseout", ".box3", changeBack);
    $(document).on("mouseout", ".box4", changeBack);

    //navigation
    $(document).on("click", ".box1", {ref: window.location.origin + "/technical"}, navigate);
    $(document).on("click", ".box2", {ref: window.location.origin + "/nontechnical"}, navigate);
    $(document).on("click", ".box3", {ref: "https://github.com/lgarcia2"}, navigate);
    $(document).on("click", ".box4", {ref: "http://theknot.com/luisheartstaylor"}, navigate);
});