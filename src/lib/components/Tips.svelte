<script>
    import Faq from "./Faq.svelte";

    let tipsHidden = true;
    function toggleHidden() {
        tipsHidden = !tipsHidden;
    }
</script>

<div class="card">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="card-header" on:click={toggleHidden}>
        <button class="card-header-icon" aria-label="collapse helpful tips">
            <i class="fa fa-angle-{tipsHidden ? 'down' : 'up'}" />
        </button>
        <p class="card-header-title title is-4">Helpful tips to get better</p>
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
                    The Ultimate Hardware Change would be to get a new Keyboard.
                    Either to get away from a low polling rate, which introduces
                    further randomness. Or to get a Keyboard with activation
                    points you can change. Like from Wooting or the Apex Mini
                    Pro from Steelseries
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
                <ul>
                    <li>Audio cue</li>
                    <li>Camera Shake</li>
                </ul>
                If you don't gain any Speed you hit the Superglide to early. If you
                jump of the ledge with speed but not a Superglide you hit it too
                late.
            </div>
        </div>
    </div>
</div>
