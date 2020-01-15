
$(document).ready(function () {
    //without server side knowlegde, there isn't a good way to get the file listing
    //with that knowlegde we could do a better file listing
    images = [
        "url('https://photos.app.goo.gl/LVpkTjzeaiSiZoUA7')",
        "url('https://photos.app.goo.gl/tTiL6W1WpvuUXMyh7')",   
        "url('https://photos.app.goo.gl/nWyDTCDQPkEuRkme8')",   
        "url('https://photos.app.goo.gl/RaZvCUiXpMj9s2LA8')",        
        "url('https://photos.app.goo.gl/JErqwZVgZPRCPTs28')",        
        "url('https://photos.app.goo.gl/j1wBRcXNNg282AcK9')",  
        "url('https://photos.app.goo.gl/BEmRsyp2CLcR8xP9A')",      
        "url('https://photos.app.goo.gl/7HnxLFwiKJkxGEN76')",   
        "url('https://photos.app.goo.gl/exjQQAGvzUdjVHPe8')",            
        "url('https://photos.app.goo.gl/YLiR618Hdurkvnzd9')",             
        "url('https://photos.app.goo.gl/wkqhfSy8ktgQRs6i9')",       
        "url('https://photos.app.goo.gl/Ng3kx9zNDCg4amnS7')",        
        "url('https://photos.app.goo.gl/iMvk14bDSdspZqkcA')",  
        "url('https://photos.app.goo.gl/nXz5FNi6yD3b7RQ58')",
        "url('https://photos.app.goo.gl/yPgDkhFUopygeFmH9')",  
        "url('https://photos.app.goo.gl/HAYuwnSC7p31UzoZ8')",  
        "url('https://photos.app.goo.gl/jRufwkde6PyA7mJKA')",  
        "url('https://photos.app.goo.gl/dvdG7AoPgRv7S8xeA')",  
        "url('https://photos.app.goo.gl/TBbQtyGS3RrWYpuJ7')",  
        "url('https://photos.app.goo.gl/ftJgXPpvtqsMn5XF9')",       
        "url('https://photos.app.goo.gl/dgF5bfTLJZUhSSzH6')",      
        "url('https://photos.app.goo.gl/mNsiTe9ETRF7ejgG8')",  
        "url('https://photos.app.goo.gl/MH1FpXmqAkZpzZQL9')",               
        "url('https://photos.app.goo.gl/jh84CCPwmknt97nM9')",   
        "url('https://photos.app.goo.gl/261Cz8LfAWDnfUuQ6')",  
        "url('https://photos.app.goo.gl/s22qhMeiSAWcyoMg9')",  
        "url('https://photos.app.goo.gl/PUiGxNoxL7Rj47xbA')",
        "url('https://photos.app.goo.gl/4vxWcHSuyEbR9niL7')",    
        "url('https://photos.app.goo.gl/MbCjSFKNx9defuFV7')",  
        "url('https://photos.app.goo.gl/kc2q1BybK43Y7Q748')",          
        "url('https://photos.app.goo.gl/kJ4Twwd1AaMCZyPk7')",        
        "url('https://photos.app.goo.gl/x5Mn9QDZxr6ZLJpt9')",   
        "url('https://photos.app.goo.gl/P2DirHJ3wjNQhzFc7')",      
        "url('https://photos.app.goo.gl/fACHEmDSJma32uo7A')",       
        "url('https://photos.app.goo.gl/UVwtpT9JnDRRF4nj7')",  
        "url('https://photos.app.goo.gl/3cADH76ebXoHnSkJ7')",  
        "url('https://photos.app.goo.gl/sbNxrxHQWN84EYE46')",          
        "url('https://photos.app.goo.gl/RgLsERFyL6BqSu1F6')",   
        "url('https://photos.app.goo.gl/Vp4P1PfNHCe4Rf1j9')",
        "url('https://photos.app.goo.gl/Azdg2PUwJuKLzQzM9')"
    ];
    index = Math.floor((Math.random() * images.length));
    imageUrl = images[index];
    console.log(imageUrl);
    $(".main-header").css("background-image", imageUrl);
    //style="background-image: url('http://localhost:4000/assets/mountain-alternative-cover.jpg')"
});