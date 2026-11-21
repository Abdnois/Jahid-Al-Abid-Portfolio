/* Replace the FAQ image with the exact uploaded wooden FAQ-blocks image.
   The Framer runtime can re-render this image, so the change is re-applied
   whenever the old source reappears. */
(function () {
    'use strict';

    var SRC = 'assets/images/faq-blocks.png';

    function apply() {
        var faq = document.getElementById('faq');
        if (!faq) return;

        var img = faq.querySelector('img');
        if (!img) return;

        var current = img.getAttribute('src') || '';
        if (img.classList.contains('faq-blocks-image') && current.indexOf('faq-blocks.png') !== -1) return;

        // Remove srcset/sizes so the browser cannot choose the old lemon image.
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('src', SRC);
        img.setAttribute('alt', 'Wooden F, A and Q blocks spelling Frequently Asked Questions');
        img.classList.add('faq-blocks-image');
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
