---
title: 'The Review Is the Work'
description: 'When generation is free, the scarce resource is judgement. That reframes what a senior engineer is for.'
pubDate: 2026-02-22
topics: [agentic-development, solution-architecture, code-review, craft]
featured: false
draft: false
placeholder: true
---

I grew up assuming that the expensive part of writing code was the
writing. When I estimated a feature I was counting days at a keyboard,
because that was the scarce resource. Working with agents pulled the
floor out from under that assumption. Generation is cheap now; in one
evening I can see working versions of five different approaches. But
deciding which of the five is correct did not get cheaper at all, and in
relative terms it got much more expensive.

## The scarcity moved

When one resource gets cheaper, the one next to it becomes more
valuable. With code generation nearly free, the bottleneck moved to
judgement: is this change actually the thing we wanted, what will this
abstraction cost us in six months, what does this passing test really
prove. These always mattered, but they used to hide in the shadow of
writing time. There is no shadow now, and it turns out judgement is
slow.

What this means day to day is that review is no longer a quality gate at
the end of the work. It is the work. Giving an agent a task and reading
what comes back takes about as long as writing that code myself used to
take. The difference is that the time now goes into deciding rather than
typing.

## Reading is harder than writing

There is an uncomfortable fact here: reading code is harder than writing
it. When you write, you make the decisions and the reasons are fresh in
your head. When you read, you have to reverse-engineer someone else's
decisions without their reasons. With agent output this is harder still,
because the output always looks confident and stays plausible even when
it is wrong.

The only thing that has worked for me is putting constraints up front
that make reading cheap. Ask for small changes. Ask for a test next to
each change that makes it obvious what is being proven. Keep the
conventions written down in the repo. If a convention is written,
checking compliance takes seconds; if it is not, I end up asking "wait,
is this how we do it here" every single time, and that is where the real
fatigue comes from.

## What seniority means now

This also shifts the answer to what a senior engineer is for. Seniority
used to mean being able to write the hard thing. Increasingly it means
being able to see quickly where the produced thing is wrong. These are
not the same muscle. I know excellent writers who get impatient reading
someone else's code, and they are the ones struggling with the new
arrangement.

Oddly, this makes the junior path harder too. Judgement develops by
making enough bad decisions and living with the consequences. If you
skip the writing step, where does that feedback loop come from? I do not
have a good answer yet. What I do on my own team for now is use agent
output as a review exercise: "what is wrong here" teaches more than
"write this."

## What I measure

For a while I have been splitting my week into how much went to
producing and how much went to reviewing. The ratio keeps moving toward
review, and I do not think that is a problem. What is a problem is
still planning review as unpaid overhead. Work with no place on the
calendar does not happen, and with agents the bill for review that did
not happen goes straight into the product.
