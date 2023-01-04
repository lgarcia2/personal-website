import { getPhotoS3KeySync } from './photo-lister.js';
//import { createPhotoImage } from './photo-image.js';

// Inspiration from https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/#:~:text=Click%20here%20to%20see%20the%20final%20web%20application,css%20folder%20and%20app.js%20in%20the%20js%20folder.
// Requirements:
// "photos" class element (i.e. <div class="photos"></div>)
// "loader" class element (i.e. <div class="loader"></div>)
// Optional:
// "loaderButton" id elements (i.e. <a id="loaderButton">Load More Photos...</a> )
(function () {

    // initialize
    const PHOTO_LOAD_LIMIT = 8;
    const BASE_URL = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/";
    const PHOTO_PREFIX = "background-images"; //TODO: add photos and update this dir
    var isLoadingPhotos = false;
    var lastPhotoKey = null;
    var areThereMorePhotos = true;

    const root = document.querySelector("body, html");
    const container = document.querySelector('.gg-container');
    //const images = document.querySelectorAll(".gg-box > img");
    const images = [];

    const photosElement = document.querySelector('.photos');
    const loaderElement = document.querySelector('.loader');
    const loadButton = document.querySelector('.loadButton');

    const hideLoader = () => {
        loaderElement.classList.remove('show');
    };

    const showLoader = () => {
        loaderElement.classList.add('show');
    };

    const keyAndBaseUriToFullUri = (baseUri, s3key) => {
        var fullUri = `${baseUri}/${s3key}`;
        if (baseUri.endsWith("/")) {
            fullUri = baseUri + s3key;
        }
        return fullUri
    }


    const createPhotoImage = (photoUri) => {
        const img = document.createElement('img');
        img.classList.add("thumb");
        img.src = photoUri;

        img.addEventListener("click", function (i) {
            var currentImg = this;
            var isLastImage = false;
            const parentItem = currentImg.parentElement;
            var currentImgIndex = 0;
            for (i = 0; i < images.length; i++) {
                if (currentImg === images[i]) {
                    console.log("found ref");
                    currentImgIndex = i;
                    break;
                }
            }

            var screenItem = document.getElementById("gg-screen");
            if (typeof (screenItem) == 'undefined' || screenItem == null) {
                console.log(`Creating Screen, element is {}`)
                screenItem = document.createElement('div');
                screenItem.id = "gg-screen";
                container.prepend(screenItem);
                if (parentItem.hasAttribute('data-theme')) screenItem.setAttribute("data-theme", "dark");

                screenItem.innerHTML = '<div class="gg-image"></div><div class="gg-close gg-btn">&times</div><div class="gg-next gg-btn">&rarr;</div><div class="gg-prev gg-btn">&larr;</div>';
                screenItem.addEventListener("click", function (e) {
                    if (e.target == this || e.target == close) hide();
                });
            }

            var route = currentImg.src;
            root.style.overflow = 'hidden';
            var first = this;
            var last = this;
            if (images.length > 0) {
                first = images[0].src;
                last = images[images.length - 1].src;
            }
            //const first = images[0].src;
            //const last = images[l - 1].src;
            const imgItem = document.querySelector(".gg-image"), prevBtn = document.querySelector(".gg-prev"), nextBtn = document.querySelector(".gg-next"), close = document.querySelector(".gg-close");
            imgItem.innerHTML = '<img src="' + route + '">';

            if (images.length > 1) {
                if (route == first) {
                    prevBtn.hidden = true;
                    var prevImg = false;
                    var nextImg = images[currentImgIndex + 1]
                    //var nextImg = currentImg.nextElementSibling;
                    console.log("route is first");
                }
                else if (route == last) {
                    nextBtn.hidden = true;
                    var nextImg = false;
                    var prevImg = images[currentImgIndex - 1]
                    //var prevImg = currentImg.previousElementSibling;
                    console.log("route is last");
                }
                else {
                    //var prevImg = currentImg.previousElementSibling;
                    //var nextImg = currentImg.nextElementSibling;
                    var prevImg = images[currentImgIndex - 1]
                    var nextImg = images[currentImgIndex + 1]
                    console.log("route is neither");
                }
            }
            else {
                prevBtn.hidden = true;
                nextBtn.hidden = true;
            }

            root.addEventListener("keydown", function (e) {
                if (e.keyCode == 37 || e.keyCode == 38) prev();
                if (e.keyCode == 39 || e.keyCode == 40) next();
                if (e.keyCode == 27) hide();
            });

            prevBtn.addEventListener("click", prev);
            nextBtn.addEventListener("click", next);

            function prev() {
                isLastImage = false;
                if (currentImgIndex == 0) { return; }
                //prevImg = currentImg.previousElementSibling;
                var prevImg = images[currentImgIndex - 1];
                imgItem.innerHTML = '<img src="' + prevImg.src + '">';
                //currentImg = currentImg.previousElementSibling;
                currentImg = images[currentImgIndex - 1];
                var mainImg = document.querySelector(".gg-image > img").src;
                nextBtn.hidden = false;
                prevBtn.hidden = mainImg === first;

                currentImgIndex = currentImgIndex - 1;
            };

            function next() {
                if (isLastImage) { return; }
                var nextImg = images[currentImgIndex + 1];
                imgItem.innerHTML = '<img src="' + nextImg.src + '">';
                currentImg = images[currentImgIndex + 1];
                prevBtn.hidden = false;
                currentImgIndex = currentImgIndex + 1;

                if (currentImgIndex === images.length - 1) {
                    lastPhotoKey = loadPhotos(lastPhotoKey, BASE_URL, PHOTO_PREFIX, PHOTO_LOAD_LIMIT);
                    if (currentImgIndex === images.length - 1) {
                        isLastImage = true;
                        nextBtn.hidden = currentImgIndex === images.length - 1;
                    }
                    //else {
                    //    isLastImage = false;
                    //}
                }
            };

            function hide() {
                root.style.overflow = 'auto';
                screenItem.remove();
            };
        });

        images.push(img);

        return img;
    }

    // Creates new img elements and appends them to the photos element
    const appendImgs = (photoKeys, baseUri, photoPrefix, lastPhotoKey, photoLoadLimit) => {
        console.log("Creating Imgs...")
        photoKeys.forEach(photoKey => {
            var photoUri = keyAndBaseUriToFullUri(baseUri, photoKey);
            console.log(`Creating Img for ${photoUri}`)
            //var img = createPhotoImage(photoUri, loadPhotos(lastPhotoKey, baseUri, photoPrefix, photoLoadLimit));
            var img = createPhotoImage(photoUri);
            // const img = document.createElement('img');
            // img.classList.add("thumb");
            // img.src = photoUri;

            photosElement.appendChild(img);
        });
    };

    const updateLoadButton = (areMorePhotos) => {
        //if button is not null or undefined
        if (loadButton) {
            if (!areMorePhotos) {
                loadButton.innerHTML = "End of list.";
            }
        }
    }

    const updatePage = (photoKeys, baseUri, photoPrefix, lastPhotoKey, photoLoadLimit, areMorePhotos) => {
        appendImgs(photoKeys, baseUri, photoPrefix, lastPhotoKey, photoLoadLimit);
        updateLoadButton(areMorePhotos);

        //Re-load gallery, so photos can be arranged correctly and examined
        //based on https://github.com/jestov/grid-gallery
        //loadGridGallery();
    }

    const loadPhotos = (lastPhotoKey, baseUri, photoPrefix, photoLoadLimit) => {
        isLoadingPhotos = true;
        showLoader();
        try {
            if (areThereMorePhotos) {
                var photoKeysToDisplay = [];

                //using a photo load limit + 1 to load an extra photo to always have an accurate "are there more photos" value
                var extraPhotoLoadLimit = PHOTO_LOAD_LIMIT + 1;
                var photoS3Keys = getPhotoS3KeySync(baseUri, photoPrefix, extraPhotoLoadLimit, lastPhotoKey);
                if (photoS3Keys.length > 0) {
                    //display up to the limit of the photos
                    photoKeysToDisplay = photoS3Keys.slice(0, photoLoadLimit);
                    if (photoS3Keys.length <= photoLoadLimit) {
                        areThereMorePhotos = false;
                        lastPhotoKey = photoS3Keys[photoS3Keys.length - 1];
                    }
                    else {
                        areThereMorePhotos = true;
                        //last key isn't the last in the list, its the last up to the limit
                        lastPhotoKey = photoS3Keys[photoS3Keys.length - 2];
                    }
                }
                else {
                    areThereMorePhotos = false;
                }
                updatePage(photoKeysToDisplay, baseUri, photoPrefix, lastPhotoKey, photoLoadLimit, areThereMorePhotos);
            }
        } catch (error) {
            console.log("Error in loadPhotos");
            console.log(error.message);
        } finally {
            hideLoader();
        }
        isLoadingPhotos = false;
        return lastPhotoKey;
    }

    const handleScroll = () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            console.log("loading more photos on scroll")
            lastPhotoKey = loadPhotos(lastPhotoKey, BASE_URL, PHOTO_PREFIX, PHOTO_LOAD_LIMIT);
        }
        else {
            console.log("NOT loading more photos on scroll")
        }
    }

    window.addEventListener('scroll', () => handleScroll(), {
        passive: true
    });

    $(".loadButton").click(function () { lastPhotoKey = loadPhotos(lastPhotoKey, BASE_URL, PHOTO_PREFIX, PHOTO_LOAD_LIMIT) });

    lastPhotoKey = loadPhotos(lastPhotoKey, BASE_URL, PHOTO_PREFIX, PHOTO_LOAD_LIMIT);

})();