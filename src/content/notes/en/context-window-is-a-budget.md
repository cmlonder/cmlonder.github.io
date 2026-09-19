---
title: 'The context window is a budget, not a container'
description: 'Half-formed thought on why "just paste more" stops working past a certain repo size.'
pubDate: 2026-08-30
status: seedling
topics: [agentic-development, context-engineering]
draft: false
placeholder: true
---

For a long time I thought of the context window as a container: the
bigger it is the more fits, so fit as much as possible. The "paste more"
strategy really does work on small repositories, which is exactly how it
becomes a habit.

Past a certain size it stops working, and the reason is not capacity.
Everything you put in the window joins a denominator across which the
model has to divide its attention. Adding two thousand irrelevant lines
lowers the weight of the fifty relevant ones long before the window is
anywhere near full. So it is a budget, not a container: every token you
spend comes out of something else's share.

Once you accept that, the decisions change. The question stops being
"does this fit" and becomes "is this worth more than what it displaces."
Tool definitions are part of the same budget and almost nobody counts
them; ten tool schemas quietly take up room on every single turn.

Where I am stuck is that I can measure the budget but not the value. The
only way I know to find out whether a file is earning its place is to
remove it and watch the outcome, which is a slow and noisy experiment.
Maybe the right move is to stop evaluating files individually and define
fixed bundles per task type instead. Not sure. Have not tried it yet.
