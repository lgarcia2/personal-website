---
layout:            post
title:             Wyoming Coronavirus Data by County
date:              2020-08-26 14:00:00 -0400
tags:              Coronavirus COVID AWS matplotlib
category:          Technical
author:            lgarcia
---

### Updated daily at 12:00 PM Eastern ###
{: style="text-align: center;"}
<A href="#about-this-project">Check out the details about how this was made</A>
{: style="text-align: center;"}

{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Albany.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Big Horn.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Campbell.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Carbon.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Converse.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Crook.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Fremont.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Goshen.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Hot Springs.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Johnson.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Laramie.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Lincoln.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Natrona.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Niobrara.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Park.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Platte.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Sheridan.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Sublette.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Sweetwater.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Teton.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Uinta.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Washakie.png" height=200 width=300 %}
{% include image.html url="https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/coronavirus-metrics/wyoming/Weston.png" height=200 width=300 %}



# About This Project #

## What's shown here?

These graphs show the number of COVID-19 (Coronavirus) cases that have been reported in each of Wyoming's counties. The number of cases is reported with respect to the reporting date. With those two factors, one can see how the number of COVID-19 cases is changing over time. Here are some examples and explanations of what someone could see in these graphs.

### Horizontal Line
A horizontal line would suggest that the number of cases has not changed at all over time. This would mean that COVID-19 has been eliminated or has not been reported from the community.

### Straight Diagonal Line 
A straight diagonal line from the lower left hand corner to the upper right hand corner means that the number of COVID-19 cases is increasing linearly. That is, the number of new cases is not increasing, but the number of new cases is not decreasing. COVID-19 is still spreading, but its rate of spread is not changing. A line like this is not good news or bad news, more people are getting sick which is bad, but the rate of spread is not increasing which is good.

### Exponential Curve
A curved line starting small from the left corner and increasing more and more is a bad sign. This is an exponential curve that means that the number of new cases is increasing over time. This means that COVID-19 is spreading more and more from day to day. This is the worst sign since it indicates that the disease is continuing to spread at a more rapid pace.

### Flattening Curve
A curved line that increases quickly but levels out is a good sign. This means that a lot of cases were reported initially but the number of new cases has slowed. This means that COVID-19 is not spreading as much and is what we want. If it levels out completely, like the horizontal line it means that COVID-19 has been eliminated or is not being reported in the community.


### Why Did I Make This?

I made this because it wasn't shown on the [Wyoming Department of Health website](https://health.wyo.gov/publichealth/infectious-disease-epidemiology-unit/disease/novel-coronavirus/), at least not at the time of writing this. The data was there, I saw it change county to county every day. You could also see these statistics from the whole state. However, I wanted to see the graphs on a per-county basis. Since this wasn't on the website I had to make it myself.
Additionally, I wanted to learn more about AWS functionality and offerings. This would be a perfect project to dip my toes in with some other pieces of technology.

## How This Was Made

### AWS
Like I mentioned, I wanted to play around with more AWS pieces. I found a nice tutorial that gave me a point to start with. You can find that tutorial [here](https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/). It seemed to mimic some of my needs well. I didn't really need a front end for this project but I did need some of the other pieces from the tutorial.

### The Plan
I knew where to source my data from: the Wyoming Department of Health Website. The problem is, they didn't provide all the data at once. If I wanted a historical perspective of the county data, I would have to store it my self. Storing the data means that I'll need a database and to retrieve the data I'll have to query their website. I can generate my graphs myself with the Python library 'Matplotlib'. To deliver the graphs I decided initially it would be easy to just shoot out an email.

### Starting with the Lambda
I'm still relatively new at implementing AWS tools, so I wanted to make sure that I could get as much working as I could locally before deploying and integrating with other cloud services. So I implemented my first features on my personal computer. I 'queried' the Wyoming Department of Health website for data and parsed out the relevant information. I skipped the persistence of that data, since I was developing locally. However, I did use 'Matplotlib' to generate some graphs with the single point of data. 

Deploying it into the cloud was a little more troublesome. AWS didn't natively support all of the imported libraries I was using, so I had to create a .zip deployment package to upload to AWS. For this I highly suggest installing [Docker](https://www.docker.com/). I tried to create my own deployment package, but generating the package from the libraries on Windows was not compatible with the AWS linux environment that the lambda's run on. Docker simplifies the whole process by spinning up the exact image AWS uses and generating the package there. A quick google will show that this is the command to generate the package with Docker. 
```
docker run -v path_to_project:/var/task "lambci/lambda:build-python3.8" /bin/sh -c "pip install -r requirements.txt -t python/lib/python3.8/site-packages/; exit"
```
Here's a quick rundown. 'docker run" Run a command in a new docker container. "-v path_to_project:/var/task" Mount a volume to the container where path_to_project is the path to your project on your local machine and /var/task is the path mapped in the container. '/bin/sh -c "pip install -r requirements.txt -t python/lib/python3.8/site-packages/; exit"' Run the shell command pip install and put the output in python/lib/python3.8/site-packages. This also requires that your libraries are listed in a requirements.txt file. For more information on that see documentation [here](https://pip.pypa.io/en/stable/user_guide/#requirements-files). Running this whole command will dump your package in path_to_project/python/lib/python3.8/site-packages/. From there, add your python file, zip it up, and upload to AWS lambda.

### Working with DynamoDB
Since I'd never worked with DynamoDB I wanted to adhere to the tutorial apply its wisdom and deviate only where necessary. With that in mind, I stuck too it. Creating the table was easy. The tutorial showed exactly how to set permissions properly and inserting the data was straightforward. I modified my lambda to insert the data from the Wyoming Department of Health website into the Dynamo database and everything seemed fine. So I let the project sit for a while and collect data while I took a break. If you need a break too, check out [what I was doing in the mean time](/blog/non-technical/Motorcycle).

### Lessons Learned
I came back to the project after about a month to finish it off. There were a couple things still on my list like querying the database for the historical data and sending out the graphs. I started at the top, querying the data. Thats where I ran into my problem. Most of my knowledge and training has come from using relational databases and I didn't see anything in the tutorial that contradicted that viewpoint. When I created the database I followed my previous knowledge and made the primary key a unique uuid. This is where I encountered my problem. When querying for my data using dynamo db, in order to use the boto3 query command you must know the partition key (a part of the primary key). The way I designed my table, that was the least important piece of my data. 
Since I didn't read any documentation beyond the tutorial what I failed to understand was that the database is split and sorted by a combination of the partition key and sort key. Those two keys combined create the primary key. Using those two keys you can index and sort your rows so that lookups are quicker. The primary key still has to be unique per row, but if you carefully choose what data you put in those keys, you can optimize your querying. Since I didn't choose my keys carefully I could not optimize my data querying. Instead of using the efficient boto3 'query' command, I had to use the 'scan' command, much less efficient. The good news is that this was a good learning experience. The bad news is that this project will have some inefficiencies in it until I pick a new database schema and migrate the data. For more information on better DynamoDB patterns see some of these pages:
[Ten Examples of Getting Data from Dynamo DB...](https://www.fernandomc.com/posts/ten-examples-of-getting-data-from-dynamodb-with-python-and-boto3/)
[Choosing the Right DynamoDB Partition Key](https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/)

### Going Forward
I reckoned with the fact that my data would need to be migrated in the future. Since this was a test project and the dataset will be small (I'm hoping) it shouldn't be too bad. The longer the COVID-19 pandemic continues the more expensive my queries will be, so for my database's and everyone's sake, lets hope we can bring it to a halt.

## Data Delivery
### E-mail
So how will someone view this data? In other words, how will I deliver the graphs to a place where they can be viewed? My initial reaction was to send an email. Its quick, easy, and I can attach the graphs without issue. So I started down that path. I implemented the code to my lambda function and started wiring up the infrastructure. I wanted to use one of gmail's features to use as my email server. I quickly ran into some drawbacks though. I had to provide my email and a plaintext password in the script in order to use gmail. Second, it wouldn't even work with lambda. I don't know the specific technical reason it wouldn't work but its related to signing in to your account. It looked like that I had to sign in via a browser, get a cookie, and then when my script would email, google would look for that cookie or sign in token. When I deployed to AWS there was no way to 'scriptify' this login procedure. So I had to abandon that for another idea. The next idea was to utilize AWS's email utility Simple Email Service (SES). It was simple enough to setup and implement but it didn't scale for my purposes. That is, I wanted to send out this email to family members in Wyoming. With SES, I had to apply to be able to send an email to any address. Alternatively, I could send out a subscribe email first, and if the recipient accepts, then I could send the email. This is probably good in the scheme of things since it prevents a lot of spam, but it prevented me from easily delivering the data to relevant recipients. 

### S3
My spouse was the one that suggested sticking it in S3. My first reaction was, "okay I could do that and it would be complex and then I'd have to figure out how to show the file from S3". However, the more I thought about it, the easier and more correct it seemed. I didn't have to implement any large S3 uploader code, it was built into the boto3 library. Displaying the data was easy too, I wrote a [post](/blog/technical/AWSImageHosting) on it! I shouldn't dismiss ideas so quickly. 
I went forward with this idea, implemented an IAM role for S3 security, added the S3 upload, and changed the filenames of the graphs. I wanted to be sure to overwrite the files every time new data came in. This would keep my S3 bucket from getting too big and allow me to hard-link the S3 files while the data changed on the backend. What you see at the beginning of this page is the result. A series of graphs detailing the number of total cases recorded per day on a county by county basis in Wyoming.

## Final Thoughts
This was a fun and practical project for dipping your toes into the AWS landscape. I had to touch a lot of different tools and I learned a bit about each one as I went along. This was is a good project to start with, but the tutorial I followed was useful too if you're starting. I'm glad I made mistakes along the way because it forced me to learn and I'm happy that this data is now more available to the public! <A href="#updated-daily-at-1200-pm-eastern">Check it out!</A>


