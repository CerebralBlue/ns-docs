---
title: "Control Flow"
description: "This node allows for comments and description of surrounding NTL :::note[Parameters]"
---

## Comment 


This node allows for comments and description of surrounding NTL
:::note[Parameters]

- **nsdescription**: Comments
:::

---


## Set Variable 


Collect all current flowing text into this node, and set it to a variable for use in later steps. You can also use this to clear existing text.
:::note[Parameters]

- **name**: The name of the variable

- **mode**: Overwrite (default) or Append to this variable

- **value**: (Optional) Directly set the value. Leave this blank to collect the input to this node.
:::

```text
{{ variable  | name: "age" | value: "34" }}
```
:::tip[No Returns]

:::

---

## useVariable 

undefined

---


## Stop 


Stop all further processing

    

```
{{ stop }}
```

    

---


## Start Loop 


Loop for a set number of times. Use the Break Loop node to stop the loop early
:::note[Parameters]

- **count**: 
    - **text**: The times to loop unless a loop break is recieved
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 2
:::

---


## End Loop 


Loop for a set number of times. Use the Break Loop node to stop the loop early
:::note[Parameters]

- **sleep**: 
    - **text**: Amount of time in milliseconds to delay the next loop iteration
    - **min**: 0
    - **max**: 4000
    - **step**: 100
    - **default**: 0
:::

---


## Break Loop 


Break Loop stops a loop early.  Use it in conjunction with the condition node.

    


    

---


## Context Loop 


Split on input text based on token count and set a percentage of overlap for each loop, then loop on the split.
:::note[Parameters]

- **tokens**: 
    - **text**: The number of tokens to split and loop on
    - **min**: 200
    - **max**: 16000
    - **step**: 200
    - **default**: 1000

- **overlap**: 
    - **text**: The percentage of overlap between successive iterations.
    - **min**: 0
    - **max**: 50
    - **step**: 1
    - **default**: 0
:::

---


## Variable Loop 


Loop on an array variable, iterating thru each element of the array
:::note[Parameters]

- **variable**: The base variable name

- **loopType**: The type of input object (defaults to 'array-strings')
:::

```
{{ variableLoop  | variable: "categories" | loopType: "array-strings" }}
```
<details>
<summary>Example Usage 1</summary>

```json
{"looper": ["a","b","c"]}=>{{ jsonToVars  }}
{{ variableLoop  | variable: "looper" | loopType: "" }}
was the passed input.
{{ variable  | name: "myVar" | mode: "append" }}
{{ endLoop  }}
<< name: myVar, prompt: false >>
```
Will yield:
```json
a 
was the passed input.
b 
was the passed input.
c 
was the passed input.
```

</details>

<details>
<summary>Example Usage 2</summary>

```text
{"messages": [
  {
    "message": "Hello, how can I assist you today?",
    "sender": "Assistant",
    "timestamp": "2023-04-12T10:30:00Z"
  },
  {
    "message": "I'm doing well, thanks for asking. How can I help you?",
    "sender": "User",
    "timestamp": "2023-04-12T10:30:15Z"
  },
  {
    "message": "I'm afraid I don't have a specific task for you at the moment. I'm just here to chat and help out however I can.",
    "sender": "Assistant",
    "timestamp": "2023-04-12T10:30:30Z"
  },
  {
    "message": "That's great, I appreciate your availability. I was wondering if you could help me with a project I'm working on.",
    "sender": "User",
    "timestamp": "2023-04-12T10:30:45Z"
  },
  {
    "message": "Absolutely, I'd be happy to assist you with your project. Please go ahead and provide me with the details, and I'll do my best to help.",
    "sender": "Assistant",
    "timestamp": "2023-04-12T10:31:00Z"
  }
]}=>{{ jsonToVars  }}
{{ variableLoop  | variable: "messages" | loopType: "array-objects" }}
[<< name: loopObject.timestamp, prompt: false >>] << name: loopObject.sender, prompt: false >>: << name: loopObject.message, prompt: false >>
{{ variable  | name: "messagesFormatted" | mode: "append" }}
{{ endLoop  }}
<< name: messagesFormatted, prompt: false >>
```
Will yield:
```json
[2023-04-12T10:30:00Z] Assistant: Hello, how can I assist you today?
[2023-04-12T10:30:15Z] User: I'm doing well, thanks for asking. How can I help you?
[2023-04-12T10:30:30Z] Assistant: I'm afraid I don't have a specific task for you at the moment. I'm just here to chat and help out however I can.
[2023-04-12T10:30:45Z] User: That's great, I appreciate your availability. I was wondering if you could help me with a project I'm working on.
[2023-04-12T10:31:00Z] Assistant: Absolutely, I'd be happy to assist you with your project. Please go ahead and provide me with the details, and I'll do my best to help.
```

