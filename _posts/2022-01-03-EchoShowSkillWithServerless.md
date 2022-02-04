---
layout:            post
title:             Create an Echo Show Skill with VS Code and the Serverless Framework
date:              2022-01-03 16:00:00 -0200
tags:              Alexa Echo Show Skill AWS Amazon Serverless Framework Visual Studio Code
category:          Technical
author:            lgarcia
---

# Lets Make an Echo Show Skill with the Visual Studio Code and the Serverless Framework!

Checkout the completed project [on my github!](https://github.com/lgarcia2/DemoEchoShowSkillWithServerless)

# Introduction

If you've been following my posts lately, you'll probably notice a pattern. I've been working a lot with Alexa Skills and Serverless lately. I'm doing a lot of learning and test projects to prepare myself for a bigger project that will combine my efforts. As I learn things, I want to be able to remember what I did and how its done. Thats a big reason why I write these posts; so I can go back later and review things I've done. It also has the benefit of possibly helping someone that may have the same problem or questions that I have. So with that in mind, here's how to make an Echo Show skill with the Serverless Framework.

For more information, here are some other helpful links
- https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/use-apl-with-ask-sdk.html
- https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/tutorial-add-first-visual-response-custom-skill.html

# Project Setup Review

I'll review it pretty quickly here, but for more details on how to set up the project checkout [my post where I go into this in detail.](https://luisgarcia.me/blog/technical/AlexaSkillWithServerless) Additionally, I'll assume everything's installed and configured so I'm just going to start creating a new project.

## Create The New Skill

First, I'll launch Visual Studio Code, click the Alexa Skills Toolkit button and click "Create a Skill"
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/AlexaSkillWithServerless/VisualStudioScreenshot.PNG)

- **Skill Name** - "Show Demo" The name of the skill. I used "Show Demo" so I could invoke the skill by saying something like: "Alexa, open Show Demo."
- **Default Language** - English
- **Skill Model** - Custom
- **Choose a method to host your skill's backend resources** - "Provision your own" - A lot of good information on this can be found [here.](https://developer.amazon.com/en-IN/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html) I chose the "Provision your own" to host it in my AWS account. I can deploy it and manage it there without any restriction from the Alexa free-tier. I'll still have to work with the developer console, but I'll spend much less time there. Besides, deploying this to AWS with Serverless is one of the points of the article!
- **Programing Language** - Python
- **Local Directory** - The folder/repository created earlier.

After waiting a bit, the code will generate and the skill will be available for you in the Alexa Skill developer console.

## My 'pre-commit' script

I want to avoid committing my skill-id to these public repositories (although I've been deleting these 'demo' skills anyway). To do that I've created a very rudimentary script to check all the files in the repo for a skill-id type string and prevent committing if one is found. I used the tool [pre-commit](https://pre-commit.com/) to help me do that. If you take a look at that script (alexa_skill_id_check_git_hook.py) again, you'll see its rudimentary, has some TODO's, etc... but it gets the job done for now. Someday I'll work on improving it, so look forward to that in another post!

# Prepare The Skill For Visuals

In the past I've created 'audio only' types of skills. Theres a few differences and configuration details that need to change in order for us to add visuals to a skill. [This AWS tutorial goes into it thorougly](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/tutorial-add-first-visual-response-custom-skill.html) so check it out too.

## Enable the APL Interface

For visual skills we need to enable the APL interface. APL stands for "Alexa Presentation Language" its the feature that we'll use to help us **present** visuals to users. 
You can find it in the developer console in the Build tab in the Interfaces section under Alexa Presentation Language
Developer Console > Build > Interfaces > Alexa Presentation Language
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/EnableAlexaPresentationLanguage.png)

## Create a New APL Document

We're now going to create an APL ("Alexa Presentation Language") document to declare how we'll display information. For this tutorial, we'll do this in the Alexa Developer Console, but it can be done right in code as well.

In the console, go to the Build tab, then under the "Assets" menu, click "Multimodal Responses". Once that page opens, there are two types of responses "Audio" and "Visual". We want "Visual". (Build > Assets > Multimodal Responses > Visual)

Click "Create Visual Response"
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/CreateAPL_MultiModalResponses.png)

