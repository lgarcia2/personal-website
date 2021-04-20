---
layout:            post
title:             Creating an Alexa Skill with Visual Studio Code and the Serverless Framework
date:              2021-04-19 14:00:00 -0200
tags:              Alexa Echo Skill AWS Amazon Serverless Framework Visual Studio Code
category:          Technical
author:            lgarcia
---

# Lets Make an Alexa Skill with the Visual Studio Code and the Serverless Framework!

I've been toying around with more tools, frameworks, and other things I find interesting these days. I'm interested in creating another Alexa Skill, but I've never had a good time managing the infrastructure and deployment. I've only used the free developer console and associated resources and have had difficulty provisioning resources and rapidly developing and prototyping was kind of a pain. I'm fully willing to accept that I may be doing something wrong, but I haven't yet found what.

I've been playing with the [Serverless Framework](https://www.serverless.com/) lately and have found it pleasant to work with for describing AWS Infrastructure as Code. Serverless will create and deploy an AWS Cloud Formation stack for you. This tool seemed to me like a good way to solve my past problems when developing Alexa Skills. 

Now that I have a pretty solid idea of what I want to create, lets get started on making it!

# Visual Studio Code

I've worked with the Microsoft Stack pretty extensively. I'm pretty accustomed to Visual Studio. Lately, a lot of my work has been directing me more towards Visual Studio Code. I enjoy the tool for its relative familiarity, but also how it can support much more than the normal Visual Studio. It also just so happens to be well supported by Amazon for developing skills via the [Alexa Skills Toolkit extension for Visual Studio](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit)

There are some pretty good guides out there for working with the toolkit that I used when writing and developing this. Feel free to check them out while you're here.

- [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html)
- [Create Skills](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-ask-skills.html)

# Set Up the Environment

I started by getting everything set up. 

