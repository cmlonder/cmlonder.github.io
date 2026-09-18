---
title: 'Designing Data-Intensive Applications'
author: 'Martin Kleppmann'
year: 2017
note: 'The only book that made distributed systems feel like engineering rather than folklore.'
order: 0
placeholder: true
status: "done"
rating: 5
tags: ["distributed", "data", "foundational"]
---

After finishing this the vocabulary I use in architecture discussions
changed. I stopped saying "consistency" and started asking which
consistency.

The chapter that helped me most was not replication but **data
encoding**. I had been underestimating schema evolution; afterwards it
happened to us in exactly the way described, on three separate projects.

Its weakness is that most examples come from systems around 2016. The
ideas hold, the product names have aged.
