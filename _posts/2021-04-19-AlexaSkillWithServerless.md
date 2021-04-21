---
layout:            post
title:             Create an Alexa Skill with VS Code and the Serverless Framework
date:              2021-04-19 14:00:00 -0200
tags:              Alexa Echo Skill AWS Amazon Serverless Framework Visual Studio Code
category:          Technical
author:            lgarcia
---

# Lets Make an Alexa Skill with the Visual Studio Code and the Serverless Framework!

Checkout the completed project [on my github!](https://github.com/lgarcia2/DemoAlexaSkillWithServerless)

I've been toying around with more tools, frameworks, and other things I find interesting these days. I'm interested in creating another Alexa Skill, but I've never had a good time managing the infrastructure and deployment. I've only used the free developer console and its tooling. Its been kind of a pain to provision resources, develop, and prototype rapidly. I'm fully willing to accept that I may be doing something wrong, but I haven't yet found what.

I've been playing with the [Serverless Framework](https://www.serverless.com/) lately and have found it pleasant to work with for describing AWS Infrastructure as Code. Serverless will create and deploy an AWS Cloud Formation stack for you. This tool seemed to me like a good way to solve my past problems when developing Alexa Skills. Hopefully it will help solve some of your problems too or at least provide a good guild to this specific case.

# Before You Start

Before you continue to read, I wrote this article after I developed a couple Alexa skills. I will skip over a lot of the details of creating your first skill. Instead I'm focusing on the specific case of creating a new skill with Visual Studio Code and deploying the AWS infrastructure with the Serverless Framework. If you're developing your first ever Alexa skill, I encourage you to keep reading, but a better guide might be [the one from Amazon themselves](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/develop-your-first-skill.html) 

# Visual Studio Code

I've worked with the Microsoft Stack pretty extensively and I'm pretty accustomed to Visual Studio. Lately, a lot of my work has been directing me more towards Visual Studio Code though. I enjoy the tool for its relative familiarity, but also how it can integrate and work with a more diverse set of programming languages. It also just so happens supported by Amazon for developing skills via the [Alexa Skills Toolkit extension for Visual Studio](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit)

There are some pretty good guides out there for working with the toolkit that I used when writing and developing this. Feel free to check them out while you're here.

- [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html)
- [Create Skills](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-ask-skills.html)

# Set Up the Environment

I started by getting everything set up. 

1. First, I downloaded and installed [Visual Studio Code](https://code.visualstudio.com/)
2. I chose to use [Python 3.8](https://www.python.org/) as my language of choice for developing this skill, so I made sure to add that [extension.](https://marketplace.visualstudio.com/items?itemName=ms-python.python) Python isn't required for this though. Alexa skills are supported for a number of programming languages.
3. I installed the [Alexa Skills Toolkit extension](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit).
4. You'll need [NPM](https://www.npmjs.com/get-npm) to install Serverless. Once that's installed, follow the [Serverless Install Instructions](https://www.serverless.com/framework/docs/providers/aws/guide/installation/) to get serverless installed. The [AWS CLI tool](https://aws.amazon.com/cli/) is required too in case you didn't already have it. 
5. I already had both an [AWS account](https://aws.amazon.com/) and an [Amazon Developer account](https://www.developer.amazon.com/), so I didn't need to create those, but if you don't have them you'll have to create those accounts. Make sure you're able to use the AWS cli tool too!
6. After getting everything installed, I logged in and followed the [Getting Started](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/get-started-with-the-ask-toolkit-for-visual-studio-code.html) guide. If you've never developed a skill before, or have never used the extension, its an important guide to follow. 
7. I created a directory and got it setup with git, [check it out here!](https://github.com/lgarcia2/DemoAlexaSkillWithServerless)

# Creating the Skill

After launching Visual Studio Code and opening the Alexa Skills Toolkit extension, I clicked the 'Create new skill' button. That button opens a new tab for creating a new skill. This tab contains all the parameters that must be filled out to create a new skill. Most of the them are fairly obvious, but I'll describe what I put in the parameters and the decisions that drove those inputs.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/AlexaSkillWithServerless/VisualStudioScreenshot.PNG)

- **Skill Name** - This is the name of your skill. I used 'Demo' so I could invoke the skill by saying something like: "Alexa, open Demo." I can always change this later before publishing if I wanted to publish this or expand the project further.
- **Default Language** - I chose 'English' because thats what I speak!
- **Skill Model** - Custom, its the only option right now.
- **Choose a method to host your skill's backend resources** - A lot of good information on this can be found [here.](https://developer.amazon.com/en-IN/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html) For my purposes, I chose the "Provision your own" option so that I could host it in my AWS account. I can deploy it and manage it there without any restriction from the Alexa free-tier. As much as I want to just have the Alexa developer space host it, I found it a bit restricting. That being said, I'll still have to work with the developer console, but I'll spend much less time there. Besides, I'm [no stranger](/blog/technical/CoronavirusGraphs) [to AWS.](/blog/technical/AWSImageHosting) and deploying this to AWS with Serverless is the point of the article!
- **Programing Language** - Python, as I mentioned above.
- **Local Directory** - I chose the folder/repository I created earlier.

After I filled out all the parameters, I clicked the final 'Create' button and waited for the extension to build out some skeleton code for me.

# Building and Deploying The Skill

Since I chose to host my AWS resources outside of the Alexa developer space, and since I'm using serverless, I will generally have two deployment steps.

- Deploy Skill configuration to Alexa developer account
- Deploy AWS resources to AWS account

The steps can technically be done in any order, but its important to make sure they are coordinated well so that any change made to one will affect the other appropriately. That is, if I add some new interaction in the skill configuration, there should be corresponding code to back it up. With that in mind, its probably best to deploy the skill configuration first then the AWS resources. All that being said, I may change my mind on this as time progresses. Any developer in any project should be aware of their deployment order (if they have one) and dependencies.

## First Skill Deployment

When I first clicked the 'Create' button from the Visual Studio Extension, it automatically created and deployed the default 'hello-world' configuration to the developer space. Since this is just a demo, I'm not going to change the default hello-world skill too much. So for now, I'm just going to log-in to the [skill console](https://developer.amazon.com/alexa/console/ask), open up the skill and note the Skill Id. The skill you created is found in the main page of the Alexa developer console. You can click the name of your skill to get into the details of it. Once the skill is open you can go to the 'Build' tab, then click 'Endpoint'. We're going to use a Lambda for our skill endpoint, so I'll click the AWS Lambda ARN radio button and then note the Skill ID that appears to the right. Be sure to note the whole string there, it should be unique to your skill.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/AlexaSkillWithServerless/DeveloperConsoleSkillId.PNG)

## First AWS Resource Deployment

The next thing on my list was to deploy the AWS resources to make the skill work. Right now, all I've got is the `hello_world.py` file that came by in the lambda directory by default. It should be easy enough to stand it up in AWS and make sure everything works as intended.

If I were doing this manually, I'd zip up the file and its dependencies and then upload it to the lambda section of the AWS console. As I've mentioned, I found that to be rather tedious, so I'm choosing to use the [Serverless Framework](https://www.serverless.com/) to define, package, and deploy all my AWS resources. This should make things easy to rapidly prototype, test, and deploy. 

First I'll initialize my serverless project by `cd`'ing into the `lambda` directory that was created and I'll run `serverless create --template aws-python`. This will create a nice little serverless template file (`serverless.yml`) for me to use. You can always create this file manually if you know what you're doing. The command will also create a default function `handler.py`. I'll go ahead and remove that file since I don't need it, but I will tweak my `serverless.yml` file accordingly. 

The `serverless.yml` file we created has a lot of information in it that is useful if you're starting out with serverless. Check it all out if you have time, but I only care about a few parameters. First, I'll change the value in the `service:` to `DemoAlexaSkill` since thats a good memorable name for the Cloud Formation Stack that will be created. Under `provider:` and under `runtime:` I made sure I specified `python3.8`. I also like to define the default stage and region too, so I'll uncomment those lines. 

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

Lambda functions are defined in the `functions:` block. By default, Serverless created an example 'hello' function with the handler.py file we deleted earlier. We can see how Serverless defined the function in this block of code in the serverless.yml file:
```
functions:
  hello:
    handler: handler.hello
```
We only need to change a little bit for now to get our skill working, but I strongly encourage you to read more about Serverless so that you can get a better idea of what it can do.

First, we want to define the lambda's entry point. A default function was defined in the `handler.py` file when we created the `serverless.yml` file. We're using different lambda code I'll replace it with the `hello_world.py` that was created with our skill. That file contains lambda function code so we can just swap some parameters to that the snippet so that our file now looks like this:
```
functions:
  hello:
    handler: hello_world.handler
```

`hello_world` is the name of the file containing the lambda code to execute, as in `hello_world.py`. The `.handler` refers to the entry point within that file. In the old, default `handler.py` that serverless created, the method's name was `hello`. In our code, its `handler`. 

Now that the code is 'done', we'll enable it to be used by our skill created in the developer console. With serverless we can just reference it in the serverless file. Its pretty easy as you can see with the updated block.
```
functions:
  hello:
    handler: hello_world.handler
    events: 
      - alexaSkill: amzn1.ask.skill.xx-xx-xx-xx
```

[This is a good quick reference if you need more info.](https://www.serverless.com/examples/aws-node-alexa-skill).

The new parameter `alexaSkill:` should be populated with your Skill Id that I mentioned to note earlier. Do not use `amzn1.ask.skill.xx-xx-xx-xx`. Use your own skill's id from the developer console.

Once that's done we're ready to deploy! Make sure you have the AWS CLI configured correctly (you need an IAM user that can deploy resources to your AWS account). Also make sure that serverless has the proper AWS configuration as well. If all is configured correctly, you can run this command to see your lambda deployed:
```
serverless deploy
```

## Look for the Lambda in AWS

We defined the serverless stage as 'dev' and we know the service was named 'DemoAlexaSkill' in the serverless.yml we created earlier. After running the deploy command, our code was deployed in our region as a Cloud Formation Stack with a name like DemoAlexaSkill-dev. 'DemoAlexaSkill' comes from what was defined as the service name and 'dev' comes from the serverless stage. To find the lambda function you can click into and explore the 'Resources' tab in the Cloud Formation Stack. Alternatively, since we know the name in our serverless.yml file, we can look for a lambda created with the name 'DemoAlexaSkill-dev-hello'. 'DemoAlexaSkill' comes from what was defined as the service name. 'dev' comes from the stage and 'hello' is from the name we gave to the lambda.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/AlexaSkillWithServerless/FunctionOverview.PNG)

After getting into the lambda function in the console, you can see that it is configured to be invoked by Alexa Skills Kit and it should have the permissions automatically created for it too; the wonders of serverless! Make sure to copy the new lambda function's ARN. We'll need it for the next step.

# Define Skill Configuration and Test!

To finish things up, we can go back to the [Alexa Developer console](https://developer.amazon.com/alexa/console/ask). Just like before, we need to find the skill that we created before (mine's named 'Demo'). After getting into the skill, we need to configure its build. So click the 'Build' tab at the top and then the 'Endpoint' item from the menu on the left. From there, just like when we copied the Skill Id before, click the AWS Lambda ARN radio button. This time we'll paste in the ARN of the lambda function we created earlier into the 'Default Region' box. This will define our lambda as the endpoint to call when the Alexa skill is invoked. After the value is in the box, you can click 'Save Endpoints' at the top of the page and we're ready to test.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/AlexaSkillWithServerless/DeveloperConsoleLambdaArn.PNG)

Testing from the Developer console is pretty easy, you can just go to the 'Test' tab at the top of the Skill page. Once you've gotten to the page, most things will be greyed out. In order to start testing, the tests must be enabled for development by selecting 'Development' from the drop down at the top of the page. From there you can toy around with enabling your mic, and treating the test page just like an Alexa device. You can test the skill we created by clicking the mic box and saying 'hello world'. From an efficiency point of view, I prefer to type 'hello world' in the box. Regardless of your choice, Alexa should echo back to you the message "Welcome, you can say Hello or Help. Which would you like to try?". This is the behavior that was implemented in the hello_world.py file by default. Now you're all set up to start playing with Alexa!

# Cleanup

In order to cleanup the resources we deployed to the AWS account we can remove them with serverless. Its as easy as running the following command in the directory where the serverless.yml exists.
```
serverless remove
```
That'll cleanup all the things we deployed to AWS. If you want to remove the skill from the Alexa Developer console, that can be done too. You can go to the main page in the Alexa Developer Console where all your skills are listed. There should be an 'Actions' column with a dropdown menu on the skill that we created. If you choose the 'Delete' action, the skill will be deleted.

# Final Thoughts

I wanted to have an easier time creating and deploying skills. Serverless, seems to me, to solve this problem pretty well. Its straight forward and I can keep track of everything that I've deployed. Its easy to define all the infrastructure as code in the serverless.yml file. Linking the AWS and Alexa Skill is straightforward too. I had a great time learning this and I hope you did too!

If you want to reference the code, check it out [on my github page](https://github.com/lgarcia2/DemoAlexaSkillWithServerless)
