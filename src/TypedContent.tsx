// src/TypedContent.tsx

import React, {useEffect, useRef} from 'react';
import Typed from 'typed.js';

interface TypedContentProps {
    content: string;
}

const TypedContent: React.FC<TypedContentProps> = ({content}) => {
    const typedRef = useRef<HTMLDivElement>(null);
    const typedInstance = useRef<Typed | null>(null);

    useEffect(() => {
        if (content && typedRef.current) {
            if (typedInstance.current) {
                typedInstance.current.destroy();
            }

            const enhancedContent = enhanceContent(content);

            // Hide the typedRef before typing begins
            typedRef.current.style.opacity = '0';

            typedInstance.current = new Typed(typedRef.current, {
                strings: [enhancedContent],
                typeSpeed: 1,
                showCursor: false,
                contentType: 'html',
                onStringTyped: function (_arrayPos) {
                    const typedElement = typedRef.current!;
                    const progress = typedElement.innerHTML.length / enhancedContent.length;

                    const contentBoxes = typedElement.querySelectorAll('.content-box');
                    if (contentBoxes) {
                        const currentIndex = Math.floor(progress * contentBoxes.length);
                        const currentBox = contentBoxes[currentIndex];

                        if (currentBox) {
                            const button = currentBox.querySelector('.new-demo-button');
                            if (button) {
                                button.classList.add('visible');
                            }
                        }
                    }
                },


                onComplete: function () {
                    // Select both .content-box and .first-context-box
                    document.querySelectorAll('.content-box, .first-context-box').forEach(box => {
                        box.classList.add('generated');
                    });
                    showButtons(); // Call the function to show buttons after typing is complete
                },

            });

            // Show the typedRef after typing begins
            typedRef.current.style.opacity = '1';

            return () => {
                typedInstance.current?.destroy();
            };
        }
    }, [content]);

    const enhanceContent = (content: string): string => {
        // Split content into sections based on h2 headers
        const sections = content.split(/(?=<h2>)/);

        // Process each section
        const processedSections = sections.map((section, index) => {
            let processedSection = section;

            // Handle bold text
            processedSection = processedSection.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Handle italic text
            processedSection = processedSection.replace(/\*(.*?)\*/g, '<em>$1</em>');

            // Replace double line breaks with paragraph tags
            processedSection = processedSection.replace(/\n\n/g, '</p><p>');

            // Handle headers (h3 and below, as h2 is already handled)
            processedSection = processedSection.replace(/(Here's how.*?:)\n/g, '</p><h3>$1</h3><p>');

            // Handle highlight boxes
            processedSection = processedSection.replace(/(Imagine for a second.*?)\n/g, '</p><div class="highlight-box"><p>$1</p></div><p>');

            // Handle unordered lists
            processedSection = processedSection.replace(/\n- /g, '</p><ul><li>');
            processedSection = processedSection.replace(/\n - /g, '</li><li>');
            processedSection = processedSection.replace(/(<li>.*?)\n/g, '$1</li></ul><p>');

            // Handle ordered lists
            processedSection = processedSection.replace(/\n\d+\. /g, '</p><ol><li>');
            processedSection = processedSection.replace(/(<li>.*?)\n/g, '$1</li></ol><p>');

            // Wrap content in paragraphs
            processedSection = '<p>' + processedSection + '</p>';

            // Remove empty paragraphs
            processedSection = processedSection.replace(/<p>\s*<\/p>/g, '');

            // Determine if this section should have a button (only for the last 3 sections)
            const shouldHaveButton = index >= sections.length - 3;
            const demoButton = shouldHaveButton ? '<a href="https://prognostic.ai/#demo" class="new-demo-button">Book Your Free Demo Now!</a>' : '';

            // Add 'first-context-box' class to the first section
            const boxClass = index === 0 ? 'content-box' : 'content-box';

            return `<div class="${boxClass}">
            <div class="content-box-inner">
                ${processedSection}
            </div>
            ${demoButton}
        </div>`;
        });

        // Join all processed sections into a single string
        return processedSections.join('');
    };


    const showButtons = () => {
        document.querySelectorAll('.new-demo-button').forEach(button => {
            button.classList.add('visible');
        });
    };

    return (
        <div id="typed-output" ref={typedRef}></div>
    );
};

export default TypedContent;
