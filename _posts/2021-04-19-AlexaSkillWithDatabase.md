---
layout:            post
title:             Create an Alexa Skill with a Dynamo Database
date:              2021-12-09 14:00:00 -0200
tags:              Alexa Echo Skill AWS Amazon Serverless Framework Visual Studio Code
category:          Technical
author:            lgarcia
---

# Lets Make an Alexa Skill with a Dynamo Database

Checkout the completed project [on my github!](https://github.com/lgarcia2/DemoAlexaSkillWithDatabase)

## Introduction

In my post about [Creating an Alexa Skill with VSCode and the Serverless Framwork](https://luisgarcia.me/blog/technical/AlexaSkillWithServerless) I made a simple hello world Alexa Skill so that anyone can get up and running creating and deploying Alexa Skills easily. Now that we've seen how easy it can be to develop and deploy, lets start to introduce some complexity!

A large part of many applications is a data layer to store information. I want to be able to have a skill that can store and retrieve custom user data. With that in mind I'll need a database to store the data and I'll need to implement code to interact with it. 

This project builds upon my previous work. If you haven't checked it out, [now's a good time to look.](https://luisgarcia.me/blog/technical/AlexaSkillWithServerless) With that in mind, I'll continue by adding a DynamoDB table to my serverless.yml file. This will allow a new DynamoDB table to be created whenever I run the `serverless deploy` command. Infrastructure as code makes deploying things and identifying and maintaining aws resources a lot easier.

## Problem

In expanding our Hello World application, I'll add a piece to track how many times the application has said hello to the Alexa user.

## Designing the Dynamo DB Table

I'm using AWS's Dynamo DB for a few reasons. Its AWS native resource thats easy to work with. The boto3 python library makes it easy to work with within python and AWS Lambda functions. Its easy to add to a Cloud Formation template or my serverless.yml file. Lastly, I can always use more practice with it.

I mention that I could use more practice with it, because I'm more accustomed to relational databases (think SQL) where data is usually stored across multiple tables in seperate columns per table. Relational databases often use primary keys and foreign keys to join data together across tables to organize, manage, and construct objects to use in code.

DynamoDB on the other hand, is non-relational, sometimes called NoSQL. It doesn't user joins or other concepts from relational databases. With that in mind, our table design will be very different and so will our access patterns. I'll do my best to explain my design decisions here, but to learn more about NoSQL database design with Dynamo, you can checkout [this AWS post](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/) [or this post](https://www.sensedeep.com/blog/posts/2021/dynamodb-singletable-design.html)

### Columns

**Partition Key**
As I mentioned earlier, there are many differences between relational and non-relational databases. Relational databases have a Primary key to query and help organize the data among other things. For our non-relational Dynamo database though, there is no primary key. We'll instead use a *Partition Key*. If you're familiar with hash tables, sometimes called hash maps or dictionaries, think of this as the 'key', they're very familiar concepts. A partition key is one of the most characteristic parts of a NoSQL database. Our usage patterns will, in a lot of ways, mimic the patterns of a hash map or dictionary. So with that in mind, a partition key will be our first column in our database. 

Another thing the differs between relational and non-relational databases is the number of tables. For relational databases, the data is stored across many tables and joined together. In non-relational, its much more appropriate to store and organize all the data in the same table. You can query different objects stored with different styles of keys using different sorting options. That is, we'll store our data as a JSON string. That JSON string can be a different object across rows of data. Its important to know what that object is and how to deserialize it, so establishing the keys and key data is important.

Let's consider our access pattern now. Our problem states that we want to know how many times our application has said "hello" to our user. Lets make the partition key relate to the user so that we can query the number of times we've said hello by a user's id. In other words, we'll ask our database this question: "For user id {x}, what is the number of times we've said hello?". Another way to represent this is with some psuedo-code (Note this code wont be used in our application, but it demonstrates our access pattern)
```
userId = "x"
numberOfHellos = myDatabase[userId]
```

For our Alexa ppplication, we'll use our user's userId as part of the partition key. According to the [Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#user-id) userId is a string so we'll make the datatype of our Partition Key a string as well. We also want other data in our partition key, so a string is a good way to satisfy both those requirements.

So lets make our first column in our table look like this:

| pk |
| --- |
| user#abc-123-456 |
| user#def-567-890 |
| user#ghi-456-567 |

**Sort Key**

If you expected more than one row to be returned when you queried an individual pk (in our case the userId) then it can be helpful to sort that data so that you can get the exact row you're after. For the purposes of our problem, this isn't necessary since we'll only have one row per user. However, for more complex applications, one could use a *Sort Key* to enhance and optimize the queries you run to get your data. [Checkout those posts](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/) [I linked earlier](https://www.sensedeep.com/blog/posts/2021/dynamodb-singletable-design.html) for more information.

**Data Column**

For our data column, I'm just going to store our object as serialized json. Something like this:
```
{
    "numberOfHellos": 0
}
```
I'll just name the column data sticking with the idea that any object can be stored in a non-relational database. That being said, its important to consider how you will know *what* data is stored in this column. That may be a reason to add an additional column like a sort key, a global index, or just another column.

Our final table will end up looking something like this:
| pk | data |
| --- | --- |
| user#abc-123-456 | {"numberOfHellos":0} |
| user#def-567-890 | {"numberOfHellos":5} |
| user#ghi-456-567 | {"numberOfHellos":2} |


## Adding to Serverless

Now that our table is designed, lets add it to our serverless.yml file so it can be deployed

```
resources:
  Resources:
    helloLambdaIamRole:
      Type: AWS::IAM::Role
      Properties:
        RoleName: ${opt:stage, self:provider.stage}-helloLambdaRole
        AssumeRolePolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Principal:
                Service:
                  - lambda.amazonaws.com
              Action: sts:AssumeRole
        Policies:
          - PolicyName: ${opt:stage, self:provider.stage}-LambdaDynamoAndLogPolicy
            PolicyDocument:
              Version: '2012-10-17'
              Statement:
                - Effect: Allow
                  Action:
                    - logs:*
                  Resource: "*"
                - Effect: Allow
                  Action:
                    - dynamodb:PutItem
                    - dynamodb:Query
                  Resource: 
                    Fn::GetAtt: [helloWorldDataTable, Arn]
    helloWorldDataTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tableName}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          -
            AttributeName: "pk"
            AttributeType: "S"
        KeySchema:
          - 
            AttributeName: "pk"
            KeyType: "HASH"
```

We add the table in a `Resources` block in the `resources` section. Yes its a little redundant and silly but you can [take that up with Serverless](https://www.serverless.com/framework/docs/providers/aws/guide/resources/)

Our resource is named `helloWorldDataTable` and if I need to reference this resource anywhere else in my serverless.yml file then I'll use this as the reference name

From here you can use the [AWS Cloud Formation templeate reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html) for details on the other parameters, but I'll go over them briefly too.

- **Type** - for DynamoDB tables this is always `AWS::DynamoDB::Table`
- **Properties** - The specific DynamoDB properties for the resource
    - *TableName* - The name of the table. You *can* hardcode this, but I named mine elsewhere in the `serverless.yml`. You can checkout the [whole source on github](https://github.com/lgarcia2/DemoAlexaSkillWithDatabase) (NOTE this has different meaning than the reference name of the resource we specified earlier)
    - *BillingMode* - This is how AWS bills you for interacting with the resource. I chose `PAY_PER_REQUEST` in case my skill's usage pattern varies wildly. Checkout the earlier reference for more information
    - *AttributeDefinitions* - This (in combination with KeySchema) is where our key colums are defined. Note, you don't have to define *all* columns here, just the ones that will be used as keys in the KeySchema definitions later
        - AttributeName - the column name
        - AttributeType - the datatype of the column "S" for string, "N" for number, "B" for binary
    - *KeySchema* - This defines the keys for the table
        - AttributeName - the name of the column, this must be equal to one of the AttributeNames defined in the AttributeDefinitions
        - KeyType - the role of the key. "HASH" for partition keys "RANGE" for sort keys

You can also see the IAM role that I defined too. In order to interact with the database, we need to give the role our lambda uses permissions to read and write to the database. So in the resources section I defined a role that is able to read/write to the database, write logs, and interact with lambda. I also made sure the lambda used the role by adding this line to the function definition `role: helloLambdaIamRole`

Now that our table and security is defined, we can move on to writing the code to use it!

## Interacting with our Database

Lets reflect on our problem before we write any code. 

*Add a piece to track how many times the application has said hello to the Alexa user.*

So lets have our application do the following
1. A user invokes the application
2. From the database, we fetch the number of times this user has invoked the application
    - If the user row doesnt exist in the database for this user, create a row and set the number of times this application has been invoked value to 1
    - If the user row does exist, fetch the data, add 1 to it and persist the data
3. Reply with a message that says "Hello World, I have said hello {x} times" to the user where {x} is the number fetched from the database + 1 (or the number persisted earlier)

Example 1: 
- Our user invokes this application for the first time.
- We attempt to lookup user data in the database but find zero rows
- A row is persisted in the database with the userid and the number of times invoked set to 1
- Alexa replies saying "Hello World, I have said hello one time"

Example 2: 
- Our user invokes this application for the third time.
- We attempt to lookup user data in the database and find a row with the number of times invoked = 2
- the row is updated so that the number of times invoked = 3
- Alexa replies saying "Hello World, I have said hello three times"

Now lets write the code!

I'm going to write three methods:
- get_number_of_hellos(userId: str) -> int
- set_number_of_hellos(userId: str, number_of_hellos: int) -> None
- create_hellos_message(number_of_hellos: int) -> str

`get_number_of_hellos()` will query the database and return the number of hellos found for the user
`set_number_of_hellos()` will add or update the database with a number of hellos
`create_hellos_message()` will create the message to return back to the user

`create_hellos_message()` is an easy one lets write it below in python
```
def create_hellos_message(number_of_hellos: int) -> str:
    # NOTE: english is funny, we have to say 'time' or 'times' so it sounds correct depending on whether there is one or more number of hellos
    if number_of_hellos == 1:
        return f"Hello World, I have said hello {number_of_hellos} time"
    else:
        return f"Hello World, I have said hello {number_of_hellos} times"
```

### Querying the Database

Now that we've got our easiest method out of the way, lets interact with our database in code for the first time. For this lets `import boto3` and make sure `boto3` is in our `requirements.txt` file.

While we're up in the top of our python file lets also `import os` and `from boto3.dynamodb.conditions import Key, Attr` and add some global variables

```
import boto3
from boto3.dynamodb.conditions import Key, Attr
import os
import json

# Globals that should stay 'warm' from lambda to lambda
TABLE_NAME = os.environ.get('HELLO_WORLD_DATA_TABLE')
REGION = os.environ.get('REGION')
DYNAMODB_RESOURCE = boto3.resource('dynamodb') 
DYNAMODB_TABLE = DYNAMODB_RESOURCE.Table(TABLE_NAME)
```
Normally, global variables should be something to frown on. However in this case, I want to keep these resource references 'warm'. That is, if the lambda is invoked in rapid succession, less time will be spent initializing these resources since they've been previously initalized, or so I've been told. A cursory google neither proves or denies this though. 

Of these variables, we'll just use DYNAMO_TABLE to query our table for data. Let's start on our get_number_of_hellos method
```
def get_number_of_hellos(self, userId: str) -> int:
    user_value = f'user#{userId}'
    query_response = DYNAMODB_TABLE.query(
        KeyConditionExpression=Key('pk').eq(user_value)
    )

    query_response_items = query_response['Items']
    if len(query_response_items) < 1:
        return 0
    else:
        # there 'should' only be one item returned, if there is > 1 then we'll just pick the first one
        data_str = query_response_items[0]['data']
        data_obj = json.loads(data_str)
        return data_obj['numberOfHellos']
```
One item that tripped me up was the difference between the Dynamo resource and the Dynamo client. The query syntax is different between the two. 

For more information on querying the database see [this AWS article.](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.Python.04.html)

### Adding to the database

Alright, last method. It should be pretty easy to copy and past our old code with a few changes. 
```
def set_number_of_hellos(self, userId: str, number_of_hellos: int) -> None:
    user_value = f'user#{userId}'
    data_obj = {}
    data_obj['numberOfHellos'] = number_of_hellos
    db_item = {
        'pk': user_value,
        'data': json.dumps(data_obj)
    }

    DYNAMODB_TABLE.put_item(
        Item = db_item
    )
```

The important part here is to get the item-to-persist correct. Make sure to name and add the columns correctly. Other than that its the same thing!

### Putting it all together

Lastly, reflecting on the problem statement from earlier, I reworked the 'handle' method in the 'HelloWorldIntentHandler' so that we could read, write, and get a good message from Alexa. Since we wrote good methods, the code is very easy.

```
def handle(self, handler_input):
    # type: (HandlerInput) -> Response
    speak_output = "Hello World!"

    userId = handler_input.request_envelope.session.user.user_id
    number_of_hellos = self.get_number_of_hellos(userId)
    number_of_hellos = number_of_hellos + 1
    self.set_number_of_hellos(userId, number_of_hellos)
    speak_output = self.create_hellos_message(number_of_hellos)

    return (
        handler_input.response_builder
            .speak(speak_output)
            # .ask("add a reprompt if you want to keep the session open for the user to respond")
            .response
    )
```

### Deploying and Testing

Finally, we can deploy and test. I used this line in my powershell (or terminal if you're using linux) `serverless deploy --region us-east-1 --stage dev`

Make sure you have your aws profiles configured and it should deploy nicely for you in AWS. If you have problems, go back to my [previous post](https://luisgarcia.me/blog/technical/AlexaSkillWithServerless). It should help out.

Like last time you can go into the Alexa Developer Console and test your skill. With any luck you'll be able to verify the examples from earlier