1. First, I downloaded and installed [Visual Studio Code](https://code.visualstudio.com/)
2. I chose to use [Python 3.8](https://www.python.org/) as my language of choice for developing this skill, so I made sure to add that [extension.](https://marketplace.visualstudio.com/items?itemName=ms-python.python) Python isn't required for this though. Alexa skills are supported for a number of programming languages.
3. I installed the [Alexa Skills Toolkit extension](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit).
4. You'll need [NPM](https://www.npmjs.com/get-npm), [Serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/), the [AWS CLI tool](https://aws.amazon.com/cli/), and [Docker](https://www.docker.com/) for the Serverless deployment. (Why Docker? Checkout my [other post.](/blog/technical/CoronavirusGraphs))
5. I already had both an [AWS account](https://aws.amazon.com/) and an [Amazon Developer account](https://www.developer.amazon.com/), so I didn't need to create those.
6. After getting everything installed, I logged in and followed the [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html) guide. If you've never developed a skill before, or have never used the extension, its an important guide to follow. 
7. I created a directory and got it setup with git, check it out here!

# Creating the Skill

After opening Visual Studio Code and opening the Alexa Skills Toolkit extension, I clicked the 'Create new skill' button. That button opens a new tab for creating a new skill. Most of the parameters are fairly obvious, but I'll describe what I put in the parameters and the decisions that drove those inputs.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/VisualStudioScreenshot.PNG)

- **Skill Name** - This is the name of your skill I used 'Demo' so I could invoke the skill by saying something like: "Alexa, open Demo." I can change always change this later before publishing if I wanted to publish this or expand the project further
- **Default Language** - I chose 'English' because thats what I speak!
- **Skill Model** - Custom, its the only option right now.
- **Choose a method to host your skill's backend resources** - A lot of good information on this can be found [here.](https://developer.amazon.com/en-IN/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html) For my purposes, I chose the "Provision your own" option so that I could host it in my AWS account, deploy it and manage it there without any restriction from the Alexa free-tier. As much as I want to just have the Alexa developer space host it, I found it a bit restricting. That being said, I'll still have to work with it, just a little less. Besides, I'm [no stranger](/blog/technical/CoronavirusGraphs) [to AWS.](/blog/technical/AWSImageHosting) and its the point of the article!
- **Programing Language** - Python, as I mentioned above.
- **Local Directory** - I chose the folder/repository I created earlier.

After I filled out all the parameters, I clicked the final 'Create' button and waited for the extension to build out some skeleton code for me.

# Building and Deploying The Skill

Since I chose to host my AWS resources outside of the Alexa developer space, and since I'm using serverless, I will generally have two deployment steps.

- Deploy Skill configuration to Alexa developer account
- Deploy AWS resources to AWS account

The steps can technically be done in any order, but its important to make sure they are coordinated well so that any change made to one will affect the other appropriately. That is, if I add some new interaction in the skill configuration, there should be corresponding code to back it up. With that in mind its probably best to deploy the skill configuration first then the AWS resources. All that being said, I may change my mind on this as time progresses. Any developer in any project should be aware of their deployment order (if they have one) and dependencies.

## First Skill Deployment

When I first clicked the 'Create' button from the Visual Studio Extension, it automatically created and deployed the default 'hello-world' configuration to the developer space. Since this is just a demo, I'm not going to change the default hello-world skill too much. So for now, I'm just going to log-in to the [skill console](https://developer.amazon.com/alexa/console/ask), open up the skill and note the Skill Id. This is found by logging-in to the developer console. Clicking your skill. Once the skill is open you can go to the 'Build' tab, then click 'Endpoint'. I'm going to use a Lambda for my skill, so I'll click the AWS Lambda ARN radio button and then note the Skill ID that appears to the right.

## First AWS Resource Deployment

The next thing on my list was to deploy the AWS resources to make the skill work. Right now, all I've got is the `hello_world.py` file that came by in the lambda directory by default, so it should be easy enough to stand it up in AWS and make sure everything works as intended.

If I were doing this manually, I'd zip up the file and its dependencies and then upload it to the lambda section of the AWS console. As I've mentioned, I found that to be rather tedious, so I'm choosing to use the [Serverless Framework](https://www.serverless.com/) to define, package, and deploy all my AWS resources. This should make things easy to rapidly prototype, test, and deploy. 

First I'll initialize my serverless project by `cd`'ing into the `lambda` directory that was created and I'll run `serverless create --template aws-python`. This will create a nice little serverless template file (`serverless.yml`) for me to use. You can always create this file manually if you know what you're doing. The command will also create a default function `handler.py`. I'll go ahead and remove that file since I don't need it, but I will tweak my `serverless.yml` file accordingly. 

The `serverless.yml` file we created has a lot of information in it that is useful if you're starting out with serverless. Check them out if you have time, but I only care about a few parameters. First, I'll change the `service:` value to `DemoAlexaSkill` since thats a good memorable name for the Cloud Formation Stack that will be created. Under `provider:` and under `runtime:` I made sure I specified `python3.8`. I also like to define the default stage and region too, so I'll uncomment those lines. 
The top of my file looks like this:
```
service: DemoAlexaSkill
frameworkVersion: '2'

provider:
  name: aws
  runtime: python3.8
  lambdaHashingVersion: 20201221
  stage: dev
  region: us-east-1
```

Next, we can skip ahead to defining our lambda function.

Lambda functions are defined in the `functions:` block. By default, the block should look like this:
```
functions:
  hello:
    handler: handler.hello
```
We only need to change a little bit for now, but I strongly encourage you to read more about Serverless and so that you can understand more about what it capable of doing.

First we want to define the lambda's entry point. A default function was defined in the `handler.py` file when we created the `serverless.yml` file. We're using different lambda code so this is where our `hello_world.py` Alexa skill file comes in. That file also contains lambda function code so we'll just swap some parameters to that the snippet of our file now looks like this:
```
functions:
  hello:
    handler: hello_world.handler
```

`hello_world` is the name of the code containing the entry point for the lambda file, as in `hello_world.py` the `.handler` refers to the entry point within that file. In the default `handler.py` that serverless created, the method's name was `hello`. In our code, its `handler`. 

Now that the code is 'done', we'll enable it to be used by our skill in the developer console. With serverless we can just reference it in the serverless file. [This was a good quick reference](https://www.serverless.com/examples/aws-node-alexa-skill). Its pretty easy as you can see with that same updated block.
```
functions:
  hello:
    handler: hello_world.handler
    events: 
      - alexaSkill: amzn1.ask.skill.xx-xx-xx-xx
```

The new parameter `alexaSkill:` should be populated with your Skill Id that I mentioned to note earlier. Do not use `amzn1.ask.skill.xx-xx-xx-xx`. Use your own skill's id from the developer console.

Once that's done we're ready to deploy! Make sure you have the AWS CLI configured correctly (you need an IAM user that can deploy resources to your AWS account). Also make sure that serverless has the proper AWS configuration as well. If all is configured correctly, you can run this command to see your lambda deployed:
```
serverless deploy
```
Since we defined the serverless 'stage' and region earlier it should get deployed to that AWS region as a Cloud Formation Stack with a name similar to DemoAlexaSkill-dev. You can click into and explore the stack to find the lambda function, but since we know the name in our serverless.yml file we can look for the lambda created with the name 'hello'.

The lambda should be configured to be invoked by an Alexa Skill, and it should have the permissions automatically created for it too. The wonders of serverless!

To finish this up, we can go back to the [Alexa Developer console](https://developer.amazon.com/alexa/console/ask).

# Define Skill Configuration and Test!