import React, { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

interface TypedContentProps {
  content: string;
  booking_button_name: string;
  booking_button_redirection: string;
  onFirstHeaderExtracted?: (header: string | null) => void; // Callback prop
}

interface Section {
  content: string;
  shouldHaveButton: boolean;
}

const TypedContent: React.FC<TypedContentProps> = ({
  content,
  booking_button_name,
  booking_button_redirection,
  onFirstHeaderExtracted,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const typedRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typedInstances = useRef<Array<Typed | null>>([]);

  useEffect(() => {
    if (content) {
      const processedSections = enhanceContent(content);
      setSections(processedSections);

      // Extract the first header and pass it to the callback
      if (processedSections.length > 0 && onFirstHeaderExtracted) {
        const firstSection = processedSections[0].content;
        const headerMatch = firstSection.match(
          /<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i
        );
        const firstHeader = headerMatch ? headerMatch[1] : null; // Extract text inside <h1> or <h2>
        onFirstHeaderExtracted(firstHeader);
      }
    }
  }, [content]);

  useEffect(() => {
    if (sections.length > 0) {
      startTyping(0);
    }

    return () => {
      typedInstances.current.forEach(
        (instance) => instance && instance.destroy()
      );
      typedInstances.current = [];
    };
  }, [sections]);

  const startTyping = (index: number) => {
    if (index >= sections.length) return;

    setCurrentIndex(index);
    const typedRef = typedRefs.current[index];

    if (typedRef) {
      typedRef.innerHTML = ""; // Clear previous content
      const contentBox = typedRef.closest(".content-box");
      const header = contentBox?.querySelector(".section-header");
      const content = contentBox?.querySelector(".section-content");

      const typedInstance = new Typed(typedRef, {
        strings: [sections[index].content],
        typeSpeed: 5,
        showCursor: false,
        contentType: "html",
        onStart: () => {
          if (header) header.classList.add("reduced-width");
          if (content) content.classList.add("expanded-width");
        },
        onComplete: () => {
          const demoButton = contentBox?.querySelector(".new-demo-button");
          if (demoButton) demoButton.classList.add("visible");
          contentBox?.classList.add("typing-complete");
          startTyping(index + 1);
        },
      });

      typedInstances.current[index] = typedInstance;
    }
  };

  return (
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
  );
};

const enhanceContent = (content: string): Section[] => {
  const isPlainString = !/<[^>]+>/g.test(content);

  if (isPlainString) {
    const formattedContent = `
      <div style="text-align: center; color: black; font-weight: bold; margin: 1rem">
        ${content}
      </div>
    `;
    return [{ content: formattedContent, shouldHaveButton: false }];
  }

  const sections = content.split(/(?=<h2\b[^>]*>)/i);
  const processedSections = sections.map((section, index) => {
    const processedSection = section
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .split(/\n\n+/)
      .map((block) => (block.trim() ? `<p>${block}</p>` : ""))
      .join("")
      .replace(/<\/p>\s*<br>\s*<br>\s*<p>/g, "</p><p>")
      .replace(/<br>\s*<li>/g, "<li>")
      .replace(/<\/li>\s*<br>/g, "</li>")
      .replace(/<p>\s*<\/p>/g, "");

    const headerMatch = processedSection.match(
      /<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i
    );
    const header = headerMatch ? headerMatch[0] : "";
    const contentWithoutHeader = processedSection
      .replace(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i, "")
      .trim();
    const sectionHTML = `
      <div class="section-container">
        <img class="typed-image" src="https://how.clients.ai/assets/images/image06.jpg?v=65128ef7" />
        <div>
          <div class="section-header">${header}</div>
          <div class="section-content">${contentWithoutHeader}</div>
        </div>
      </div>
    `;
    const shouldHaveButton = index >= sections.length - 3;
    return { content: sectionHTML, shouldHaveButton };
  });

  return processedSections;
};

export default TypedContent;
