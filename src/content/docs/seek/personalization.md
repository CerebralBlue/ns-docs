---
title: 'Personalization'
description: 'Adjust Seek answers per user from CRM data you pass on the request — what Dynamic Personalization changes, and when it is worth turning on.'
---

## What is it

Dynamic Personalization adjusts the answer NeuralSeek generates using information about the
person asking. You supply that information — typically from your CRM: past interactions,
preferences, purchase history, demographics — and NeuralSeek shapes the response around it
rather than answering the same way for everyone.

It changes how an answer is written for a given user. It does not change which documents are
searched; that is [Dynamic filters](/seek/dynamic-filters/).

## Why it matters

A generic answer is correct and still unhelpful. A customer on an enterprise plan asking about
limits does not want the free-tier number, and a returning buyer does not want to be told what
they already own. Personalized answers hold attention better, which shows up as higher
satisfaction and higher containment — fewer conversations escalating to a human.

It is the wrong thing to reach for if you have no per-user data to pass. Personalization is
driven entirely by what you send on the request; with nothing to send, it has nothing to work
with and you gain only the overhead.

## When to use it

- You already hold user context in a CRM and can attach it to the request.
- Answers differ by plan, entitlement, region or purchase history.
- You are trying to raise containment on a support surface where the generic answer is
  technically right but not actionable for the person reading it.

## How it works

You can preview personalization in the **Seek** tab of the NeuralSeek console, which is the
fastest way to see how a given user's details change an answer before any integration work.

In production you pass the personalization details on the REST call to `/seek`. The values ride
with the request, so they can be different on every call — nothing is stored against a user
between requests.

The pipeline surface is a **Personalization In/Out** node pair, which is what lets an agent read
and rewrite the personalization payload as it passes through. See
[Pipeline hooks](/maistro/ntl/pipeline-hooks/).

## FAQ

### Where does the personalization data come from?

From you. NeuralSeek does not connect to your CRM by itself — you read the user's details from
whatever system holds them and attach them to the `/seek` request.

### Can I try it without writing any integration code?

Yes. The Seek tab previews it in the console, so you can see the effect on real answers before
deciding whether the integration is worth building.