This will take you to a page with templates and fancy ways to display and organize your visual response. These are great and are worth taking a look at, but for our purposes we're just going to create a blank response for now.

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/CreateBlankAPL.PNG)

So click "Blank Document" (in the upper right) which will create a blank response for us. After that we'll go ahead and save the document and name it "HelloWorldDocument". So click the save **icon** in the upper right and type "HelloWorldDocument" as the template name

This will save it as a document, and really, its just JSON. You can check it out by clicking "Code View" next to "GUI View" in the editor in the upper left.

### Add an APL Package

In the designer, go to the "Code View". 

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/BlankAPL_CodeView.PNG)

Go ahead and add this object to the "import" array.

```
{
   "name": "alexa-layouts",
   "version": "1.5.0"
}
```

The final code should look like this.
```
{
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [
        {
           "name": "alexa-layouts",
           "version": "1.5.0"
        }
    ],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": []
    }
}
```

We just imported an APL package into our document. This package contains pre-defined resources that you can use to help display your information. In this case, we're importing the alexa-layouts package.

Now lets go ahead and use them.

### Add a Headline

Lets now add this object to our JSON, this time add it to the mainTemplate.items array.

```
{
    "type": "AlexaHeadline",
    "primaryText": "Display your text here."
}
```

Your code should look like this now.

```
{
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [
        {
           "name": "alexa-layouts",
           "version": "1.5.0"
        }
    ],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaHeadline",
                "primaryText": "Display your text here."
            }
        ]
    }
}
```

And you screen should update to look like this image ![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/DisplayYourTextHereAPL.PNG)


Don't forget to save by clicking the save icon in the top right!

### Hook the APL to a data source

Now that we've got something to show, lets hook it to a data source so we can display different things to the user other than "Display your text here."

Lets start by clicking the "DATA" icon in the leftmost column of controls.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/ClickDataAPL.PNG)

You should see the empty code block `{}` here. Lets go ahead and replace that with this populated code block. Note you won't see anything change in this step
```
{
    "helloWorldDataSource": {
        "title": "Hello World!",
        "subtitle": "I hope you're having fun!",
        "color": "@colorTeal800"
    }
}
```

This adds the data source for our design tool to use. Now we need to reference this and bind it to our APL document we created.

Since we're done adding the data source and we're modifying our APL document again, click the APL button in the leftmost column. This takes us back to the design space we were working with earlier.
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/DesignAPLAfterData.PNG)

We'll update our APL code again here. This time we'll add to the parameters array. Add the string "helloWorldDataSource" to the parameters list in the mainTemplate object. It should look like this.
```
"parameters": [
    "helloWorldDataSource"
],
```

We'll also bind the data in our "helloWorldDataSource" to the displayed text. This is done by updating the primaryText property to the following value `${helloWorldDataSource.primaryText}`

It should look like this
```
"primaryText": "${helloWorldDataSource.primaryText}"
```

When this is changed, you should see the text change to "Hello World!". This is exactly what we want. Now we have a data source that controls the text on screen!

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/HelloWorldAPL.PNG)

While we're here, lets add some of our other properties too. This is the final code I have for my APL document.
```
{
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [
        {
           "name": "alexa-layouts",
           "version": "1.5.0"
        }
    ],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "helloWorldDataSource"
        ],
        "items": [
            {
                "type": "AlexaHeadline",
                "primaryText": "${helloWorldDataSource.title}",
                "secondaryText": "${helloWorldDataSource.subtitle}",
                "backgroundColor": "${helloWorldDataSource.color}"
            }
        ]
    }
}
```

### Save and Rebuild!

Looking good! Lets make sure to save our work, click the save icon in the upper right. We also have to rebuild our model before we start making any code changes. Click the back button in the upper left. That should take you back to the developer console. You can click the build tab, then the build entry on the left. Alternatively, you can click "Interfaces" then "Build Model" at the top of the page.


