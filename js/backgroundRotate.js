
$(document).ready(function () {
    //without server side knowlegde, there isn't a good way to get the file listing
    //with that knowlegde we could do a better file listing
    images = [
        "url('/assets/pictures/ankorHall.jpg')",
        "url('/assets/pictures/ankorWat.jpg')",   
        "url('/assets/pictures/BuffaloSteam.jpg')",   
        "url('/assets/pictures/dragonfly.jpg')",        
        "url('/assets/pictures/flower.jpg')",        
        "url('/assets/pictures/grassyBuilding.jpg')",  
        "url('/assets/pictures/incaPircaRain.jpg')",      
        "url('/assets/pictures/marinabaysans.jpg')",   
        "url('/assets/pictures/oldSlip.jpg')",            
        "url('/assets/pictures/rocks.jpg')",             
        "url('/assets/pictures/tauProm.jpg')",       
        "url('/assets/pictures/temple.jpg')",        
        "url('/assets/pictures/utahWaterfall.jpg')",  
        "url('/assets/pictures/yellowstoneFalls.jpg')",
        "url('/assets/pictures/ankorLibrary.jpg')",  
        "url('/assets/pictures/ankorWat2.jpg')",  
        "url('/assets/pictures/BuffaloSteam2.jpg')",  
        "url('/assets/pictures/dragonflyFlower.jpg')",  
        "url('/assets/pictures/gardenBridge.jpg')",  
        "url('/assets/pictures/incaPirca.jpg')",       
        "url('/assets/pictures/incaPircaWall.jpg')",      
        "url('/assets/pictures/marinaBaySans2.jpg')",  
        "url('/assets/pictures/pine.jpg')",               
        "url('/assets/pictures/singaporeFlower.jpg')",   
        "url('/assets/pictures/taylorTemple.jpg')",  
        "url('/assets/pictures/threeBuffalo.jpg')",  
        "url('/assets/pictures/waterfall.jpg')",
        "url('/assets/pictures/ankorRight.jpg')",    
        "url('/assets/pictures/bearStudy.jpg')",  
        "url('/assets/pictures/bunny.jpg')",          
        "url('/assets/pictures/fireworks.jpg')",        
        "url('/assets/pictures/gardenTower.jpg')",   
        "url('/assets/pictures/incaPirca2.jpg')",      
        "url('/assets/pictures/LibraryOfCongress.jpg')",       
        "url('/assets/pictures/pokeyFlowerAndBee.jpg')",  
        "url('/assets/pictures/singaporeFlower2.jpg')",  
        "url('/assets/pictures/tedy.jpg')",          
        "url('/assets/pictures/tinyFlowers.jpg')",   
        "url('/assets/pictures/whiteFlowers.jpg')"
    ];
    index = Math.floor((Math.random() * images.length));
    imageUrl = images[index];
    console.log(imageUrl);
    $(".main-header").css("background-image", imageUrl);
    //style="background-image: url('http://localhost:4000/assets/mountain-alternative-cover.jpg')"
});