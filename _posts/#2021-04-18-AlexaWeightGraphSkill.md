---
layout:            post
title:             Creating an Alexa Skill with Serverless
date:              2021-04-18 14:00:00 -0200
tags:              Alexa Echo Skill AWS Amazon Serverless Framework
category:          Technical
author:            lgarcia
---

# Lets Make a New Alexa Skill!

Well, the pandemic is still on. I've been working from home for more than a year now and its had its 'ups' and 'downs'. One of the 'ups' is that I've found more time to exercise. I've lost a little weight and that knowledge has kept me inspired to continue exercising. My weight does continue to fluctuate though and I wanted to see how it changed over time.

That phrase 'changed over time' is always a key indicator to me that the data could be visualized with a line graph, and I wanted to see my weight in a line graph. What I don't want to do, is put forth the effort to write down my weight every day, input it into excel (or some other data tool) and generate a graph for it. 

This particular problem seemed pretty well suited for Amazon's Echo device to perform. That is, I could have an Echo device 'collect' the data and aggregate it behind the scenes. That data collection would still have to be me, saying something like "Alexa record my weight", but those spoken words would be a lot less of a hassle than recording the data by hand every time I weighed myself. With an Echo Show, I could even display the graph.

Now that I have a pretty solid idea of what I want to create, lets get started on creating it!

# Visual Studio Code

I've worked with the Microsoft Stack pretty extensively. I'm pretty accustomed to Visual Studio. Lately, a lot of my work has been directing me more towards Visual Studio Code. I enjoy the tool for its relative familiarity, but also how it can support much more than the normal Visual Studio. It also just so happens to be well supported by Amazon for developing skills via the [Alexa Skills Toolkit extension for Visual Studio](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit)

There are some pretty good guides out there for working with the toolkit that I used when writing and developing this. Feel free to check them out while you're here.

- [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html)
- [Create Skills](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-ask-skills.html)

# Set Up the Environment

I started by getting everything set up. 

1. First, I downloaded and installed [Visual Studio Code](https://code.visualstudio.com/)
2. I chose to use [Python 3.8](https://www.python.org/) as my language of choice for developing this skill, so I made sure to add that [extension.](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
3. Installing the [Alexa Skills Toolkit extension](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit) was the final piece I needed to download.
4. After getting everything installed, I followed the [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html) guide. If you've never developed a skill before, or have never used the extension, its an important guide to follow.
5. I created a directory and got it setup with git, check it out here!

# Creating the Skill

After opening Visual Studio Code and opening the Alexa Skills Toolkit extension, I clicked the 'Create new skill' button. That button opens a new tab for creating a new skill. Most of the parameters are fairly obvious, but I'll describe what I put in the parameters and the decisions that drove those inputs.

- **Skill Name** - I used 'Weight Chart' so I could invoke the skill by saying something like: "Alexa, open Weight Chart and add 170 pounds". I can change always change this later before publishing (if I want to publish this)
- **Default Language** - English because thats what I speak!
- **Skill Model** - Custom, its the only option right now.
- **Choose a method to host your skill's backend resources** - A lot of good information on this can be found [here.](https://developer.amazon.com/en-IN/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html) What I found it boils down to is whether you want your skill and associated AWS resources (lambda, S3, Dynamo, etc...) to be hosted by the Alexa developer space, subject to its 'free-tier' limitations, or whether you want to host the AWS resources yourself. As much as I want to just have the Alexa developer space host it, I opted to choose the 'Provision your own' option. My reasoning was that if I only use this skill for myself, I'll never exceed the 'free-tier' limitations. If I want to open it up to the world though and if it gains a lot of usage, I'll quickly exceed that 'free-tier' limitation and have to migrate it anyway. Besides, I'm [no stranger](/blog/technical/CoronavirusGraphs) [to AWS.](/blog/technical/AWSImageHosting)
- **Programing Language** - Python, same as I mentioned earlier.
- **Local Directory** - I chose the folder I created earlier.

After I filled out all the parameters, I clicked the final 'create skill' button and waited for the extension to build out some skeleton code for me.

# Building and Deploying The Skill

Since I chose to host my AWS resources outside of the Alexa developer space, my build and deployment may look different than some of the guides out there. Since I chose to deploy without the Alexa developer space I will have two deployment steps.

- Deploy Skill configuration to Alexa developer space
- Deploy AWS resources to AWS account

The steps can technically be done in any order, but its important to make sure they are coordinated well so that any change made to one will affect the other appropriately. That is, if I add some new interaction in the skill configuration, there should be corresponding code to back it up. With that in mind its probably best to deploy the skill configuration first then the AWS resources. All that being said, I may change my mind on this as time progresses and any developer in any project should be aware of their deployment order and dependencies.

## First Skill Deployment

When I first clicked the 'create skill' button from the Visual Studio Extension, it automatically created and deployed the default 'hello-world' configuration to the developer space. Since I'm just doing a test deployment now, to make sure everything works right, I'm not going to change the developer space. What I do need to do, however, is to deploy the code to make the function work.

## First AWS Resource Deployment

The next thing on my list was to deploy the AWS resources to make the skill work. Right now, all I've got is the `hello_world.py` file that came by in the lambda directory by default, so it should be easy enough to stand it up in AWS and make sure everything works as intended.

If I were doing this manually, I'd zip up the file and its dependencies and then upload it to the lambda section of the AWS console. I've found that to be rather tedious, so I'm choosing to use the [Serverless Framework](https://www.serverless.com/) to define, package, and deploy all my AWS resources. This should make things easy to rapidly prototype, test, and deploy. If you're interested in using it, check out the website for specific instructions, but off-hand, I recall that I'll need the framework itself and [Docker](https://www.docker.com/) to zip up my dependencies. (Why Docker? Checkout my [other post.](/blog/technical/CoronavirusGraphs)). 

### Serverless

If you're deploying manually or with some other framework, feel free to ignore these sections. 

First I'll initialize my serverless project by `cd`'ing into the lambda directory and running `serverless create --template aws-python`. This will create a nice little serverless template file (`serverless.yml`) for me to use. You can always create this file manually if you know what you're doing. The command will also create a default function `handler.py`. I'll go ahead and remove that file and tweak my `serverless.yml` file accordingly. 
I added a name to my function, so I could identify it easily and I also added some parameters specifically for Alexa Skill. [This was a good quick reference](https://www.serverless.com/examples/aws-node-alexa-skill) on adding an Alexa Skill to the serverless definition. The `alexaSkill` parameter was populated the Alexa Skill Id that was created when the skill was created in the developer space. The serverless framework takes care of the rest.
The function definition should look similar to this.

```
functions:
  hello:
    name: hello
    handler: handler
    events: 
      - alexaSkill: amzn1.ask.skill.xxxxx
```

If 