# Write the Code to Interact with the Visuals

Now we need to add this APL document to our lambda function in code. We need to respond with the APL document when skill is invoked. If you remember that should be in the skill's 'lambda' folder. There should be a 'hello_world.py' for us to open up.

In the file, I'm just going to handle this new APL in the launch of the skill, for more complex interactions, checkout some of the other methods.

I'm going to modify the LaunchRequestHandler class's method "handle". I'm going to add this code right at the beginning of the function, before any responses are returned. When you're writing other functions, be sure to think carefully about where you may want to handle any APL interactions.

Here's my code for adding the APL to the response
```
supported_interfaces = ask_utils.request_util.get_supported_interfaces(handler_input)
if supported_interfaces.alexa_presentation_apl is not None:
    logging.info('This device supports APL')

    document_name = "HelloWorldDocument" # The name of the APL we saved
    token = document_name + "Token"
    handler_input.response_builder.add_directive(
        RenderDocumentDirective(
            token=token,
            document={
                "src":'doc://alexa/apl/documents/' + document_name,
                "type": "Link"
            },
            datasources={
                "helloWorldDataSource":{
                    "title": "We did it!",
                    "subtitle": "Hello World is coming from code!",
                    "color": "@colorTeal800"
                }
            }
        )
    )
```

Quick Explaination: I'm using the sdk to figure out what kind of device the user's device is. If its a device that supports a Presentation APL then we can proceed. I'll add the "RenderDocumentDirective" to render the APL document that we created. Right now the APL document is stored in the developer console. If you remember we stored it named "HelloWorldDocument", so we need the name. The developer console will store this saved document at that reference `doc://alexa/apl/documents/`. A little later, I'll show you what it looks like if you were to use an APL committed with your code. This Directive is added to the response and is returned to the user. If we've done everything right we can save, build, and deploy our skill!

NOTE: Each time you update your APL documents in the developer console, you have to rebuild your model to make sure your changes are available.

## Serverless Comes In

So far, this has just been a tutorial on working with APL's. I want to make sure I'm not forgetting Serverless since its our deployment mechanism. Let's start working with it. See my [first Serverless Alexa Skill post](https://luisgarcia.me/blog/technical/AlexaSkillWithServerless) for more details.

1. First lets initialize serverless by running the command `serverless create --template aws-python` in the lambda directory. 
2. Rework the serverless.yml as follows 

```
service: DemoEchoShowSkill
frameworkVersion: '2'

plugins:
  - serverless-python-requirements
provider:
  name: aws
  runtime: python3.8
  lambdaHashingVersion: 20201221
custom:
  pythonRequirements:
    dockerizePip: non-linux

functions:
  hello:
    handler: hello_world.handler
    events: 
      - alexaSkill: amzn1.ask.skill.xx-xx-xx-xx
```

(Make sure you change your alexaSkill parameter so it matches whatever your skills skill Id is)

3. Install the plugin `serverless-python-requirements` the ASK SDK is not in the standard libraries so you have to add the lib in your requirements.txt file and package it up when you deploy

