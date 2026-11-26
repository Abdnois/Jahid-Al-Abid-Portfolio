import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import ScrollStack from './ScrollStack.jsx';
import './scrollstack.css';

/* Adopt a cloned Framer card into the React tree without rebuilding it, so the
   original text, icons, numbers, classes and card styling are reused as-is. */
function Adopt({ node }) {
    const ref = useCallback(
        el => {
            if (!el) return;
            while (el.firstChild) el.removeChild(el.firstChild);
            if (node) el.appendChild(node);
        },
        [node]
    );
    return <div className="ja-scrollstack-card" ref={ref} />;
}

function App({ controller, initialCards }) {
    const [cards, setCards] = useState(initialCards);

    useEffect(() => {
        controller.setCards = setCards;
        return () => {
            delete controller.setCards;
        };
    }, [controller]);

    return (
        <ScrollStack
            className="ja-scrollstack"
            useWindowScroll
            smoothScroll={false}
            snap={false}
            itemDistance={90}
            itemStackDistance={22}
            stackPosition="12%"
            itemScale={0.04}
            baseScale={0.88}
            dimAmount={0.16}
            blurAmount={0}
            tiltAmount={0}
            rotationAmount={0}
            holdDistance={180}
        >
            {cards.map((node, index) => (
                <Adopt key={index} node={node} />
            ))}
        </ScrollStack>
    );
}

export function mount(host, cards) {
    if (!host || host.__jaScrollRoot) return;
    const root = createRoot(host);
    const controller = {};
    host.__jaScrollRoot = root;
    host.__jaScrollController = controller;
    root.render(<App controller={controller} initialCards={cards} />);
}

export function update(host, cards) {
    const setCards = host && host.__jaScrollController && host.__jaScrollController.setCards;
    if (setCards) setCards(cards);
}

export function unmount(host) {
    if (!host || !host.__jaScrollRoot) return;
    host.__jaScrollRoot.unmount();
    delete host.__jaScrollRoot;
    delete host.__jaScrollController;
}
