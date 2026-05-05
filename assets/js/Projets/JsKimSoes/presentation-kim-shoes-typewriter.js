/**
 * Effet typewriter - le code s'écrit automatiquement avec un rythme lent
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INSTANT = prefersReducedMotion;
    const CHAR_DELAY = INSTANT ? 0 : 55;       // ms par caractère (rythme normal)
    const NEWLINE_DELAY = INSTANT ? 0 : 220;   // ms après un saut de ligne
    const START_DELAY = INSTANT ? 0 : 500;      // ms avant de commencer
    const BETWEEN_WINDOWS = INSTANT ? 0 : 700; // ms entre les deux fenêtres

    const codeCartService = [
        [{ c: 'comment', t: '// Récupère le panier depuis la session' }],
        [{ c: 'keyword', t: 'public function' }, { c: 'method', t: ' add' }, { c: 'plain', t: '(' }, { c: 'type', t: 'int' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$productId' }, { c: 'plain', t: ', ' }, { c: 'type', t: 'int' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$quantity' }, { c: 'plain', t: ' = ' }, { c: 'num', t: '1' }, { c: 'plain', t: '): ' }, { c: 'type', t: 'void' }],
        [{ c: 'plain', t: '{' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$cart' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$this' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getCart' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '    ' }, { c: 'comment', t: '// Incrémente la quantité si produit déjà présent' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$cart' }, { c: 'plain', t: '[' }, { c: 'var', t: '$productId' }, { c: 'plain', t: '] = (' }, { c: 'var', t: '$cart' }, { c: 'plain', t: '[' }, { c: 'var', t: '$productId' }, { c: 'plain', t: '] ?? ' }, { c: 'num', t: '0' }, { c: 'plain', t: ') + ' }, { c: 'var', t: '$quantity' }, { c: 'plain', t: ';' }],
        [{ c: 'plain', t: '    ' }, { c: 'comment', t: '// Sauvegarde en session' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$this' }, { c: 'plain', t: '->' }, { c: 'method', t: 'saveCart' }, { c: 'plain', t: '(' }, { c: 'var', t: '$cart' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '}' }],
        [{ c: 'plain', t: '' }],
        [{ c: 'keyword', t: 'public function' }, { c: 'method', t: ' getCartItems' }, { c: 'plain', t: '(): ' }, { c: 'type', t: 'array' }],
        [{ c: 'plain', t: '{' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$cart' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$this' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getCart' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$items' }, { c: 'plain', t: ' = [];' }],
        [{ c: 'plain', t: '    ' }, { c: 'keyword', t: 'foreach' }, { c: 'plain', t: ' (' }, { c: 'var', t: '$cart' }, { c: 'plain', t: ' ' }, { c: 'keyword', t: 'as' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$productId' }, { c: 'plain', t: ' => ' }, { c: 'var', t: '$quantity' }, { c: 'plain', t: ') {' }],
        [{ c: 'plain', t: '        ' }, { c: 'var', t: '$product' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$this' }, { c: 'plain', t: '->' }, { c: 'var', t: 'productRepository' }, { c: 'plain', t: '->' }, { c: 'method', t: 'find' }, { c: 'plain', t: '(' }, { c: 'var', t: '$productId' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '        ' }, { c: 'comment', t: '// Filtre les produits indisponibles' }],
        [{ c: 'plain', t: '        ' }, { c: 'keyword', t: 'if' }, { c: 'plain', t: ' (' }, { c: 'var', t: '$product' }, { c: 'plain', t: ' && ' }, { c: 'var', t: '$product' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getStock' }, { c: 'plain', t: '() > ' }, { c: 'num', t: '0' }, { c: 'plain', t: ') {' }],
        [{ c: 'plain', t: '            ' }, { c: 'var', t: '$items' }, { c: 'plain', t: '[] = [' }, { c: 'str', t: "'product'" }, { c: 'plain', t: ' => ' }, { c: 'var', t: '$product' }, { c: 'plain', t: ', ' }, { c: 'str', t: "'quantity'" }, { c: 'plain', t: ' => ' }, { c: 'var', t: '$quantity' }, { c: 'plain', t: '];' }],
        [{ c: 'plain', t: '        }' }],
        [{ c: 'plain', t: '    }' }],
        [{ c: 'plain', t: '    ' }, { c: 'keyword', t: 'return' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$items' }, { c: 'plain', t: ';' }],
        [{ c: 'plain', t: '}' }],
    ];

    const codeCheckout = [
        [{ c: 'attr', t: '#[Route' }, { c: 'plain', t: '(' }, { c: 'str', t: "'/checkout'" }, { c: 'plain', t: ', ' }, { c: 'str', t: "'app_checkout'" }, { c: 'plain', t: ')' }, { c: 'attr', t: ']' }],
        [{ c: 'keyword', t: 'public function' }, { c: 'method', t: ' index' }, { c: 'plain', t: '(' }, { c: 'type', t: 'CartService' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$cartService' }, { c: 'plain', t: ', ' }, { c: 'type', t: 'Request' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$request' }, { c: 'plain', t: '): ' }, { c: 'type', t: 'Response' }],
        [{ c: 'plain', t: '{' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$cartItems' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$cartService' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getCartItems' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$subtotal' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$cartService' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getSubtotal' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '    ' }, { c: 'comment', t: '// Frais de port gratuits à partir de 100€' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$shipping' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$subtotal' }, { c: 'plain', t: ' >= ' }, { c: 'num', t: '100' }, { c: 'plain', t: ' ? ' }, { c: 'num', t: '0' }, { c: 'plain', t: ' : ' }, { c: 'num', t: '5.90' }, { c: 'plain', t: ';' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$total' }, { c: 'plain', t: ' = ' }, { c: 'var', t: '$subtotal' }, { c: 'plain', t: ' + ' }, { c: 'var', t: '$shipping' }, { c: 'plain', t: ';' }],
        [{ c: 'plain', t: '' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$order' }, { c: 'plain', t: ' = ' }, { c: 'keyword', t: 'new' }, { c: 'plain', t: ' ' }, { c: 'type', t: 'Order' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$order' }, { c: 'plain', t: '->' }, { c: 'method', t: 'setUser' }, { c: 'plain', t: '(' }, { c: 'var', t: '$this' }, { c: 'plain', t: '->' }, { c: 'method', t: 'getUser' }, { c: 'plain', t: '());' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$order' }, { c: 'plain', t: '->' }, { c: 'method', t: 'setSubtotal' }, { c: 'plain', t: '(' }, { c: 'var', t: '$subtotal' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$order' }, { c: 'plain', t: '->' }, { c: 'method', t: 'setShippingCost' }, { c: 'plain', t: '(' }, { c: 'var', t: '$shipping' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$order' }, { c: 'plain', t: '->' }, { c: 'method', t: 'setTotal' }, { c: 'plain', t: '(' }, { c: 'var', t: '$total' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '    ' }, { c: 'comment', t: '// Construction persistante de la commande' }],
        [{ c: 'plain', t: '    ' }, { c: 'keyword', t: 'foreach' }, { c: 'plain', t: ' (' }, { c: 'var', t: '$cartItems' }, { c: 'plain', t: ' ' }, { c: 'keyword', t: 'as' }, { c: 'plain', t: ' ' }, { c: 'var', t: '$item' }, { c: 'plain', t: ') {' }],
        [{ c: 'plain', t: '        ' }, { c: 'var', t: '$orderItem' }, { c: 'plain', t: ' = ' }, { c: 'keyword', t: 'new' }, { c: 'plain', t: ' ' }, { c: 'type', t: 'OrderItem' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '        ' }, { c: 'var', t: '$orderItem' }, { c: 'plain', t: '->' }, { c: 'method', t: 'setProduct' }, { c: 'plain', t: '(' }, { c: 'var', t: '$item' }, { c: 'plain', t: "['product']" }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '        ' }, { c: 'var', t: '$em' }, { c: 'plain', t: '->' }, { c: 'method', t: 'persist' }, { c: 'plain', t: '(' }, { c: 'var', t: '$orderItem' }, { c: 'plain', t: ');' }],
        [{ c: 'plain', t: '    }' }],
        [{ c: 'plain', t: '    ' }, { c: 'var', t: '$em' }, { c: 'plain', t: '->' }, { c: 'method', t: 'flush' }, { c: 'plain', t: '();' }],
        [{ c: 'plain', t: '}' }],
    ];

    function typeCode(outputEl, cursorEl, lines, onComplete) {
        if (cursorEl) cursorEl.classList.toggle('hidden', INSTANT);

        let lineIndex = 0;
        let segIndex = 0;
        let charIndex = 0;

        function typeChar() {
            if (lineIndex >= lines.length) {
                if (cursorEl && !INSTANT) cursorEl.classList.add('hidden');
                if (onComplete) onComplete();
                return;
            }

            const line = lines[lineIndex];
            if (segIndex >= line.length) {
                outputEl.appendChild(document.createElement('br'));
                lineIndex++;
                segIndex = 0;
                charIndex = 0;
                setTimeout(typeChar, NEWLINE_DELAY);
                return;
            }

            const seg = line[segIndex];
            if (charIndex >= seg.t.length) {
                segIndex++;
                charIndex = 0;
                setTimeout(typeChar, 0);
                return;
            }

            if (INSTANT) {
                for (let i = charIndex; i < seg.t.length; i++) {
                    const s = document.createElement('span');
                    s.className = seg.c;
                    s.textContent = seg.t[i];
                    outputEl.appendChild(s);
                }
                charIndex = seg.t.length;
            } else {
                const span = document.createElement('span');
                span.className = seg.c;
                span.textContent = seg.t[charIndex];
                outputEl.appendChild(span);
                charIndex++;
            }

            const delay = INSTANT ? 0 : (seg.t[charIndex - 1] === '\n' ? NEWLINE_DELAY : CHAR_DELAY);
            setTimeout(typeChar, delay);
        }

        setTimeout(typeChar, START_DELAY);
    }

    let typed = false;

    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || typed) return;
            typed = true;

            const outputs = document.querySelectorAll('.code-typewriter .code-output');
            const cursors = document.querySelectorAll('.code-typewriter .code-cursor');

            cursors[1].classList.add('hidden');

            typeCode(outputs[0], cursors[0], codeCartService, () => {
                setTimeout(() => {
                    typeCode(outputs[1], cursors[1], codeCheckout);
                }, BETWEEN_WINDOWS);
            });
        });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.2 });

    const codeSection = document.getElementById('code');
    if (codeSection) {
        codeObserver.observe(codeSection);
    }
})();
