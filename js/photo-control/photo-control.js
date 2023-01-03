
export class PhotoControl {
    constructor(baseUri, uriPrefix, loadLimit) {
        this.baseUri = baseUri;
        this.uriPrefix = uriPrefix;
        this.loadLimit = loadLimit;
        this.s3Keys = [];
        this.imgs = [];
        this.areMorePhotos = true;
    }



    loadPhotos() {
        try {
            if (this.areMorePhotos) {
                var photoKeysToDisplay = [];
                var lastPhotoKey = null;
                if (this.s3Keys.length > 0) {
                    lastPhotoKey = this.s3Keys[this.s3Keys.length - 1];
                }

                //using a photo load limit + 1 to load an extra photo to always have an accurate "are there more photos" value
                var extraPhotoLoadLimit = this.photoLoadLimit + 1;
                var photoS3Keys = getPhotoS3KeySync(this.baseUri, this.photoPrefix, extraPhotoLoadLimit, lastPhotoKey);
                if (photoS3Keys.length > 0) {
                    //display up to the limit of the photos
                    photoKeysToDisplay = photoS3Keys.slice(0, this.photoLoadLimit);
                    if (photoS3Keys.length <= photoLoadLimit) {
                        this.areMorePhotos = false;
                        //lastPhotoKey = photoS3Keys[photoS3Keys.length - 1];
                    }
                    else {
                        this.areMorePhotos = true;
                        //last key isn't the last in the list, its the last up to the limit
                        //lastPhotoKey = photoS3Keys[photoS3Keys.length - 2];
                    }
                }
                else {
                    this.areMorePhotos = false;
                }
            }
        } catch (error) {
            console.log("Error in loadPhotos");
            console.log(error.message);
        } finally {
            //hideLoader();
        }
        this.s3Keys.concat(photoKeysToDisplay);
        return photoKeysToDisplay;
    }

    getS3KeysSync(baseUri, keyPrefix, numberOfUris = null, lastPhotoKey = null) {
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


}