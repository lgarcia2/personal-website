
export function createPhotoImage(photoUri, loadFunc) {
    const img = document.createElement('img');
    img.classList.add("thumb");
    img.src = photoUri;

    img.addEventListener("click", function (i) {
        var currentImg = this;
        const parentItem = currentImg.parentElement;
        screenItem = document.getElementById("gg-screen");
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
        const first = images[0].src, last = images[l - 1].src;
        const imgItem = document.querySelector(".gg-image"), prevBtn = document.querySelector(".gg-prev"), nextBtn = document.querySelector(".gg-next"), close = document.querySelector(".gg-close");
        imgItem.innerHTML = '<img src="' + route + '">';

        if (l > 1) {
            if (route == first) {
                prevBtn.hidden = true;
                var prevImg = false;
                var nextImg = currentImg.nextElementSibling;
            }
            else if (route == last) {
                nextBtn.hidden = true;
                var nextImg = false;
                var prevImg = currentImg.previousElementSibling;
            }
            else {
                var prevImg = currentImg.previousElementSibling;
                var nextImg = currentImg.nextElementSibling;
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
            prevImg = currentImg.previousElementSibling;
            imgItem.innerHTML = '<img src="' + prevImg.src + '">';
            currentImg = currentImg.previousElementSibling;
            var mainImg = document.querySelector(".gg-image > img").src;
            nextBtn.hidden = false;
            prevBtn.hidden = mainImg === first;
        };

        function next() {
            nextImg = currentImg.nextElementSibling;
            imgItem.innerHTML = '<img src="' + nextImg.src + '">';
            currentImg = currentImg.nextElementSibling;
            var mainImg = document.querySelector(".gg-image > img").src;
            prevBtn.hidden = false;
            nextBtn.hidden = mainImg === last;
        };

        function hide() {
            root.style.overflow = 'auto';
            screenItem.remove();
        };
    });


    return img;
}