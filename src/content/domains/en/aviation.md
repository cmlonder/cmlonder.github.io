---
title: "Aviation"
thesis: "Airline software is a real-time negotiation system built on top of a forty-year-old data model."
blurb: "Reservation, inventory, operations. Why none of them is as simple as it looks."
order: 1
parts:
  - name: "Origins"
    blurb: "From a single seat on a 1925 mail plane to the 1978 deregulation: where today's data model came from."
  - name: "Revenue management"
    blurb: "The discipline born when the profit guarantee ended: restricted discounts, controlled overbooking, leg control to O&D."
  - name: "Distribution"
    blurb: "Moving the reservation screen onto the agent's desk: who writes the standards, who carries the messages, who settles the money."
  - name: "Retailing"
    blurb: "Who holds the value chain: agency economics, the commission cut, and NDC taking pricing power back."
  - name: "Fares and pricing"
    blurb: "Fare products and their classification, rule engines, itinerary pricing, private fares, prorate agreements and ancillaries."
  - name: "Forecasting"
    blurb: "Booking curves, untruncating censored demand, spill models and O&D-level forecasting."
  - name: "Inventory and availability"
    blurb: "Overbooking, nested classes, bid price controls, network optimisation, and whether the seat is really for sale."
  - name: "Offers and merchandising"
    blurb: "Segmentation, recommendation engines, bundling, dynamic pricing and the seat itself becoming a product."
  - name: "Operations"
    blurb: "Shopping traffic, screen display order, schedule planning and revenue management that survives disruption."
  - name: "AI and what comes next"
    blurb: "Automation, interpretability, digital identity, and the e-commerce giants moving into travel."
