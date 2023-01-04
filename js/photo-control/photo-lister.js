
export function getPhotoS3KeySync(baseUri, keyPrefix, numberOfUris = null, lastPhotoKey = null) {
    //This function query's AWS S3's ListObject API to load a number of URI's from a bucket and prefix

    if (!baseUri.endsWith("/")) {
        baseUri = baseUri + "/";
    }

    //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html
    var apiUrl = baseUri;
    var readUrisFrom = 0;
    var max_keys = "";
    if (lastPhotoKey === null) {
        apiUrl = `${baseUri}?prefix=${keyPrefix}/`;
        readUrisFrom = 1; //Start at 1 because the 0th item returned is the 'directory'
    }
    else {
        apiUrl = `${baseUri}?prefix=${keyPrefix}/&marker=${lastPhotoKey}`;
        readUrisFrom = 0; //Start at 0 since we don't need to include the directory
    }

    if (!!numberOfUris) {
        //NOTE: if using 1 as 'readUrisFrom' its because the prefix (folder) is considered one of the keys
        // if using 0 as 'readUrisFrom' its because this is inclusive of the last marker
        max_keys = `&max-keys=${numberOfUris + readUrisFrom}`
        apiUrl = `${apiUrl}${max_keys}`
    }

    console.log(`getting photos at ${apiUrl}`);

    // prep request to amazon s3 bucket API for object keys
    var objectKeys = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", apiUrl, false); // false for synchronous 

    try {
        xmlHttp.send(null);
        if (xmlHttp.status == 200) {
            var response = xmlHttp.responseText;
            var xmlDoc = null;
            console.log("Parsing XML from AWS S3 Response...")
            if (window.DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(response, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(txt);
            }

            var keyNodes = xmlDoc.getElementsByTagName("Key");
            console.log(`${keyNodes.length} Keys found for uri: ${apiUrl} \r\n${keyNodes}`)

            // NOTE: this is old code from an old implementation where 'areThereMorePhotos' controlled when a button appeared 
            //if (keyNodes.length - readUrisFrom < numberOfPhotos) {
            //    console.log(`Only found ${keyNodes.length - readUrisFrom} photos in last request, but ${numberOfPhotos} were requested`);
            //    areThereMorePhotos = false;
            //}
            //else {
            //    areThereMorePhotos = true;
            //}

            for (var i = readUrisFrom; i < keyNodes.length; i++) {
                var s3Key = keyNodes[i].childNodes[0].nodeValue;
                objectKeys.push(s3Key);
            }
        }
        else {
            console.log(`Error with response getting photo keys ${xhr.status}: ${xhr.statusText}`);
        }
    }
    catch (err) {
        console.log(`Error in getPhotoS3Keys: ${err}`)
    }
    return objectKeys;
}