---
title: "Control Flow"
description: "The nodes that manage a flow's execution: conditions, variables, loops, delay, and stop."
---

## Comment

This node allows for comments and description of surrounding NTL

:::note[Parameters]

- **nsdescription**: Comments
:::

---

## Condition

Evaluate a condition. If true continue processing the attached chain. If false, break out of the chain and continue to the next node in the flow. Use single quotes around text string to compare them.

:::note[Parameters]

- **value**: A condition to evaluate
:::

---

## Set a Variable

Collect all current flowing text into this node, and set it to a variable for use in later steps. You can also use this to clear existing text.

:::note[Parameters]

- **name**: The name of the variable

- **mode**: Overwrite (default) or Append to this variable

- **value**: (Optional) Directly set the value. Leave this blank to collect the input to this node.
:::

---

## Delete a Variable

Delete a variable.

:::note[Parameters]

- **name**: The name of the variable
:::

---

## Loop

Loop for a set number of times. Use the Break Loop node to stop the loop early

:::note[Parameters]

- **count**: 
    - **text**: The times to loop unless a loop break is received
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 2
:::

---

## End Loop

Close a Loop, running any remaining steps in the loop body before the next iteration. The sleep option delays the start of the next iteration.

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

Break Loop stops a loop early. Use it in conjunction with the condition node.

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

## Video Loop

Break a video down to still frames and loop thru the frames. Each iteration of the loop will populate 2 variables:

videoLoopFrame - the frame number

videoLoopImage[0-x] - the frame as a jpg

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

---

## PDF Loop

Split a PDF by page and loop thru the pages as both text and images. Each iteration of the loop will populate 3 variables:

pdfLoopPage[0-x] - the page number

pdfLoopText[0-x] - the text on the page

pdfLoopImage[0-x] - a png image of the page

:::note[Parameters]

- **file**: PDF File

- **pagesPerLoop**: 
    - **text**: Pages per loop (create additional variables to do parallel calls inside the loop)
    - **min**: 1
    - **max**: 20
    - **step**: 1
    - **default**: 1
:::

---

## Variable Loop

Loop on an array variable, iterating thru each element of the array

:::note[Parameters]

- **variable**: The base variable name

- **loopType**: The type of input object (defaults to 'array-strings')

- **consumeDelete**: Delete the variable as it is looped thru

- **reverse**: Iterate over the variables in reverse order

- **itemsPerLoop**: 
    - **text**: Number of items to load per iteration (1-10, default 1). Exposes loopValue0-9 and loopObject0-9.
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 1
:::

---

## Delay

Delay for a set time

:::note[Parameters]

- **sleep**: 
    - **text**: Amount of time in milliseconds to delay
    - **min**: 10
    - **max**: 60000
    - **step**: 100
    - **default**: 1000
:::

---

## Stop

Stop all further processing
