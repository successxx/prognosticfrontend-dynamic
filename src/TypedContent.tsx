// src/TypedContent.tsx

import React, { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

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

  // Dynamic header text
  const [headerText, setHeaderText] = useState("Your Clients.ai Solution");
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  const typedRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typedInstances = useRef<Array<Typed | null>>([]);

  useEffect(() => {
    if (content) {
      const processedSections = enhanceContent(content);
      setSections(processedSections);
    }
  }, [content]);

  useEffect(() => {
    // Extract <h1> text from first section if present
    if (sections.length > 0) {
      const firstSectionHTML = sections[0].content;
      const h1Match = firstSectionHTML.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match && h1Match[1]) {
        setHeaderText(h1Match[1]);
      }
    }
  }, [sections]);

  useEffect(() => {
    if (sections.length > 0) {
      // Start typing the first section
      startTyping(0);
    }

    // Cleanup on unmount
    return () => {
      typedInstances.current.forEach(
        (instance) => instance && instance.destroy()
      );
      typedInstances.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const startTyping = (index: number) => {
    if (index >= sections.length) {
      return; // All sections have been typed
    }

    setCurrentIndex(index);

    const typedRef = typedRefs.current[index];
    if (typedRef) {
      typedRef.innerHTML = ""; // Clear previous content if any

      const contentBox = typedRef.closest(".content-box");
      const header = contentBox?.querySelector(".section-header");
      const contentArea = contentBox?.querySelector(".section-content");

      const typedInstance = new Typed(typedRef, {
        strings: [sections[index].content],
        typeSpeed: 5,
        showCursor: false,
        contentType: "html",
        onStart: () => {
          if (header) header.classList.add("reduced-width");
          if (contentArea) contentArea.classList.add("expanded-width");
        },
        onComplete: () => {
          // After typing is complete
          const demoButton = contentBox?.querySelector(".new-demo-button");
          if (demoButton) {
            demoButton.classList.add("visible");
          }
          contentBox?.classList.add("typing-complete");
          startTyping(index + 1);
        },
      });

      typedInstances.current[index] = typedInstance;
    }
  };

  return (
    <>
      {/* Single header with dynamic text */}
      <div className="result-header fade-in visible">
        <h1 ref={headerRef}>{headerText}</h1>
      </div>

      <div id="typed-output" className="container">
        {sections.map((section, index) => (
          <div
            className={`content-box ${
              index <= currentIndex ? "visible" : "hidden"
            } px-4 py-4`}
            key={index}
            style={{ display: index <= currentIndex ? "" : "none" }}
          >
            <div className="content-box-inner">
              <div ref={(el) => (typedRefs.current[index] = el)}></div>
            </div>
            {section.shouldHaveButton && (
              <div className="button-container text-center mt-3">
                <a
                  href={booking_button_redirection}
                  className="new-demo-button btn btn-primary"
                >
                  {booking_button_name}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const enhanceContent = (content: string): Section[] => {
  // Check if plain string (no HTML tags)
  const isPlainString = !/<[^>]+>/g.test(content);

  if (isPlainString) {
    // If plain, wrap in a bold, centered div
    const formattedContent = `<div style="text-align: center; color: black; font-weight: bold; margin: 1rem">
         ${content}
       </div>`;
    return [
      {
        content: formattedContent,
        shouldHaveButton: false,
      },
    ];
  }

  // Split content into sections by <h2>
  const rawSections = content.split(/(?=<h2\b[^>]*>)/i);

  const processedSections = rawSections.map((section, index) => {
    let processed = section;

    // Normalize bold/italic
    processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Convert double line-breaks to paragraphs
    processed = processed
      .split(/\n\n+/)
      .map((block) => {
        block = block.trim();
        return block ? `<p>${block}</p>` : "";
      })
      .join("");

    // Remove extra <br> tags
    processed = processed.replace(/<\/p>\s*<br>\s*<br>\s*<p>/g, "</p><p>");
    processed = processed.replace(/<br>\s*<li>/g, "<li>");
    processed = processed.replace(/<\/li>\s*<br>/g, "</li>");
    processed = processed.replace(/<p>\s*<\/p>/g, ""); // remove empty <p>

    // Extract the first <h1> or <h2> from this section
    const headerMatch = processed.match(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i);
    const header = headerMatch ? headerMatch[0] : "";

    // Remove that header from the typed content so it's not duplicated
    const contentWithoutHeader = processed
      .replace(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i, "")
      .trim();

    // For the *first section*, remove the .section-header entirely 
    // so we don't see the repeated H1 inside the typed content.
    let sectionHTML;
    if (index === 0) {
      sectionHTML = `
        <div class="section-container">
          <img class="typed-image" src="https://how.clients.ai/assets/images/image06.jpg?v=65128ef7" />
          <div>
            <div class="section-content">${contentWithoutHeader}</div>
          </div>
        </div>
      `;
    } else {
      // For subsequent sections, keep any <h2> as normal
      sectionHTML = `
        <div class="section-container">
          <img class="typed-image" src="https://how.clients.ai/assets/images/image06.jpg?v=65128ef7" />
          <div>
            <div class="section-header">${header}</div>
            <div class="section-content">${contentWithoutHeader}</div>
          </div>
        </div>
      `;
    }

    // Decide if this section should have a button
    const shouldHaveButton = index >= rawSections.length - 3;
    return { content: sectionHTML, shouldHaveButton };
  });

  return processedSections;
};

export default TypedContent;
