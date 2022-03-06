

// Inspiration from https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/#:~:text=Click%20here%20to%20see%20the%20final%20web%20application,css%20folder%20and%20app.js%20in%20the%20js%20folder.
(function () {

    const photosElement = document.querySelector('.photos');
    const loaderElement = document.querySelector('.loader');


    const getPhotoS3Keys = (lastPhotoUri, numberOfPhotos) => {
        
        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html
        if(lastPhotoUri === null)
        {
            //NOTE: using number of Photos + 1 because the prefix (folder) is considered one of the keys
            API_URL = `${baseUrl}?prefix=background-images/&max-keys=${numberOfPhotos+1}`;
            readUrisFrom = 1 //Start at 1 because the 0th item returned is the 'directory'
        }
        else
        {
            //NOTE: using number of Photos + 1 because this is inclusive of the last marker
            API_URL = `${baseUrl}?prefix=background-images/&marker=${lastPhotoUri}&max-keys=${numberOfPhotos}`;
            readUrisFrom = 0 //Start at 0 since we dont need to include the directory
        }
        console.log(`getting photos at ${API_URL}`);

        // hit amazon s3 bucket API for object keys of photos
        var objectKeys = [];
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", API_URL, false); // false for synchronous 

        try {
            xmlHttp.send(null);
            if (xmlHttp.status == 200) 
            {
                var response = xmlHttp.responseText;
                console.log("gotta parse dat xml")
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
                console.log(`Keys found for uri: ${API_URL} \r\n${keyNodes}`)
                if (keyNodes.length-readUrisFrom < numberOfPhotos)
                {
                    console.log(`Only found ${keyNodes.length-readUrisFrom} photos in last request, but ${numberOfPhotos} were requested`);
                    areThereMorePhotos = false;
                }
                else
                {
                    areThereMorePhotos = true;
                }

                for(var i = readUrisFrom; i < keyNodes.length; i++)
                {
                    s3Key = keyNodes[i].childNodes[0].nodeValue;
                    objectKeys.push(s3Key);
                }
                return objectKeys;
            } 
            else 
            {
                console.log(`Error with response getting photo keys ${xhr.status}: ${xhr.statusText}`);
            }
        } 
        catch(err) 
        { 
            console.log(`Error in getPhotoS3Keys: ${err}`)
        }
    }


    const showPhotos = (photoS3Keys) => {
        console.log("showPhotos Started")
        photoS3Keys.forEach(photoS3Key => {
            photoUri = `${baseUrl}${photoS3Key}`

            const img = document.createElement('img');
            img.classList.add("thumb");
            img.src = photoUri;

            photosElement.appendChild(img);
        });
    };

    const hideLoader = () => {
        loaderElement.classList.remove('show');
    };

    const showLoader = () => {
        loaderElement.classList.add('show');
    };

    const hasMorePhotos = () => {
        return areThereMorePhotos;
    };

    loadPhotos = (lastPhotoKey, limit) => {
        // show the loader
        showLoader();
        nextLastPhotoKey = lastPhotoKey
        try {
            // if having more quotes to fetch
            if (hasMorePhotos()) {
                // call the API to get quotes
                photoS3Keys = getPhotoS3Keys(lastPhotoKey, limit);
                if(photoS3Keys.length > 0)
                {
                    nextLastPhotoKey = photoS3Keys[photoS3Keys.length-1]
            
                    // show quotes
                    //console.log("Showing Photos");
                    showPhotos(photoS3Keys);
                }
            }
        } catch (error) {
            console.log("Error in loadPhotos");
            console.log(error.message);
        } finally {
            hideLoader();
        }
        return nextLastPhotoKey;
    };

    loadMorePhotos = () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMorePhotos()) {
            lastPhotoUri = loadPhotos(lastPhotoUri, limit);
            //console.log("Last Photo Uri")
            //console.log(lastPhotoUri)
        }

        //Re-load gallery, so photos can be arranged correctly and examined
        loadGridGallery();
    }

    window.addEventListener('scroll', () => loadMorePhotos(), {
        passive: true
    });

    $(document).on("click", "#loaderButton", loadMorePhotos);

    // initialize
    lastPhotoUri = null;
    const limit = 8;
    const baseUrl = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/";
    areThereMorePhotos = true;

    lastPhotoUri = loadPhotos(lastPhotoUri, limit);

    //Re-load gallery, so photos can be arranged correctly and examined
    //based on https://github.com/jestov/grid-gallery
    loadGridGallery();

})();