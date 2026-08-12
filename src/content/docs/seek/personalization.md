---
title: "Personalization"
description: "Discover how NeuralSeek's Dynamic Personalization leverages CRM data to tailor results, boosting user engagement and satisfaction."
---

**What is it?**

- One way NeuralSeek quickly ties into the users business is by automatically personalizing results based on information from their Customer Relationship Management (CRM) system. By analyzing user data such as past interactions, preferences, purchase history, and demographic information, NeuralSeek can dynamically adjust its outputs to match the specific needs and preferences of each individual user.

**Why is it important?**

- Personalized answers tend to engage users more, and can result in higher satisfaction and containment.

**How does it work?**

- This can be previewed in the Seek tab of the NeuralSeek UI, and in production environments users will pass the personalization details via our API as the REST call to when /seek is made.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Enable Dynamic Personalization — the on/off switch (Neural Config > Toggle Advanced)
  - Personalization agent — the agent that adjusts answers using the personalization details
  - Its NTL surface: the Personalization In/Out node pair (cross-link maistro/ntl/pipeline-hooks)
  - Its test surface: the Seek > Personalize modal
-->
