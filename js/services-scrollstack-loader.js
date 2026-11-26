/* ------------------------------------------------------------------ *
 * Services Bento Scroll Stack loader.
 *
 * Uses the same React Bits Scroll Stack bundle as the Process section, but
 * targets the four service cards at <=1024px. The original column wrappers
 * stay in the DOM and are only hidden while the stack is mounted.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var QUERY = '(max-width: 1024px)';
    var SECTION = '#services';
    var BENTO = '.framer-1c7zclr';
    var CARD = '.framer-nSE2Y';

    var mql = window.matchMedia(QUERY);

    var script = document.currentScript;
    if (!script || !script.src) {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (/services-scrollstack-loader\.js/.test(scripts[i].src)) {
                script = scripts[i];
                break;
            }
        }
    }
    var base = script && script.src ? new URL('.', script.src).href : 'js/';

    var mod = null;
    var modulePromise = null;
    var host = null;
    var busy = false;
    var scheduled = false;
    var resizeTimer = 0;
    var suppressMutations = false;

    function ensureStyle() {
        if (document.querySelector('link[data-ja-scrollstack-style]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'scrollstack/scrollstack.css';
        link.setAttribute('data-ja-scrollstack-style', '');
        document.head.appendChild(link);
    }

    function loadModule() {
        if (mod) return Promise.resolve(mod);
        if (modulePromise) return modulePromise;
        ensureStyle();
        modulePromise = import(base + 'scrollstack/scrollstack.js')
            .then(function (loaded) {
                mod = loaded;
                return loaded;
            })
            .catch(function (error) {
                modulePromise = null;
                console.warn('[services] Scroll Stack module failed to load.', error);
                throw error;
            });
        return modulePromise;
    }

    function findBento() {
        var section = document.querySelector(SECTION);
        return section ? section.querySelector(BENTO) : null;
    }

    /* Columns are what get hidden; their card wrappers are what get cloned. */
    function collect() {
        var bento = findBento();
        if (!bento) return { bento: null, columns: [], cards: [] };
        var columns = Array.prototype.filter.call(bento.children, function (child) {
            return !!child.querySelector(CARD) && !child.hasAttribute('data-ja-scrollstack');
        });
        var cards = Array.prototype.map.call(
            bento.querySelectorAll(CARD),
            function (card) {
                return card.parentElement;
            }
        ).filter(function (wrapper) {
            return wrapper && !wrapper.closest('[data-ja-scrollstack]');
        });
        return { bento: bento, columns: columns, cards: cards };
    }

    function cloneCards(nodes) {
        return nodes.map(function (node) {
            var clone = node.cloneNode(true);
            clone.removeAttribute('data-ja-original-card');
            var card = clone.querySelector(CARD);
            // Framer writes its appear start state (opacity 0 / translateX)
            // onto the card root itself. A clone never receives the animation
            // that clears it, so settle it at its final visible state.
            [clone, card].forEach(function (el) {
                if (!el) return;
                if (el.style.opacity && el.style.opacity !== '1') el.style.opacity = '1';
                if (el.style.transform) el.style.transform = '';
            });
            if (card) {
                var dim = document.createElement('span');
                dim.className = 'ja-scrollstack-dim';
                dim.setAttribute('aria-hidden', 'true');
                card.appendChild(dim);
            }
            var appearing = clone.querySelectorAll('[data-framer-appear-id]');
            for (var j = 0; j < appearing.length; j++) {
                if (appearing[j].style.opacity) appearing[j].style.opacity = '1';
                if (appearing[j].style.transform) appearing[j].style.transform = 'none';
            }
            return clone;
        });
    }

    function mark(nodes) {
        nodes.forEach(function (node) {
            node.setAttribute('data-ja-original-card', '');
        });
    }

    function destroy() {
        if (!host) return;
        suppressMutations = true;
        window.setTimeout(function () {
            suppressMutations = false;
        }, 0);
        var el = host;
        host = null;
        try {
            if (mod) mod.unmount(el);
        } catch (error) {
            console.warn('[services] Scroll Stack teardown failed.', error);
        }
        var bento = el.parentNode;
        if (bento) {
            bento.classList.remove('ja-scrollstack-mode');
            var marked = bento.querySelectorAll('[data-ja-original-card]');
            for (var j = 0; j < marked.length; j++) marked[j].removeAttribute('data-ja-original-card');
        }
        if (el.parentNode) el.parentNode.removeChild(el);
        if (!document.querySelector('[data-ja-scrollstack]')) {
            document.documentElement.classList.remove('ja-scrollstack-active');
        }
    }

    function enable() {
        if (!mql.matches || busy) return;
        var found = collect();
        if (found.columns.length !== 2 || found.cards.length !== 4) {
            destroy();
            return;
        }
        if (host && (!host.isConnected || host.parentNode !== found.bento)) destroy();
        if (!host) {
            mark(found.columns);
            host = document.createElement('div');
            host.className = 'ja-scrollstack-host';
            host.setAttribute('data-ja-scrollstack', '');
            host.setAttribute('data-ja-target', 'services');
            found.bento.appendChild(host);
            found.bento.classList.add('ja-scrollstack-mode');
            document.documentElement.classList.add('ja-scrollstack-active');
        }

        busy = true;
        loadModule()
            .then(function (loaded) {
                if (!host || !host.isConnected) {
                    busy = false;
                    schedule();
                    return;
                }
                if (!mql.matches) {
                    busy = false;
                    disable();
                    return;
                }
                if (!host.__jaScrollRoot) {
                    loaded.mount(host, cloneCards(collect().cards));
                }
                busy = false;
            })
            .catch(function () {
                busy = false;
                destroy();
            });
    }

    function disable() {
        destroy();
        busy = false;
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        (window.requestAnimationFrame || window.setTimeout)(function () {
            scheduled = false;
            if (mql.matches) enable();
            else disable();
        });
    }

    if (mql.addEventListener) mql.addEventListener('change', schedule);
    else if (mql.addListener) mql.addListener(schedule);

    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            if (!host || !host.isConnected) {
                schedule();
                return;
            }
            var live = collect();
            if (live.columns.length === 2 && live.cards.length === 4 && mod && host.__jaScrollRoot) {
                mark(live.columns);
                mod.update(host, cloneCards(live.cards));
            }
        }, 280);
    });

    var observer = new MutationObserver(function () {
        if (!suppressMutations && (!host || !host.isConnected)) schedule();
    });

    function boot() {
        if (!document.body) return;
        observer.observe(document.body, { childList: true, subtree: true });
        schedule();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
