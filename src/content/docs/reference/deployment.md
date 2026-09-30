---
title: "Deployment"
description: "NeuralSeek runs either as a SaaS service or, under the Flex plan, installed on your own hardware on OpenShift or Kubernetes; this page covers what changes in the product on each, and how an on-prem install is sized and installed."
---

## What is it

NeuralSeek can run in two places: as a hosted SaaS service, or installed on-prem — on your
own hardware or your own cloud account — under the licence that comes with the Flex plan. This
page covers the mechanics of each: where the product runs, which parts of the console differ, what
an install needs and how it is put in place.

It does not cover plans or prices. Those are on [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/),
and the full list of features that depend on your plan or platform is on
[Plans & platforms](/reference/plans-and-platforms/).

## Why it matters

Where NeuralSeek runs decides two things you cannot change later with a setting. The first is
network reach: a SaaS instance lives on a provider's cloud, while an on-prem install sits behind
your firewall ([SaaS, on-prem and Flex](#saas-on-prem-and-flex) covers the network isolation and
compliance projects it supports). The second is what you see in the console: a few items of the
navigation bar and of **Neural Config** behave differently on an on-prem install, so a guide written against the SaaS console may point at a
screen your install does not have.

## When to use it

Read this page when:

- you are deciding between a SaaS instance and an on-prem install, for example because your data
  may not leave your network;
- you are preparing hardware for a Flex install and need the minimum sizing;
- a page of these docs names a console item — **KnowledgeBase**, for instance — that your install
  does not show.

If you only need a working instance to try NeuralSeek, SaaS is the shorter path: there is nothing to
install. On-prem is the wrong tool when nothing in your security or compliance requirements asks
for it.

## How it works

### SaaS, on-prem and Flex

<!-- UNCONFIRMED: SaaS runs on hyperscalers; the Flex plan licenses an on-prem install on your hardware or cloud, behind your firewall, with full network isolation for FedRamp, GovCloud and HIPAA projects; on-prem NeuralSeek runs as containers on OpenShift (OCP) or Kubernetes — from the previous version of this page -->

**SaaS.** NeuralSeek is hosted for you on a public cloud provider, and you open the console in a
browser.

**On-prem.** NeuralSeek is installed on your hardware, or on the cloud provider of your choice
under your own account, behind your firewall. It runs as containers on top of Red Hat OpenShift
(OCP) or Kubernetes. Because nothing has to leave your network, an on-prem install supports
complete network isolation and projects that must comply with FedRamp, GovCloud or HIPAA rules.

**Flex.** Flex is the plan that grants the on-prem licence. While you are subscribed to Flex, you
may optionally install NeuralSeek components on your own infrastructure as your security
requirements need. Flex is a bring-your-own-LLM plan, so an on-prem install connects to a model you choose —
a hosted one, or one you run yourself (see [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/)).

What stays the same across all three: the console, its screens and the configuration model
described in the rest of these docs. What changes is listed in the next section.

### What changes on on-prem

![The SaaS console's navigation bar above a Seek answer: Home, Neural Config, Seek, KnowledgeBase, mAIstro, NeuralEdit, Governance, Run Agents and Admin Tools](/img/home/seek--knowledgebase-context.png)

The screenshot shows the navigation bar of a SaaS console. Two of its items behave differently on
an on-prem install.

<!-- UNCONFIRMED: on on-prem installs the KnowledgeBase (Document Manager) navbar item is not shown, and Secrets behave differently than on SaaS (how is not documented) — from the gap list of this route in the route map; no on-prem console has been captured -->

- **KnowledgeBase** — on SaaS, this navbar item opens the
  [Document Manager](/knowledge/document-manager/), where you search the documents indexed on your
  instance and delete the ones you no longer want retrieved. On an on-prem install the item is not
  shown.
- **Neural Config** — its **Edit Configuration** dialog ends with the **Secrets** section, where
  you store values that mAIstro flows use as variables (see [Secrets](/configuration/neural-config/secrets/)).
  On an on-prem install, Secrets behave differently from SaaS. Check the behaviour on your own
  install before you rely on a secret in a flow.

:::note
If another page of these docs sends you to one of these items and your console does not have it,
this section is the reason. [Plans & platforms](/reference/plans-and-platforms/) lists every
feature that depends on plan or platform.
:::

### Flex: sizing and instances

<!-- UNCONFIRMED: minimum on-prem sizing 12-core CPU, 64 GB RAM, 100 GB disk; a self-hosted LLM needs a GPU VM equal to or better than one NVIDIA A10G; each base instance is licensed for 10,000 users, extendable in blocks of 10,000; unlimited instances within a deployment — from the previous version of this page -->

An on-prem install needs at least:

| Resource | Minimum                          |
| -------- | -------------------------------- |
| CPU      | 12 cores                         |
| Memory   | 64 GB RAM                        |
| Disk     | 100 GB available                 |
| GPU      | Only if you self-host the LLM    |

If you run your own LLM instead of connecting to a hosted one (such as watsonx.ai or SageMaker),
that model needs a GPU virtual machine equal to or better than a single NVIDIA A10G. The inference
servers NeuralSeek supports for this are on [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

**Users.** Each base instance (one install) is licensed for 10,000 users. You add more users in
blocks of 10,000.

**Instances.** Within one deployment you can create as many instances as you need, to keep use
cases logically separate.

Reporting your installs and users and downloading the licence file are covered on
[Flex licensing](/configuration/administration/flex-licensing/).

### Installing on OpenShift

<!-- UNCONFIRMED: OpenShift install outline — yml files and access to the Cerebral Blue docker registry are provided in the consultation meeting; route created under Networking → Routes → Create Route (name, service, target port, optional TLS, HTTP by default); pods take about 15 minutes, visible under Workloads → Pods; the free working session (up to 1 hour) usually covers basic authentication, SSO can take longer — from the previous version of this page -->

Installation is done together with NeuralSeek in a working session after a Flex purchase (see
[How to get NeuralSeek](/getting-started/how-to-get-neuralseek/)). In that session you receive the
`.yml` files for your install and access to the Cerebral Blue container registry. The outline is:

1. Log in to the Red Hat OpenShift console for the right domain.
2. In the `.yml` files, set the hostname to your OpenShift external URL.
3. Check that the `.yml` files can reach the Cerebral Blue container registry with the user name you
   were given access for.
4. Paste the contents of the `.yml` files into the OpenShift console with the plus icon, then click
   **Create**.
5. Create the route by hand under Networking → Routes → Create Route: give it a unique name,
   select the service to route to and the target port, and optionally add a TLS certificate (without
   one, the route uses HTTP).
6. Open the route's link to reach the NeuralSeek console.

The pods take about 15 minutes to start. Follow their status in the OpenShift console under
Workloads → Pods. Basic authentication usually fits in the working session; connecting single
sign-on (SSO) can take longer.

## FAQ

**Can NeuralSeek run without internet access?**
The option to look at is an on-prem install under the Flex plan, on your own OpenShift or
Kubernetes cluster behind your firewall; [SaaS, on-prem and Flex](#saas-on-prem-and-flex) describes
the network isolation it supports. If your install connects to a hosted LLM, check where that model
runs; to run the model yourself, see
[Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

**Why don't I see KnowledgeBase in my navbar?**
On an on-prem install the **KnowledgeBase** item, which opens the Document Manager, is not shown. See
[What changes on on-prem](#what-changes-on-on-prem), and [Plans & platforms](/reference/plans-and-platforms/)
for every other condition that hides a feature.

**What hardware does an on-prem install need?**
At least a 12-core CPU, 64 GB of RAM and 100 GB of free disk, plus a GPU equal to one NVIDIA A10G
if you host the LLM yourself. See [Flex: sizing and instances](#flex-sizing-and-instances).

**How many users does one Flex instance cover?**
Each base instance is licensed for 10,000 users, and you add more in blocks of 10,000. Within one
deployment you can run as many instances as you need.

**Where do I find the plans and prices?**
On [How to get NeuralSeek](/getting-started/how-to-get-neuralseek/).
