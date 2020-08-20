
$(document).ready(function () {

    var baseUrl = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/"

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var response = xmlHttp.responseText;
            if (window.DOMParser)
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(response, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(txt);
            }

            var keyNodes = xmlDoc.getElementsByTagName("Key");
            var objectNames = [];
            for(var i = 1; i < keyNodes.length; i++) //Start at 1 because the 0th index is the 'directory'
            {
                objectNames.push(keyNodes[i].childNodes[0].nodeValue);
            }
            
            index = Math.floor((Math.random() * objectNames.length));
            imageUrl = "url('" + baseUrl + objectNames[index] + "')";
            console.log(imageUrl);
            $(".image-rotate").css("background-image", imageUrl);
        }
    }

    //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html
    var listBucketUrl = baseUrl + "?prefix=background-images";
    xmlHttp.open("GET", listBucketUrl, true); // true for asynchronous 
    xmlHttp.send(null);
});