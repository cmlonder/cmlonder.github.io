---
title: 'p99 is a team boundary, not a metric'
description: 'Whoever owns the p99 owns the on-call pager. Everything else follows from that.'
pubDate: 2026-06-19
status: budding
topics: [scale-and-performance]
tags: [slo, oncall]
draft: false
placeholder: true
---

For years I treated p99 as a performance metric. A line on a graph, a
number that should stay under a target. Then I noticed its actual
function is not technical: p99 decides whose phone rings at night.

The logic goes like this. If you own an endpoint's p99, you are the one
who wakes up when it gets slow. That makes you the de facto owner of
everything that could cause the slowness: the query underneath, the
downstream service you call, the queue you depend on. Owning a p99
draws a much wider circle of responsibility than it looks like it does.

The practical consequence is that negotiating a p99 target is really
drawing an org chart. Saying "we commit to 200 milliseconds" means
asking for a say over everything required to hold that number. Teams
that commit without that say burn out steadily, because they are being
held to a number they do not control.

So when I walk into an SLO discussion now, my first question is not what
the target should be. It is who can say yes to the changes required to
hit it. If the answer is nobody, we are not discussing a target, we are
discussing a wish.

Unfinished part of this note: how any of it works for endpoints owned
jointly by several teams. I do not have a good answer.
