---
title: 'Workflow or agent, and why the distinction matters'
description: 'The clearest public writing on when an agent loop beats a fixed workflow.'
pubDate: 2026-08-28
url: https://www.anthropic.com/engineering/building-effective-agents
source: 'Anthropic Engineering'
topics: [agentic-development, ai-news, patterns]
draft: false
placeholder: true
---

The clearest answer I have found to whether something should be an agent
or a fixed workflow: if the steps are known in advance, write a workflow;
if the decision tree only opens up at runtime, write an agent. Reading
this made me realise that half of my own setups were agents for no good
reason.
