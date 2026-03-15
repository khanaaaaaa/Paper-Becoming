# PaperXBecoming

Live demo: [khanaaaaaa.github.io/PaperXBecoming](https://khanaaaaaa.github.io/PaperXBecoming/)

---

## What it is

PaperXBecoming is a mindfulness web app built around affirmation cards. You tell it how you're arriving and it gives you a quote to sit with tailored to that mood. You can save cards you want to keep, and use the meditation tab for a breathing guide and session timer.

---

## Why I made it

I wanted to build something that felt intentional, something that slows you down for a minute. I watched a YouTube video on the importance of meditation and got inspired to make something that combines meditation and manifestation. Wanted to combine spirituality with tech in a sense.

---

## How I built it

- **Quotes** come from the [ZenQuotes API](https://zenquotes.io/)
- **Flip cards** use CSS
- **Library** saved cards to `localStorage`
- **Meditation tab** has a countdown timer and a breathing guide

---

## What I struggled with and what I learned

The biggest thing I learned is that debugging your own code after you've been staring at it for hours is genuinely hard so I asked my friend to help me figure out what wasn't working and after countless trials and errors, finally fixed the small mistakes that took way too long:

- ZenQuotes doesn't allow direct browser requests, so I had to route through a proxy.

- CSS flip cards looked simple but `backface-visibility` behaves inconsistently across browsers. Small thing, annoying to debug.

Thought it would be a short project but took more time than it should have. Regardless loved making it despite the errors. "Good things come with time" as they say.

## AI Usage

ChatGPT for debugging.