</details>

---


## Agent Loop 


Loop thru an Agent Plan. Must be used with selectAgentPlan

    


    

---


## Video Loop 


Break a video down to still frames and loop thru the frames. Each iteration of the loop will populate 2 variables:<br>videoLoopFrame - the frame number<br>videoLoopImage[0-x] - the frame as a jpg
:::note[Parameters]

- **url**: URL of remote file (this or video required)

- **video**: Video file (this or url required)

- **fps**: 
    - **text**: Frames per second
    - **min**: 0.01
    - **max**: 10
    - **step**: 0.1
    - **default**: 1

- **framesPerLoop**: 
    - **text**: Frames per loop (create additional variables to do parallel calls inside the loop)
    - **min**: 1
    - **max**: 20
    - **step**: 1
    - **default**: 1
:::

```
{{ videoLoop }}
```
<details>
<summary>Example Usage 1</summary>

```text
{{ variable  | name: "instructions" | value: "This picture is a frame from a video of a person knitting. Your job is to describe in detail the breakdancer's each of the objects in the frame describing each of them
" | mode: "overwrite" }}
{{ videoLoop  | video: "" | url: "https://www.pexels.com/download/video/29890007" | fps: "0.31000000000000005" | framesPerLoop: "5" }}
{{ condition  | value: "'<< name: videoLoopImage0, prompt: false >>' != ''" }}=>{{ LLM  | prompt: "<< name: instructions, prompt: false >>" | cache: "false" | images: "<< name: videoLoopImage0, prompt: false >>" }}=>{{ variable  | name: "frame0" | mode: "overwrite" }}
{{ condition  | value: "'<< name: videoLoopImage1, prompt: false >>' != ''" }}=>{{ LLM  | prompt: "<< name: instructions, prompt: false >>" | cache: "false" | images: "<< name: videoLoopImage1, prompt: false >>" }}=>{{ variable  | name: "frame1" | mode: "overwrite" }}
{{ condition  | value: "'<< name: videoLoopImage2, prompt: false >>' != ''" }}=>{{ LLM  | prompt: "<< name: instructions, prompt: false >>" | cache: "false" | images: "<< name: videoLoopImage2, prompt: false >>" }}=>{{ variable  | name: "frame2" | mode: "overwrite" }}
{{ condition  | value: "'<< name: videoLoopImage3, prompt: false >>' != ''" }}=>{{ LLM  | prompt: "<< name: instructions, prompt: false >>" | cache: "false" | images: "<< name: videoLoopImage3, prompt: false >>" }}=>{{ variable  | name: "frame3" | mode: "overwrite" }}
{{ condition  | value: "'<< name: videoLoopImage4, prompt: false >>' != ''" }}=>{{ LLM  | prompt: "<< name: instructions, prompt: false >>" | cache: "false" | images: "<< name: videoLoopImage4, prompt: false >>" }}=>{{ variable  | name: "frame4" | mode: "overwrite" }}
{{ condition  | value: "'<< name: videoLoopImage0, prompt: false >>' != ''" }}=>
Frame: << name: videoLoopFrame0, prompt: false >>
<< name: frame0, prompt: false >>=>{{ variable  | name: "frameTotal" | mode: "append" }}
{{ condition  | value: "'<< name: videoLoopImage1, prompt: false >>' != ''" }}=>
Frame: << name: videoLoopFrame1, prompt: false >>
<< name: frame1, prompt: false >>=>{{ variable  | name: "frameTotal" | mode: "append" }}
{{ condition  | value: "'<< name: videoLoopImage2, prompt: false >>' != ''" }}=>
Frame: << name: videoLoopFrame2, prompt: false >>
<< name: frame2, prompt: false >>=>{{ variable  | name: "frameTotal" | mode: "append" }}
{{ condition  | value: "'<< name: videoLoopImage3, prompt: false >>' != ''" }}=>
Frame: << name: videoLoopFrame3, prompt: false >>
<< name: frame3, prompt: false >>=>{{ variable  | name: "frameTotal" | mode: "append" }}
{{ condition  | value: "'<< name: videoLoopImage4, prompt: false >>' != ''" }}=>
Frame: << name: videoLoopFrame4, prompt: false >>
<< name: frame4, prompt: false >>=>{{ variable  | name: "frameTotal" | mode: "append" }}
{{ endLoop  }}
{{ LLM  | prompt: "You will be given descriptions of frames from a person knitting video. Take this series of described frames and determine all the objects present in the video with their descriptions.
Here are the frames:
<< name: frameTotal, prompt: false >>" | cache: "true" | maxTokens: "3000" }}
```
Will yield:
```plain
Hands - The hands of the person knitting or crocheting are the main focus in all the frames.
Knitting needles/Crochet hooks - The person is using either knitting needles or crochet hooks to create the textile project.
Yarn/Thread - The person is manipulating yarn or thread to create the knitted or crocheted item.
Textile project - In each frame, the person is working on a knitted or crocheted textile project, such as a piece of fabric, a square, or an unfinished item.
Cup/Mug - In most frames, there is a cup or mug on the table, containing what appears to be tea, coffee, or a red beverage like wine.
Table - The knitting or crocheting is taking place on a table or other surface.
Couch/Soft surface - In one frame, the knitting or crocheting is taking place on a couch or other soft surface.
The overall scene depicts a relaxing, cozy activity of knitting or crocheting, with the person focused on the needlework and enjoying a warm beverage.
```

