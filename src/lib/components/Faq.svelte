<script>
  let faqHidden = true;

  function toggleFaq() {
    faqHidden = !faqHidden;
  }
</script>

<div class="card">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="card-header" on:click={toggleFaq}>
    <button class="button card-header-icon is-large" aria-label="collapse the FAQ">
      <i class="fa fa-angle-{faqHidden ? 'down' : 'up'}" />
    </button>
    <p class="card-header-title title is-3">FAQ</p>
  </a>
  <div class="card-content faq-content {faqHidden ? 'is-hidden' : ''}">
    <h4 class="title is-4 is-underlined">Superglide Trainer questions:</h4>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">Why do i keep consistently hitting the exact same frame delay? Why can't i go lower then that?</h5>
          <p />
          <p class="subtitle is-6 is-underlined">
            <strong>Website Issues:</strong>
          </p>
          <p class="subtitle is-6">
            By using this web based Superglide trainer you trade accuracy for convenience, compared to the Powershell script.
          </p>
          <p class="subtitle is-6">
            On the web we can only pull your inputs at a certain frequency. This introduces an uncertainty. We are currently working on displaying
            this uncertainty to you for MnK. For controller we already display the uncertainty in "Show all stats".
          </p>
          <p class="subtitle is-6">
            Most browser-setups seem to poll MnK inputs at 1kHz. At 144 FPS this results in an average uncertainty of around 7%. So when you get a 48%
            chance to hit the Superglide, on average it could be anything between 41% or 55%.<br />
            We are also working on potentially improving the poll frequency for both MnK and Controller.
          </p>
          <p class="subtitle is-6">
            But this means this web based Superglide Trainer still fulfills its purpose.<br />
            It helps beginners and intermediates get used to the order of inputs, resolve hardware problems and track their rough progress.<br />
            But if your overall superglide consistency starts to regularly stay above 70% and you want to make sure that your progress towards 90 and 100%
            is as accurate as possible, you could start using the Powershell script linked at the bottom. It's not limited by browser limitations and doesn't
            suffer from the same uncertainty problem.
          </p>
          <p class="subtitle is-6 is-underlined">
            <strong>Keyboard issues:</strong>
          </p>
          <p class="subtitle is-6">
            Find out the polling rate of your keyboard. That + some other small system delays is the lowest frame delay you can hit. The numbers still
            don't make sense?
          </p>
          <p class="subtitle is-6">Your keyboard might scan the inputs in a weird way.</p>
          <ul>
            <li>In key clusters. So switching over 1 key left or right might get you out of one cluster and suddenly into the perfect delay.</li>
            <li>
              In a direction like from left to right. So using <code>C</code>,<code>V</code>,<code>B</code>,<code>N</code> with spacebar all come with
              a different delay and only one of them is the correct one.
            </li>
            <li>
              Different scan rates or delays on your modifier keys (Spacebar, Shift, Ctrl etc.) So using Spacebar as jump input might never ever work
              for you. Using two letters next to each other might be your solution.
            </li>
          </ul>

          <p class="subtitle is-6">
            So try what happens to your frame delay when you switch away from spacebar as jump input. Try out keys next to each other, in different
            orders and keys far apart from each other. Try to use a keyboard-key for one input and a mouse-button for the other. This should help you
            narrow down the issue. You may or may not want to use those exact keybinds in game. But it will help you narrow down what your hardware
            issues might be. So you can potentially adapt a keybind setup that can work for you, without getting a new keyboard.
          </p>
          <p class="subtitle is-6 is-underlined">
            <strong>Other hardware issues:</strong>
          </p>
          <ul>
            <li>
              A faulty USB port or other system related latency Issues can be the cause of that. Switch USB ports. Check if your device drivers are up
              to date. In extreme cases, problems with other components like your motherboard, CPU or operating system could be the cause.
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">Any plans for future updates?</h5>
          <p class="subtitle is-6">
            We are looking into potentially improving the poll frequency for both MnK and Controller, maybe help with training the mantle timing and
            make the whole site look sleeker. I (Mokey) am also working on a Superglide companion video to this trainer.
          </p>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">What do the analytics mean?</h5>
          <p class="subtitle is-6">
            All our analytics are only in relation to hitting your jump -> Crouch timing. Your timing within the mantle is still totally up to
            you....for now 😉
          </p>
          <ul>
            <li>
              <strong>Overall superglide consistency:</strong> Is the average chance out of all your attempts. 0% or 95% it gets counted. This gives you
              a % number for the following question: If i attempted a Superglide in game, how likely am i to hit that Superglide?
            </li>
            <li>
              <strong>Attempts:</strong> Number of attempts this session. Reload the page to reset everything.
            </li>
            <li>
              <strong>Potential Superglides:</strong> How often you hit over 0% chance and thereby have the potential to hit a Superglide.
            </li>
            <li>
              <strong>Average successful chance:</strong> The average chance of all attempts over 0%.
            </li>
            <li>
              <strong>Wrong input first/Crouch too late:</strong> Why you messed up your Superglide and got a 0% chance.
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">Why is there a Chance? I thought it just needed frame perfect inputs?</h5>
          <p class="subtitle is-6">
            Because of the way Apex handles input data, you might have timed your jump and crouch input very close to 1 FPS apart. But they might
            still be processed by the engine on the same frame. Or 2 frames apart. When it only works when they are processed 1 frame apart. That is
            also the reason why the feedback can say to crouch later to get a higher chance. Because of that randomness you can never reach 100%
            Superglide consistency. Maximum is 99%. Here is a fantastic video explaining the exact same problem in Titanfall 2, for another frame
            dependent technique:
          </p>
          <p>
            <iframe
              class="has-ratio"
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/Cwa0qbDx2dA?start=423"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </p>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">Is it really just 1 Frame between the jump and crouch?</h5>
          <p class="subtitle is-6">
            Yes and No. <br />
            From 0-100FPS it is 1 frame. There have been recent discoveries that above 100FPS the delay get's bigger than 1 FPS. We are working on figuring
            out the exact delays and what the implications for the % chances are.
          </p>
        </li>
      </ul>
    </div>
    <h4 class="title is-4 is-underlined">General Superglide questions:</h4>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">What is a Superglide and why should i care about learning it?</h5>
          <p class="subtitle is-6">
            A Superglide is an instant 1 frame acceleration out of a mantle. Beyond just being fun this is a great way to throw of your enemies aim,
            escape and/or chase someone or even get across gaps that are not possible to gap without the usage of movement abilities.
          </p>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul>
        <li>
          <h5 class="title is-5">How do i know if i hit a Superglide in game?</h5>
          <p class="subtitle is-6">
            The immediate speed feels very different to every other slide or jump of a ledge or mantle. <br />
            One indicator is the change in Field of View. <br />
            An instant slide can also change your FOV. So it's not a surefire way to know. But if your Fov didn't change you definetly didn't hit a Superglide.
            <br />
            The best way to know for sure is to train in a spot that only a superglide can cross.
            <br />
            <a href="https://youtu.be/3W4McYsiPoM?t=260" target="_blank">Video with Spots</a> <br />
            If you have a teammate with you, or are in third person you can easily tell if you hit a Superglide by the way your legs will suddenly straighten
            out. Compared to the crouch out of a slide or the angled legs of a jump.
          </p>
        </li>
      </ul>
    </div>
  </div>
</div>
