---
title: "A cart is not a table, it is a time window"
domain: "ecommerce"
summary: "Does the price freeze at add-to-cart or at checkout? The answer is not a preference; it determines what promise the system is making."
pubDate: 2026-09-15
topics: ["solution-architecture"]
crossRef:
  domain: "aviation"
  slug: "pnr-is-a-contract"
  why: "A PNR is likewise not a record but a time-bounded contract between parties."
placeholder: true
---

The cart is the most underestimated structure in e-commerce systems. It looks
simple: product id, quantity, user.

In reality a cart is a **time window** — everything inside it goes stale as the
world outside changes.

## Every field in a cart can go stale

At the moment the customer added the product, all of this was true:

| Field | How soon it goes stale |
|---|---|
| Price | When a promotion ends, possibly within seconds |
| Stock | When somebody else buys it |
| Shipping cost | When the address changes, or the basket crosses a threshold |
| Promotion eligibility | When another product is added |
| Tax | When the delivery country is chosen |

So a cart is not **a frozen snapshot**; it is a derived thing that has to be
recomputed on every display. Systems that keep the cart as a table and write a
price into it eventually have to answer the question of when that price gets
refreshed — usually in production, via a complaint.

## When does the price freeze

There is no technical answer to this; you are choosing **a commercial
promise**.

**If it freezes at add-to-cart** you have told the customer "the price you saw
is yours." The consequence is that a product sitting in a cart for two weeks
sells at the old price, and during a price rise carts turn into option
contracts. If you have not put an expiry on that, you will see it on the
balance sheet.

**If it freezes at checkout** the customer can see a different amount from the
one they added. This is the correct behaviour but it has to be stated plainly;
if you do not say it, someone who saw 100 in the cart and sees 120 at payment
has lost trust in you.

**The middle option** is what most systems do: the price freezes for a short
window — typically 15 to 30 minutes — and when it expires the cart is quietly
revalued and any change is shown to the user.

Whichever you choose, it has to live in **exactly one place in the code**. I
have seen systems where this decision was implemented two different ways in two
different services; the result was price inconsistencies that nobody could
reproduce but that happened a few times a month.

## Whose cart is it

The second underestimated question is who owns the cart.

An anonymous user's cart lives in a cookie or a session. What happens when they
log in? Does the old cart **merge** with the new one, overwrite it, or does the
user get asked?

All three are defensible. What is not defensible is leaving the decision
unmade, because then the behaviour depends on which service ran first and the
user sometimes loses their cart.

The same question returns with multiple devices: two open carts, one on the
phone and one on the desktop. Without a merge rule, last writer wins and the
customer has no idea what happened.

## An abandoned cart is not a failure

The large majority of carts never become orders, and that is normal. A cart is
**a signal of intent**, not a commitment.

Accepting that changes two things. First, there is no need to keep cart data in
the same place as durable order data — you would be storing data with a very
different lifetime under the same guarantees. Second, abandoned carts are not a
cleanup problem but **a data source**: which step lost them is among the most
valuable inputs a product team has.

Modelling the cart as a temporary window clarifies both the storage decision
and the product decision.
