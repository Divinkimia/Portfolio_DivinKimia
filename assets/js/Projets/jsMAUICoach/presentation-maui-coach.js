// MAUICoach1 - Typing Effect + Line Numbers + TOC + Scroll to Top + Galaxy Effect
// Inspiré de chatbot-openbiz-copie

// Initialisation de l'effet galaxie
let galaxyEffect = null;

function initGalaxyEffect() {
    const galaxyContainer = document.getElementById('galaxy-container');
    if (!galaxyContainer) return;

    if (typeof GalaxyEffect !== 'undefined') {
        galaxyEffect = new GalaxyEffect(
            galaxyContainer,
            typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
        );
    } else {
        console.warn('GalaxyEffect non chargé');
    }
}

// Initialiser l'effet galaxie au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalaxyEffect);
} else {
    initGalaxyEffect();
}

// Typing Effect for Code Blocks
class TypingEffect {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        const codeBlocks = document.querySelectorAll('.typing-code code');
        if (codeBlocks.length === 0) return;

        codeBlocks.forEach((codeElement, index) => {
            // Dans le scrollytelling, on laisse scroll-animations.js gérer le déclenchement
            if (codeElement.closest('.scrolly-sticky-wrapper')) {
                // On prépare juste l'originalCode
                if (!codeElement.getAttribute('data-original')) {
                    const originalCode = codeElement.textContent.trim();
                    codeElement.setAttribute('data-original', originalCode);
                    const language = codeElement.className.match(/language-(\w+)/)?.[1] || 'csharp';
                    codeElement.setAttribute('data-language', language);
                }
                return;
            }

            let originalCode = codeElement.getAttribute('data-original');
            if (!originalCode || originalCode === '') {
                originalCode = codeElement.textContent.trim();
            }
            const language = codeElement.className.match(/language-(\w+)/)?.[1] || 'csharp';

            if (originalCode && originalCode.length > 0) {
                codeElement.setAttribute('data-original', originalCode);
                codeElement.setAttribute('data-language', language);
                setTimeout(() => {
                    codeElement.textContent = '';
                    setTimeout(() => {
                        this.typeCode(codeElement, originalCode, language);
                    }, index * 800);
                }, 200);
            }
        });
    }

    // Version statique pour usage manuel
    static trigger(element) {
        if (!element) return;
        const codeElement = element.querySelector('code');
        if (!codeElement) return;

        let originalCode = codeElement.getAttribute('data-original');
        if (!originalCode) {
            originalCode = codeElement.textContent.trim();
            codeElement.setAttribute('data-original', originalCode);
        }
        const language = codeElement.getAttribute('data-language') || codeElement.className.match(/language-(\w+)/)?.[1] || 'csharp';

        // Reset and type
        codeElement.textContent = '';
        const instance = new TypingEffect();
        instance.typeCode(codeElement, originalCode, language, false); // false = don't loop indefinitely
    }

    typeCode(element, code, language, loop = true) {
        if (!code || code.length === 0) {
            const savedCode = element.getAttribute('data-original');
            if (savedCode) {
                element.textContent = savedCode;
                element.className = `language-${language}`;
                if (typeof hljs !== 'undefined') hljs.highlightElement(element);
            }
            return;
        }

        // Marquer comme en train de taper
        element.classList.add('is-typing-now');

        const tempElement = document.createElement('code');
        tempElement.className = `language-${language}`;
        tempElement.textContent = code;
        let highlightedHtml = '';
        if (typeof hljs !== 'undefined') {
            try {
                hljs.highlightElement(tempElement);
                highlightedHtml = tempElement.innerHTML;
            } catch (e) {
                highlightedHtml = code;
            }
        } else {
            highlightedHtml = code;
        }

        const truncateHtmlAtTextLength = (html, maxLength) => {
            if (maxLength <= 0) return '';
            const container = document.createElement('div');
            container.innerHTML = html;
            let currentLength = 0;
            const openTagsStack = [];
            const processNode = (node) => {
                if (currentLength >= maxLength) return null;
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const remaining = maxLength - currentLength;
                    if (remaining > 0) {
                        const textToTake = Math.min(text.length, remaining);
                        currentLength += textToTake;
                        return document.createTextNode(text.substring(0, textToTake));
                    }
                    return null;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    const isVoid = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].includes(tagName);
                    const clone = node.cloneNode(false);
                    const startLength = currentLength;
                    for (let child of Array.from(node.childNodes)) {
                        if (currentLength >= maxLength) break;
                        const processed = processNode(child);
                        if (processed) clone.appendChild(processed);
                    }
                    if (clone.childNodes.length > 0 || currentLength > startLength) {
                        if (!isVoid) openTagsStack.push(tagName);
                        return clone;
                    }
                    return null;
                }
                return null;
            };
            const frag = document.createDocumentFragment();
            for (let child of Array.from(container.childNodes)) {
                if (currentLength >= maxLength) break;
                const processed = processNode(child);
                if (processed) frag.appendChild(processed);
            }
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(frag);
            let result = tempDiv.innerHTML;
            while (openTagsStack.length > 0) {
                result += `</${openTagsStack.pop()}>`;
            }
            return result;
        };

        let textIndex = 0;
        const speed = 25; // Un peu plus rapide
        let isTyping = true;
        let currentTimeout = null;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedHtml;
        const totalTextLength = (tempDiv.textContent || tempDiv.innerText || '').length;

        const restartAnimation = () => {
            if (!loop) return;
            textIndex = 0;
            isTyping = true;
            element.textContent = '';
            setTimeout(() => type(), 300);
        };

        const type = () => {
            if (!isTyping) return;
            if (textIndex < totalTextLength) {
                textIndex++;
                const partialHtml = truncateHtmlAtTextLength(highlightedHtml, textIndex);
                requestAnimationFrame(() => {
                    if (isTyping) element.innerHTML = partialHtml;
                });
                const currentChar = code[textIndex - 1] || '';
                const nextChar = code[textIndex] || '';
                let currentSpeed = speed;
                if (currentChar === '\n') currentSpeed = speed * 1.5;
                else if (nextChar === '\n') currentSpeed = speed * 1.2;
                else if (currentChar === ' ') currentSpeed = speed * 0.9;
                if (currentTimeout) clearTimeout(currentTimeout);
                currentTimeout = setTimeout(type, currentSpeed);
            } else {
                isTyping = false;
                element.innerHTML = highlightedHtml;
                element.classList.remove('is-typing-now');
                if (loop) {
                    setTimeout(() => {
                        const wrapper = element.closest('.typing-code');
                        if (wrapper) {
                            wrapper.classList.add('typing-complete');
                            setTimeout(() => {
                                wrapper.classList.remove('typing-complete');
                                restartAnimation();
                            }, 500);
                        } else restartAnimation();
                    }, 5000);
                }
            }
        };
        type();
    }
}

