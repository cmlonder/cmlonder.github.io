---
title: 'Architecture Is a Story About Trust'
description: 'Every boundary in a system is a statement about which team you trust to not break you.'
pubDate: 2026-07-19
topics: [solution-architecture]
tags: [boundaries, teams]
featured: true
draft: false
placeholder: true
---

When I look at an architecture diagram now, I read the lines rather than
the boxes. Every line looks like a technical decision, but underneath it
there is almost always a social one: how much do I trust the team on the
other side not to break me?

The first time I saw this clearly was in a design discussion where we
turned a synchronous call into a queue. We wrote resilience as the
justification, and that was not untrue. But the real reason was that we
did not know that service's deploy schedule and it restarted without
warning in the middle of the day. The queue was a statement about trust
wearing the costume of a technical fix, because we had no promise from
the other side about when they would be up.

## A boundary is where trust runs out

Tell me where you put your boundaries and I will tell you who you do not
trust. Two modules inside the same team never need schema versioning,
backward compatibility guarantees, or contract tests, because if
something breaks the same person fixes it and the fix costs an
afternoon. Put that same line between two teams and it suddenly needs a
contract, a deprecation policy, and a release order. What changed is not
the technology but who gets billed for the failure.

This is why most microservice debates start from the wrong place. "Should
this be its own service" is usually framed as a question about scale, but
in practice the answer is determined by how many teams there are.
Splitting a system owned by a single team into five services means paying
a trust premium you do not owe. Failing to split one service owned by
five teams means paying that premium invisibly, which is worse.

## Trust changes, diagrams don't

The sneaky part is that the trust relationship moves over the years while
the boundaries stay where they were. A service was written by another
team three years ago, then that team dissolved and the code came to us.
There is now no reason for a boundary between us, but the boundary is
still there, and every change pays for two repos, two pipelines, and two
release processes. The reverse happens too: a component we have treated
as an internal module quietly moves to another team, and we are still
writing directly into its tables.

So in architecture reviews I have started asking a different question:
which trust relationship does this boundary describe today, and is it
still true? If the answer is "I don't know, it has always been there,"
then what we have is not architecture. It is a fossilised org chart.

## What I actually do

When I propose a boundary now, I try not to justify it in technical
vocabulary. Instead of saying "for loose coupling," I write down who is
promising what: this team commits to keeping these fields backward
compatible, supports the previous version until this date, and carries
the pager if they break it. If I cannot write that sentence, I do not
draw the boundary, because what I cannot write down is a trust
relationship that does not exist.

The useful side effect is that it moves the argument into the right
room. When the placement of a boundary is presented as a technical
preference, engineers argue about it and the loudest one usually wins.
When the same question is asked as "who is making this promise," it
becomes obvious who can answer, and that person is usually not in the
room. Getting them into the room turns out to be more productive than
arguing about where to draw the line.
