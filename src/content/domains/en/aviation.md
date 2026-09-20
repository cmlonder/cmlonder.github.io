---
title: "Aviation"
thesis: "Airline software is a real-time negotiation system built on top of a forty-year-old data model."
blurb: "Reservation, inventory, operations. Why none of them is as simple as it looks."
order: 1
outline:
  - slug: mail-contracts-to-sabre
    title: "From mail contracts to SABRE"
    promise: "Why inventory and the passenger record were born apart, and why that split still costs us."
    part: "Reservation"
  - slug: sabre-to-pss
    title: "From SABRE to PSS: why one architecture lived 60 years"
    promise: "Why the 1964 data model still sits inside today's PSS, and why standardisation was missed on the first try."
    part: "Reservation"
  - slug: deregulation-1978
    title: "1978: when the profit guarantee ended, revenue management was born"
    promise: "Who decided fares, routes and inventory once the 55%-load, 12%-return guarantee was gone, and why revenue management became a survival skill."
    part: "Reservation"
  - slug: yield-management-origins
    title: "Yield management: the early strategy and its business logic"
    promise: "How restricted discounts, controlled overbooking and Littlewood's rule converged in DINAMO in 1985, and the formula for staying profitable while selling cheap seats."
    part: "Reservation"
  - slug: yield-management-peoplexpress
    title: "Yield management: competitive strategy and the PEOPLExpress case"
    promise: "Why a billion-dollar cost advantage was not enough; marginal traffic and inventory control in the losing side's own words."
    part: "Reservation"
  - slug: pnr-is-a-contract
    title: "A PNR is not a record, it is a contract"
    promise: "Model a reservation as a row and it works for a month, then collapses."
    part: "Reservation"
  - slug: overbooking-is-a-model
    title: "Overbooking is not a mistake, it is a model"
    promise: "Selling more seats than exist is a deliberate calculation, and the software has to carry it."
    part: "Reservation"
  - slug: inventory-is-not-seats
    title: "Inventory is not seats"
    promise: "What an airline sells is not a physical seat, and confusing the two breaks the pricing model."
    part: "Inventory"
  - slug: price-is-a-rule-stack
    title: "A price is not a number, it is a stack of rules"
    promise: "Why the same flight has a different price for every passenger, and where that is computed."
    part: "Inventory"
  - slug: codeshare
    title: "Codeshare: two airlines, one seat"
    promise: "When two carriers sell the same seat, who owns the truth about it."
    part: "Inventory"
  - slug: irops
    title: "IROPS: when the plan collapses"
    promise: "Disruption is not an exception path, it is the hardest normal path in the system."
    part: "Operations"
  - slug: crew-scheduling
    title: "Why crew scheduling is NP-hard"
    promise: "Legal duty limits, rest rules and fairness turn rostering into a genuinely hard problem."
    part: "Operations"
  - slug: edifact-messaging
    title: "The industry still speaks EDIFACT"
    promise: "A 1980s message format underneath modern APIs, and why replacing it keeps failing."
    part: "Integration"
  - slug: ndc-distribution
    title: "NDC: who controls distribution"
    promise: "A standard that is also a commercial power struggle, and what that means for the architecture."
    part: "Integration"
---

Aviation is one of the rare domains where engineers say "why is this so
complicated" and almost all of the complexity turns out to have **a real
reason**.

I am writing this file because the most instructive modelling mistakes I have
seen in my career are concentrated here. Thinking a reservation is a row,
thinking a seat is a stock item, thinking a delay is an exception — all three
get made in other domains too, but in aviation the consequences show up
immediately.

My sources are public: IATA standards, published incident and outage reports,
and airlines' own technical documentation. Nothing here is internal knowledge
belonging to a particular company.