3. Deploy the skill with the command `serverless deploy` (Make sure you've configured your aws cli and profile)

4. Once deployed, in the AWS developer console, go to the Build tab, then in the Endpoint section select "Aws Lambda ARN" and copy/paste the ARN of your deployed lambda function into the Default Region box and clid Save Endpoints, then re build the skill.


# Test It Out!

Now you can go to the Alexa Developer Console, go to the Test tab, make sure "Device Display" is checked and invoke your skill. I did this by typing 'hello world' in the Alexa Simulator textbox. (If you dont know your invocation name, you can go to Build -> Invocations -> Skill Invocation Name). Once your skill has been invoked you should be able to scroll down in the simulator and see the visuals!
![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/FirstSuccessfulTest.PNG)


# Further Reading

If you're satisfied with our results so far, thats great, take what you learned and go apply it. I'm going to continue on though and explore some extra concepts now though. I want to be able to develop some of the following items so if you're interested keep reading.
- Add the APL document to our repo and maintain it as part of the deployment.
- Support adding graphics to the display.


## Sync Changes Back to the Code

After Creating our APL document we need to save our changes and build the model if you haven't done so in the above steps. After that we can sync the changes back to our code so the APL document can be worked with and committed.

1. Save the Interface - This one's easy, at the top of the Developer Console in the build tab there's a "Save Interfaces" button. Click that.
2. Build the Model - Another easy one, at the top of the Developer Console in the build tab there's a "Build Model" button. Click that, it may take some time, so be patient
3. Sync the changes - This one's a little tricky. The best way I've found to do this is through VSCode. Go to the Alexa Skills Toolkit extension. From there you can see your skill (Mine's named "Demo Show"). Open up all the sub-options (not sure what to call these, but they're the "Skill manifest" and "Interaction model". We'll use "Alexa Presentation Language (APL)" menu later). Click Download on each one and then click the "Download" button when its page is open. If it asks you to select a folder select the whole project root (not the "Demo Show" folder, but the github repo name type folder i.e. "DemoEchoShowSkillWithServerless"). When a file opens up, you may have to ctrl+s to save it. This process should overwrite/add the correct files in the correct places.

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/DownloadConsoleFiles.PNG)

Alternatively, in the "Skills Management" section in this same page you can "Download and edit skill" be careful with this one though. If you do it in the current directory it can overwrite and delete your files. If you use this, my suggestion is to download it to a seperate folder, then merge that folder into your current working directory.

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/SyncAfterEnableAPL.png)


After this is done, you can git commit, push, whatever you want. That being said, any changes you to the local code wont be reflected back into the skill and the developer console until you deploy your changes back upstream. 

## Sync Changes Back Upstream to the Developer Console

Once you've got everything where you need it, in VSCode in the Alexa Skills Toolkit extension page theres the left column where we downloaded our skill manifest, interaction model, and APL. There's also an item to deploy the skill named "Deploy Skill". Click the item, and a page will open up. Make sure you hit the refresh button so you're aware of the most recent sync status and if you're ready and everything is up to date you can click the Deploy (or big red 'Force Deploy') button

![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/SyncUpstreamToConsole.PNG)


<!--## What If You Don't Wan't To Do That?

There are still some other options for deploying an APL. And we can take a look at doing that. Before we get into that I do want to note that the last deployment method had other benefits too. In additon to the APL, we also deployed other items needed for our skill like the interaction model and items in the skill manifest (not the lambdas and other resources though, those were deployed by serverless)

This next method of deploying an APL is only applicable to the APL document. -->

## Must Have More ...

Text is great, but I'm looking forward to adding images. Let's see what's required.

I started by adding a new APL. In the build menu, I clicked Multimodal Responses, then Create Visual Response. From here you can upload a template, use a blank document, or choose from one of the templates. I'm going to choose a template, I can't say I'm a very strong designer yet! However, the "Responsive Templates" tab doesnt have quite what I'm after. I'm going to go to the "Explore APL" tab and choose the "Image Display" template. Its pretty minimal with a background image, a title, a logo image, and a main image. 
Here I'm really only interested in the main image so this template is great! I'm going to go ahead and save this template and name it "ImageAPLDocument". 

Now I've got to sync it to my repo. I'll go back to the main Alexa Skill page, under the build tab, after clicking the 'CUSTOM' bar on the left, I clicked build so that my changes were saved. 

Back in Visual Studio, I can sync my code with the skill in the console by going to the Alexa Skills Toolkit, clicking the 'Deploy Skill' menu (Notably, I'm not deployng yet). From here, I want to hit the refresh button to refresh my status. 

Now I'm going to get my newly created APL document into my repo on disk. Still in the Alexa Skills Toolkit, under 'Skills Management' I clicked "Download and edit skill" and clicked my repository root folder when the popup came, this can overwrite your changes so see the next paragraph if you want alternative.

You can also sync APL's by going to the Alexa Presentation Language section and click the Download item. The dropdown should be populated with my "ImageAPLDocument" doc that I created earlier (If it doesn't show up, give it ~10 sec) and I'll go ahead and download it. Notably, this just downloads it to memory. It does not download the files to disk, so if you want the APL document and its data sources in the right places, you may want to sync the whole project like I did earlier

