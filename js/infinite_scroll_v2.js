


const container = document.querySelector('.photos');


function loadImages(numImages = 10) {
    let i=0;
        while(i < numImages){
            fetch('https://dog.ceo/api/breeds/image/random')
                .then(response=>response.json())
                .then(data=>{
                        //const img =  document.createElement('img');
                        //img.src = `${data.message}`
                        //container.appendChild(img)

                        const photoArticle = document.createElement('article');
                        photoArticle.classList.add("thumb");

                        //photoEl.innerHTML = `
                        //    <article class="thumb">
                        //        <a href="${photoUri}" class="image">
                        //            <img src="${photoUri}" alt="Nisl Adipiscing" />
                        //        </a>
                        //        <!--<h2>Photo Title</h2>-->
                        //        <!--<p>Photo Subtitle</p>-->
                        //    </article>
                        //`
                        photoArticle.innerHTML = `
                                <a href='${data.message}' class='image'>
                                    <img src='${data.message}' alt='Nisl Adipiscing' />
                                </a>
                                <!--<h2>Photo Title</h2>-->
                                <!--<p>Photo Subtitle</p>-->
                        `

                        container.appendChild(photoArticle);
                    })
            i++;
        }   
}
 
 loadImages();

 window.addEventListener('scroll',()=>{
    console.log(window.scrollY) //scrolled from top
    console.log(window.innerHeight) //visible part of screen
    if(window.scrollY + window.innerHeight >= 
    document.documentElement.scrollHeight){
    loadImages();
    }
})