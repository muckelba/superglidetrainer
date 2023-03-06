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
        <button class="card-header-icon" aria-label="collapse the FAQ">
            <i class="fa fa-angle-{faqHidden ? 'down' : 'up'}" />
        </button>
        <p class="card-header-title title is-4">FAQ</p>
    </a>
    <div class="card-content {faqHidden ? 'is-hidden' : ''}">
        <div class="content">
            <h5 class="title is-5">
                What is a Superglide and why should i care about learning it?
            </h5>
            <p class="subtitle is-6">
                A Superglide is an instant 1 Frame acceleration out of a Mantle.
                Beyond just being fun this is a great way to throw of your
                enemies aim, escape and/or chase someone or even get across gaps
                that are not possible to gap without the usage of movement
                abilities.
            </p>
        </div>
        <div class="content">
            <h5 class="title is-5">
                Why is there a Chance? I thought it just needed Frame perfect
                inputs?
            </h5>
            <p class="subtitle is-6">
                Because of the way Apex handles Input data, you might have timed
                your jump and crouch input very close to 1 FPS apart. But they
                might still be processed by the engine on the same Frame. Or 2
                Frames apart. When it only works when they are processed 1 Frame
                apart. That is also the reason why the feedback can say to
                crouch later or sooner. Because of that randomness you can never
                reach 100% Superglide consistency. Max is 99%. Here is a
                fantastic video explaining the exact same Problem in Titanfall
                2:
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
            <h5 class="title is-5">What do the Analytics mean?</h5>
            <p class="subtitle is-6">blablabla replace me</p>
        </div>
        <div class="content">
            <h5 class="title is-5">
                Why do i keep consistently hitting the exact same Frame Delay?
            </h5>
            <p class="subtitle is-6">
                Find out the Polling Rate of your Keyboard. That + some other
                small system delays is the lowest Frame delay you can hit. The
                numbers still don't make sense? A Faulty USB Port or other
                System related Latency Issues can be the cause of that. Check if
                your device drivers are up to date. Try if the same happens when
                you use a Keyboard Key and a Mousebutton for the inputs and or
                switch the USB Ports. In extreme cases problems with other
                components like your motherboard, CPU or operating system
                install could be the cause.
            </p>
        </div>
        <div class="content">
            <h5 class="title is-5">Who made this Trainer?</h5>
            <p class="subtitle is-6">
                This website is made by <a href="https://github.com/muckelba"
                    >@muckelba</a
                >
                and based on a
                <a
                    href="https://github.com/AngryGroceries/Apex_Superglide_Practice_Tool"
                    >powershell script</a
                >
                that
                <a href="https://github.com/AngryGroceries">@AngryGroceries</a>
                and
                <a href="https://github.com/JayTheYggdrasil">@JayTheYggdrasil</a
                >
                made.
            </p>
        </div>
    </div>
</div>
