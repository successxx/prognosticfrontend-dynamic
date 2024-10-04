// src/TypedContent.tsx

import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

interface TypedContentProps {
    content: string;
    booking_button_name: string;
    booking_button_redirection: string;
}

interface Section {
    content: string;
    shouldHaveButton: boolean;
}

const TypedContent: React.FC<TypedContentProps> = ({
                                                       content,
                                                       booking_button_name,
                                                       booking_button_redirection,
                                                   }) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const typedRefs = useRef<Array<HTMLDivElement | null>>([]);
    const typedInstances = useRef<Array<Typed | null>>([]);

    useEffect(() => {
        if (content) {
            const processedSections = enhanceContent(content);
            setSections(processedSections);
        }
    }, [content]);

    useEffect(() => {
        if (sections.length > 0) {
            // Start typing the first section
            startTyping(0);
        }

        // Cleanup function
        return () => {
            typedInstances.current.forEach((instance) => instance && instance.destroy());
            typedInstances.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections]);

    const startTyping = (index: number) => {
        if (index >= sections.length) {
            return; // All sections have been typed
        }

        setCurrentIndex(index); // Update current active index to render the card

        const typedRef = typedRefs.current[index];

        if (typedRef) {
            typedRef.innerHTML = ''; // Clear previous content if any

            const typedInstance = new Typed(typedRef, {
                strings: [sections[index].content],
                typeSpeed: 1,
                showCursor: false,
                contentType: 'html',
                onComplete: () => {
                    // After typing is complete for this section, start typing the next one
                    console.log(typedRef.parentElement)
                    const demoButton = typedRef.parentElement?.parentElement?.querySelector('a.new-demo-button');
                    console.log(demoButton)
                    // Add the 'visible' class to the <a> element
                    if (demoButton) {
                        demoButton.classList.add('visible');
                    }
                    typedRef.parentElement?.parentElement?.classList.add('typing-complete');
                    startTyping(index + 1);
                },
            });

            typedInstances.current[index] = typedInstance;
        }
    };

    return (
        <div>
            <div id="typed-output">
                {sections.map((section, index) => (

                    <div
                        className={`content-box ${index <= currentIndex ? 'visible' : 'hidden'}`}
                        key={index}
                        style={{display: index <= currentIndex ? 'block' : 'none'}}
                    >
                        <div className="content-box-inner">
                            <div ref={(el) => (typedRefs.current[index] = el)}></div>
                        </div>
                        {section.shouldHaveButton && (
                            <div className="button-container">
                                <a href={booking_button_redirection} className="new-demo-button">
                                    {booking_button_name}
                                </a>
                            </div>

                        )}
                            </div>

                        ))}
                    </div>
                    </div>
            );
            };

const enhanceContent = (content: string): Section[] => {
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
        processedSection = processedSection.replace(
            /(Here's how.*?:)\n/g,
            '</p><h3>$1</h3><p>'
        );

        // Handle highlight boxes
        processedSection = processedSection.replace(
            /(Imagine for a second.*?)\n/g,
            '</p><div class="highlight-box"><p>$1</p></div><p>'
        );

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

        return { content: processedSection, shouldHaveButton };
    });

    return processedSections;
};

export default TypedContent;
