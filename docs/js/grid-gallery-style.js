//see https://github.com/jestov/grid-gallery for more infoo

//## Settings
//
//Option | Type | Default | Description | options
//------ | ---- | ------- | ----------- | -------
//selector | string | null | Element to which the settings are applied to customize the options of a specific gallery | ".class", "#id"
//darkMode | boolean | false | Enable a dark theme for the gallery | true
//layout | string | "vertical" | Adapts the layout of the gallery box | "horizontal", "square"
//gapLength | number | 2 | Modify the thickness in pixels of the gaps between images 
//rowHeight | number | 200 | Modify the height of images
//columnWidth | number | 220 | Customize the width of images

console.log("before gridGallery");
gridGallery({
    selector: "#main",
    darkMode: true,
    layout: "square",
    //layout: "horizontal",
    //gapLength: 4,
    //gapLength: 100,
    //rowHeight: 180,
    //columnWidth: 200
   });
console.log("after gridGallery");