</details>

---


## PDF Loop 


Split a PDF by page and loop thru the pages as both text and images. Each iteration of the loop will populate 3 variables:<br>pdfLoopPage - the page number<br>pdfLoopText[0-x] - the text on the page<br>pdfLoopImage[0-x] - a png image of the page
:::note[Parameters]

- **file**: PDF File

- **pagesPerLoop**: 
    - **text**: Pages per loop (create additional variables to do parallel calls inside the loop)
    - **min**: 1
    - **max**: 20
    - **step**: 1
    - **default**: 1
:::

```
{{ pdfLoop  | file: "" | pagesPerLoop: 1 }}
```
<details>
<summary>Example Usage 1</summary>

```text
{{ variable  | name: "instructions" | value: "Summarize the provided text into 5 concise bullet points that capture the main ideas. Do not include explanations or add any information that isn’t in the original text. Your response should only contain the text itself, formatted appropriately. Do not interpret or explain the content." }}
{{ pdfLoop  | file: "somatosensory.pdf" | pagesPerLoop: "1" }}
{{ LLM  | prompt: "<< name: instructions, prompt: false >>
<< name: pdfLoopText0, prompt: false >>" | cache: "false" }}=>{{ variable  | name: "output" | mode: "append" | value: "" }}
{{ endLoop  }}
{{ LLM  | prompt: "Each section of the text below corresponds to a page in a pdf. Format it correctly listing the bullet points for each section. 
<< name: output, prompt: false >>" | cache: "true" }}
```
Will yield:
```plain
Page 1:
The somatosensory system consists of sensors in the skin, muscles, tendons, and joints.
Cutaneous receptors in the skin provide information about temperature, pressure, texture, and pain.
Receptors in muscles and joints provide information about muscle length, tension, and joint angles.
Meissner corpuscles and rapidly adapting afferents help adjust grip force when lifting objects.
The skin contains various types of mechanoreceptors, both free receptors and encapsulated receptors.

Page 2:
Mammalian muscle spindles have sensory endings that detect stretch and provide feedback for motor control.
Rapidly adapting afferent activity from touch receptors triggers reflexive muscle force increases.
Slowly adapting Merkel's receptors mediate form and texture perception, with higher density in digits and around the mouth.
Pacinian corpuscles detect vibration, while Ruffini corpuscles respond to lateral skin movement or stretching.
Nociceptors are free nerve endings that detect high-threshold mechanical or thermal stimuli as pain.

Page 3:
Rapidly adapting and slowly adapting surface receptors (e.g., hair receptors, Meissner's corpuscle, Merkel's receptor) detect different types of mechanical stimuli.
Deep receptors with large receptive fields (e.g., Pacinian corpuscle, Ruffini's corpuscle) detect diffuse vibrations and skin stretch.
Polymodal receptors respond to intense mechanical, thermal, and chemical stimuli, and transmit pain signals.
Pain signals can be separated into different components (first pain, second pain, deep pain) based on transmission speed and localization.
Muscle spindles are stretch receptors scattered throughout striated muscles, consisting of intrafusal fibers attached to extrafusal fibers.

Page 4:
Force control signal
Length control signal
Load and external forces
Tendon organs and muscle force/length feedback
Muscle spindles and joint receptors
```

