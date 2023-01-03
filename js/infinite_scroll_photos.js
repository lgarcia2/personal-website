import { getPhotoS3UrisSync } from './photo-control/photo-lister.js';

// Inspiration from https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/#:~:text=Click%20here%20to%20see%20the%20final%20web%20application,css%20folder%20and%20app.js%20in%20the%20js%20folder.
// Requirements:
// "photos" class element (i.e. <div class="photos"></div>)
// "loader" class element (i.e. <div class="loader"></div>)
// Optional:
// "loaderButton" id element (i.e. )
(function () {

    // initialize
    const PHOTO_LOAD_LIMIT = 8;
    const BASE_URL = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/";
    const PHOTO_PREFIX = "background-images"; //TODO: add photos and update this dir
    lastPhotoUri = null;
    areThereMorePhotos = true;

    const photosElement = document.querySelector('.photos');
    const loaderElement = document.querySelector('.loader');
    const loadButtonElement = document.querySelector('.loadButton');

    const hideLoader = () => {
        loaderElement.classList.remove('show');
    };

    const showLoader = () => {
        loaderElement.classList.add('show');
    };

    const hasMorePhotos = () => {
        return areThereMorePhotos;
    };

    // Initial photo discovery
    photoUris = getPhotoS3UrisSync(BASE_URL, PHOTO_PREFIX, PHOTO_LOAD_LIMIT, null);

    // Creates new img elements and appends them to the photos element
    //const showPhotos = (photoUris) => {
    const createImgs = (photoUris) => {
        console.log("Creating Imgs...")
        photoUris.forEach(photoUri => {
            const img = document.createElement('img');
            img.classList.add("thumb");
            img.src = photoUri;

            photosElement.appendChild(img);
        });
    };


    // const getPhotoS3Keys = (lastPhotoUri, numberOfPhotos) => {

    //     //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html
    //     if (lastPhotoUri === null) {
    //         //NOTE: using number of Photos + 1 because the prefix (folder) is considered one of the keys
    //         API_URL = `${baseUrl}?prefix=background-images/&max-keys=${numberOfPhotos + 1}`;
    //         readUrisFrom = 1 //Start at 1 because the 0th item returned is the 'directory'
    //     }
    //     else {
    //         //NOTE: using number of Photos + 1 because this is inclusive of the last marker
    //         API_URL = `${baseUrl}?prefix=background-images/&marker=${lastPhotoUri}&max-keys=${numberOfPhotos}`;
    //         readUrisFrom = 0 //Start at 0 since we dont need to include the directory
    //     }
    //     console.log(`getting photos at ${API_URL}`);

    //     // hit amazon s3 bucket API for object keys of photos
    //     var objectKeys = [];
    //     var xmlHttp = new XMLHttpRequest();
    //     xmlHttp.open("GET", API_URL, false); // false for synchronous 

    //     try {
    //         xmlHttp.send(null);
    //         if (xmlHttp.status == 200) {
    //             var response = xmlHttp.responseText;
    //             console.log("gotta parse dat xml")
    //             if (window.DOMParser) {
    //                 parser = new DOMParser();
    //                 xmlDoc = parser.parseFromString(response, "text/xml");
    //             }
    //             else // Internet Explorer
    //             {
    //                 xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //                 xmlDoc.async = false;
    //                 xmlDoc.loadXML(txt);
    //             }

    //             var keyNodes = xmlDoc.getElementsByTagName("Key");
    //             console.log(`Keys found for uri: ${API_URL} \r\n${keyNodes}`)
    //             if (keyNodes.length - readUrisFrom < numberOfPhotos) {
    //                 console.log(`Only found ${keyNodes.length - readUrisFrom} photos in last request, but ${numberOfPhotos} were requested`);
    //                 areThereMorePhotos = false;
    //             }
    //             else {
    //                 areThereMorePhotos = true;
    //             }

    //             for (var i = readUrisFrom; i < keyNodes.length; i++) {
    //                 s3Key = keyNodes[i].childNodes[0].nodeValue;
    //                 objectKeys.push(s3Key);
    //             }
    //             return objectKeys;
    //         }
    //         else {
    //             console.log(`Error with response getting photo keys ${xhr.status}: ${xhr.statusText}`);
    //         }
    //     }
    //     catch (err) {
    //         console.log(`Error in getPhotoS3Keys: ${err}`)
    //     }
    // }



    loadPhotos = (lastPhotoKey, limit) => {
        // show the loader
        showLoader();
        nextLastPhotoKey = lastPhotoKey
        try {
            // if having more quotes to fetch
            if (hasMorePhotos()) {
                // call the API to get quotes
                photoS3Keys = getPhotoS3UrisSync(BASE_URL, "", PHOTO_LOAD_LIMIT, lastPhotoKey)
                if (photoS3Keys.length > 0) {
                    areThereMorePhotos = true;
                    nextLastPhotoKey = photoS3Keys[photoS3Keys.length - 1]
                    showPhotos(photoS3Keys);
                    if (photoS3Keys.length < PHOTO_LOAD_LIMIT) {
                        areThereMorePhotos = false;
                    }
                }
                else {
                    areThereMorePhotos = false;
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

    loadMorePhotosOnScroll = (element_id_to_update) => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            console.log("loading more photos on scroll")
            loadMorePhotos(element_id_to_update);
        }
        else {
            console.log("NOT loading more photos on scroll")
        }
    }

    loadMorePhotos = (element_id_to_update) => {
        console.log("Attempting to load more photos.")
        if (hasMorePhotos()) {
            lastPhotoUri = loadPhotos(lastPhotoUri, limit);
            //Re-load gallery, so photos can be arranged correctly and examined
            loadGridGallery();
            return true;
        }
        else {
            console.log("No more photos to load.");
            elements = $(element_id_to_update);
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                element.innerHTML = "End of list.";
            }
            return false;
        }
    }

    window.addEventListener('scroll', () => loadMorePhotosOnScroll("#loaderButton"), {
        passive: true
    });

    //$(document).on("click", "#loaderButton", "#loaderButton", loadMorePhotos);
    $("#loaderButton").click(function () { loadMorePhotos("#loaderButton") });

    lastPhotoUri = loadPhotos(lastPhotoUri, limit);

    //Re-load gallery, so photos can be arranged correctly and examined
    //based on https://github.com/jestov/grid-gallery
    loadGridGallery();

})();