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

  const typedRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typedInstances = useRef<Array<Typed | null>>([]);

  // PHASE 2: track the dynamic header text (defaults to "Your Clients.ai Solution")
  const [headerTitle, setHeaderTitle] = useState<string>("Your Clients.ai Solution");

  useEffect(() => {
    if (content) {
      const processedSections = enhanceContent(content);
      setSections(processedSections);

      // Attempt to extract an <h1> from the entire content
      const extractedH1 = extractFirstH1(content);
      if (extractedH1) {
        setHeaderTitle(extractedH1);
      } else {
        setHeaderTitle("Your Clients.ai Solution");
      }
    }
  }, [content]);

  useEffect(() => {
    if (sections.length > 0) {
      // Start typing the first section
      startTyping(0);
    }

    // Cleanup function
    return () => {
      typedInstances.current.forEach(
        (instance) => instance && instance.destroy()
      );
      typedInstances.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // PHASE 2: Whenever headerTitle changes, update the .result-header h1 text
  useEffect(() => {
    const headerEl = document.querySelector(".result-header h1");
    if (headerEl) {
      headerEl.textContent = headerTitle;
    }
  }, [headerTitle]);

  const startTyping = (index: number) => {
    if (index >= sections.length) {
      return; // All sections have been typed
    }

    setCurrentIndex(index);

    const typedRef = typedRefs.current[index];

    if (typedRef) {
      typedRef.innerHTML = ""; // Clear previous content if any

      // Find the header and content elements for the current section
      const contentBox = typedRef.closest(".content-box");
      const header = contentBox?.querySelector(".section-header");
      const content = contentBox?.querySelector(".section-content");

      const typedInstance = new Typed(typedRef, {
        strings: [sections[index].content],
        typeSpeed: 5,
        showCursor: false,
        contentType: "html",
        onStart: () => {
          // When content starts typing, adjust the widths
          if (header) {
            header.classList.add("reduced-width");
          }
          if (content) {
            content.classList.add("expanded-width");
          }
        },
        onComplete: () => {
          // After typing is complete for this section
          // Find the demo button within the current section
          const demoButton = contentBox?.querySelector(".new-demo-button");

          // Add the 'visible' class to the demo button if it exists
          if (demoButton) {
            demoButton.classList.add("visible");
          }

          // Add a class to indicate typing is complete for this section
          contentBox?.classList.add("typing-complete");

          // Start typing the next section
          startTyping(index + 1);
        },
      });

      // Store the typed instance for cleanup or future use
      typedInstances.current[index] = typedInstance;
    }
  };

  return (
    <>
      {/* The .result-header div is presumably elsewhere in your HTML structure.
          We are just updating its <h1> text above (useEffect).
          The typed content boxes below remain the same. */}
      <div id="typed-output" className="container">
        {sections.map((section, index) => (
          <div
            className={
              `content-box ${index <= currentIndex ? "visible" : "hidden"} px-4 py-4`
            }
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

/**
 * Process the full content into sections with typed HTML.
 */
const enhanceContent = (content: string): Section[] => {
  // Check if the content is a plain string (no HTML tags)
  const isPlainString = !/<[^>]+>/g.test(content);

  if (isPlainString) {
    // If it's a plain string, wrap it in a centered, bold, black-styled div
    const formattedContent = 
      `<div style="text-align: center; color: black; font-weight: bold; margin: 1rem">
         ${content}
       </div>`;

    // Return a single section with the formatted content
    return [
      {
        content: formattedContent,
        shouldHaveButton: false, // No button for plain strings
      },
    ];
  }

  // Split content into sections based on h2 headers (handling attributes)
  const sections = content.split(/(?=<h2\b[^>]*>)/i);

  // Process each section
  const processedSections = sections.map((section, index) => {
    let processedSection = section;

    // Normalize bold and italic text
    processedSection = processedSection.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    processedSection = processedSection.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Replace double line breaks with paragraph tags
    processedSection = processedSection
      .split(/\n\n+/)
      .map((block) => {
        block = block.trim();
        if (block) {
          return `<p>${block}</p>`;
        }
        return ""; // Skip empty blocks
      })
      .join("");

    // Remove redundant <br> tags after paragraphs
    processedSection = processedSection.replace(
      /<\/p>\s*<br>\s*<br>\s*<p>/g,
      "</p><p>"
    );

    // Handle lists (remove <br> tags and ensure proper nesting)
    processedSection = processedSection.replace(/<br>\s*<li>/g, "<li>");
    processedSection = processedSection.replace(/<\/li>\s*<br>/g, "</li>");

    // Remove empty paragraphs (including whitespace-only)
    processedSection = processedSection.replace(/<p>\s*<\/p>/g, "");

    // Extract the headers and the rest of the content
    const headerMatch = processedSection.match(
      /<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i
    );
    const header = headerMatch ? headerMatch[0] : "";
    const contentWithoutHeader = processedSection
      .replace(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i, "")
      .trim();

    // Wrap the header and content in a container
    const sectionHTML = `
      <div class="section-container">
        <img class="typed-image" src="https://how.clients.ai/assets/images/image06.jpg?v=65128ef7" />
        <div>
          <div class="section-header">${header}</div>
          <div class="section-content">${contentWithoutHeader}</div>
        </div>
      </div>
    `;

    // Determine if this section should have a button (configurable logic)
    const shouldHaveButton = index >= sections.length - 3;

    return { content: sectionHTML, shouldHaveButton };
  });

  return processedSections;
};

/**
 * Extract the first <h1> tag text from the entire content (if any).
 */
const extractFirstH1 = (htmlString: string): string | null => {
  const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/i;
  const match = h1Regex.exec(htmlString);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
};

export default TypedContent;
