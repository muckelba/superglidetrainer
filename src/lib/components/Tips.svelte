<script>
  let tipsHidden = true;
  function toggleHidden() {
    tipsHidden = !tipsHidden;
  }
</script>

<div class="card {tipsHidden ? 'container' : ''}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <a class="card-header darker-bg" on:click={toggleHidden}>
    <p class="card-header-title title is-3 is-centered">
      <span class="icon is-large has-text-primary">
        <i class="fa fa-angle-{tipsHidden ? 'down' : 'up'} " />
      </span>
      Helpful tips to get better
      <span class="icon is-large has-text-primary">
        <i class="fa fa-angle-{tipsHidden ? 'down' : 'up'}" />
      </span>
    </p>
  </a>
  <div class="card-content {tipsHidden ? 'is-hidden' : ''} darker-bg">
    <div class="content">
      <h5 class="title is-4">There are two timings. The input timing and the mantle timing</h5>
      <h5 class="title is-4 is-underlined">Get better at hitting the Jump -> Crouch timing</h5>
      <strong>Mouse and keyboard:</strong>
      <ol type="1">
        <li>
          It's common to put your crouch on a button next to your jump input, so you can press them both with 1 finger at the same time. <code>C</code
          >,<code>V</code>
          or <code>B</code> with spacebar for example.
        </li>
        <li>
          The simplest way to alter the delay and which button you hit first is to manually correct it by holding your thumb in a different way. This
          might feel strange at first but often this can already make a 1 -3 frame difference. And with practice you can get consistent.
        </li>
        <li>
          Different keycap profiles will naturally alter which button you hit first. So flipping over your crouch keycap can help. As well as getting
          different keycaps. Or taping stuff to your existing keycaps.
        </li>
        <li>Some folks have seen success by jumping or crouching with Scrollwheel.</li>
        <li>
          Your keyboard switches will also alter when a key is activated. Tactile switches like MX blues make it much easier to feel the activation
          point, and putting different switches on your <code>C</code>,<code>V</code>
          and <code>B</code> then on Spacebar might help with activation as well.
        </li>
        <li>
          The ultimate hardware change would be to get a new keyboard. Either to get away from a low polling rate & weird keystroke scan issues which
          introduce further randomness or make it outright impossible. Or to get a keyboard with activation points you can change. Like from Wooting
          or the Apex Pro Mini from Steelseries. Potential keyboard scan issues and how to resolve them without getting new hardware are further
          explained in the FAQ below.
        </li>
      </ol>
      <strong>Controller:</strong> <br />
      For controller the only tip is to put jump and crouch on two buttons you can hit with the same finger. Like A+B, X+Square or two paddles.
    </div>
    <div class="content">
      <h5 class="title is-4 is-underlined">Get better at timing the Superglide during the mantle</h5>
      <div class="subtitle is-6">
        You need to do the Superglide Inputs in the last 150ms of a mantle. For a start it can help to practice this on the same ledge over and over
        till you are consistent with that. It also helps to practice with the same legend. Since they have different body heights it's easier to get
        used to how a mantle looks on the same legend. Beyond that there are 5 cues you can use to practice the mantle timing.
        <ol type="1">
          <li>
            <strong>Jump</strong><br />Try to jump immediately out of a mantle. Don't even bother with a crouch input for now. The first few frames
            where you jump is the Superglide window. If you jump too early you simply won't jump. So start by deliberately jumping too late and then
            jump earlier and earlier till you are right on the edge where it shifts into not jumping at all. That method of figuring out the mantle
            timing works on every ledge. But there's also
            <a href="https://youtu.be/_cP1YO5Idts?si=8rQNoywHdg3kr41h&t=473" target="_blank">this spot</a>. That even shows you if you jumped too
            late. This is the most precise method to experience the superglide mantle timing for the first time.
          </li>
          <li>
            <strong>Audio cue</strong><br />There is a distinct hand grab sound the Legend does at the end of a mantle. It sounds like
            <a href="https://youtu.be/_cP1YO5Idts?si=GQMXaW4bvzo0Y_tQ&t=497" target="_blank">this</a>. That sound plays at around 0.3 seconds before
            the mantle ends. So if you time your jump crouch combo right after that sound you hit the correct window. But how that timing feels
            between your headset or speaker latency and hand-ear/eye coordination might be different. So it is helpful to use the hand sound as a cue
            but to you it might feel like you have to time your inputs with it instead of after.
          </li>
          <li>
            <strong>Camera shake</strong><br />Your view will shake during a mantle and then come to a stop. It's easiest to see this on the upper
            border of <a href="https://youtu.be/_cP1YO5Idts?si=43fuwGrNpqHAvztb&t=534" target="_blank">your screen</a>. That stop happens just a few
            frames before the Superglide window closes. So doing your input together with the wiggle stop is a good ballpark to aim for. Same as with
            the audio cue, to you it might feel correct to do it slightly before or after.
          </li>
          <li>
            <strong>Camera turn</strong><br />If you
            <a href="https://youtu.be/_cP1YO5Idts?si=mcBShizWXZAKC6KC&t=554" target="_blank">turn your view</a> during the mantle it will stop at about
            80 degrees and then continue after the mantle is finished. Time your jump crouch combo slightly before that. This is not to say to actually
            do a Superglide using the turn, but to use it as a tool to get a feeling for the end of the mantle.
          </li>
          <li>
            <strong>Animations</strong><br />If you have learned to superglide and just keep playing you will start to develop an intuitive
            understanding of how your heirlooms and weapons move around during different mantles. Helping with the feeling of the mantle timing.
          </li>
        </ol>
        <p>All the tips for the jump crouch combo and mantle timing are only good for the initial practice, to get you used to Supergliding.</p>
        <p>Ingame it makes much more sense to go for feeling.</p>
        <p>
          And like with practicing every other Movement-Tech. Play Mixtape. The density of fights to practice in is 5-10x higher in mixtape then in
          BR. And if you don't have a teammate you can disappoint, because you just lost them the game with your Superglide attempt, your mind is free
          to care about movement, without pressure.
        </p>
      </div>
    </div>
  </div>
</div>
