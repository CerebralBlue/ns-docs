---
title: "Multimodal LLM configuration"
description: "Discover how to configure multimodal LLMs like GPT-4o to process images. Follow step-by-step instructions to set up, test connections, and utilize Maistro for image analysis."
---

## Steps to Configure the LLM

To begin, navigate to the Configure tab and locate the LLM Details section. 

![LLM details](/img/configuration/multimodal/llmdetails3.png)

Click on "Add an LLM" and choose a model that can process images, such as OpenAI GPT-4o. 


![Select LLM](/img/configuration/multimodal/selectllm.png)

Once selected, add the model and enter the necessary connection details, which, for GPT-4o, would be the API Key. 

Test the connection by clicking the Test button and ensure the button turns green, indicating a successful connection. 


![Successful LLM](/img/configuration/multimodal/successtestllm.png)


Save the configuration and provide a meaningful name for the version. 

## Steps to Process an Image

Next, switch to the Maistro tab to upload an image. Use the left side pane to search for "Upload data" and then select "Upload a File" under that section. 

After selecting the local file, a local document node will be created. You can use the "Local Document" button to access a dropdown menu that shows all your locally uploaded files, and select the image you uploaded as your choice.

```
    << name: img, prompt: true, desc: Enter image file name >>
```

![Local document node](/img/configuration/multimodal/localdocument.png)

If you plan to use this image for different purposes, it’s best to set it as a variable. Add a set variable node to the right of the local document node and give the variable a descriptive name. 


![Local document node](/img/configuration/multimodal/setvariablenode.png)

Below these nodes, add a send to LLM node. For the prompt, you can use:

```
What is this a picture of?
```

For the image, reference the variable you defined earlier:

```
  << name: img, prompt:false >>
```

And the node should be end up like this:

![Complete template](/img/configuration/multimodal/sendtollmnode.png)

Select an LLM that supports reading images, such as GPT-4o. 

Press the Evaluate button. You will be prompted to enter the name of the image file you want to process, including its file extension. Once entered, the setup will allow Maistro to describe the image.

![Complete template](/img/configuration/multimodal/maistroworkflow.png)


:::note
This is a basic example, but you can expand on this logic to achieve more complex procedures.
:::
