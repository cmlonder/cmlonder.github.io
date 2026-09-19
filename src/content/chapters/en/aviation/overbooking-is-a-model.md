---
title: "Overbooking is not a mistake, it is a model"
domain: "aviation"
summary: "Airlines sell more tickets than seats, and that is a deliberate decision rather than a software bug. What is interesting is not the decision but how the system carries it."
pubDate: 2026-09-13
topics: [solution-architecture, scale-and-performance]
crossRef:
  domain: "ecommerce"
  slug: "stock-is-a-reservation"
  why: "In e-commerce overselling is a bug; in aviation it is a model. The difference is whether the compensation can be priced."
placeholder: true
---

A 180-seat aircraft sells 186 tickets. Engineers hearing this for the first
time go looking for the bug. There is no bug — **it is deliberate.**

## Why the number is higher

The share of passengers who do not show up for a flight — the industry calls
them *no-shows* — varies by route but is not a small number. Business
travellers on flexible tickets change plans at the last minute, connecting
passengers miss the first leg, and some people simply never arrive.

A seat is **a perishable product**: the moment the door closes its value drops
to zero and it can never be sold again. Hotel rooms, concert tickets and ad
impressions are in the same category.

So the airline sells roughly as many extra tickets as it expects no-shows. When
the estimate is wrong there are not enough seats at the gate and a passenger is
**denied boarding**, meaning they are kept off the flight either voluntarily or
involuntarily.

<c-overbooking overbook="6" noshow="5" style="--ex-height: 230px" description="Overbooking simulation: a 180-seat flight sells extra tickets while no-shows are random. Left, the seats filling; right, every flight's empty seats and denied boardings.">
</c-overbooking>

Play with the sliders: pull overbooking to zero and every flight leaves
empty seats; push it past the no-show rate and denied boardings pile up.
The model is trying to shrink the sum of those two bars.

## What makes the decision tractable

The interesting part is the compensation. What is owed to a passenger who is
kept off a flight is **defined in advance and regulated**: regulation 261/2004
in Europe, DOT rules in the United States, other regimes elsewhere. The amount
varies with distance and delay, but it is **computable**.

That single property is what makes the whole model possible. Because the cost
of the risk is known, the decision stops being a gamble and becomes an
optimisation problem:

```
expected gain = P(no-show) × extra ticket revenue
expected cost = P(too many passengers) × compensation + reputational cost
```

The airline sells enough extra tickets to keep the second smaller than the
first. No more than that.

## What changes on the software side

The architectural conclusions here are useful even if you never touch aviation.

**An inventory counter cannot be a single number.** The number of sellable
seats is not the number of physical seats; it is a derived value computed from
class, fare and forecast. If your system has one field called
`available_seats`, the model is already wrong.

**Overselling is not an exception, it is a normal path.** The boarding process
has to support volunteer solicitation, upgrades, rebooking and compensation
**routinely**. If you code those as an error path, you end up with an error
path that runs thousands of times a year — and error paths are always the least
tested ones.

**The decision point has to be late.** Who gets kept off is determined at the
gate, not at the point of sale. The system has to be able to **stay undecided**
until the last moment; a design that binds early does not work here.

## Why e-commerce does not do the same thing

In e-commerce, selling more than you hold — *overselling* — counts as a bug,
and rightly so. The difference is not in the model but in **whether the
compensation can be priced.**

At an airline, what the passenger is owed is set by law. In e-commerce, when an
order is cancelled the customer's loss is not regulated; the cost lands
entirely on reputation and cannot be measured. You cannot optimise a risk you
cannot measure.

That is why e-commerce systems protect stock with a **reservation**: instead of
decrementing a counter, they make a promise with an expiry. It is the solution
to the same problem in the case where compensation cannot be computed.

Both domains ask the same question: *how do you sell a perishable resource in a
world where demand is uncertain.* Their answers differ, because in one the cost
of being wrong is known and in the other it is not.