</details>

---


## Condition 


Evaluate a condition. If true continue processing the attached chain.  If false, break out of the chain and continue to the next node in the flow. Use single quotes around text string to compare them.
:::note[Parameters]

- **value**: A condition to evaluate
:::

```
{{ condition | value: "1 == 1" }}
```

<details>
<summary>Example usage</summary>

**Example set 1:** Basic
```
{{ condition  | value: "1 == 1" }}=>This is true!
```
Will yield the output text: `This is true!`
```
{{ condition  | value: "(5 + 5) == 10" }}=>This is true!
```
Will yield the output text: `This is true!`
**Example set 2:** OR, AND
```
{{ condition  | value: "OR(1==1, 2==3, 1==2, 1==1)" }}=>This is true!
```
Will continue the chain and yield the output text: `This is true!`.
```
{{ condition  | value: "AND(1==1, 2==2, 3==3, 4==4)" }}=>This is true!
```
Will continue the chain and yield the output text: `This is true!`.
```
{{ condition  | value: "OR(1==2,2==3)" }}=>This is true!
```
Will stop the chain and yield no output, as the chain was blocked with a false condition.
**Example set 3:** Strings
```
{{ condition  | value: "'name' == 'name'" }}=>This is true!
```
Will yield the output text: `This is true!`
```
{{ condition  | value: "CONTAINS('this is a test string', 'test')" }}=>This is true!
```
```
{{ condition  | value: "CONTAINS('<< name: variableContainingTest, prompt: false >>', 'test')" }}=>This is true!
```
Both will yield the output text: `This is true!`
```
{{ condition  | value: "LENGTH('Hello World') > 5" }}=>This is true!
```
Will yield the output text: `This is true!`
```
{{ condition  | value: "(LENGTH('<< name: variableContainingTest, prompt: false >>') + 12) > 10" }}=>This is true!
```
Will yield the output text: `This is true!`

</details>

**For more:** See the "Conditional Logic" Example Template for a working example on routing chains based on a variable value:

![Conditional mAIstro Example](/img/maistro/ntl/control-flow/conditionals.png)


    

---


## Stream a string 


Send a string to the client when response streaming is enabled
:::note[Parameters]

- **string**: The text to stream (leave blank for current input)
:::
