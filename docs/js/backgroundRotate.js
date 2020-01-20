
$(document).ready(function () {
    //without server side knowlegde, there isn't a good way to get the file listing
    //with that knowlegde we could do a better file listing
    //TODO: now that these are in aws s3, its plausible to do a listObject, then randomize them
    images = [
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/BuffaloSteam.jpg')",
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/BuffaloSteam2.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/LibraryOfCongress.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/ankorHall.jpg')",        
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/ankorLibrary.jpg')",        
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/ankorRight.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/ankorWat.jpg')",      
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/ankorWat2.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/bearStudy.jpg')",            
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/bunny.jpg')",             
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/dragonfly.jpg')",       
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/dragonflyFlower.jpg')",        
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/fireworks.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/flower.jpg')",
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/gardenBridge.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/gardenTower.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/grassyBuilding.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/incaPirca.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/incaPirca2.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/incaPircaRain.jpg')",       
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/incaPircaWall.jpg')",      
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/marinaBaySans2.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/marinabaysans.jpg')",               
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/oldSlip.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/pine.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/pokeyFlowerAndBee.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/rocks.jpg')",
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/singaporeFlower.jpg')",    
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/singaporeFlower2.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/tauProm.jpg')",          
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/taylorTemple.jpg')",        
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/tedy.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/temple.jpg')",      
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/threeBuffalo.jpg')",       
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/tinyFlowers.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/utahWaterfall.jpg')",  
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/waterfall.jpg')",          
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/whiteFlowers.jpg')",   
        "url('https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/background-images/yellowstoneFalls.jpg')"
    ];
    index = Math.floor((Math.random() * images.length));
    imageUrl = images[index];
    console.log(imageUrl);
    $(".main-header").css("background-image", imageUrl);
    //style="background-image: url('http://localhost:4000/assets/mountain-alternative-cover.jpg')"
});