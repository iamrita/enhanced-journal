# Enhanced Journal: Chat-GPT Inspired Journal Sessions 

Based off this [article](https://every.to/chain-of-thought/gpt-3-is-the-best-journal-you-ve-ever-used), I want to create a piece of software that feels like a journal and therapy session combined into one. 

Right now, the web app acts as an interative journal; the user types in how they are feeling, and the the website repsonds back with relevant questions to keep the user writing. If you hit "Save Entry," it stores the current entry with the date to a database in Firebase. You can look at your past entries in the "Entries" link at the top (not show in current gif)

Here is a sample video of the current prototype: 

![](https://github.com/iamrita/enhanced_journal/blob/main/recording_4_3_23.gif)

There is a lot to be explored here. I want the AI interaction here to not just help you feel inspired during one journal session, but to eventually draw on previous things you might have documented in prior sessions. I want it to be able to recognize positive and negative entries, and show some sort of mood tracker. 

Huge stretch - It would be cool if it could save places mentioned in journal entries on a map of some sort. For example, if I say "I went to an amazing restaurant with my boyfriend," it saves the restaurant on Google Maps. Not sure what this would like design wise so this is a big TBD. 


## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. To run the app, run `npm run dev.` 