// Exposer globalement pour scroll-animations.js
window.TypingEffect = TypingEffect;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TypingEffect());
} else {
    new TypingEffect();
}

window.addEventListener('load', () => {
    document.querySelectorAll('.typing-code code').forEach(block => {
        const originalCode = block.getAttribute('data-original');
        if (block.textContent.trim() === '' && originalCode && originalCode.length > 0) {
            const language = block.getAttribute('data-language') || 'csharp';
            new TypingEffect().typeCode(block, originalCode, language);
        }
    });
});

// Add line numbers to code blocks
function addLineNumbers() {
    document.querySelectorAll('.code-block').forEach(wrapper => {
        if (wrapper.querySelector('.code-block-line-numbers')) return;
        const preElement = wrapper.querySelector('pre');
        const codeBlock = wrapper.querySelector('code');
        if (!codeBlock || !preElement) return;
        const text = codeBlock.getAttribute('data-original') || codeBlock.textContent || codeBlock.innerText;
        const linesCount = (text.match(/\n/g) || []).length + 1;
        const lineNumbersContainer = document.createElement('div');
        lineNumbersContainer.className = 'code-block-line-numbers';
        const rowsEl = document.createElement('span');
        rowsEl.className = 'line-numbers-rows';
        rowsEl.innerHTML = Array.from({ length: linesCount }, () => '<span></span>').join('');
        lineNumbersContainer.appendChild(rowsEl);
        const codeContentContainer = document.createElement('div');
        codeContentContainer.className = 'code-block-content';
        codeContentContainer.appendChild(preElement);
        wrapper.innerHTML = '';
        wrapper.appendChild(lineNumbersContainer);
        wrapper.appendChild(codeContentContainer);
        wrapper.classList.add('line-numbers');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code, .code-block code').forEach(block => {
                if (!block.getAttribute('data-original')) {
                    block.setAttribute('data-original', block.textContent || block.innerText);
                }
                hljs.highlightElement(block);
            });
            setTimeout(addLineNumbers, 300);
        } else {
            setTimeout(addLineNumbers, 200);
        }
    }, 150);
});

window.addEventListener('load', () => setTimeout(addLineNumbers, 800));
setTimeout(addLineNumbers, 1000);

// Scroll to Top
(function () {
    function initScrollToTop() {
        const btn = document.querySelector('.scroll-to-top-btn-footer');
        if (btn && !btn.hasAttribute('data-initialized')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            btn.setAttribute('data-initialized', 'true');
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }
})();
