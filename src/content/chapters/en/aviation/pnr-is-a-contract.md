---
title: "A PNR is not a record, it is a contract"
domain: "aviation"
summary: "Model a reservation as a row and it works for a month, then collapses. The cause is misunderstanding not what a PNR is, but what it represents."
pubDate: 2026-09-10
topics: ["solution-architecture"]
crossRef:
  domain: "ecommerce"
  slug: "cart-is-a-time-window"
  why: "A cart is likewise not a record but a promise with an expiry."
placeholder: true
---

The first thing someone new to airline reservation systems draws is almost
always the same:

```
reservations
  id, passenger_name, flight_no, seat, status, created_at
```

This table works for a month. In the second month it collapses. The reason is
not performance; it is misunderstanding **not what a PNR is, but what it
represents.**

## What a PNR is not

A PNR — Passenger Name Record — is not a record of a passenger. It is **a
record of a journey.** It can contain several passengers, several flights and
several services, and each of those parts can be changed at different times by
different parties.

Concretely, a single PNR can carry all of these at once:

- Two adults and an infant (the infant has no seat of its own but has its own ticket)
- Istanbul to London outbound, London to Edinburgh to Istanbul inbound (two legs back)
- One leg operated by another airline under a codeshare
- A separately purchased baggage allowance and a seat selection
- A note added by the agency that the airline cannot see

The data model equivalent of that structure is not a row, it is **a tree**.
And the branches of the tree live independently: cancelling one leg does not
cancel the other, and removing one passenger does not delete the PNR.

## The real point: a PNR is a contract

The modelling mistake comes from one assumption: *"a reservation is a record of
a state in my system."*

It is not. A PNR is **the current state of a contract between parties.** Those
parties are the passenger, the agency that sold the ticket, the carrying
airline, and sometimes a partner airline. Each has different authority over the
record and none of them owns it alone.

That has three concrete consequences.

**First: a change is not an overwrite.** When a passenger name is corrected,
the old name does not disappear. Who changed the contract and when has to stay
provable, because that is where you look when there is a dispute. So the
natural storage form for a PNR is not *a row being overwritten* but **an
append-only event log**. If you do not build it that way from the start, six
months in you cannot answer "when did this name change."

**Second: splitting is a core operation.** If one person out of a party of four
changes flights, that person is removed from the PNR and moved into **a new
PNR**, with a link left between the two. The industry calls this a *split*, and
it is not an edge case, it is a daily operation. A single-table model has no
equivalent for it.

**Third: ownership is transferable.** Control of a PNR booked through an agency
can move to the airline. The record's "owner" field changes over the record's
lifetime.

## Why it is still six characters

The code used to find a PNR, something like `A3F9KL` — the *record locator* —
is six alphanumeric characters. That limit comes from 1960s terminal screens
and it is still there, because every system in the industry expects it.

The practical consequence is that **this code is not unique.** The same locator
can refer to different reservations at different airlines, and after enough
time it can be reused even within the same airline. Systems that make the
locator a primary key are why strange collisions turn up years later.

The right reading is that a locator is a **lookup key**, not an identity.
Identity should be your own durable identifier; the locator is the language you
use to talk to the outside world.

## What to do instead

Model the reservation as an **event log**, with today's state as a view derived
from that log. "Current state" can be its own table, but it must not be the
source of truth.

Build the tree as an actual tree: passengers, legs and services as separate
entities, with the PNR as the container holding them together. Even if you do
not support splitting in the first version, make sure the model allows it —
adding it later is close to a rewrite.

Never make the record locator a primary key.

None of this is specific to aviation; the consequences just show up earlier
there. We make the same mistake modelling a shopping cart.
