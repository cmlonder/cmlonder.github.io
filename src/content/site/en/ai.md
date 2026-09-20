---
title: 'AI usage'
description: 'How AI-generated content is labelled on this site, and why.'
updated: 2026-09-21
---

Short answer: **The writing is mine. [Radar](/radar) is AI-compiled digests;
I do not write those.**

> The Radar briefings themselves are in Turkish. This page explains the
> process in English; the mechanics are identical.

## Method

Every sentence in the essays, notes, playbooks and shelves is mine. I use
agents while writing: correction, research, code. But any sentence with an
opinion or an "I" in it is mine; the rule is [Simon Willison](https://simonwillison.net/2026/Mar/1/ai-writing/)'s. Those
pieces carry no mark.

Radar is different. For topics I follow, I produce daily briefings through
pipelines I built, with my own templates and rules. An agent writes the text:
it gathers from many sources, summarises, and drops a publish-ready file.
Nobody reads or edits it in between. In return, two rules hold:

- Every claim is numbered inline and its full link sits at the foot of the
  piece. Verification is left to the reader.
- The agent's own "verified" claims have no place. I watched it write
  "pulled from the profile" for a page it could not fetch; that column is gone.

## What the big platforms do

Meta and YouTube are solving the same problem and both landed in the same
place: not hiding the content, but **stating its origin with a visible label**.

**Meta** (Facebook, Instagram, Threads) puts an "AI info" label on
AI-generated posts. It launched in May 2024 as "Made with AI" and was renamed
in July 2024. The label sits at the top of the post; clicking it opens a panel
explaining what was AI. [Meta's announcement](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/).

<figure class="ai-ornek" data-kim="meta">
  <div class="ornek-kart" aria-hidden="true">
    <div class="ornek-bas"><span class="ornek-avatar"></span><span class="ornek-ad">an account</span><span class="ornek-zaman">2h</span></div>
    <div class="ornek-govde"></div>
    <div class="ornek-etiket"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg> <span>AI info</span></div>
  </div>
  <figcaption>Meta: an "AI info" label in the post header. Schematic drawing, not a screenshot.</figcaption>
</figure>

**YouTube** requires uploaders to disclose realistic AI-generated or altered
content; the video gets an "Altered or synthetic content" label. On most
videos it sits in the expanded description; on sensitive topics such as
health, news, elections and finance it moves onto the player. YouTube may add
the label itself when nothing was disclosed and the content could mislead.
In force since March 2024. [YouTube's announcement](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) and
[help page](https://support.google.com/youtube/answer/14328491).

<figure class="ai-ornek" data-kim="youtube">
  <div class="ornek-kart" aria-hidden="true">
    <div class="ornek-bas"><span class="ornek-avatar"></span><span class="ornek-ad">a channel</span><span class="ornek-zaman">1.2M views</span></div>
    <div class="ornek-govde"></div>
    <div class="ornek-etiket"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg> <span>Altered or synthetic content<span class="ornek-alt">Sound or visuals were significantly edited or digitally generated.</span></span></div>
  </div>
  <figcaption>YouTube: a two-line label in the description panel. Schematic drawing, not a screenshot.</figcaption>
</figure>

## The label

Here is the equivalent on this site: when an agent wrote the whole text, the
byline carries a small dashed mark next to the date: **ai-written**. It is
shaped differently from the topic chips on purpose; it is not a topic, it is
provenance. Radar bulletins and the domain chapters built from NotebookLM
briefings carry it, and it also sits next to Radar's name in the menu.
Clicking it brings you here.

<figure class="ai-ornek" data-kim="biz">
  <div class="ornek-kart ornek-biz" aria-hidden="true">
    <span class="ornek-baslik"></span>
    <span class="ornek-kunye">21 September 2026 <span aria-hidden="true">·</span> <span class="ornek-pill">ai-written</span></span>
  </div>
  <figcaption>This site: in the byline, next to the date.</figcaption>
</figure>

The machine side carries the same information: marked pages have
`<meta name="ai-disclosure" content="ai-generated">`, the `.md` mirror has an
`AI: ai-generated` line, and RSS and JSON-LD use IPTC
[`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia).

## If you find an error

If you see a claim that is wrong,
[open an issue in the repository](https://github.com/cmlonder/cmlonder.github.io/issues)
or leave a comment under the piece. Every error the agent gets away with is a
rule to add to the template.
