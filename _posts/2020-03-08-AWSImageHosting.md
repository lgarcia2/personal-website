---
layout:            post
title:             "Image Hosting with AWS"
date:              2020-03-08 14:00:00 -0400
tags:              AWS Image Hosting Github Pages Jekyll
category:          Technical
author:            lgarcia
---

## New Website, New Problems

I'm hosting this latest version of my website using Jekyll in combination with Github Pages. If you want to know more about that process you can read my post on that [here.](https://luisgarcia.me/blog/non-technical/NewBlogWhoThis) Its been great! I've still not been contributing as much as I'd like, but I am contributing more! Along with new content, I'm also able to create and deploy site design changes with just as much speed. One of those changes is how I'm hosting the images in the background at the top of the page.

Originally, I only used one background image for my website, the one with four couches and a girl. I wanted was to be able to show off more of my photos, so I added the images and a little javascript to randomize when they appeared. Job well done right? Well, there are a couple problems. First, I use a reasonably decent (read: nice for 2015) camera and its images can be quite large. For that matter, media files in general, depending on quality and compression, can be quite large. Since I'm using Github to host my website, I may [run into their size restrictions](https://help.github.com/en/github/managing-large-files/what-is-my-disk-quota) if I store too many photos. Second, Github is generally used to store code repositories. Using it as a website hosting platform is a nice feature but those two pieces of functionality don't alway agree on how to do things. Github and other repositories are not _generally_ the ideal place to host images. Third, every deployment with an image change can take a long time to upload to the Github server.

For my initial implementation, I was lucky enough to have the option to host my images in Github, but that needed to change.

## My First Idea

AWS costs money, and I didn't want to pay. I wanted my cake and to eat it to, that is, I wanted my images to be hosted somewhere but I wanted to have strong control over those images and my IP (intellectual property). I probably could have used Imgur, Flickr, or maybe even Instagram as free public solutions to host my images. I didn't like the inherent public nature of image hosting on the platform. For my pictures with my friends, sure they're great. Vacation pictures, awesome! For storing my amateur photography? No way. ![Protected GIF](s3://luisorlandogarcia.com-images/technical/AWSImageHosting/WeirdAl_Foil.webp)

I tried using a private or even public album with Google Photos, but it seems Google has gotten wise and discourages direct links to photos. It seems like some companies may have come up with ways to get around this, but most of those seemed like hack-y solutions.

In the end, my desire to control my images was more powerful than my desire for free solutions, but AWS S3 bucket hosting, in this case, was cheap enough for me.

## Enter AWS

I'm sure there are a ton of ways to configure AWS resources, store your images, and grant access to them. However, I think this method is probably the simplest and most straightforward. I chose to upload my photos to a certain directory in an S3 bucket and grant public read access to that bucket.

Breaking this down a bit, these are the steps that I needed to host images from AWS and use them on this site.
    1. Login and Create an S3 Bucket
    2. Configure the S3 Bucket
    3. Upload Photos
    4. Modify Website to Link to Photos

## Step 1 - Login and Create an S3 Bucket

If you don't have an AWS account, its pretty easy to create one. Just go to [https://aws.amazon.com/](https://aws.amazon.com/), click "Create an AWS Account" and follow the instructions. You will have to enter credit card information to cover any costs that you incur with any of the resources you use. If you're concerned you can look at AWS's pricing information for more on this. I havent been charged yet and its been a couple months but I'm only using one S3 Bucket with a total of less than 40 MB. After you've created your account, or if you already have one, log in and get to the AWS Console.

From there, under AWS services, you can search in the box for "S3" and click the link. Alternatively you can find and click the link under > All Services > Storage > S3. From there it should be pretty easy to find the button with the label "Create Bucket". Once clicked the "Create bucket" dialogue will appear. Choose a good name for the bucket, AWS has some good information on this if you click the little (i) icon next to "Bucket name" in this dialogue. I named mine luisgarcia.me-background-images for reference. You'll also need to pick a region for it, this is worth looking into if your new to AWS but for now just pick the region closest to you. Once those two things are filled out, we'll just accept the default settings on all the other pages, so keep clicking next until you've created your bucket. Now we can start configuring it!

## Step 2 - Configure The S3 Bucket

Once you have the bucket go ahead and click it! This will take you to the bucket overview where you have a lot of control over your bucket. Right now, lets skip the "Overview" tab, it deals a lot with whats inside the bucket. While thats very important, I usually like to save it until the bucket is configured that way I don't expose any sensitive data accidentally and I can remove the bucket easily if things change. A lot of the settings and confguration values we are about to change could have been chaged from the bucket creation dialog. I think its probably more important to configure a bucket once its already created though. In a bucket's lifetime it can only be created once but its configuration could be changed any time you want.

We'll go ahead and click the 'Properties' tab next. Once you're in there, click 'Static website hosting' accept the defaults and click save. Similar to our Github pages, we can use buckets for static website hosting. For our purposes though, since we just want image hosting we'll use this functionality too. 

After that click the 'Permissions' tab. This is where we'll allow read access to our bucket. Its pretty important to get this right, so if you're not comfortable read up a bit more on AWS S3 bucket permissions. In the permissions tab, click the "Bucket Policy" button which will open the Bucket policy editor. This is where you can copy and paste the following JSON. Be sure to change `<bucketname>` to the name of your bucket.
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucketname>/*"
        }
    ]
}
```

This JSON is telling AWS to create a policy named "AllowPublicRead" that grants the "GetObject" action on this S3 bucket to all resources. This policy is applied to all objects in the bucket, designated by the resource `arn:aws:s3:::<bucketname>/*`. If you wanted to just allow public read to a specific directory you could change this to `arn:aws:s3:::<bucketname>/specificDirectory/*`

## Step 3 - Upload Photos

This is an easy one, go back to the "Overview" tab, click upload, and pick the files you want in the bucket. I'm using images, but you could put anything here. Notably, since we configured it to be publicly accessible, anything you put there can be accessed publicly.

## Step 4 - Link to photos.

Since we configured our bucket for static website hosting earlier it should be pretty easy to link to our files, or images in my case. AWS has a pretty standard way of creating url's from buckets. This can be changed if you want, but we'll use the default since I already have my real website somewhere else. Anyway, our photos should be avaliable at `http://<bucketname>.s3-website.us-east-2.amazonaws.com/<directory>/<filename>`, note replace `<bucketname> <directory> and <filename>` with your relevant values. If you're still having trouble seeing your files, check the properties tab again and click Static website hosting. Your website url should be at the top of the box that pops up.

Once we have these links, you can alter the HTML in your other site to link to these new images and there we have it! Image hosting with AWS!

## Final Thoughts

I like this solution for the control I get over the objects, its relatively low cost, and low complexity. If one doesn't have an AWS account, I'm sure you could do the same on the Google Cloud Platform or with Azure, other 'cloud' providers. I don't like that its not free, but its a cost I can accept. Going forward, one thing I'd like to validate is the performance of loading theses images from a different place. I generally trust in the uptime and availability of the platforms hosting Github Pages and AWS S3 but it is possible that in certain cases the loading of either the site or the images could differ. Regardless I believe in the solution and I'm happy with it. This method is how I'm loading all the images you see at the top of the page so you can evaluate the solution in real time! 

