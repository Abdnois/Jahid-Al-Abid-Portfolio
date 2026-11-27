/* ------------------------------------------------------------------ *
 * Projects: Cedrina Farm occupies three existing Framer card containers.
 *
 * Retargeting the original containers (the same mechanism used for VERDÉ)
 * keeps the Framer-generated sizing, spacing, clipping, card overlay and
 * hover behaviour intact. No card is cloned and no layout override is used.
 * The three chosen containers leave exactly three VERDÉ, three Red Bull and
 * three Cedrina cards in the desktop grid.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SITE = 'https://abdnois.github.io/cedrina-farm/';
    var REPO = 'https://github.com/Abdnois/cedrina-farm';
    var NAME = 'Cedrina Farm';
    var CATEGORY = 'Artisan Preserves';
    var DESCRIPTION = 'A small-batch preserves storefront with seasonal jars, product storytelling and a warm editorial shopping experience.';
    var TECH = 'TypeScript, React, Vite, Cloudflare Workers';
    var TITLE = NAME + ' — ' + CATEGORY + ' — ' + DESCRIPTION + ' — ' + TECH;

    var CEDRINA_CARDS = [
        {
            container: 'framer-17ecfsj-container',
            image: 'assets/images/cedrina-story.png',
            position: '50% 35%',
            label: 'Cedrina Farm story — the hillside kitchen and jar collection'
        },
        {
            container: 'framer-1q40z7n-container',
            image: 'assets/images/cedrina-desktop.png',
            label: 'Cedrina Farm home — small-batch preserves on desktop'
        },
        {
            container: 'framer-1wwyak-container',
            image: 'assets/images/cedrina-mobile.png',
            label: 'Cedrina Farm on mobile — pistachio pesto product story'
        }
    ];

    function convert(card) {
        var section = document.getElementById('projects') || document.querySelector('section[data-framer-name="Projects"]');
        var wrapper = section ? section.querySelector('.' + card.container) : null;
        if (!wrapper) return;
        var anchor = wrapper.querySelector('a[href]');
        var img = wrapper.querySelector('img');
        if (!anchor || !img) return;

        if (anchor.getAttribute('href') !== SITE) {
            anchor.setAttribute('href', SITE);
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
            anchor.setAttribute('title', TITLE);
            anchor.setAttribute('aria-label', 'View casestudy: ' + NAME + ', ' + CATEGORY);
            anchor.setAttribute('data-project', 'cedrina');
            anchor.setAttribute('data-repository', REPO);
        }

        if (img.getAttribute('src') !== card.image) {
            if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
            if (img.hasAttribute('sizes')) img.removeAttribute('sizes');
            img.setAttribute('src', card.image);
            img.setAttribute('alt', card.label + ' — ' + NAME);
        }

        if (card.position && img.style.objectPosition !== card.position) {
            img.style.setProperty('object-position', card.position, 'important');
        }
    }

    function apply() {
        CEDRINA_CARDS.forEach(convert);
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
