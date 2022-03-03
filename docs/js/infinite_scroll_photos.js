

// Inspiration from https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/#:~:text=Click%20here%20to%20see%20the%20final%20web%20application,css%20folder%20and%20app.js%20in%20the%20js%20folder.
(function () {

    const photosEl = document.querySelector('.photos');
    const loaderEl = document.querySelector('.loader');


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
                //for(var i = 1; i < keyNodes.length; i++) //Start at 1 because the 0th index is the 'directory'
                for(var i = readUrisFrom; i < keyNodes.length; i++)
                {
                    s3Key = keyNodes[i].childNodes[0].nodeValue;
                    console.log(`Key found: ${s3Key}`)
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
            //console.log("Creating article");
            //const photoArticle = document.createElement('article');
            //photoArticle.classList.add("thumb");

            //photoEl.innerHTML = `
            //    <article class="thumb">
            //        <a href="${photoUri}" class="image">
            //            <img src="${photoUri}" alt="Nisl Adipiscing" />
            //        </a>
            //        <!--<h2>Photo Title</h2>-->
            //        <!--<p>Photo Subtitle</p>-->
            //    </article>
            //`

            // photoArticle.innerHTML = `
            //         <a href='${photoUri}' class='image'>
            //             <img src='${photoUri}' alt='Nisl Adipiscing' />
            //         </a>
            //         <!--<h2>Photo Title</h2>-->
            //         <!--<p>Photo Subtitle</p>-->
            // `

            const img = document.createElement('img');
            img.classList.add("thumb");
            img.src = photoUri;
            photosEl.appendChild(img);

            //img.innerHTML = `
            //        <a href='${photoUri}' class='image'>
            //            <img src='${photoUri}' alt='Nisl Adipiscing' />
            //        </a>
            //        <!--<h2>Photo Title</h2>-->
            //        <!--<p>Photo Subtitle</p>-->
            //`

            //console.log("appending child");
            ////document.getElementById("main").appendChild(photoArticle);
            //photosEl.appendChild(photoArticle);
        });
    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    //TODO
    const hasMorePhotos = (page, limit, total) => {
        return true;
        //TODO
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    };

    lastPhotoUri = null;
    const limit = 2;
    const baseUrl = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/";
    total = 0;

    loadPhotos = (lastPhotoKey, limit) => {
        // show the loader
        showLoader();
        nextLastPhotoKey = lastPhotoKey
        try {
            // if having more quotes to fetch
            if (hasMorePhotos(lastPhotoUri, limit, total)) {
                // call the API to get quotes
                photoS3Keys = getPhotoS3Keys(lastPhotoKey, limit);
                if(photoS3Keys.length > 0)
                {
                    nextLastPhotoKey = photoS3Keys[photoS3Keys.length-1]
            
                    // show quotes
                    console.log("Showing Photos");
                    showPhotos(photoS3Keys);
                    
                    // update the total
                    // total = response.total;
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
            hasMorePhotos(lastPhotoUri, limit, total)) {
            lastPhotoUri = loadPhotos(lastPhotoUri, limit);
            console.log("Last Photo Uri")
            console.log(lastPhotoUri)
        }

        //createMainPoptrox();
        //poptroxIt();
        //poptroxItV2();

        //var photos = $('#main');
        //photos.poptrox();

        loadGridGallery();
    }

    // poptroxItV2 = () => {

    //     var $body = $('body');
        
    //     // Main.
	// 	var $main = $('#main');

	// 	// Thumbs.
	// 		$main.children('.thumb').each(function() {

	// 			var	$this = $(this),
	// 				$image = $this.find('.image'), $image_img = $image.children('img'),
	// 				x;

	// 			// No image? Bail.
	// 				if ($image.length == 0)
	// 					return;

	// 			// Image.
	// 			// This sets the background of the "image" <span> to the image pointed to by its child
	// 			// <img> (which is then hidden). Gives us way more flexibility.

	// 				// Set background.
	// 					$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

	// 				// Set background position.
	// 					if (x = $image_img.data('position'))
	// 						$image.css('background-position', x);

	// 				// Hide original img.
	// 					$image_img.hide();

	// 		});

	// 	// Poptrox.
	// 		$main.poptrox({
	// 			baseZIndex: 20000,
	// 			caption: function($a) {

	// 				var s = '';

	// 				$a.nextAll().each(function() {
	// 					s += this.outerHTML;
	// 				});

	// 				return s;

	// 			},
	// 			fadeSpeed: 300,
	// 			onPopupClose: function() { $body.removeClass('modal-active'); },
	// 			onPopupOpen: function() { $body.addClass('modal-active'); },
	// 			overlayOpacity: 0,
	// 			popupCloserText: '',
	// 			popupHeight: 150,
	// 			popupLoaderText: '',
	// 			popupSpeed: 300,
	// 			popupWidth: 150,
	// 			selector: '.thumb > a.image',
	// 			usePopupCaption: true,
	// 			usePopupCloser: true,
	// 			usePopupDefaultStyling: false,
	// 			usePopupForceClose: true,
	// 			usePopupLoader: true,
	// 			usePopupNav: true,
	// 			windowMargin: 50
	// 		});

	// 		// Hack: Set margins to 0 when 'xsmall' activates.
	// 			// breakpoints.on('<=xsmall', function() {
	// 			// 	$main[0]._poptrox.windowMargin = 0;
	// 			// });

	// 			// breakpoints.on('>xsmall', function() {
	// 			// 	$main[0]._poptrox.windowMargin = 50;
	// 			// });
    // }







    // poptroxIt = () => {

    //     var	$window = $(window);
    //     var $body = $('body');
    //     var $wrapper = $('#wrapper');
        
    //     // Main.
	// 	var $main = $('#main');

	// 	// Thumbs.
	// 		$main.children('.thumb').each(function() {

	// 			var	$this = $(this),
	// 				$image = $this.find('.image'), $image_img = $image.children('img'),
	// 				x;

	// 			// No image? Bail.
	// 				if ($image.length == 0)
	// 					return;

	// 			// Image.
	// 			// This sets the background of the "image" <span> to the image pointed to by its child
	// 			// <img> (which is then hidden). Gives us way more flexibility.

	// 				// Set background.
	// 					$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

	// 				// Set background position.
	// 					if (x = $image_img.data('position'))
	// 						$image.css('background-position', x);

	// 				// Hide original img.
	// 					$image_img.hide();

	// 		});

	// 	// Poptrox.
	// 		$main.poptrox({
	// 			baseZIndex: 20000,
	// 			caption: function($a) {

	// 				var s = '';

	// 				$a.nextAll().each(function() {
	// 					s += this.outerHTML;
	// 				});

	// 				return s;

	// 			},
	// 			fadeSpeed: 300,
	// 			onPopupClose: function() { $body.removeClass('modal-active'); },
	// 			onPopupOpen: function() { $body.addClass('modal-active'); },
	// 			overlayOpacity: 0,
	// 			popupCloserText: '',
	// 			popupHeight: 150,
	// 			popupLoaderText: '',
	// 			popupSpeed: 300,
	// 			popupWidth: 150,
	// 			selector: '.thumb > a.image',
	// 			usePopupCaption: true,
	// 			usePopupCloser: true,
	// 			usePopupDefaultStyling: false,
	// 			usePopupForceClose: true,
	// 			usePopupLoader: true,
	// 			usePopupNav: true,
	// 			windowMargin: 50
	// 		});

	// 		// Hack: Set margins to 0 when 'xsmall' activates.
	// 			// breakpoints.on('<=xsmall', function() {
	// 			// 	$main[0]._poptrox.windowMargin = 0;
	// 			// });

	// 			// breakpoints.on('>xsmall', function() {
	// 			// 	$main[0]._poptrox.windowMargin = 50;
	// 			// });
    // }

    window.addEventListener('scroll', () => loadMorePhotos(), {
        passive: true
    });

    $(document).on("click", "#loaderButton", loadMorePhotos);
    //$(document).on("click", "#loaderButton", randomColors);

    //window.addEventListener('scroll', () => {
    //    const {
    //        scrollTop,
    //        scrollHeight,
    //        clientHeight
    //    } = document.documentElement;
    //
    //    if (scrollTop + clientHeight >= scrollHeight - 5 &&
    //        hasMorePhotos(lastPhotoUri, limit, total)) {
    //        lastPhotoUri = loadPhotos(lastPhotoUri, limit);
    //    }
    //}, {
    //    passive: true
    //});


    // initialize
    lastPhotoUri = loadPhotos(lastPhotoUri, limit);
    console.log("First lastPhotoUri:");
    console.log(lastPhotoUri);

    //poptroxIt();
    //createMainPoptrox();

    //console.log("About to poptrox");
    //var photos = $('#main');
    //photos.poptrox();
    //console.log("poptrox'd");

    //poptroxItV2();

    //based on https://github.com/jestov/grid-gallery
    loadGridGallery();

})();











    //$(document).ready(function () {
    //
    //    var baseUrl = "https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/"
    //
    //    var xmlHttp = new XMLHttpRequest();
    //    xmlHttp.onreadystatechange = function() { 
    //        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    //        {
    //            var response = xmlHttp.responseText;
    //            if (window.DOMParser)
    //            {
    //                parser = new DOMParser();
    //                xmlDoc = parser.parseFromString(response, "text/xml");
    //            }
    //            else // Internet Explorer
    //            {
    //                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //                xmlDoc.async = false;
    //                xmlDoc.loadXML(txt);
    //            }
    //
    //            var keyNodes = xmlDoc.getElementsByTagName("Key");
    //            var objectNames = [];
    //            for(var i = 1; i < keyNodes.length; i++) //Start at 1 because the 0th index is the 'directory'
    //            {
    //                objectNames.push(keyNodes[i].childNodes[0].nodeValue);
    //            }
    //            
    //            index = Math.floor((Math.random() * objectNames.length));
    //            imageUrl = "url('" + baseUrl + objectNames[index] + "')";
    //            console.log(imageUrl);
    //            $(".image-rotate").css("background-image", imageUrl);
    //        }
    //    }
    //
    //    //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html
    //    var listBucketUrl = baseUrl + "?prefix=background-images&max-Keys=12";
    //    xmlHttp.open("GET", listBucketUrl, true); // true for asynchronous 
    //    xmlHttp.send(null);
    //});