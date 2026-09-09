---
title: "Multimodal nodes"
description: "Nodes that work on audio and images rather than text."
---

## Generate Image Edit

This node takes all text flowing into it and sends it to an image LLM. If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes. Be sure that any text being sent to this node has new prompting to send to the LLM.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **name**: An optional image filename

- **images**: Base64 encoded image strings to use in the edit generation

- **cache**: Cache and reuse LLM response for identical requests

- **modelCard**: Override the default mAIstro LLM
:::

---

## Generate Image

This node takes all text flowing into it and sends it to an image LLM. If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes. Be sure that any text being sent to this node has new prompting to send to the LLM.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **name**: An optional image filename

- **cache**: Cache and reuse LLM response for identical requests

- **modelCard**: Override the default mAIstro LLM
:::

---

## Generate Video

This node takes all text flowing into it and sends it to an video LLM. If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes. Be sure that any text being sent to this node has new prompting to send to the LLM.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **image**: An image to use in the generation

- **seconds**: 
    - **text**: Video Length
    - **min**: 4
    - **max**: 12
    - **step**: 4
    - **default**: 4

- **cache**: Cache and reuse LLM response for identical requests

- **modelCard**: Override the default mAIstro LLM
:::

---

## Video Frame

This node is used to extract a frame from a video.

:::note[Parameters]

- **video**: Video file

- **frame**: Which frame to extract
:::

---

## FFMpeg

This node is used to transform multimedia with ffmpeg.

:::note[Parameters]

- **video**: Media file

- **inputOptions**: An array of arrays of input options

- **outputOptions**: An array of arrays of output options

- **outputFile**: The output filename
:::

---

## Join Media

This node is used to join multimedia files.

:::note[Parameters]

- **files**: The files to join

- **outputFile**: The output filename
:::

---

## Merge Audio Video

This node is used to Merge Audio and Video.

:::note[Parameters]

- **audio**: The audio file (.mp3)

- **video**: The video file (.mp4)
:::

---

## Generate Speech

This node takes all text flowing into it and sends it to a text-to-speech model. If you set the "prompt" option, that will prepend an additional prompt to any text flowing in from previous nodes. Be sure that any text being sent to this node has new prompting to send to the model.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **instructions**: Additional instructions to the model

- **voice**: The voice to use

- **speed**: 
    - **text**: The speed of the speech
    - **min**: 0.25
    - **max**: 4
    - **step**: 0.01
    - **default**: 1

- **format**: The output format

- **cache**: Cache and reuse LLM response for identical requests

- **modelCard**: Override the default mAIstro LLM
:::

---

## Speech to Text

This node takes an audio file and sends it to a speech-to-text model, returning the transcribed text.

:::note[Parameters]

- **prompt**: A prompt to prepend to the LLM input

- **cache**: Cache and reuse LLM response for identical requests

- **modelCard**: Override the default mAIstro LLM
:::

---

## OCR

OCR an image.

:::note[Parameters]

- **name**: The image name
:::
