<script>
  import { onMount } from "svelte";
  import { siteTitle } from "$lib/config";

  import { percentageColor, updateHistory, toggleSharingModal, toggleAnalytics } from "$lib/util";

  import {
    settings,
    loopDelayAvg,
    isController,
    devices,
    trainingActive,
    attempts,
    potentialSuperglides,
    wrongInputCount,
    crouchTooLateCount,
    gradientArray,
  } from "$lib/stores";

  import Faq from "../../lib/components/Faq.svelte";
  import Footer from "../../lib/components/Footer.svelte";
  import Tips from "../../lib/components/Tips.svelte";
  import Analytics from "../../lib/components/Analytics.svelte";

  // Misc
  let isTabActive = true;

  // Random Background Image
  let backgroundImages = ["/BG_1.jpg", "/BG_2.jpg", " /BG_3.jpg"];
  let randomImage;

  // Controller stuff
  let selectedController = 0; // use the first controller by default
  let controllers = [];
  let jumpButtonPressed = false;
  let crouchButtonPressed = false;

  // Controller Loop
  let controllerLoopId = null;
  let prevTimestamp = 0;
  let loopDelay = 0;
  let loopDelayHz = 0;
  let loopDelayList = [];

  let inputListeners = [];
  let settingsBinding = undefined;
  let assignWarning = false;
  let settingActive = false;
  $: frameTime = 1 / $settings.fps;
  let instructions = "";
  let instructionColor = "";
  let superglideText = "";
  let superglideTextColor = "";
  let message = "";

  const states = {
    Ready: "ready", // Initial State
    Jump: "jump", // Partial Sequence
    JumpWarned: "jumpwarned", // Multi-Jump Warning Sent
    Crouch: "crouch", // Incorrect Sequence, let it play out for a bit
  };

  let state = states.Ready;
  let lastState = states.Jump;
  let startTime = new Date();
  let chance = 0;

  const icon_map = {
    keyboard: "keyboard",
    mouse: "mouse",
    wheel: "mouse",
    controller: "gamepad",
  };

  const events = {
    Keydown: "keydown",
    Mousedown: "mousedown",
    Mouseup: "mouseup",
    Wheel: "wheel",
    Popstate: "popstate",
    Contextmenu: "contextmenu",
  };

  function migrateSettings(oldSettings) {
    // check if oldSettings is in the old format
    if ("jump" in oldSettings && "crouch" in oldSettings && "fps" in oldSettings) {
      // convert to the new format
      console.log("Detected old settings, migrating them...");
      return {
        mnk: {
          jump: oldSettings.jump,
          crouch: oldSettings.crouch,
        },
        controller: {
          jump: 0,
          crouch: 1,
        },
        fps: oldSettings.fps,
      };
    } else {
      // already in the new format, return as is
      return oldSettings;
    }
  }

  // Function to update the controllers array with current connected controllers minus the empty entries in chromium
  function updateControllers() {
    controllers = Array.from(navigator.getGamepads()).filter((controller) => controller !== null);
  }

  function controllerLoop(timestamp) {
    updateControllers();
    // Get the latest gamepad state
    const gamepad = controllers[selectedController];

    if (gamepad) {
      const currentButton = gamepad.buttons.findIndex((button) => button.pressed === true);
      const crouch = gamepad.buttons[$settings.controller.crouch];
      const jump = gamepad.buttons[$settings.controller.jump];

      if (currentButton >= 0) {
        // Settings
        if (settingsBinding) {
          if (currentButton !== getOtherKey(settingsBinding)) {
            $settings.controller[settingsBinding] = currentButton;
            settingsBinding = undefined;
            assignWarning = false;
          } else {
            assignWarning = true;
          }
        }
        console.log(`Pressed button ${currentButton}`);
      }

      if (!crouch.pressed) {
        crouchButtonPressed = false;
      }
      if (!jump.pressed) {
        jumpButtonPressed = false;
      }

      // Trainer
      if ($trainingActive && currentButton >= 0) {
        if (crouch.pressed && !crouchButtonPressed) {
          handleCrouch();
          crouchButtonPressed = true;
        } else if (jump.pressed && !jumpButtonPressed) {
          console.log("Handle jump");
          handleJump();
          jumpButtonPressed = true;
        } else if (currentButton != $settings.controller.crouch && currentButton != $settings.controller.jump) {
          instructions = "Other button pressed, ignoring";
          instructionColor = "warning";
        }
        updateState();
      }
    }

    // Get the time elapsed since last call to controllerLoop
    loopDelay = timestamp - prevTimestamp;
    // Store current timestamp for next time
    prevTimestamp = timestamp;
    loopDelayHz = 1000 / loopDelay;
    loopDelayList.push(loopDelay);
    // Only keep 1000 items to make this stat readable
    if (loopDelayList.length > 1000) {
      loopDelayList.shift();
    }
    $loopDelayAvg = loopDelayList.reduce((acc, curr) => acc + curr, 0) / loopDelayList.length;
  }

  function pauseWhenInactive() {
    isTabActive = !document.hidden;

    if ($isController && !isTabActive) {
      console.log("Tab became inactive, stopping controller polling loop");
      clearInterval(controllerLoopId);
    } else if ($isController) {
      console.log("Tab became active again, starting controller polling loop");
      startControllerLoop();
    }
  }

  onMount(() => {
    // Stop trainer when tab is inactive
    window.addEventListener("visibilitychange", pauseWhenInactive);

    // Random Background Image
    let randomIndex = Math.floor(Math.random() * backgroundImages.length);
    randomImage = backgroundImages[randomIndex];

    // load settings from localstorage
    const content = localStorage.getItem("content");
    if (content) {
      const oldSettings = JSON.parse(content);
      const newSettings = migrateSettings(oldSettings);
      settings.set(newSettings);
      localStorage.setItem("content", JSON.stringify(newSettings));
    }

    const unsubscribe = settings.subscribe((value) => {
      localStorage.setItem("content", JSON.stringify(value));
    });

    return unsubscribe;
  });

  $: prettyBind = (setting) => {
    let buttonText = "";
    let icon_class = "";
    if ($isController) {
      buttonText = `Button ${$settings.controller[setting]}`;
      icon_class = `fas fa-${icon_map["controller"]}`;
    } else {
      switch ($settings.mnk[setting].type) {
        case devices.Keyboard:
          buttonText = $settings.mnk[setting].bind === " " ? "SPACE" : $settings.mnk[setting].bind.toUpperCase();
          break;
        case devices.Mouse:
          buttonText = `Mousebutton ${$settings.mnk[setting].bind}`;
          break;
        case devices.Wheel:
          buttonText = `Mousewheel ${$settings.mnk[setting].bind > 0 ? "DOWN" : "UP"}`;
          break;
        default:
          break;
      }
      icon_class = `fas fa-${icon_map[$settings.mnk[setting].type]}`;
    }

    return `${buttonText}&nbsp;&nbsp;
                <span class="icon">
                    <i class="${icon_class}"></i>
                </span>`;
  };

  $: prettyController = (name) => {
    if (name.length > 47) {
      return name.slice(0, 50) + "...";
    } else {
      return name;
    }
  };

  // always go to the first forward history, which does not exist.
  function disableHistory() {
    window.history.go(1);
  }

  // prevent the right-click menu
  function disableContextmenu(event) {
    event.preventDefault();
  }

  function toggleTraining() {
    $trainingActive = !$trainingActive;

    // Only open the analytics, dont close them when stopping training
    if ($trainingActive) {
      toggleAnalytics(!$trainingActive);
    }

    message = "";
    superglideText = "";
    instructions = "";
    instructionColor = "";
    state = states.Ready;
    lastState = states.Jump;
    updateState();

    // removes focus to disable activation by spacebar
    this.blur();

    if (!$isController && $trainingActive) {
      // clear forward history
      window.history.pushState(null, null, window.location.href);
      window.addEventListener(events.Popstate, disableHistory);
      window.addEventListener(events.Contextmenu, disableContextmenu);
      handleMnK();
    }

    if (!$trainingActive && inputListeners.length > 0) {
      window.removeEventListener(events.Popstate, disableHistory);
      window.removeEventListener(inputListeners[0][0], inputListeners[0][1]);
      window.removeEventListener(inputListeners[1][0], inputListeners[1][1]);
      window.removeEventListener(events.Contextmenu, disableContextmenu);
      inputListeners = [];
    }
  }

  function startControllerLoop() {
    prevTimestamp = new Date(); // calculate the first delay entry correct
    controllerLoopId = setInterval(() => {
      controllerLoop(new Date());
    }, 1);
  }

  function toggleController() {
    $isController = !$isController;
    $trainingActive = false;
    if ($isController) {
      startControllerLoop();
    } else {
      clearInterval(controllerLoopId);
    }
  }

  function getOtherKey(setting) {
    const otherSetting = setting === "jump" ? "crouch" : "jump";
    if ($isController) {
      return $settings.controller[otherSetting];
    } else {
      return $settings.mnk[otherSetting].bind;
    }
  }

  function setSetting(setting) {
    function removeListeners() {
      window.removeEventListener(events.Keydown, handleKeyboard);
      window.removeEventListener(events.Mouseup, handleMouse);
      window.removeEventListener(events.Wheel, handleWheel);
      // TODO: find a better solution for this
      setTimeout(function () {
        window.removeEventListener(events.Contextmenu, disableContextmenu);
      }, 1000);
    }

    function handleKeyboard(event) {
      event.preventDefault();

      if (event.key !== getOtherKey(setting)) {
        if (settingsBinding) {
          // Only change something if no controller was pressed in the meantime
          $settings.mnk[setting].type = devices.Keyboard;
          $settings.mnk[setting].bind = event.key;
        }
        settingsBinding = undefined;
        assignWarning = false;
        removeListeners();
      } else {
        assignWarning = true;
      }
      event.target.blur();
    }

    function handleMouse(event) {
      event.preventDefault();

      if (event.button !== getOtherKey(setting)) {
        if (settingsBinding) {
          // Only change something if no controller was pressed in the meantime
          $settings.mnk[setting].type = devices.Mouse;
          $settings.mnk[setting].bind = event.button;
        }
        settingsBinding = undefined;
        assignWarning = false;
        removeListeners();
      } else {
        assignWarning = true;
      }
      event.target.parentElement.blur();
    }

    function handleWheel(event) {
      event.preventDefault();

      if (Math.sign(event.deltaY) !== getOtherKey(setting)) {
        if (settingsBinding) {
          // Only change something if no controller was pressed in the meantime
          $settings.mnk[setting].type = devices.Wheel;
          $settings.mnk[setting].bind = Math.sign(event.deltaY);
        }
        settingsBinding = undefined;
        assignWarning = false;
        removeListeners();
      } else {
        assignWarning = true;
      }
    }

    if (!settingsBinding) {
      settingsBinding = setting;
      if (!$isController) {
        window.addEventListener(events.Keydown, handleKeyboard);
        // Mouseup, because we want to keep the disableContextmenu listener longer than the click to still disable it
        window.addEventListener(events.Mouseup, handleMouse);
        window.addEventListener(events.Wheel, handleWheel, {
          passive: false,
        });
        window.addEventListener(events.Contextmenu, disableContextmenu);
      }
      // Unable to preventDefault in passive event listner, which causes page to scroll down when binding it to the input.
      // https://chromestatus.com/feature/6662647093133312
    } else {
      removeListeners();
      settingsBinding = undefined;
      settingActive = false;
    }
  }

  function get_device_props(device_type, e = null) {
    switch (device_type) {
      case devices.Keyboard:
        return [events.Keydown, e?.key];
      case devices.Mouse:
        return [events.Mousedown, e?.button];
      case devices.Wheel:
        return [events.Wheel, Math.sign(e?.deltaY)];
    }
  }

  function waitingKeypress() {
    const devices = [$settings.mnk.jump.type, $settings.mnk.crouch.type];
    inputListeners = [];
    return new Promise((resolve) => {
      devices.forEach((dev) => {
        const [event_name, _] = get_device_props(dev, null);
        window.addEventListener(event_name, onEventHandler, {
          passive: false,
        });
        function onEventHandler(e) {
          window.removeEventListener(event_name, onEventHandler);
          const [_, return_value] = get_device_props(dev, e);
          // only prevent default for the two set keys (only works for keyboard events)
          if (return_value === $settings.mnk.jump.bind || return_value === $settings.mnk.crouch.bind) {
            e.preventDefault();
          }
          resolve(return_value);
        }
        inputListeners.push([event_name, onEventHandler]);
      });
    });
  }

  function updateState() {
    if (lastState !== state) {
      if (state === states.Jump) {
        instructions = "Press crouch";
        instructionColor = "";
      } else if (state === states.Ready) {
        instructions = "Press jump";
        instructionColor = "";
      }
    }
    lastState = state;
  }

  function handleCrouch() {
    if (state === states.Ready) {
      startTime = new Date();
      state = states.Crouch;
    } else if (state === states.Jump || state === states.JumpWarned) {
      const now = new Date();
      const calucated = (now.getTime() - startTime.getTime()) / 1000;
      const elapsedFrames = calucated / frameTime;
      const differenceSeconds = frameTime - calucated;
      const lateBy = Math.abs(1 - elapsedFrames);

      if (elapsedFrames < 1) {
        chance = elapsedFrames * 100;
        message = `Crouch later by ${lateBy.toFixed(1)} frames (${differenceSeconds.toFixed(5)}s)`;
      } else if (elapsedFrames < 2) {
        chance = (2 - elapsedFrames) * 100;
        message = `Crouch sooner by ${lateBy.toFixed(1)} frames (${(differenceSeconds * -1).toFixed(1)}s)`;
      } else {
        message = `Crouched too late by ${lateBy.toFixed(1)} frames (${(differenceSeconds * -1).toFixed(5)}s)`;
        chance = 0;
        $crouchTooLateCount += 1;
      }

      updateHistory([
        {
          line: message,
          color: "light",
          finished: false,
        },
        {
          line: `${elapsedFrames.toFixed(1)} frames have passed`,
          color: "light",
          finished: false,
        },
      ]);

      if (chance > 0) {
        $potentialSuperglides = [...$potentialSuperglides, chance];
      }
      superglideText = `${chance.toFixed(2)}% chance to hit the superglide`;
      superglideTextColor = percentageColor(chance);

      updateHistory([
        {
          line: superglideText,
          color: percentageColor(chance),
          finished: true,
        },
      ]);

      $attempts = [...$attempts, chance];
      state = states.Ready;
    } else if (state === states.Crouch) {
      instructions = "Double Crouch Input, resetting";
      instructionColor = "danger";
      chance = 0;
      state = states.Ready;
    }
  }

  function handleJump() {
    if (state === states.Ready) {
      startTime = new Date();
      state = states.Jump;
    } else if (state === states.Jump) {
      state = states.JumpWarned;
      instructions = "Multiple jumps detected, results may not reflect ingame behavior.";
      instructionColor = "warning";
      superglideText = "";
    } else if (state === states.JumpWarned) {
      state = states.JumpWarned;
    } else if (state === states.Crouch) {
      instructions = "You must jump before you crouch";
      instructionColor = "danger";
      updateHistory([
        {
          line: instructions,
          color: instructionColor,
          finished: false,
        },
      ]);

      const now = new Date();
      const delta = (now.getTime() - startTime) / 1000 + frameTime;
      const earlyBy = delta / frameTime;

      chance = 0;

      superglideText = "0% chance to hit the superglide";
      superglideTextColor = percentageColor(chance);
      message = `Crouch later by ${earlyBy.toFixed(2)} frames (${delta.toFixed(5)}s)`;
      updateHistory([
        {
          line: message,
          color: "light",
          finished: false,
        },
        {
          line: superglideText,
          color: superglideTextColor,
          finished: true,
        },
      ]);
      $wrongInputCount += 1;
      $attempts = [...$attempts, chance];
      state = states.Ready;
    }
  }

  async function handleMnK() {
    while ($trainingActive) {
      let key = await waitingKeypress();
      console.log(`Pressed key "${key}"`);

      if (String(key).toLowerCase() === String($settings.mnk.crouch.bind).toLowerCase()) {
        handleCrouch();
      } else if (String(key).toLowerCase() === String($settings.mnk.jump.bind).toLowerCase()) {
        handleJump();
      } else {
        instructions = `Other key pressed, ignoring`;
        instructionColor = "warning";
      }
      updateState();
    }
  }
