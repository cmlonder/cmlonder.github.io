---
title: "E-commerce"
thesis: "E-commerce software is a graveyard of systems that refused to accept stock is actually a promise."
blurb: "Stock, cart, order. All three are more temporary than they look."
order: 2
outline:
  - slug: stock-is-a-reservation
    title: "Stock is not a number, it is a reservation"
    promise: "The difference between decrementing a counter and making a promise, and where overselling comes from."
    part: "Inventory"
  - slug: cart-is-a-time-window
    title: "A cart is not a table, it is a time window"
    promise: "When does the price freeze? At add-to-cart, or at checkout? What the wrong answer costs."
    part: "Order"
  - slug: order-state-machine
    title: "An order is a state machine, but whose?"
    promise: "Payment, warehouse and shipping assign different states to the same order. There is no single truth."
    part: "Order"
  - slug: promotion-engine
    title: "Why the promotion engine is always slow"
    promise: "Combinatorial explosion as rule count grows, and why caching does not save you."
    part: "Pricing"
  - slug: returns-are-a-new-flow
    title: "A return is not a reverse flow, it is a new one"
    promise: "Why systems that try to rewind an order end up breaking accounting."
    part: "Order"
  - slug: search-relevance-or-revenue
    title: "Search: relevance or revenue"
    promise: "A relevant result and a profitable result are not the same thing, and someone has to choose."
    part: "Discovery"
  - slug: marketplace-many-truths
    title: "Marketplace: one product, ten different truths"
    promise: "Why product identity, price and stock have to come apart once there are many sellers."
    part: "Marketplace"
  - slug: black-friday-constraint
    title: "Black Friday is not a load test, it is a design constraint"
    promise: "What designing for one day of the year costs you on the other 364."
    part: "Scale"
---

The software side of e-commerce looks deceptively familiar: product, cart,
order. Everyone thinks they could draw an e-commerce system.

The trouble is that none of those three words describes anything fixed. A
product changes by seller, a cart goes stale within minutes, and one order can
be in three different states in three different systems at once.

What this file is really about is **temporariness**: how long a given piece of
data stays true, and designing systems around that.
