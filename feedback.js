(function () {
    const feedbackMarkup = `
        <button class="feedback-trigger" type="button" aria-haspopup="dialog" aria-controls="feedback-dialog">
            <span class="feedback-trigger-mark" aria-hidden="true">✳</span><span>Feedback</span>
        </button>
        <div class="feedback-overlay" id="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title" aria-describedby="feedback-description" hidden>
            <section class="feedback-panel" tabindex="-1">
                <button class="feedback-close" type="button" aria-label="Close feedback form">×</button>
                <div class="feedback-kicker"><span class="feedback-live-dot"></span> SECURE LINE <span class="feedback-kicker-rule"></span> 01</div>
                <h2 id="feedback-title">Feedback<span class="feedback-title-period">.</span></h2>
                <p class="feedback-description" id="feedback-description">Share suggestions or report issues</p>
                <form class="feedback-form">
                    <fieldset class="feedback-types">
                        <legend>01 / MESSAGE TYPE</legend>
                        <label class="feedback-type-choice"><input type="radio" name="type" value="Suggestion" checked><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 18h8M9 21h6M7.5 14.5a7 7 0 1 1 9 0c-1 .8-1.5 1.5-1.5 2.5h-6c0-1-.5-1.7-1.5-2.5Z"/><path d="M12 3v2M4.9 5.9l1.4 1.4M19.1 5.9l-1.4 1.4"/></svg><span>Suggestion</span></label>
                        <label class="feedback-type-choice"><input type="radio" name="type" value="Bug report"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8v9a4 4 0 0 1-8 0V8ZM9 8a3 3 0 0 1 6 0M4 12h4m8 0h4M5.5 7.5l2.8 2.8m10.2-2.8-2.8 2.8M6 18h3m6 0h3"/></svg><span>Bug report</span></label>
                        <label class="feedback-type-choice"><input type="radio" name="type" value="Feature request"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg><span>Feature request</span></label>
                        <label class="feedback-type-choice"><input type="radio" name="type" value="Other"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 3V5Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg><span>Other</span></label>
                    </fieldset>
                    <label class="feedback-field-label" for="feedback-message">Your Message <span aria-hidden="true">*</span></label>
                    <textarea id="feedback-message" name="message" rows="5" maxlength="5000" placeholder="Tell us what you think…" required></textarea>
                    <label class="feedback-field-label" for="feedback-email">Email <span class="feedback-optional">(optional)</span></label>
                    <input id="feedback-email" type="email" name="email" maxlength="254" placeholder="your@email.com" autocomplete="email">
                    <small class="feedback-helper">Only if you’d like a reply. Your message is delivered to the site owner via FormSubmit.</small>
                    <input class="feedback-honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
                    <input type="hidden" name="_subject" value="Deep Web Nest feedback">
                    <button class="feedback-submit" type="submit"><span aria-hidden="true">↗</span> Submit Feedback</button>
                    <p class="feedback-status" role="status" aria-live="polite" hidden></p>
                </form>
            </section>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', feedbackMarkup);

    const trigger = document.querySelector('.feedback-trigger');
    const overlay = document.querySelector('.feedback-overlay');
    const panel = document.querySelector('.feedback-panel');
    const closeButton = document.querySelector('.feedback-close');
    const form = document.querySelector('.feedback-form');
    const submitButton = document.querySelector('.feedback-submit');
    const status = document.querySelector('.feedback-status');

    function openFeedback() {
        overlay.hidden = false;
        document.body.classList.add('feedback-open');
        const firstType = form.querySelector('input[name="type"]');
        (firstType || panel).focus();
    }

    function closeFeedback() {
        overlay.hidden = true;
        document.body.classList.remove('feedback-open');
        trigger.focus();
    }

    trigger.addEventListener('click', openFeedback);
    closeButton.addEventListener('click', closeFeedback);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeFeedback();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !overlay.hidden) closeFeedback();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const values = Object.fromEntries(new FormData(form).entries());
        if (values._honey) return;
        delete values._honey;

        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
        status.hidden = true;
        status.classList.remove('feedback-error');

        try {
            const response = await fetch('https://formsubmit.co/ajax/3hk-x@mail.ru', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(values)
            });
            const result = await response.json();
            if (!response.ok || result.success === false || result.success === 'false' || result.error) {
                throw new Error(result.message || 'The feedback could not be sent. Please try again.');
            }

            form.reset();
            status.textContent = 'Thanks! Your feedback has been sent.';
            status.hidden = false;
        } catch (error) {
            status.textContent = error.message || 'Could not send feedback. Please try again later.';
            status.classList.add('feedback-error');
            status.hidden = false;
        } finally {
            submitButton.disabled = false;
        submitButton.innerHTML = '<span aria-hidden="true">↗</span> Submit Feedback';
        }
    });
})();