outline:
  - slug: mail-contracts-to-sabre
    title: "From mail contracts to SABRE"
    promise: "Why inventory and the passenger record were born apart, and why that split still costs us."
    part: "Origins"
  - slug: sabre-to-pss
    title: "From SABRE to PSS: why one architecture lived 60 years"
    promise: "Why the 1964 data model still sits inside today's PSS, and why standardisation was missed on the first try."
    part: "Origins"
  - slug: deregulation-1978
    title: "1978: when the profit guarantee ended, revenue management was born"
    promise: "Who decided fares, routes and inventory once the 55%-load, 12%-return guarantee was gone, and why revenue management became a survival skill."
    part: "Origins"
  - slug: yield-management-origins
    title: "Yield management: the early strategy and its business logic"
    promise: "How restricted discounts, controlled overbooking and Littlewood's rule converged in DINAMO in 1985, and the formula for staying profitable while selling cheap seats."
    part: "Revenue management"
  - slug: yield-management-peoplexpress
    title: "Yield management: competitive strategy and the PEOPLExpress case"
    promise: "Why a billion-dollar cost advantage was not enough; marginal traffic and inventory control in the losing side's own words."
    part: "Revenue management"
  - slug: revenue-management-operations
    title: "Revenue management and strategic operations: PEOPLExpress and American Airlines"
    promise: "From leg-based to O&D control, the 30/70 math of hub-and-spoke, a cost culture down to the olive and the paint, and AAdvantage as a data tool, all in one formula."
    part: "Revenue management"
  - slug: loyalty-and-gds
    title: "PEOPLExpress and the industry: loyalty programmes and distribution systems"
    promise: "Every mile redeemed displaces a paying passenger; the neutral shared system was tried five times and died five times; display order is a business rule."
    part: "Revenue management"
  - slug: crs-to-gds
    title: "Airline reservation and global distribution systems (GDS): strategic evolution and business logic"
    promise: "Why MAARS Plus failed, what the four rules of 1984 banned, what MIDT and BIDT are for, and how four systems became three giants."
    part: "Distribution"
  - slug: industry-standards
    title: "Aviation industry standards and governance: a strategic analysis"
    promise: "IATA and A4A write the rules, SITA and ARINC carry the messages, OAG and ATPCO distribute schedules and fares, BSP and the clearing houses move the money; the full-content clause and the merchant-of-record question."
    part: "Distribution"
  - slug: gds-ecosystem
    title: "GDS and the airline distribution ecosystem: strategy and business logic"
    promise: "The GDS's customers are four clusters; how the 1994 e-ticket, the 2004 DOT sunset and the OTAs' demand for a thousand bookless results broke the mainframe; look-to-book from 10:1 to 10,000:1."
    part: "Distribution"
  - slug: tpf-to-metasearch
    title: "Airline reservation systems and digital distribution channels: a strategic analysis"
    promise: "Assembly still beats at the heart of the system; the phased migration from TPF to open systems, and the shift of control from inventory to attention, from eAAsy Sabre through Priceline and Orbitz to Google Flights."
    part: "Distribution"
  - slug: travel-value-chain
    title: "The travel value chain and distribution channels: a strategic briefing"
    promise: "RM decides, the host CRS executes; showing the same inventory in four storefronts is as critical as the RM math. 2.5 bookings per ticket, agency incentives above 50%, and the pricing power NDC wants back."
    part: "Retailing"
  - slug: ndc-retailing
    title: "The travel distribution ecosystem and New Distribution Capability (NDC)"
    promise: "The agency's five revenue streams, the commission cut of 1995, GDS surcharges since 2015; NDC moves pricing power back to the airline, ONE Order collapses three records into one, and the four certification levels."
    part: "Retailing"
  - slug: ndc-at-scale
    title: "NDC@Scale: transformation and business logic in airline distribution"
    promise: "Pricing power brought the compute load with it: 675 million searches a day, the GDS's existential choice, the gap the aggregators opened, and normalisation replacing transparency."
    part: "Retailing"
  - slug: marketing-planning
    title: "Airline marketing planning: process and business logic"
    promise: "A planning loop that starts with the fleet decision five years out and runs to close-in re-fleeting three months before departure, the feedback between functions, and the blind spots of MIDT, IATA DDS and DB1B."
    part: "Operations"
  - slug: airline-planning-overview
    title: "Airline planning and revenue management: a strategic analysis"
    promise: "Five links from schedule to profit: capacity planning, elasticity-based segmentation, O&D inventory control, CRM data carried into the booking moment, channel cost, and the competitor question no algorithm can answer."
    part: "Revenue management"
  - slug: revenue-management-sun-tzu
    title: "Revenue management and competitive strategy in aviation: a business logic analysis through Sun Tzu's principles"
    promise: "Translated into airline business rules, Sun Tzu's principles turn revenue management from a pricing tool into a competitive weapon that targets market share and margin together and demands clear direction, knowledge of both the rival and oneself, and decision authority with limits drawn in advance."
    part: "Revenue management"
  - slug: pricing-and-yield
    title: "Airline pricing and yield management strategies: an analytical view"
    promise: "The shift in 1978 from fixed fares to answering competitors, why marginal cost makes pricing reactive, the logic of systemwide versus market-specific changes, and the cascade that spreads through ATPCO, which carries 87% of fare filings."
    part: "Fares and pricing"
  - slug: fare-products
    title: "Airline fare products and their business logic"
    promise: "How restricted, qualified and unqualified discounts differ, why revenue management breaks down once fences disappear, and how a fare is represented in the many-to-one mapping chain that narrows from fare basis code to booking class."
    part: "Fares and pricing"
  - slug: fare-product-classification
    title: "Classifying airline fare products: strategic analysis and business logic"
    promise: "The ATPCO categories (CAT 1, 15, 25, 35) that separate public, private and negotiated fares by who may sell and who may buy them, why a discounted corporate fare can cost more than a public one, and how the airline loses control of the final price when negotiated fares settle net through BSP."
    part: "Fares and pricing"
  - slug: fare-rules-and-channels
    title: "Airline distribution channels and fare rules: a strategic analysis"
    promise: "A ticket price sits where two layers meet: the full content agreement and its parity clause that constrain web fares, NDC making that agreement obsolete, ATPCO's 29 rule categories with the stopover threshold, and Fare by Rule cutting ADMs on corporate contracts."
    part: "Fares and pricing"
  - slug: fare-rules-journey-types
    title: "Airline fare rules and journey types: a strategic analysis"
    promise: "Which pricing logic back-to-back tickets, hidden cities and point-of-commencement arbitrage exploit, how revenue integrity software catches them, and how journey types such as one-way, circle trip, open jaw and round the world are modelled in the system."
    part: "Fares and pricing"
  - slug: route-pricing
    title: "Itinerary pricing in aviation: business logic analysis"
    promise: "How a journey is split into fare components and recombined into priceable units, the open jaw distance rule, IATA TC areas, and picking the cheapest valid solution with taxes included."
    part: "Fares and pricing"
  - slug: fare-structure-segmentation
    title: "Fare construction, segmentation and loyalty programs analysis"
    promise: "Fares built from gateway and add-on components, currencies reduced to a single unit via NUC, the number of price points bounded by inventory control, and the business logic behind stopover, open jaw and one-way redemption rules."
    part: "Fares and pricing"
  - slug: special-fares-elasticity
    title: "Special fares and price elasticity in aviation"
    promise: "The unrealized revenue a single price leaves on the table, private fares visible only to their target segment, the conditions behind bereavement and child fares, and price elasticity that falls as departure nears, along with how a competitor's fare moves your demand."
    part: "Fares and pricing"
  - slug: fare-management-planning
    title: "Fare management and planning strategies in aviation"
    promise: "How a single fare action is decided where the competitive landscape meets the market profile: responses that differ by competitor, price elasticity turning a discount into loss or gain, and the RASK goal split between volume and yield."
    part: "Fares and pricing"
  - slug: reactive-pricing
    title: "Reactive pricing process and strategic decision mechanisms"
    promise: "The five stages of responding to a competitor's fare move: detection down to rules and footnotes, impact analysis that weighs revenue dilution, when not matching is the right call, and the hard requirement to fit into the next fare distribution window."
    part: "Fares and pricing"
  - slug: proactive-pricing
    title: "Proactive pricing and fare rationalization: a strategic business logic analysis"
    promise: "Will explain the rules behind proactive pricing decisions and why an RM system stops protecting higher classes when fares do not sit in a clean booking-class hierarchy."
    part: "Fares and pricing"
  - slug: prorate-agreements
    title: "Revenue sharing in aviation: multilateral and special prorate agreements (MPA and SPA)"
    promise: "How a single ticket's revenue is split between two airlines: IATA's mileage- and cost-weighted default MPA, and the bilateral SPA that overrides it."
    part: "Fares and pricing"
  - slug: ancillaries
    title: "Airline ancillaries and their business logic"
    promise: "How services added back on top of a no-frills base fare split into EMDs and receipts, the move from flat fees to market-based pricing, carrying brands across channels with the ATPCO S-8 record, and total itinerary prices that change with loyalty status."
    part: "Fares and pricing"
  - slug: fare-structures-rm
    title: "Airline revenue management and fare structures"
    promise: "Which carrier and document fuel, channel and optional-service charges (YQ/YR, OB, OC) attach to, how unseen demand (spill) is estimated, and how recapture and upsell rates feed the inventory decision."
    part: "Fares and pricing"
  - slug: spill-model
    title: "The airline spill model and its business logic"
    promise: "How the demand a full flight cuts off is estimated, how six decisions from upgauging and cabin layout to corporate discounts and award tickets are priced from that one calculation, and why assuming an LFCF of 1.0 understates spill."
    part: "Forecasting"
  - slug: expected-spill-boeing
    title: "Expected spill and the Boeing spill model"
    promise: "Estimating the demand a closed flight never sees with the Boeing spill model: why demand variability doubles the loss at the same load factor and why the closing load factor pushes the tables up."
    part: "Forecasting"
  - slug: demand-forecast-spill
    title: "Aviation demand forecasting and spill models analysis"
    promise: "Explains how the passengers a full flight turns away are estimated, why the Boeing model's logit approximation overstates spill at high load factors, and how the Gamma model closes that gap."
    part: "Forecasting"
  - slug: spill-and-demand
    title: "Expected spill and demand analysis in revenue management"
    promise: "Shows how the passengers a full flight turns away are counted from the demand distribution, and why a single passenger's rejection probability always exceeds the flight's closing probability."
    part: "Forecasting"
  - slug: spill-calibration
    title: "Calibrating input parameters for airline spill models"
    promise: "How the two inputs of a spill model, the demand coefficient of variation (CV) and the load factor of closed flights (LFCF), are calibrated from which data and with which filter, and why a small drift multiplies the estimate at high load factors."
    part: "Forecasting"
  - slug: capacity-and-spill
    title: "Capacity management and spill (lost demand) analysis in aviation"
    promise: "The four assumptions behind estimating spill from the load factor of closed flights: Gamma versus Normal demand, a 96 rather than 100 percent LFCF, a CV that grows from 0.30 to 0.46 with scope, and an iterative calculation that converges on the observed load factor."
    part: "Forecasting"
  - slug: nominal-load-factor
    title: "Nominal load factor and spill analysis"
    promise: "Iterating back to the true demand a full aircraft hides, the three fates of a spilled passenger, how ignoring recapture inflates nominal demand, and why First Class demand is modeled with a negative exponential rather than a bell curve."
    part: "Forecasting"
  - slug: coxian-demand
    title: "High-variance demand and the two-stage Coxian distribution"
    promise: "Why first-class demand does not fit a negative exponential distribution, how the two-stage Coxian distribution opens up variance with a single transition probability, and how a 15-point difference in the load-factor-on-closed-flights (LFCF) assumption multiplies the spilled-passenger estimate."
    part: "Forecasting"
  - slug: coxian-spill
    title: "Measuring spill with the two-stage Cox distribution"
    promise: "Rebuilding the demand the sales system never sees from the mean and deviation of history via moment matching: the a = 0.1 constant and its bound, how flight closing rate, expected spill and spill rate come from the same tail area, and how those numbers feed equipment and inventory decisions."
    part: "Forecasting"
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
