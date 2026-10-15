---
layout: post
title: "Wizard Wars Game"
date: 2024-12-30
time: false
categories: [GameDev]
description: "My submission for the 2024 WinterMelon Game Jam. I created a boss-rush and card-game combo, in which I solo-developed using Love2D, Aseprite, and Fl Studio."
image: "posts/wizard-wars/cover.png"
tags: [gamedev, pixel-art]
---

### Quick Links
{% assign quick_links = '' | split: '' %}

{% assign link1 = '' | split: '' %}
{% assign link1 = link1 | push: 'https://solarsprout.itch.io/wizard-wars' %}
{% assign link1 = link1 | push: 'fa-brands fa-itch-io' %}
{% assign link1 = link1 | push: 'Play on Itch.io' %}

{% assign link2 = '' | split: '' %}
{% assign link2 = link2 | push: 'https://www.youtube.com/watch?v=knTAH2j8QMs' %}
{% assign link2 = link2 | push: 'fa-brands fa-youtube' %}
{% assign link2 = link2 | push: 'Watch Gameplay' %}

{% assign quick_links = quick_links | push: link1 | push: link2 %}
{% include quick-links.html links=quick_links %}

## Reflections
<div style="overflow: auto;">
<img src="posts/wizard-wars/wizard.png" alt="Wizard character sprite" style="width: 200px; image-rendering: pixelated; float: right; margin: 0 0 15px 15px;">
<p style="margin-bottom: 1em;">"Wizard Wars" is a game I developed while participating in the 2024 WinterMelon Game Jam-- the first ever game jam I have participated in. While I had some game development experience (if you could call watching videos of other developers craft a miniscule feature of their games, "experience"), I didn't have a good understanding of what I was in for.</p>

<p style="margin-bottom: 1em;">The only piece of advice I had gathered from the discord, in between the absolute chaos of anxiety, pompousness, and self-deprecation in the vast majority of messages, was this: "Start small".</p>

<p style="margin-bottom: 1em;">Of course, a reasonable person would hear this and decide to, like the advice states, start small. Maybe join a group, keep the core of the idea simple, and only add on additional content if additional time exists.</p>

<p style="margin-bottom: 1em;">Unfortunately, as it turns out, part of my motivation for entering such a game was to transcend the realm of reasonable. I was here to push myself to some unknown limit, by solo-developing not only the software, but also all the pixel-art and music/sound design.</p></div>

There was an itch in me to get a sense of all aspects of game development, as a precursor to any future game development I might do. At that time, I was newly pumped to try and create my own indie game, and was hoping these game jams would be a series of stepping stones I would need to understand what it takes to achieve that goal. 

And to be frank, I won't say I have strayed from this motivator- I still feel that solo development allows one to learn a lot of different skills. But perhaps, in future competitions, I'll try to keep the idea of the project more reasonable.

So...what was this idea?

## Project Overview

<p style="margin-bottom: 1em;">Wizard Wars is a game where you control a spell wielding wizard, who's on a mission to defeat a series of enemies.</p>

<p style="margin-bottom: 1em;">Wizards, of course, are courteous beings, and will not attack you if you are not attacking them. Thus, arose the two distinct fight phases every wizard must prepare for: attack, and defense.</p>

<div style="overflow: auto;">
<img src="posts/wizard-wars/enemy.png" alt="Enemy character sprite" style="width: 150px; image-rendering: pixelated; float: left; margin: 5px 15px 15px 0;">
<p style="margin-bottom: 1em;">Unfortunately for you, the wizard you control can only perform one spell outright- shooting pellets from a spinning circle. If you want different spells, you'll have to use all your cards at your disposal.</p>

<p style="margin-bottom: 1em;">How does one know what spell to cast? Well thankfully you have a special sight that's able to see exactly what number your cards must add to, hosted right on top of either the enemy or yourself.</p></div>

If you cast during attack phase, you'll be surprised that all your bullets will propel straight towards the enemy, as if it were being magnetized. And if you cast during defense phase, well you'll have a sudden ability to dodge all the bullets coming at you, as if they're being repelled. 

(The theme of the game jam was "Polarity", if it wasn't obvious)

Once the enemy runs out of numbers, that solidifies your victory in the round!

Rest up after each of your fights at a shop, where you can find new cards and boosts to help you on your boss rush mission.

And if you ever have to step away for a wizard vacation, you can always save your progress and return back to where you left off.

Sound interesting? Sound...complicated? It is. I'm not going to lie to you. No matter how simple I try to make it sound, it's not an intuitive setup. Alas, no one said wizarding was easy, now did they?

## Development Features

The game was developed using Lua and Love2D as the framework. This framework- I was not familiar with beforehand. However, I was pleasantly surprised to see how easy the Love2D documentation was to navigate, and how simple it was to get started. I chose it originally because, at this time I was playing a lot of Balatro, and LocalThunk used the same framework for that one. Since my idea also vaguely had cards as a mechanic, I decided to give it a go. Maintaining the entire game through code was a marvel, and I definitely will be using Love2D for future games. It's hard not to Love, Love...2D.

Pixel art backgrounds and animations were created using Aseprite. Having a tablet that replicates the windows screen would have been a lifesaver for this. But, seeing as I didn't have those tools at the time, I made this art with keyboard and mouse. It was rough, but got the job done. I chose pixel art as a way to keep things more simple, and I think that was a good choice. 

Music and sounds were composed using Fl Studio and Fl Studio Cloud samples. Here's a preview of the main theme:

{% include audio-player.html audio_file='posts/wizard-wars/wizardwars.mp3' title='Wizard Wars Main Theme' type='audio/mpeg' %}

The music was one of the last things I added to the game, and was a bit rushed. I focused on creating a layered melody and drum line for the main theme, and then found some nice sounds for selecting cards and buying items from the shop.

## Gallery

<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
  <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
    <a href="posts/wizard-wars/wizard-wars1.png" data-lightbox="wizard-wars1" data-title="Wizard Wars Screenshot">
      <img src="posts/wizard-wars/wizard-wars1.png" style="width: 250px; margin: 10px;" />
    </a>
    <a href="posts/wizard-wars/wizard-wars2.png" data-lightbox="wizard-wars2" data-title="Wizard Wars Screenshot">
      <img src="posts/wizard-wars/wizard-wars2.png" style="width: 250px; margin: 10px;" />
    </a>
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
    <a href="posts/wizard-wars/wizard-wars3.png" data-lightbox="wizard-wars3" data-title="Wizard Wars Screenshot">
      <img src="posts/wizard-wars/wizard-wars3.png" style="width: 250px; margin: 10px;" />
    </a>
    <a href="posts/wizard-wars/wizard-wars4.png" data-lightbox="wizard-wars4" data-title="Wizard Wars Screenshot">
      <img src="posts/wizard-wars/wizard-wars4.png" style="width: 250px; margin: 10px;" />
    </a>
  </div>
</div>

<div style="display: flex; align-items: center;">
  <a href="posts/wizard-wars/wizard-sheet.png" data-lightbox="wizard-sheet" data-title="Wizard Sprite Sheet">
    <img src="posts/wizard-wars/wizard-sheet.png" style="width: 300px; margin-right: 20px;" />
  </a>
  <a href="posts/wizard-wars/enemy-sheet.png" data-lightbox="enemy-sheet" data-title="Enemy Sprite Sheet">
    <img src="posts/wizard-wars/enemy-sheet.png" />
  </a>
</div>
