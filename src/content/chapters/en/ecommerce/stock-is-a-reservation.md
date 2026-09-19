---
title: "Stock is not a number, it is a reservation"
domain: "ecommerce"
summary: "Decrementing a stock counter and promising something to a customer are not the same operation. Overselling almost always comes from confusing the two."
pubDate: 2026-09-11
topics: [solution-architecture, scale-and-performance]
crossRef:
  domain: "aviation"
  slug: "overbooking-is-a-model"
  why: "Aviation solves the same problem from the opposite direction: it oversells and prices the compensation."
placeholder: true
---

In almost every e-commerce system this line sits somewhere:

```sql
UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0
```

On its own it is a correct statement. The problem is **which question it
answers**.

## Two different questions

There are two separate questions in the system and they get confused
constantly:

1. **How many are in the warehouse?** — physical truth, the result of a count
2. **How many can I promise?** — a commercial decision, a computed value

The industry calls the second one *available-to-promise*, and it is a different
number from the first. There might be 10 in the warehouse, but:

- 3 are held for orders still going through payment
- 2 came back as returns and have not been inspected
- 1 is damaged and unsellable
- 5 are in transit and arrive in three days

The number you can promise is not 10. And that number **depends on when you
ask** — five minutes later it is different.

## Reservation: a promise with an expiry instead of a counter

The right model is this: when the customer adds to cart or moves to checkout,
you do not decrement a counter, you create **a reservation with an expiry**.

```
reservation
  product, quantity, holder (session/order), expires_at
```

Sellable quantity is no longer a counter but a calculation:

```
sellable = physical − (unexpired reservations) − (blocked)
```

This structure has three advantages.

**It returns on its own when the timer runs out.** Stock held by a customer who
abandoned checkout is released fifteen minutes later even if the cancellation
job never ran. In the counter model you have to write a cleanup job to
compensate, and be sure it is running — on the day it is not, stock leaks.

**You know who is holding it.** When a counter decrements, no information is
left behind: it says 4 instead of 7 and you do not know why. In the reservation
model there is an answer to "which three sessions are holding these three
units." For a support team, that is the whole difference.

**The race condition lives in one place.** Creating a reservation is a single
critical section; everything else is a read. In the counter model every flow —
cart, checkout, cancellation, return — touches the counter, and each is its own
source of races.

## Where it gets stuck

The reservation model is not free.

**A popular product turns into one row.** When a thousand people try to reserve
the same product at once, that product's row becomes a lock point. The fix is
to **append reservations** rather than lock per product — writing rows instead
of updating one — and to compute the sellable quantity as a sum. The write
contention disappears and reads get more expensive.

**Once reads get expensive you add a cache, and once you add a cache you lose
consistency.** It is acceptable for the "only 3 left" on a product page to be
stale. It is not acceptable at add-to-cart. Until you separate those two reads,
you will be either slow or wrong.

**Partial-order behaviour is a commercial decision, not a technical one.** If
two of three line items can be reserved, what you do is a product decision:
hold, ship partially, or reject the whole order. The system has to support all
three, and which one applies must not be hardcoded.

## The aviation inverse

What is interesting is that aviation solves this problem **from exactly the
opposite direction**: it sells more tickets than seats and closes the gap at
the gate with compensation.

The only reason they can do that is that the compensation is **computable in
advance** — regulation defines what is owed in which case. In e-commerce, the
loss suffered by a customer whose order is cancelled is not regulated; the cost
lands on reputation and cannot be measured.

You cannot optimise a risk you cannot measure. So we reserve and they oversell.
The same problem with a different cost function.
