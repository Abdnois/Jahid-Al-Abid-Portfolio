/* ------------------------------------------------------------------ *
 * Services visual: replace the Framer device mockup (device image +
 * iframe embeds) with one static screenshot of the actual website.
 *
 * The Framer runtime re-renders this subtree, so the replacement is
 * re-applied whenever the screenshot is missing.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SELECTOR = '#services .framer-1aan3w8';
    var SRC = 'assets/images/Ni74vgkuqdIR02d1m4UEqH4TQ.png';
    var ALT = 'Screenshot of the Red Bull portfolio website design';

    function apply() {
        var container = document.querySelector(SELECTOR);
        if (!container) return;

        var current = container.querySelector('.services-screenshot');
        if (current && container.children.length === 1) return;

        // Drop the device mockup image and the two-screen iframe wrapper.
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        var img = document.createElement('img');
        img.className = 'services-screenshot';
        img.src = SRC;
        img.alt = ALT;
        img.setAttribute('data-services-screenshot', '1');
        container.appendChild(img);
    }

    function start() {
        apply();

        var observer = new MutationObserver(function () {
            apply();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
