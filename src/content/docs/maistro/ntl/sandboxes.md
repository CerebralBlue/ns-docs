---
title: "Sandboxes"
description: "Run arbitrary javascript ESM code."
---

## Javascript Sandbox 


Run arbitrary javascript ESM code. You must use import and not require (CJS)
:::note[Parameters]

- **script**: The script

- **maxTime**: 
    - **text**: Max execution time in MS
    - **min**: 100
    - **max**: 30000
    - **step**: 1
    - **default**: 1000
:::

---


## Python Sandbox 


Run arbitrary Python code.
:::note[Parameters]

- **script**: The script

- **maxTime**: 
    - **text**: Max execution time in MS
    - **min**: 100
    - **max**: 30000
    - **step**: 1
    - **default**: 1000
:::

```text
{{ pythonSandbox | script: "Python code to run" | maxTime: "Max execution time"  }}
```

![python_sandbox](/img/maistro/ntl/sandboxes/python_sandbox.png)
<details>
<summary>Example Usage 1</summary>

Let's create a script to calculate a falling object velocity:
```text
<< name: timeInput, prompt: "Enter time in seconds:">>
{{ LLM  | prompt: "Write Python to calculate the velocity of an object after free fall for a given time which is: << name: timeInput, prompt: false >>. Make sure to output just the code with no explanations" | cache: "true" }}=>{{ extractCode  }}=>{{ variable  | name: "code" }}
{{ pythonSandbox  | script: "<< name: code, prompt: false >>" | maxTime: "1000" }}=>{{ variable  | name: "codeResult" | mode: "" | value: "" }}
The velocity of an object after free fall for << name: timeInput, prompt: false >> seconds is << name: codeResult, prompt: false >>
```
Will yield something like:
```plain
The velocity of an object after free fall for 10 seconds is 98 m/s
```

</details>

<details>
<summary>Example Usage 2</summary>

Let's create a script to calculate circle area based on its radius:
```text
<< name: radiusInput, prompt: "Enter the radius of the circle:">>
{{ LLM  | prompt: "Write Python to calculate the area of a circle given the radius: << name: radiusInput, prompt: false >>. Make sure to output just the code with no explanations" | cache: "true" }}=>{{ extractCode  }}=>{{ variable  | name: "code" }}
{{ pythonSandbox  | script: "<< name: code, prompt: false >>" | maxTime: "1000" }}=>{{ variable  | name: "codeResult" | mode: "" | value: "" }}
The area of the circle with radius << name: radiusInput, prompt: false >> is << name: codeResult, prompt: false >>
```
Will yield something like:
```plain
The area of the circle with radius 12 is 452.3893421169302
```

</details>

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Custom Connector — call another agent as an isolated connector (not in the node menu)
-->
