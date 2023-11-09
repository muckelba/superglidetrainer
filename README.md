# Superglidetrainer

A website based on [this powershell script](https://github.com/AngryGroceries/Apex_Superglide_Practice_Tool) to train your superglide timings. Built with [svelte](https://svelte.dev/) and [bulma](https://bulma.io/).

## TODO

### In progress

- [ ] Expand the protocol for better screenshots

### Backlog

- [ ] More session stats
  - [ ] Add graphs
- [ ] Use a pop-up modal for setting keybinds
- [ ] Sharing feature
- [ ] Add a ? next to analytics to scroll down to the website FAQ section

### Done

- [x] Actually implementing the trainer
- [x] Darkmode
- [x] Don't allow double binds
- [x] Show # of attempts and a overall superglide consistency
- [x] Mousebutton support
- [x] Controller support (<https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API>)

## Local development

To run this website locally, make sure to have [Node.js](https://nodejs.org/en/download/) installed.

- Clone the repository
- Install the requirements with `npm i`
- Start a dev server with `npm run dev`

To make sure the final code is ready to be deployed, build it locally with `npm run build`.
