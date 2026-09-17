---
title: "watsonx Assistant streaming"
description: "Unlock a dynamic user experience with mAIstro NTL Endpoint and Watsonx Assistant! Learn to enable streaming for faster, interactive chatbot responses. Follow our step-by-step guide to enhance engagement."
---

## Overview

**What is it?**

- It’s an endpoint called **`/maistro_stream`** that you’ll find in our **Integrate** tab.

:::note
This endpoint is designed to support streaming responses from both the LLM and the mAIstro Agent.
:::

**Why is it important?**

- Streaming responses create the impression of a faster, more interactive experience by displaying the reply as it’s being formed. This immediate feedback enhances the overall user experience.

:::tip
Enabling streaming can make your chatbot feel more responsive, which is especially useful when handling longer responses or complex queries.
:::

**How does it work?**

- To enable a more dynamic and responsive user experience, first enable streaming in mAIstro and on your LLM nodes. Then, set up your Watsonx Assistant Chatbot following the IBM Focus lab instructions, modify the extension configuration by setting the correct operation and parameters, and enable streaming in Watsonx Assistant. Finally, verify the streaming behavior with the provided demo.

### Enable Streaming in mAIstro

- **Toggle the streaming feature:**  
  Locate the streaming option at the bottom right of mAIstro and enable it.

- **LLM Node Configuration:**  
  In every LLM node that should support streaming (ideally the final LLM call), set the option `enable_streaming`.

![enablestreaming](/img/integrations/watsonx-assistant-streaming/enablestreaming.png)

---

### Configure Watsonx Assistant Chatbot

Follow steps **1.2** and **1.3** in our [Learning Lab IBM Focus](https://labs.neuralseek.com/module1/module1_ibm/ibm_module1-2/ibm_module1-2/) to set up your Watsonx Assistant Chatbot.

---

### Modify the Extension Configuration

1. **Navigate to the Actions Tab:**

    - Select the extension you created.
    - Click on the step where you want to use the extension.
    - Click **Edit Extension**.

2. **Configure the Extension:**

    - **Extension Selection:** Choose the extension you previously created.
    - **Operation:** Set it to **`Stream mAIstro NTL or an agent`**.

3. **Set Your Parameters:**

    - **Agent Name:** Set `agent` to the name of the mAIstro agent you want to call.
    - **Optional Parameter:** Due to a known Watsonx Assistant bug, set an optional parameter, for example `timeout` to an appropriate value. This ensures streaming behaves correctly.
    - **Parameters Example:** Define your parameters (either as variables or expressions) that your agent expects. For example:
    ```json
    [
      {
        "name": "question",
        "value": "userQuery" // 'userQuery' is a session variable provided by the user
      }
    ]
    ```

4. **Stream Response Option:**

    - Scroll to the bottom and set the **Stream response** option to `chunk`.

5. **Save Your Changes:**

    - Click **Apply**.
    - Remember to hit the **Save** button in the top left corner of your window.

![streamendpoint](/img/integrations/watsonx-assistant-streaming/streamendpoint.png)

---

### Enable Streaming in Watsonx Assistant

1. **Go to the Preview Tab:**

    - Navigate to the Preview Tab in your IBM Watsonx Assistant menu.

2. **Toggle Streaming On:**

    - Turn the streaming toggle on to enable the feature.

![streamingfwatson](/img/integrations/watsonx-assistant-streaming/streamingfwatson.png)

---

### Final Behavior

After configuring all settings, your system should behave as demonstrated below:

![final](/img/integrations/watsonx-assistant-streaming/finalresult.png)
