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
        <button
            class="button card-header-icon is-large"
            aria-label="collapse the FAQ"
        >
            <i class="fa fa-angle-{faqHidden ? 'down' : 'up'}" />
        </button>
        <p class="card-header-title title is-3">FAQ</p>
    </a>
    <div class="card-content {faqHidden ? 'is-hidden' : ''}">
        <h4 class="title is-4 is-underlined">Superglide Trainer Questions:</h4>
        <div class="content">
            <h5 class="title is-5">
                Why is there a Chance? I thought it just needed Frame perfect
                inputs?
            </h5>
            <p class="subtitle is-6">
                Because of the way Apex handles input data, you might have timed
                your jump and crouch input very close to 1 FPS apart. But they
                might still be processed by the engine on the same frame. Or 2
                frames apart. When it only works when they are processed 1 frame
                apart. That is also the reason why the feedback can say to
                crouch later to get a higher chance. Because of that randomness
                you can never reach 100% Superglide consistency. Maximum is 99%.
                Here is a fantastic video explaining the exact same problem in
                Titanfall 2, for another frame dependent technique:
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
        </div>
        <div class="content">
            <h5 class="title is-5">
                Why do i keep consistently hitting the exact same Frame Delay?
            </h5>
            <p class="subtitle is-6">
                Find out the polling rate of your keyboard. That + some other
                small system delays is the lowest frame delay you can hit. The
                numbers still don't make sense? A faulty USB port or other
                system related latency Issues can be the cause of that. Check if
                your device drivers are up to date. Try if the same happens when
                you switch away from spacebar as jump input. Try to use a
                keyboard-key for one input and a mouse-button for the other
                and/or switch the USB ports. In extreme cases, problems with
                other components like your motherboard, CPU or operating system
                could be the cause.
            </p>
        </div>
        <div class="content">
            <h5 class="title is-5">What do the Analytics mean?</h5>
            <p class="subtitle is-6">
                All our analytics are only in relation to hitting your jump ->
                Crouch timing. Your timing within the mantle is still totally up
                to you....for now ????
            </p>
            <ul>
                <li>
                    <strong>Overall superglide consistency:</strong> Is the average
                    chance out of all your attempts. 0% or 95% it gets counted. This
                    gives you a % number for the following question: If i attempted
                    a Superglide in Game, how likely am i to hit that Superglide?
                </li>
                <li>
                    <strong>Attempts:</strong> Number of attempts this session. Reload
                    the page to reset everything.
                </li>
                <li>
                    <strong>Potential Superglides:</strong> How often you hit over
                    0% chance and thereby have the potential to hit a Superglide.
                </li>
                <li>
                    <strong>Average successful chance:</strong> The average chance
                    of all attempts over 0%.
                </li>
                <li>
                    <strong>Wrong input first/Crouch too late:</strong> Why you messed
                    up your Superglide and got a 0% chance.
                </li>
            </ul>
        </div>
        <h4 class="title is-4 is-underlined">General Superglide Questions:</h4>
        <div class="content">
            <h5 class="title is-5">
                What is a Superglide and why should i care about learning it?
            </h5>
            <p class="subtitle is-6">
                A Superglide is an instant 1 frame acceleration out of a mantle.
                Beyond just being fun this is a great way to throw of your
                enemies aim, escape and/or chase someone or even get across gaps
                that are not possible to gap without the usage of movement
                abilities.
            </p>
        </div>
        <div class="content">
            <h5 class="title is-5">
                How do i know if i hit a Superglide in game?
            </h5>
            <p class="subtitle is-6">
                The immediate speed feels very different to every other slide or
                jump of a ledge or mantle. The biggest indicator is the change
                in FOV. If your FOV didn't change. You didn't hit a Superglide.
                Go to the fire range to the long metal box at the top. A
                Superglide will clear it from one side to the other without
                scraping your feet. If you can't clear that box. You are not
                supergliding.<br />
                <a href="https://youtu.be/i7jfEFrJ4sw?t=23"
                    >Here is how that looks and sounds.</a
                >
            </p>
        </div>
    </div>
</div>
