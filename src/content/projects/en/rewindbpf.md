---
title: "RewindBPF"
summary: "A hackathon build: run the agent inside a disposable filesystem transaction, then roll back or commit."
what: "Gives an agent a workspace it can wreck, and a person the diff to accept or discard."
status: "shipped"
started: 2026-07-17
updated: 2026-07-22
stack: ["Go", "eBPF", "OverlayFS", "Landlock", "cgroup v2", "Codex"]
url: "https://rewind.cmlonder.com"
repo: "https://github.com/cmlonder/rewind-bpf"
event:
  name: "OpenAI Build Week"
  url: "https://devpost.com/software/rewindbpf"
metrics:
  - label: "Days"
    value: "6"
  - label: "Commits"
    value: "213"
  - label: "Platforms fully enforced"
    value: "1 / 3"
order: 4
---

Six days, 213 commits, one hackathon deadline. This is a build for OpenAI Build
Week, not a product, and the numbers on this page are the honest size of it. It
stays here because the idea outlived the weekend.

An agent that can write files can also delete a source directory, overwrite a
config, or read a secret before anyone notices. The usual answer is a list of
blocked shell commands. That list is easy to walk around, and copying the whole
project before every run is expensive.

RewindBPF moves the boundary instead. The real workspace becomes an immutable
lower layer. The agent sees a merged view and works normally, but every write
and delete lands in a disposable upper layer. When the run ends there are
exactly two outcomes: **discard the upper layer, or commit it after a conflict
check.** Reads are a separate policy — you deny `**/*.env` or `**/*.pem` by
pattern, instead of hard-coding `.env` as a magic filename.

Git is not a substitute for this, and this is not a substitute for Git. Git
protects what a developer has already committed. Rewind protects the run that
happens before any of that exists, and it covers untracked and ignored files
too: images, binaries, generated assets, anything inside the workspace.

## What it does not undo

The boundary is filesystem paths inside the protected workspace. That means it
does not undo database writes, cloud or API calls, network traffic, device
state, kernel changes, or files outside the workspace.

This is the part a submission page usually skips. If the agent posts to an API
during the run, discarding the upper layer does not unsend that request.

## One platform is actually enforced

Linux is the reference path: OverlayFS/FUSE copy-on-write, Landlock read
enforcement, eBPF filesystem telemetry, cgroup-v2 process scoping. The
privileged tests run in an Ubuntu 24.04 VM.

macOS has a native path backed by APFS clones. It is enough to run the local
supervisor, the Control Plane UI, the read policy, the staged diff, rollback
and commit — enough to record the demo on a laptop. It does not prove eBPF or
OverlayFS enforcement, so I do not claim it does. Windows is a fail-closed
contract and nothing more.

That is why the metric above reads 1 / 3 instead of "cross-platform".

## Written with an agent, about agents

I built it in Codex, with GPT-5.6 as the implementation and review partner. 172
Go files in six days is not solo typing speed, and pretending otherwise on a
project about agent safety would be a strange place to start.

If you are building guardrails for agents, the cheap question is not "which
commands do I block". It is "where does the write actually land". The rest
follows from that answer.
