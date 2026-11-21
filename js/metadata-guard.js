/* Keep the deployed document metadata stable when the Framer runtime
   re-applies template title/canonical/hreflang values after hydration.
   No production domain is invented: canonical/og:url/hreflang stay unset. */
(function () {
    'use strict';

    var TITLE = 'Jahid Al Abid | Independent Web Developer';
    var DESCRIPTION = 'Modern, responsive websites for small businesses. Explore my projects, services and web development work.';

    function setMeta(selector, content) {
        var node = document.querySelector(selector);
        if (node && node.getAttribute('content') !== content) {
            node.setAttribute('content', content);
        }
    }

    function apply() {
        if (document.title !== TITLE) document.title = TITLE;
        setMeta('meta[name="description"]', DESCRIPTION);
        setMeta('meta[property="og:title"]', TITLE);
        setMeta('meta[property="og:description"]', DESCRIPTION);
        setMeta('meta[name="twitter:title"]', TITLE);
        setMeta('meta[name="twitter:description"]', DESCRIPTION);

        // Unknown Vercel URL: keep these unset rather than guessing a domain.
        [].slice.call(document.querySelectorAll('link[rel="canonical"], link[hreflang], meta[property="og:url"]')).forEach(function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);
        });
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['content', 'href', 'rel', 'hreflang']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
