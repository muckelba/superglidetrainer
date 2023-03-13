<script>
    let tipsHidden = true;
    function toggleHidden() {
        tipsHidden = !tipsHidden;
    }
</script>

<div class="card">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="card-header" on:click={toggleHidden}>
        <button
            class="button card-header-icon is-large"
            aria-label="collapse helpful tips"
        >
            <i class="fa fa-angle-{tipsHidden ? 'down' : 'up'}" />
        </button>
        <p class="card-header-title title is-3">Helpful tips to get better</p>
    </a>
    <div class="card-content {tipsHidden ? 'is-hidden' : ''}">
        <div class="content">
            <h5 class="title is-5">
                Get better at hitting the Jump -> Crouch Timing
            </h5>
            <strong>Mouse and Keyboard:</strong>
            <ol type="1">
                <li>
                    It's common to put your crouch on a button next to your jump
                    input, so you can press them both with 1 finger at the same
                    time. <code>C</code>,<code>V</code>
                    or <code>B</code> with spacebar for example.
                </li>
                <li>
                    Different keycap profiles will naturally alter which button
                    you hit first. So flipping over your crouch keycap can help.
                    As well as getting different keycaps. Or taping stuff to
                    your existing keycaps.
                </li>
                <li>
                    Some folks have seen success by jumping with Scrollwheel.
                </li>
                <li>
                    Your keyboard switches will also alter when a key is
                    activated. Tactile switches like MX blues make it much
                    easier to feel the activation point, and putting different
                    switches on your <code>C</code>,<code>V</code>
                    and <code>B</code> then on Spacebar might help with activation
                    as well.
                </li>
                <li>
                    The ultimate Hardware Change would be to get a new keyboard.
                    Either to get away from a low polling rate, which introduces
                    further randomness. Or to get a keyboard with activation
                    points you can change. Like from Wooting or the Apex Pro
                    Mini from Steelseries.
                </li>
            </ol>
            <strong>Controller:</strong> <br />
            For controller the eastiest way is to press either A+B with one finger
            or X+Square with one finger.
        </div>
        <div class="content">
            <h5 class="title is-5">
                Get better at timing the Superglide during the Mantle
            </h5>
            <div class="subtitle is-6">
                You need to do the Superglide Inputs in the last 0.1-0.2 sec of
                a Mantle. For a start it can help to practice this on the same
                ledge over and over till you are consistent with that. It also
                helps to practice with the same legend. Since they have
                different body heights it's easier to get used how a mantle
                looks on the same legend. Additionally you can use different
                cues to help with the timing:
                <ul>
                    <li>
                        <strong>Audio cue</strong><br />There is a distinct,
                        higher pitched hand grab sound effect at the end of a
                        mantle. That starts at around 0.3-0.25 sec before the
                        mantle finishes. So timing your Superglide just as its
                        about to end or slightly after it ended is perfect. How
                        that timing feels between your headset/speaker latency
                        and hand-ear/eye coordination might be different. So you
                        might time it with or before the Audio-cue happens.
                        <a href="https://youtu.be/i7jfEFrJ4sw">Here</a> is what that
                        sounds and looks like.
                    </li>
                    <li>
                        <strong>Visual cue</strong><br />You can also time it
                        with the camera movement. Check in the top left or right
                        corner. You view goes from wobbling to completely still
                        a few frames before the Superglide-window closes. So
                        some people time it using that. I zoomed into the
                        corners in the
                        <a href="https://youtu.be/i7jfEFrJ4sw"
                            >audio-trigger video</a
                        > to make it more obvious.
                    </li>
                </ul>
                <br />
                Using these cues is only good for practice. Trying to do Superglides
                in game during gunfights with cues is almost impossible. So use the
                cues to practise the timing and then start to get used to it by feeling.
                <br />
                One last timing tip: If you don't gain any speed of the ledge you
                hit the Superglide to early in the mantle.
            </div>
        </div>
    </div>
</div>
