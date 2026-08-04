---
title: "Replay"
description: "Explore NeuralSeek's Replay feature to revisit past Q&As, track documentation changes, and see how answers evolve. Perfect for understanding updates and refining your knowledge."
---

**What is it?**

- The Replay feature in NeuralSeek enables users to revisit previously logged questions and their corresponding answers, semantic analysis, and the KnowledgeBase documentation used to generate the response at that point in time. 

**Why is it important?**

- As documentation in our KnowledgeBase gets updated, questions on the Seek tab get updated to account for that new information. As a result, a user could ask a question identical to one asked previously and receive a completely different answer if the documentation has been significantly changed. If one wants to go back to a previous response and notice the changes that occurred in the documentation to see how the answers evolve, the Replay feature is very useful to get some insight.

**How does it work?**

- First, check to make sure that you have Corporate Logging enabled with an instance of Elasticsearch. You can find the settings for Corporate Logging underneatch the `Configure` tab.

![corporate-logging](/img/governance/replay/corporate-logging.png)

- Navigate to the `Logs` tab on Neuralseek. There, you will find a log of all previously asked questions and answers from the `Seek` tab. Notice the small icon underneath the answer that resembles a clock turning backward. By clicking on it, you will be taken to the page as it appeared at that specific point in time.

![location](/img/governance/replay/location.png)

![previous-answer](/img/governance/replay/previous-answer.png)
![previous-context](/img/governance/replay/previous-context.png)

- If the documentation used to answer the question has been updated, you can compare and contrast the results by asking the same question in the `Seek` tab.

![current-answer](/img/governance/replay/current-answer.png)
![current-context](/img/governance/replay/current-context.png)


<!-- MERGE: everything below came from guides/data/replay_guide/index.md. Fold it into the sections above, then delete this comment. -->


**What is it?**

- The Replay feature in NeuralSeek enables users to revisit previously logged questions and their corresponding answers, semantic analysis, and the KnowledgeBase documentation used to generate the response at that point in time. Replay can also be enabled for mAIstro flows, allowing you to revist the point in time when an AI Agent was evaulated in mAIstro for debugging or other tracking purposes.

**Why is it important?**

- As documentation in our KnowledgeBase gets updated, questions on the Seek tab get updated to account for that new information. As a result, a user could ask a question identical to one asked previously and receive a completely different answer if the documentation has been significantly changed. If one wants to go back to a previous response and notice the changes that occurred in the documentation to see how the answers evolve, the Replay feature is very useful to get some insight. Replay also allows us to track when an AI Agent runs successfully or not. By reviewing the Replay log for the mAIstro agent, then we can inspect the debugger icon at each step to analyze what steps were performed, and what was generated, during the run. 

**How does it work?**

- First, check to make sure that you have Corporate Logging enabled with an instance of Elasticsearch. You can find the settings for Corporate Logging underneatch the `Configure` tab.

![corporate-logging](/img/governance/replay/corporatelogging.jpg)

- Navigate to the `Governance` tab on Neuralseek, and click on the **Seek Logs** page from the sidebar. There, you will find a log of all previously asked questions and answers from the `Seek` tab. 
- Notice the small icon underneath the answer that resembles a clock turning backward. By clicking on it, you will be taken to the page as it appeared at that specific point in time.

![location](/img/governance/replay/seek1.png)

![previous-answer](/img/governance/replay/seek2.png)
![previous-context](/img/governance/replay/seek3.png)

- Repeat the above steps for **mAIstro Logs** as well. 

![mAIstro-logs](/img/governance/replay/mAIstro_logs.png)
![mAIstro_replay](/img/governance/replay/mAIstro_replay.png)

- If the documentation used to answer the question has been updated, you can compare and contrast the results by asking the same question in the `Seek` tab.

![current-answer](/img/governance/replay/seek4.png)
![current-context](/img/governance/replay/seek5.png)
