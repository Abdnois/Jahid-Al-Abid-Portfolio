/* ------------------------------------------------------------------ *
 * Projects: three VERDÉ cards in the desktop grid.
 *
 * The Framer runtime renders the image-only case-study cards. This module
 * retargets three of them to VERDÉ, swapping in real screenshots captured
 * from the live VERDÉ website. Card markup, sizes, hover effects,
 * grayscale treatment and animations are untouched. The remaining project
 * containers are handled by their own project scripts. Re-applied if
 * Framer re-renders.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SITE = 'https://abdnois.github.io/verde-skincare-store/';
    var REPO = 'https://github.com/Abdnois/verde-skincare-store';
    var NAME = 'VERDÉ — Naturally in Balance';
    var CATEGORY = 'Skincare E-commerce';
    var DESCRIPTION = 'An interactive skincare e-commerce experience designed to make discovering products and building personalised skincare routines simple. Features product browsing, wishlist management, shopping bag, checkout flow, and a personalised skin quiz.';
    var TECH = 'React 19, TypeScript, Tailwind CSS 4, React Router, Motion, Hono / Cloudflare Workers';

    // Right column (Col 6), top to bottom. The other project containers
    // keep their own destinations.
    var VERDE_CARDS = [
        {
            container: 'framer-jj94u9-container',
            image: 'assets/images/verde-home.png',
            position: '10% 50%',
            label: 'VERDÉ home — thoughtful care, lasting glow'
        },
        {
            container: 'framer-1wwyak-container',
            image: 'assets/images/verde-shop.png',
            label: 'VERDÉ shop — all products'
        },
        {
            container: 'framer-1q40z7n-container',
            image: 'assets/images/verde-quiz.png',
            position: '75% 50%',
            label: 'VERDÉ skin quiz'
        }
    ];

    function convert(card) {
        var wrapper = document.querySelector('#projects .' + card.container);
        if (!wrapper) return;
        var anchor = wrapper.querySelector('a[href]');
        var img = wrapper.querySelector('img');
        if (!anchor || !img) return;

        if (anchor.getAttribute('href') !== SITE) {
            anchor.setAttribute('href', SITE);
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
            anchor.setAttribute('title', NAME + ' — ' + CATEGORY + ' — ' + DESCRIPTION + ' — ' + TECH);
            anchor.setAttribute('aria-label', 'View casestudy: ' + NAME + ', ' + CATEGORY);
            anchor.setAttribute('data-project', 'verde');
            anchor.setAttribute('data-repository', REPO);
        }

        if (img.getAttribute('src') !== card.image) {
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');
            img.setAttribute('src', card.image);
            img.setAttribute('alt', card.label + ' — ' + NAME);
        }

        // Framer carries over object-position values from the Red Bull cards.
        // Only the two cards needing better framing are overridden; shop and
        // product keep their original centre framing.
        if (card.position && img.style.objectPosition !== card.position) {
            img.style.setProperty('object-position', card.position, 'important');
        }
    }

    function apply() {
        VERDE_CARDS.forEach(convert);
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
