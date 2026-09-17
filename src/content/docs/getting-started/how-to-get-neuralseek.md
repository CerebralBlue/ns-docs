---
title: "How to get NeuralSeek"
description: "The plans NeuralSeek is sold under, what each one includes, and how to get an instance. Deployment and platform detail lives in Reference > Deployment."
---

## Pay-per-answer
Create natural language answers to user questions based on your raw Corporate KnowledgeBase. This plan uses our curated LLM and does not offer connectivity to other LLMs. All other features are available with this plan. The NeuralSeek Curated LLM is kept pinned to the industry's highest price-performing LLM.  Specifics such as exact LLM used for the curated LLM are discussable only under NDA with Cerebral Blue.  We automatically update the underlying minor version of the LLM, and major version changes are controllable by the end user. The BYOLLM (Bring your own LLM) plan is available if you require a specific LLM.

This plan's features include, but are not limited to:

- Automatic catalog, curation and grouping of questions and answers 
- Export to a Virtual Agent
- Round-trip monitoring to a Virtual Agent
- Sentiment scoring
- Automatic language detection
- Translate text into other languages
- Extract Entities from text
- Categorize text by matching categories and matching or creating Intents
- Connect to any supported KnowledgeBase, including Watson Discovery, Watsonx Discovery, Elastic, Kendra, pinecone, Milvus, or a Virtual KB based on any connection in mAIstro...

## Flex
The NeuralSeek Flex plan is a bring-your-own LLM plan featuring unlimited usage, and a flex license allowing you to optionally and additionally install NeuralSeek components on your hardware, behind your firewall as needed to meet your security requirements while you are subscribed to this flex plan. All NeuralSeek features are supported on this plan. 

This plan's features include, but are not limited to:

- Automatic catalog, curation and grouping of questions and answers 
- Export to a Virtual Agent
- Round-trip monitoring to a Virtual Agent
- Sentiment scoring
- Automatic language detection
- Translate text into other languages
- Extract Entities from text
- Categorize text by matching categories and matching or creating Intents
- Unlimited instances within a deployment to allow for logical separation of usecases
- Connect to any supported LLM
- Connect to any supported KnowledgeBase, including Watson Discovery, Watsonx Discovery, Elastic, Kendra, pinecone, Milvus, or a Virtual KB based on any connection in mAIstro

Each base instance (or install) is licensed for 10,000 users. Additional users may be added in blocks of 10,000. 

:::note
Upon Flex plan purchase, we provide a free working session (up to 1 hour) designed to guide users live through the installation process and grant access to the docker repository. This is generally sufficient time to complete product installation with basic authentication. Integrating Single Sign-on (SSO) may take additional time.
:::

### On-Premise Details
The Flex plan grants license for you to install NeuralSeek on-premise or on your cloud provider of choice, on your your hardware, behind your firewall to meet security requirements. The flex plan allows for complete network isolation, as well as projects that require compliance with FedRamp, GovCloud, and HIPAA regulations. Neuralseek on-premise runs as containers on top of OpenShift (OCP) or Kubernetes.

#### Installation Requirements
Minimum sizing requirements for on-prem installation include: 

- 12 Core CPU
- 64 GB RAM/Memory
- 100 GB Available Disc Space
- If self-hosting an LLM (not using watsonx.ai or sagemaker) your self-hosted LLM will require a GPU VM that is equivalent or better to a single NVIDIA A10G

#### Installation Steps

1. Log onto Red Hat OpenShift console with appropriate domain.
2. Modify the appropriate .yml file with the corresponding hostname OpenShift external URL. 
    - .yml files are provided during consultation meeting.
3. Verify connectivity to the Cerebral Blue docker in .yml files. 
    - Permission access will be granted during consultation meeting. Provide the appropriate username.
4. Copy the contents of the .yml files into your OpenShift console by clicking the plus icon, then click create. 
5. Route will be created manually by navigating to **Networking → Routes → Create Route**.
    - Add a unique name. 
    - Select the service to route to.
    - Select the target port for traffic.
    - Optionally, provide a TLS certificate. Default will set to HTTP. 
6. Click the link to the route to open the NeuralSeek User Interface. 

:::note
It will take approximately 15 minutes for the pods to run. View their status in the OpenShift console under **Workloads → Pods**. 
:::

## Bring-your-own-LLM
Leverage all of NeuralSeek's features, but instead of using our curated LLM, you can connect via our no-code connectors to leading commercial and open-source LLM's. This enables you to run within a single datacenter or country, or choose the commercial LLM that best fits your business and pricing needs.

**Refer to our Integrations documentation for a list of supported LLM's.**

This plan's features include, but are not limited to:

- Automatic catalog, curation and grouping of questions and answers 
- Export to a Virtual Agent
- Round-trip monitoring to a Virtual Agent
- Sentiment scoring
- Automatic language detection
- Translate text into other languages
- Extract Entities from text
- Categorize text by matching categories and matching or creating Intents
- Connect to any supported LLM
- Connect to any supported KnowledgeBase, including Watson Discovery, Watsonx Discovery, Elastic, Kendra, pinecone, Milvus, or a Virtual KB based on any connection in mAIstro

## Search
The Search Plan is for use cases not requiring a Virtual Agent. NeuralSeek provides a search interface to supported KnowledgeBases, and will provide search responses plus generative AI summaries. Any generated AI summary incurs a per-call usage fee. Cache responses are included at no additional cost. This plan uses our curated LLM and does not offer connectivity to other LLMs. The NeuralSeek Curated LLM is kept pinned to the industry's highest price-performing LLM.  Specifics such as exact LLM used for the curated LLM are discussable only under NDA with Cerebral Blue.

This plan's features are identical to the pay-per-answer plans EXCEPT: 

- No export to a Virtual Agent is allowed
- No round-trip monitoring to a Virtual Agent is allowed
- No sentiment scoring
- No automatic language detection

## Small Business
The Small Business plan is the easiest plan to get NeuralSeek running in minutes with no experience required. This plan is pre-connected to both our curated LLM and a KnowledgeBase, and you cannot swap these out. Simply point NeuralSeek at your website or upload documents, connect to a Virtual Agent, and go-live! This plan uses our curated LLM and does not offer connectivity to other LLMs. All other features are available with this plan. The NeuralSeek Curated LLM is kept pinned to the industry's highest price-performing LLM.  Specifics such as exact LLM used for the curated LLM are discussable only under NDA with Cerebral Blue.

This plan's features include, but are not limited to:

- Automatic catalog, curation and grouping of questions and answers 
- Export to a Virtual Agent
- Round-trip monitoring to a Virtual Agent
- Sentiment scoring
- Automatic language detection
- Translate text into other languages
- Extract Entities from text
- Categorize text by matching categories and matching or creating Intents

&nbsp;

&nbsp;

**For cloud-specific available plans, see cloud provider for up-to-date cost information.**

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Renamed from 'Deployment options' per Robert's review (2026-08-04)
  - Boundary: plans, pricing model and purchasing live here; platform/deployment mechanics live in reference/deployment
  - Support plans — Home > Update Support Plan bills immediately, then rebills every 30 days (cross-link configuration/administration/support-plans)
-->
