
function createMainPoptrox() {		
    
    var $body = $('body');

    // Main.
	var $main = $('#main');

    // Thumbs.
        $main.children('.thumb').each(function() {

            var	$this = $(this),
                $image = $this.find('.image'), $image_img = $image.children('img'),
                x;

            // No image? Bail.
                if ($image.length == 0)
                    return;

            // Image.
            // This sets the background of the "image" <span> to the image pointed to by its child
            // <img> (which is then hidden). Gives us way more flexibility.

                // Set background.
                    $image.css('background-image', 'url(' + $image_img.attr('src') + ')');

                // Set background position.
                    if (x = $image_img.data('position'))
                        $image.css('background-position', x);

                // Hide original img.
                    $image_img.hide();

        });

    // Poptrox.
    $main.poptrox({
        baseZIndex: 20000,
        caption: function($a) {

            var s = '';

            $a.nextAll().each(function() {
                s += this.outerHTML;
            });

            return s;

        },
        fadeSpeed: 300,
        onPopupClose: function() { $body.removeClass('modal-active'); },
        onPopupOpen: function() { $body.addClass('modal-active'); },
        overlayOpacity: 0,
        popupCloserText: '',
        popupHeight: 150,
        popupLoaderText: '',
        popupSpeed: 300,
        popupWidth: 150,
        selector: '.thumb > a.image',
        usePopupCaption: true,
        usePopupCloser: true,
        usePopupDefaultStyling: false,
        usePopupForceClose: true,
        usePopupLoader: true,
        usePopupNav: true,
        windowMargin: 50
    });

    // Hack: Set margins to 0 when 'xsmall' activates.
    //    breakpoints.on('<=xsmall', function() {
    //        $main[0]._poptrox.windowMargin = 0;
    //    });
//
    //    breakpoints.on('>xsmall', function() {
    //        $main[0]._poptrox.windowMargin = 50;
    //    });

}