</script>

<section class="section background-image" style={randomImage ? `background-image: url('${randomImage}');` : ""}>
  <div class="container">
    <h1 class="title is-1 has-text-centered">
      <span class="icon is-medium">
        <img src="/logo.png" alt="superglidetrainer logo" style="transform: scaleX(-1);" />
      </span>
      {siteTitle}
      <span class="icon is-medium">
        <img src="/logo.png" alt="superglidetrainer logo" />
      </span>
    </h1>
    <div
      class="box has-text-centered gradient"
      style="border-bottom: 12px solid transparent; border-image: linear-gradient(90deg, rgba(0, 0, 0, 0), {$gradientArray
        .slice(-10)
        .join(',')}, rgba(0, 0, 0, 0)) 1; width: 100%"
    >
      <p>
        A Superglide needs a jump input first and then a crouch input 1 frame later. You need to do the whole Superglide in the last 0.15 second of a
        mantle.
      </p>
      <p>
        That makes the correct timing of Jump -> Crouch way harder than timing the whole Superglide in the mantle. This trainer will help you learn
        that much harder Jump -> Crouch timing.
      </p>
      <br />
      <p>
        <a href="https://youtu.be/_cP1YO5Idts?si=w8I9vglYEgI_FvtK" target="_blank">Here</a> is our official companion video to this Trainer. Giving you
        every single tip and trick you could need.
      </p>
    </div>
    <div class="columns">
      <div class="column">
        <div class="box has-text-centered">
          <h3 class="title is-3">
            <span class="icon-text"><span class="icon"><i class="fas fa-dumbbell" /></span>&nbsp;<span>Training</span></span>
          </h3>
          <p class="subtitle">Click on the buttons to re-bind them</p>
          <div class="field">
            <div class="field-body">
              <div class="field has-addons">
                <p class="control">
                  <button class="button is-link is-outlined no-hover"> Jump </button>
                </p>
                <p class="control">
                  <button class="button setting-button is-link is-outlined" on:click={() => setSetting("jump")}>
                    {@html prettyBind("jump")}
                  </button>
                  <!-- <span class="tag" /> -->
                </p>
              </div>
              <div class="field has-addons">
                <p class="control">
                  <button class="button is-link is-outlined no-hover"> Crouch </button>
                </p>
                <p class="control">
                  <button class="button is-link is-outlined setting-button" on:click={() => setSetting("crouch")}
                    >{@html prettyBind("crouch")}
                  </button>
                </p>
              </div>
              <div class="field has-addons">
                <p class="control">
                  <button class="button is-link is-outlined no-hover"> FPS </button>
                </p>
                <p class="control">
                  <input class="input is-link is-outlined has-background-dark has-text-white" bind:value={$settings.fps} type="number" min="1" />
                </p>
              </div>
            </div>
          </div>
          {#if settingsBinding}
            <div class="notification is-info">Press any key or mouse button to bind</div>
          {/if}
          {#if assignWarning}
            <div class="notification is-danger">This key is already assigned</div>
          {/if}
          {#if $trainingActive}
            <div class="notification is-{instructionColor}">
              {instructions}
            </div>
            {#if message}
              <div class="notification is-{superglideTextColor}">
                {#if superglideText}
                  <p class="has-text-weight-bold is-size-5">
                    {superglideText}
                  </p>
                {/if}
                {message}
              </div>
            {/if}
          {/if}
          <button class="button is-medium is-fullwidth {$trainingActive ? 'is-danger' : 'is-success'}" on:click={toggleTraining}>
            {$trainingActive ? "Stop" : "Start"}
          </button>
        </div>
        <div class="box">
          <div class="field">
            <div class="field-body">
              <div class="switch-container is-size-4 field has-addons">
                <span class:has-text-grey-light={$isController} class="label-left">MnK</span>
                <label class="switch">
                  <input type="checkbox" on:click={toggleController} />
                  <span class="slider round" />
                </label>
                <span class:has-text-grey-light={!$isController} class="label-right">Controller</span>
              </div>
              <a class="button is-size-5 is-primary tutorial-button" href="https://www.youtube.com/watch?v=_cP1YO5Idts" target="_blank">
                <div class="transparent">
                  <strong>Superglide Tutorial Video</strong>
                </div>
              </a>
            </div>
          </div>
          {#if $isController}
            <br />
            {#if $loopDelayAvg >= 7}
              <div class="notification is-danger">
                Your Browser is polling the controller state with a very low rate. ({$loopDelayAvg.toFixed(2)}ms delay on average)
                <strong> The trainerresults are very inaccurate.</strong>
                <br />
                <!-- TODO: style a <button> that looks like link. Currently not possbile with bulma out of the box -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                Click <a on:click={toggleSharingModal}>here</a> to see more statistics about it
                <br />
                If you are using Firefox, switch to a Chromium based browser as those allow a higher pollingrate. This is a test sentence
              </div>
            {/if}
            {#if controllers.length == 0}
              <p>Please press a button on a controller to connect it</p>
            {:else}
              <div class="control has-icons-left">
                <div class="select">
                  <select bind:value={selectedController}>
                    {#each controllers as controller, index (controller.index)}
                      <option value={index}>{prettyController(controller.id)}</option>
                    {/each}
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-gamepad" />
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>
      <div class="column">
        <Analytics />
      </div>
    </div>
  </div>
  <br />
  <Tips />
  <br />
  <Faq />
</section>
<Footer />
