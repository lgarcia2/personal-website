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

function gridGallery(options) {
    if (options.selector) selector = document.querySelector(options.selector);
    if (options.darkMode) selector.setAttribute("data-theme", "dark");
    if (options.layout == "horizontal" || options.layout == "square") selector.setAttribute("data-layout", options.layout);
    if (options.gaplength) selector.style.setProperty('--gap-length', options.gaplength + 'px');
    if (options.rowHeight) selector.style.setProperty('--row-height', options.rowHeight + 'px');
    if (options.columnWidth) selector.style.setProperty('--column-width', options.columnWidth + 'px');
}

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