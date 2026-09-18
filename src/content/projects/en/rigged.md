---
title: "RIGGED"
summary: "A hackathon build: a daily physics game that lives inside a single Reddit post."
what: "Players build a physics rig, then call each other's frozen rigs WORK or FLOP before they run."
status: "shipped"
started: 2026-07-04
updated: 2026-07-19
stack: ["Devvit", "Phaser 4", "Matter.js", "TypeScript", "Hono", "Redis"]
url: "https://www.reddit.com/r/RiggerGame/comments/1uxg0xy/"
event:
  name: "Reddit — Games with a Hook"
  url: "https://devpost.com/software/rigged"
metrics:
  - label: "Physics pieces"
    value: "11"
  - label: "Day rotation"
    value: "24"
  - label: "Levels cut for drift"
    value: "3"
order: 5
---

A daily physics game inside one Reddit post, built for Reddit's Games with a
Hook hackathon. Each day a scene rotates in with obstacles and a goal. You
build a contraption from 11 pieces, simulate it, and publish it. Everyone else
sees your rig **frozen** — before it runs — and calls it WILL WORK or WILL
FLOP. Then it runs.

The scoring is what makes it a game rather than a puzzle. A builder does not
score by solving cleanly; a builder scores by **surprise rate**, the share of
predictors the rig caught out. A contraption that looks doomed and works is
worth more than one that looks inevitable.

## Determinism was the whole problem

Every reveal is a live re-simulation on the viewer's device, not a recorded
video. So the same rig has to produce the same outcome everywhere, or the game
is a lie.

Two "identical" runs can diverge on something as small as body insertion order.
The fix was to stop trusting the frame loop: the world is stepped manually at a
fixed `1000 / 60`, and a Node harness runs Phaser's own bundled Matter build to
pre-simulate bot rigs and check that every authored level is solvable.

It still was not enough for every level. Three of the bell levels are pulled
from the 24-day rotation because their winning rigs clear the dome by under a
pixel while the ball is still moving — any drift between the bake and the
reveal flips WORK into FLOP. The levels that stayed are settle goals, where the
ball comes to rest and both engines converge on the same answer.

I would rather cut three levels than ship a game that occasionally lies about
who read it right.

## User content without a text box

Players can publish their own challenges, and none of it is free text. Inputs
come from presets, the server re-validates every submission, and a challenge
only goes live after its author has solved it themselves. Moderation problems
you never create are the cheapest kind to handle.

## What I got wrong

The screens were built from the prototype's code and business logic instead of
from the rendered prototype. That sounds like a detail. It cost animations —
not a single `@keyframes` block made it across — plus colours, piece detail,
element positions, and a few whole flows that were only visible when the
prototype was actually running.

The lesson is dull and I keep relearning it: **reading the source is not the
same as watching the thing run.** Every screen now gets audited against the
running prototype, not against its file.