Now that I've got my ImageAPLDocument, I'm going to start making some changes! Although that may be misleading. I'm not going to change the APL docs at all, in fact, I'm just going to leave them be. However, I will change my lambda function. 

I'm going to source some new images from the API https://picsum.photos/. With that API you can generate a random image of your requested size. I'm using https://picsum.photos/300/200. 
I'll change my 'handler' function to look like this.

```
def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        logging.info("Handling...")
        supported_interfaces = ask_utils.request_util.get_supported_interfaces(handler_input)
        # If this device supports APL 
        # e.g. If this device is an Echo Show
        if supported_interfaces.alexa_presentation_apl is not None:
            logging.info('This device supports APL')
            #
            # Flag you can toggle based on where your APL is
            # This isnt production code, its just for demonstration purposes
            the_api_document_is_only_in_the_developer_console = True
            #
            # add "Alexa.Presentation.APL.RenderDocument" to the handler_input
            if the_api_document_is_only_in_the_developer_console:
                # if your APL is only in the console, load it from the console
                document_name = "ImageAPLDocument" # The name of the APL we saved
                token = document_name + "Token"
                # using an image api: https://picsum.photos/300/200
                # for more info see: https://picsum.photos/
                handler_input.response_builder.add_directive(
                    RenderDocumentDirective(
                        token=token,
                        document={
                            "src":'doc://alexa/apl/documents/' + document_name,
                            "type": "Link"
                        },
                        datasources={
                            "imageTemplateData": {
                                "type": "object",
                                "objectId": "imageSample",
                                "properties": {
                                    "backgroundImage": {
                                        "contentDescription": None,
                                        "smallSourceUrl": None,
                                        "largeSourceUrl": None,
                                        "sources": [
                                            {
                                                "url": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridListBackground_Dark.png",
                                                "size": "large"
                                            }
                                        ]
                                    },
                                    "image": {
                                        "contentDescription": None,
                                        "smallSourceUrl": None,
                                        "largeSourceUrl": None,
                                        "sources": [
                                            {
                                                "url": "https://picsum.photos/300/200",
                                                "size": "large"
                                            }
                                        ]
                                    },
                                    "title": "Plant of the day",
                                    "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/logo/logo-modern-botanical-white.png"
                                }
                            }
                        }
                    )
                )
            else:
                # if your APL is alongside the code, load it from the package
                # NOTE: it must be in a specefic place (in the lambda folder)
                # see https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/use-apl-with-ask-sdk.html 
                # for more detail
                handler_input.response_builder.add_directive(
                    RenderDocumentDirective(
                        token=HELLO_WORLD_TOKEN,
                        document=_load_apl_document()
                    )
                )
        else:
            logging.info('This device does not support APL. \r\n Supported Interfaces: \r\n {supported_interfaces}')
        #
        #
        speak_output = "Welcome, you can say Hello or Help. Which would you like to try?"
        #
        return (
            handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
    )
```
Its a little messy, but I'll leave cleaning it up as an excersize for the reader. The important part is that I copied the JSON from the ImageAPLDocument's datasources into the data source from the render document directive. From here, I left the background image and I left the logo. I did change the main image's source to be the API I referenced earlier (https://picsum.photos/300/200). Now when the skill is invoked, it'll show a new random image from the API. Check it out! ![PNG](https://s3.us-east-2.amazonaws.com/luisorlandogarcia.com-images/technical/EchoShowSkillWithServerless/EchoShowPictureWorking.PNG)

To get it to deploy, dont forget to deploy and build the skill and deploy the serverless.yml as well. From there go to the Test tab in the developer console and invoke your skill! 