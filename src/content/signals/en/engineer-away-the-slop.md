---
title: 'Engineer away the slop'
description: 'On treating low-quality agent output as an engineering problem rather than a model problem.'
pubDate: 2026-07-25
url: https://ghuntley.com/slop/
source: 'Geoffrey Huntley'
topics: [agentic-development, quality]
draft: false
placeholder: true
---

Treats low-quality agent output as an engineering problem rather than a
model-quality one: if the rules are not written down, the checks are not
automated, and there is no feedback loop, bad output is not surprising.
For me the concrete answer to this turned out to be the `pnpm verify`
command itself.
