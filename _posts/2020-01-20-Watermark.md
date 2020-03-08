---
layout:            post
title:             "How to Watermark All Your Photos"
date:              2020-01-20 14:00:00 -0400
tags:              Photography FFmpeg
category:          Technical
author:            lgarcia
---

[//]: # How to Watermark All Your Photos
[//]: I commented out the title above to prevent it from being displayed twice

In looking at images across the internet, an reocurring element that appears in many of them is a watermark. If you're unfamiliar with the concept, a watermark is a small design or text added to an image. The purpose behind a watermark is to visibly mark a the image to provide the creator with proof of ownership. For instance, if I mark my photos with my name and someone else downloads the image and uses it, its clear who the photo belongs to and who the original creator is. A watermark's effectiveness is debatable. Depending on the watermark, it can be sometimes be easily cropped off. There's also software out there designed to explicitly remove watermarks. However, leaving a watermark on an image does offer at least some security when exposing your images to the internet. In this post, I'll describe an easy way to add a watermark to an image, and a way to automate the process so that watermarks can be added _en masse_ to a large number of photos in a short period of time.

## FFmpeg

The tool I'll be using to help us along is [FFmpeg](https://ffmpeg.org/). We'll only be using it to manipulate our images, but its great open source tool if you want to for other things like video and audio processing. Its a very powerful and versitile tool and I highly recommend it for media processing.

## Other requirements

In addition to FFmpeg, you'll need at least two images, an image that you want to apply a watermark to and the watermark image itself. When designing the watermark image some things to consider are size, color, and transparency. For my watermark image, I just chose my name set at an angle. Additionally, I made sure that the background of the watermark image was 100% transparent. The transparency should allow the watermark to be seen, but the original image can still be mostly intact.

## Simple Overlay

Running the following command in a shell will use FFmpeg to do a simple overlay, placing the watermark image on top of the original image

    $ ffmpeg.exe -i "originalImage.png" -i "watermarkImage.png" -filter_complex "[0:v][1:v] overlay=main_w-overlay_w:main_h-overlay_h" "outputImage.png"

The resulting image is a combination of the original image and the watermark. We've accomplished our goal. Now lets go into what the command is actually doing.

    ffmpeg.exe

This is an easy one, we're calling the executable

    -i "originalImage.png" -i "watermarkImage.png"
    
these two arguments assign the paths to the original image and the watermark image to the first and second inputs. 

    -filter_complex "[0:v][1:v] overlay=main_w-overlay_w:main_h-overlay_h"

As the argument suggests, this is a complex one to explain. "filter_complex" is an argument that describes various filters to use through FFmpeg. You can read more about it [here](https://ffmpeg.org/ffmpeg-filters.html#Description). Lets break this specific filter down though. The first things we must do is declare the inputs to the filter. In our case we're using our two source images. The way to declare our inputs to the filter is with the square brackets. \[0:v] is stating that we should use the "zero'th" or first input, our original image, and we should use the visual portion, or "video stream" from it. \[1:v] is similar, only this time we're using the second input, the watermark image. These two images will be passed to the "overlay" filter. Finally, the last piece after the "=" symbol states that the watermark's top left corner should be placed at the point determined by two formulas. "main_w - overlay_w" determines the "x" position, where main_w is the width of the first input and overlay_w is the width of the watermark image. The "y" position is determined in a similar way. I chose to place my image in the lower right hand corner, but by manipulating these arguments the watermark can appear anywhere on the original image. For example "overlay=0:0" will place the watermark in the top left of the original image.

    "outputImage.png"

Finally, the last argument is the path to the output image. This tells FFmpeg where to write your output file. If a file already exists there, FFmpeg will ask you if you want to overwrite it. If you dont want to be prompted for this question, you can just use the "-y" flag to always overwrite and "-n" flag to never overwrite.

## Making a Better Watermark

### Transparency

My watermark started as an opaque image, that is, originally the text in my image was not transparent. A nice feature of watermarks is their transparency, it maintains the idea of marking an image as your own while also preserving as much of the image as possible. Fortunately FFmpeg offers a way for us to do that too, we can just add another filter

    [1:v]colorchannelmixer=aa=0.5

This filter will take our watermark image and make it 50% transparent. Putting it all together we can use this command to generate our new image

    $ ffmpeg.exe -i "originalImage.png" -i "watermarkImage.png" -filter_complex "[1:v]colorchannelmixer=aa=0.5[opacity];[0:v][opacity]overlay=main_w-overlay_w:main_h-overlay_h" "partialTransparentWatermark.png"

This command may look a little different than expected. Using FFmpeg's filter_complex, we can do multiple filter operations as long as we keep track of our streams. That is, now that we've created an video stream that is 50% transparent, we have to pass that transparent stream onto our overlay filter. I choose to keep things straight by naming the outputs of each filter result, in this case I named the output of my transparency "\[opacity]". There are other ways to pass around streams, for more information, again you can look at the [filter documentation](https://ffmpeg.org/ffmpeg-filters.html#Description).

### Consistency

So far we've done a great job watermarking our one image. However, if we continue to use the previous command on our images a problem will emerge. The watermark will appear to grow and shrink relative to the size of the image we're watermarking. That is, if our watermark is 100x100 and we put it on a 200x200 image, the watermark will take up the bottom right quarter of the original image. If our original image is 400x400 and we use the same 100x100 watermark, then it will take up the bottom right sixteenth of the image. One solution is to create a new watermark for every image size. That does seem to get tedious very quickly. Instead lets use FFmpeg to create a more consistent watermark across all image sizes. Unfortunately, there's not an easy way to scale an image based on the size of another image in one command. We must detect the height and width of the original image so we can scale the watermark appropriately. Fortunately, included with FFmpeg is their ffprobe program, used to gather information about a piece of media. We'll use it to get the size of our original image.

    $ ffprobe.exe -i "originalImage.png" 
    
This command will result in an output that looks like this:

> ffprobe version 4.1.3 Copyright (c) 2007-2019 the FFmpeg developers
>  built with gcc 8.3.1 (GCC) 20190414
>  configuration: --enable-gpl --enable-version3 --enable-sdl2 --enable-fontconfig --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libfreetype --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libopus --enable-libshine --enable-libsnappy --enable-libsoxr --enable-libtheora --enable-libtwolame --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libzimg --enable-lzma --enable-zlib --enable-gmp --enable-libvidstab --enable-libvorbis --enable-libvo-amrwbenc --enable-libmysofa --enable-libspeex --enable-libxvid --enable-libaom --enable-libmfx --enable-amf --enable-ffnvcodec --enable-cuvid --enable-d3d11va --enable-nvenc --enable-nvdec --enable-dxva2 --enable-avisynth
>  libavutil      56. 22.100 / 56. 22.100
>  libavcodec     58. 35.100 / 58. 35.100
>  libavformat    58. 20.100 / 58. 20.100
>  libavdevice    58.  5.100 / 58.  5.100
>  libavfilter     7. 40.101 /  7. 40.101
>  libswscale      5.  3.100 /  5.  3.100
>  libswresample   3.  3.100 /  3.  3.100
>  libpostproc    55.  3.100 / 55.  3.100
>Input #0, image2, from 'originalImage.jpg':
>  Duration: 00:00:00.04, start: 0.000000, bitrate: 103560 kb/s
>    Stream #0:0: Video: mjpeg, yuvj444p(pc, bt470bg/unknown/unknown), 2400x953 [SAR 300:300 DAR 2400:953], 25 tbr, 25 tbn, 25 tbc

Thats a lot to take in! Fortunately, we don't need all of it. All we need is a tiny bit at the end. The resulting outpus shows Input #0 has a video stream, Stream #0:0, and its resolution is 2400x953. As with the other commands, we can simplify this one too.

    $ ffprobe.exe -i "originalImage.png" -v error -hide_banner -select_streams v:0 -show_entries stream=width,height -of default=nw=1

This command will get straight to the point and give us our width and height of this form:

>width=2400
>height=953

Bringing it all back together, we use the original width and height as a base to ensure our watermark is 25% of the size of the original image. This will result in the watermark taking up 1/16 of the original image. The original image does have a weird size though, so lets try to maintain the aspect ratio of our watermark as its applied, rather than distort the watermark image. _A quick note here, there are other strategies that could be used here to provide other definitions of "consistent watermark". I'm choosing to preserve the aspect ratio of the watermark at the expense of the inconsistencies in the height of the watermark. Another strategy could be to apply a standard scale to the both the watermark's height and width, that could result in a stretched look of the watermark if the aspect ratio of the two images does not match._

I used ffprobe again to find out my watermark's size is 640x480

Width Scale  = (640/480) * 2400 * .25 = x
Height Scale = (640/480) * 953 * 0.25 = y

Width Scale  = (2400/953) * 640 * 0.25 = 402
Height Scale = (2400/953) * 480 * 0.25 = 302

We can then use these values in our ffmpeg command

    $ ffmpeg.exe -i "originalImage.png" -i "watermarkImage.png" -filter_complex "[1:v]scale=402:302,colorchannelmixer=aa=0.5[opacity];[0:v][opacity]overlay=main_w-overlay_w:main_h-overlay_h" "scaledWatermark.png"

## Automation

Watermarking a large number of images could take some time if one were to do it by hand, thats why automating this process is essential. There are many ways to automate this process, and I've chosen to write a bash script for speed and ease. However, these methods can easily be transferred to another technology or programming language. The important pieces to keep are the processing steps. Those steps consist of the following.
    1. Identify the resolution (width and height) of the image intended to be used as a watermark with FFprobe.exe
    2. Identify the resolution (width and height) of the image that will receive the watermark with FFprobe
    3. Calculate the scale factor to apply to the watermark
    4. Create and execute the command to ffmpeg.exe.
        

If you'd like to see the bash script I put together to accomplish this for myself, you can check it out on github [here](https://github.com/lgarcia2/ImageWatermarking)



