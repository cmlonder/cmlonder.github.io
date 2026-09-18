---
title: 'What I want from an agent harness'
description: 'A running wishlist. Mostly about observability and being able to stop the thing mid-flight.'
pubDate: 2026-05-10
status: budding
topics: [agentic-development]
tags: [tooling]
draft: false
placeholder: true
---

A running list. Mostly about seeing what is happening and being able to
stop it.

**Let me stop it mid-flight without losing the work.** The most common
thing I want is not to cancel, it is to redirect. Right now stopping
usually means throwing away the context and starting the conversation
again, which makes me let bad runs continue longer than I should.

**Show me the token budget as it is being spent.** Not a total at the
end. I want to know, during a run, which part of the window is going to
tool definitions, which to files pulled in, and which to actual
reasoning. I keep guessing at this and being wrong.

**Make the diff reviewable before it lands.** Reading a change after it
is written into the working tree is fine for small things and terrible
for large ones. I want the same staged review experience I would get
from a colleague.

**Give me a replay.** When a run goes wrong I want to see the exact
sequence of inputs and decisions again, not a summary of it. Summaries
are written by the same thing that made the mistake.

**Let verification be a first-class step, not a convention.** If the
repository declares a check command, the harness should run it and treat
failure as failure, rather than leaving it to me to remember.

Most of these are observability requests, which I did not expect when I
started writing the list. What I want is not a smarter agent. It is a
cockpit.
