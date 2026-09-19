---
title: "From mail contracts to SABRE"
domain: "aviation"
summary: "Most of what looks strange in airline reservation systems today started with a single seat on a mail plane in 1925. This chapter is about why inventory and the passenger record were born apart, and why that split still costs us."
audience: "Engineers meeting an airline reservation system for the first time, or wondering why the PNR and inventory were ever separate. No aviation background needed."
pubDate: 2026-09-19
topics: [solution-architecture]
origin:
  tool: "NotebookLM"
  kind: "briefing"
  note: "The slides come from the same deck and are in Turkish; the alt text and captions are mine."
crossRef:
  domain: "ecommerce"
  slug: "stock-is-a-reservation"
  why: "A buffer seat and a safety stock are two names for the same problem."
---

The first question anyone asks when they open an airline reservation system is
always the same: how hard can it be to keep a seat and a passenger in one
table, and why is all of this such a mess?

The answer is a single seat on a mail plane in 1925.

![Cover slide of the deck, in Turkish. Title: the evolution of airline reservation systems. Subtitle: from mail contracts to the world's first computerised reservation network, SABRE.](/decks/crs-evolution/01.webp "Thirty-five years in one line: it starts with a postal contract and ends with a real-time database.")

## The passenger was a by-product

The 1925 Kelly Act ended the Post Office monopoly and opened airmail to
private carriers. The point of the flight was to carry mail; **exactly one
seat was set aside for a paying passenger.** A traveller called the departure
city, and if the seat was free, it was booked.

![Slide placing two ideas side by side: on the left a mail bag labelled payload capacity, on the right a single passenger seat labelled residual inventory. Below, bullet points on the 1925 Kelly Act and the single-seat era.](/decks/crs-evolution/02.webp "The label on the right is the whole story: the passenger seat is not a product, it is what the mail left over.")

The business logic matters here. The aircraft's payload was optimised for
cargo, so passenger inventory was the **residue**. In modern terms it is a
fixed allotment: the physical space is the limit. And since revenue came from
a government mail contract, yield did not exist as a concept. Price was not
something you optimised — it was a number written in a contract.

## Who knows the inventory

Early inventory control was not centralised. The true state of the seats was
known by **the station in the city the aircraft departed from.** Before making
a booking, a sales agent had to call that station and get confirmation:
request and reply. The answer went onto a PNR card and moved by teletype.

It was correct, and it was slow. Every sale cost a phone call.

The fix arrived in Boston in 1939: **sell and report.** Agents sold freely
without asking, up to a threshold of fullness; once the threshold was crossed
a "stop sale" message went out and the system fell back to the slow, safe
method.

![Slide comparing two inventory models. On the left, request and reply: the agent calls the departure city, asks for a free seat, gets confirmation, writes the PNR card. On the right, sell and report: agents sell freely, a stop sale message arrives, the system reverts to the old logic.](/decks/crs-evolution/04.webp "The chain on the left is one phone call per sale. The loop on the right only picks up the phone near the threshold.")

Read that in today's vocabulary and it is obvious what happened: instead of
taking a synchronous lock on every sale, they moved to **eventual
consistency.**[^consistency]

[^consistency]: Nobody called it that in 1939, but that is what it was:
    instead of guaranteeing correctness on every transaction, you wait for a
    message that tells you when it is wrong. The name arrived forty years later. Availability is assumed correct until a message says otherwise.
The idea is still in the field — the AVS messages in legacy GDS distribution
are the grandchildren of that stop sale.

The efficiency argument is also the modern one: management by exception. You
start the message traffic only near the limit, not on every transaction.

## The buffer seat: when sync is slow, you hide inventory

Post-war traffic grew while the process stayed old. The Boston Reservisor
(1946) was the first machine to replace the card files; the Magnetronic
Reservisor (1952) went in at LaGuardia and held **ten days of data for a
thousand flights**, queryable by several people at once.

![Slide summarising the Reservisor era in two columns. Left, under capacity: Boston Reservisor 1946 and Magnetronic Reservisor 1952. Right, under limitations: communication, the matching problem, and buffer seats.](/decks/crs-evolution/05.webp "The third item on the right names a habit that lasted forty years: seats held back and never sold.")

But the machine solved less than half the problem. The agent and the operator
were still on two ends of a telephone, and more importantly: **the seat sold
and the passenger name record were matched by hand.**

The business rule that came out of this will sound familiar. Because inventory
and record could not be synchronised in the moment, the last few seats were
closed to sale and a **buffer** was kept. That was how oversales and denied
boarding were managed.

A buffer is not free. It means flying with empty seats — the industry calls it
**spoilage**.[^spoilage]

[^spoilage]: Spoilage and overbooking are two sides of one coin: flying empty
    versus selling too many. Revenue management is the job of choosing a point
    between them. The one-sentence definition of modern revenue management comes
from here: minimise spoilage while managing overbooking correctly. Both are
invoices for the same synchronisation problem.

## If the fare is fixed, revenue management cannot exist

From 1938 until the late 1970s the Civil Aeronautics Board ran the industry at
the micro level: which carrier flew which route, what a ticket on it cost,
whether a merger was allowed.

![Slide showing the CAB's areas of control over a map of the United States: routes, pricing and competition, with a padlock in the centre. Below, a conclusion box: with price competition forbidden, airlines could only compete on operational efficiency and service quality.](/decks/crs-evolution/03.webp "For forty years price was not a variable. It was a constant the regulator wrote down.")

It is odd to find this in a technical chapter, and it is decisive. **If the
tariff is fixed, dynamic pricing is not a problem you have.** Whenever you
book, the seat costs the same. Yield management could not exist until
deregulation removed the CAB's pricing control — not because the technology
was missing, but because the rule forbade it.

Worth remembering when you look at what a system does not solve: some features
are not missing, they are **prohibited.**

## The real idea: bind inventory to the customer

In 1953 C.R. Smith, the CEO of American Airlines, and a young IBM salesman
named R. Blair Smith sat next to each other on a flight. The machine Blair
Smith described would not just hold availability; it could record the
passenger's name, their itinerary, even their phone number.

![Slide about the 1953 flight, quoting R. Blair Smith in Turkish: a computer that could do far more than hold availability, one that could record the passenger's name, itinerary and even telephone number. Below, the vision line: the foundations of the first computerised system to integrate a passenger's name with a seat reservation.](/decks/crs-evolution/06.webp "The three fields in that quote — name, itinerary, phone — are still the core of a PNR.")

Until then, airline computers were calculators for inventory counts. The idea
was, at bottom, a relational database idea: **bind a numeric inventory entity
to an alphanumeric customer entity.** The modern PNR was born there.

![Slide on the SABER project moving from idea to investment: the research phase proving the feasibility of a PNR system, IBM judging the project high-risk and deciding to invest in software development as well, and the formal contract signed in 1958.](/decks/crs-evolution/07.webp "The middle item is the decision that created an industry: a hardware company starts writing software.")

An IBM that moved from hardware into software purely to serve one airline's
requirement is also the start of the airline IT vendor model. Amadeus, Sabre,
Travelport — all descendants of that decision.

The technical foundation came from the military. SAGE, the air defence system
built to track aircraft, turned out to be the right infrastructure for
tracking seats.

![Slide showing the transfer of military technology to the commercial sector in three steps: SAGE in 1951, an IBM computer, a reservation system. Below, the foundations SAGE provided: real-time interactive computing, magnetic core memory, active standby dual processors, digital communication over voice lines, and a front-end interface taking live data from tracking devices.](/decks/crs-evolution/08.webp "Every item on that list is ordinary today. In 1951 none of them were.")

SAGE became IBM's ACP; ACP became TPF. **TPF still runs inside the big GDSs
today** — a sixty-year-old operating system, still in production.[^tpf]

[^tpf]: The longest-lived piece of software in this chapter. It was born in an
    air defence system and it is still selling tickets.

## A decision made in 1961 is still standing

![Slide introducing the joint team at 99 Park Avenue: Roger Burkhardt and Fred Plugge, the mathematician Mal Perry, and Bill Elmore, who wrote the world's first matched PNR code. On the right, 1961 and a phased deployment box.](/decks/crs-evolution/09.webp "Phased deployment was not invented here, but it became the standard here: today's PSS migrations are run the same way.")

SABRE's architecture left five modules behind: schedules, inventory, PNR,
ticketing and DCS. Each answers its own question — where and when do we fly,
how many seats can be sold, who is the passenger, what was paid, who boarded.

![Slide placing Host CRS at the centre with five modules around it: flight schedules, inventory, PNR, ticketing and departure control. Five questions are listed on the left.](/decks/crs-evolution/10.webp "That ring is not an architecture diagram, it is a list of inheritances. Each of the five boxes is a separate product today.")

Here is the part to notice: **PNR, ticketing and inventory are separate
modules.** That was decided in 1961 and we are still paying for it. An e-ticket
and a PNR can drift out of sync because the architecture gave birth to them
apart. IATA's ONE Order initiative is an attempt to undo exactly that split:
collapse the PNR, the ticket and the EMD into a single retail order.

Sixty years later, we are trying to reverse a modularisation decision.

## What it leaves us

Three things, and none of them are specific to aviation.

**When synchronisation is slow, you hide inventory.** The buffer seat is not
incompetence, it is the invoice for latency. If you hold safety stock in your
own system you are paying the same invoice; the question is not "how do I
reduce the stock" but "why can't I make the sync faster".

**The constraint is not always technical.** What was missing in the CAB era
was not an algorithm, it was permission. Before you explain what a system
fails to do, ask what it was allowed to do.

**Boundary decisions made early live longest.** Separating inventory from the
record was the right call in 1952; undoing it in 2026 takes an international
standards initiative. What you split today stays split.
