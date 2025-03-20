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

  // For moving first <h1> to result-header:
  const [pageTitle, setPageTitle] = useState<string>("");

  // Track when main typed content is fully done, so we can show the 4-box grid
  const [allTypedDone, setAllTypedDone] = useState(false);

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

    return () => {
      typedInstances.current.forEach(
        (instance) => instance && instance.destroy()
      );
      typedInstances.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // On scroll, update the progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;

      // For desktop (vertical bar):
      const progressBar = document.querySelector<HTMLElement>(".progress-bar");
      const progressContainer = document.querySelector<HTMLElement>(".progress-container");

      if (progressBar && progressContainer) {
        // Desktop (width=6px, height grows)
        if (window.innerWidth > 600) {
          const newHeight = Math.floor(scrollFraction * 100);
          progressBar.style.height = `${newHeight}%`;
        } else {
          // Mobile (height=6px, width grows)
          const newWidth = Math.floor(scrollFraction * 100);
          progressBar.style.width = `${newWidth}%`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const startTyping = (index: number) => {
    if (index >= sections.length) {
      // All sections typed
      setAllTypedDone(true);
      return;
    }

    setCurrentIndex(index);
    const typedRef = typedRefs.current[index];

    if (typedRef) {
      typedRef.innerHTML = ""; // Clear previous content

      const contentBox = typedRef.closest(".content-box");
      const typedInstance = new Typed(typedRef, {
        strings: [sections[index].content],
        typeSpeed: 5,
        showCursor: false,
        contentType: "html",
        onComplete: () => {
          // Reveal "new-demo-button" if exists
          if (contentBox) {
            const demoButton = contentBox.querySelector(".new-demo-button");
            if (demoButton) {
              demoButton.classList.add("visible");
            }
            contentBox.classList.add("typing-complete");
          }
          // Move on
          startTyping(index + 1);
        },
      });

      typedInstances.current[index] = typedInstance;
    }
  };

  return (
    <>
      {/* If we extracted an <h1> from typed content, place it here */}
      <div className="result-header">
        {pageTitle ? <h1>{pageTitle}</h1> : <h1>Your Clients.ai Solution</h1>}
      </div>

      {/* progress bar */}
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>

      <div id="typed-output" className="container">
        {sections.map((section, index) => (
          <div
            className={`content-box ${index <= currentIndex ? "visible" : "hidden"} px-4 py-4`}
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

      {/* 4-box agent grid: reveal once typed content is done */}
      <div
        className="agents-section-bg"
        style={allTypedDone ? { display: "block", opacity: 1, transform: "translateY(0)" } : {}}
      >
        <div className="agents-inner-container">
          <div className="agents-header-block">
            <h1>Hire your first team of marketing agents—Your AI team for client acquisition</h1>
            <p>
              You don’t need more traffic. You need more clients. But generic messaging is a proven conversion killer. 
              Clients.ai supercharges your funnels with Agents that customize copy for every prospect—turning your marketing 
              into a client-getting powerhouse.
            </p>
          </div>

          <div className="agents-boxes-grid">
            {/* Box 1: Intake Agent */}
            <div className="agents-box">
              <div className="agents-box-top">
                <div className="agents-combo">
                  <span>Intake Agent</span>
                  <span className="agents-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>
              <p className="agents-text-desc">
                Most leads never buy because you never learn what they actually want. The second they opt-in, your intake 
                agent scans their socials, uncovers unique buying triggers, and hands them to your copy operator.
              </p>
              <div className="agents-action-row">
                <a href="https://z.clients.ai" className="agents-demo-link">Go</a>
                <a href="https://analyst.clients.ai" className="agents-info-link">Learn more</a>
              </div>
            </div>

            {/* Box 2: Copy Operator */}
            <div className="agents-box">
              <div className="agents-box-top">
                <div className="agents-combo">
                  <span>Copy Operator</span>
                  <span className="agents-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>
              <p className="agents-text-desc">
                Most marketing talks at leads. Yours will talk to them. Your Copy Operator rewrites every thank-you page, 
                lead magnet, email, and offer—so personal, leads feel you wrote them by hand. That’s how you get real responses.
              </p>
              <div className="agents-action-row">
                <a href="https://z.clients.ai" className="agents-demo-link">Go</a>
                <a href="https://copywriter.clients.ai" className="agents-info-link">Learn more</a>
              </div>
            </div>

            {/* Box 3: Launch Architect */}
            <div className="agents-box">
              <div className="agents-box-top">
                <div className="agents-combo">
                  <span>Launch Architect</span>
                  <span className="agents-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>
              <p className="agents-text-desc">
                Emails that cement relationships and close deals. Every follow-up, every offer—strategically placed, automatically 
                customized—driving leads straight to checkout, primed to buy. No guesswork, no pain points missed, no revenue lost.
              </p>
              <div className="agents-action-row">
                <a href="https://z.clients.ai" className="agents-demo-link">Go</a>
                <a href="https://campaign.clients.ai" className="agents-info-link">Learn more</a>
              </div>
            </div>

            {/* Box 4: Content Strategist */}
            <div className="agents-box">
              <div className="agents-box-top">
                <div className="agents-combo">
                  <span>Content Strategist</span>
                  <span className="agents-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>
              <p className="agents-text-desc">
                Your offer is only as strong as what comes before it. So your content strategist reworks every guide, every resource—
                expertly crafted, perfectly positioned, effortlessly delivered—guiding leads to the sale at every turn.
              </p>
              <div className="agents-action-row">
                <a href="https://z.clients.ai" className="agents-demo-link">Go</a>
                <a href="https://content.clients.ai" className="agents-info-link">Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const enhanceContent = (content: string): Section[] => {
  // Attempt to find the first <h1> and remove it, so we can place it in the result-header
  // This is where you could setPageTitle if needed. For now, we'll keep it simpler:
  // We'll do a quick check for any <h1> in the text, but only if we want to set it aside.

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

    // Replace the typed image link with the new BG image
    // (If there's an <img> or we can forcibly inject our .typed-image structure)
    // We'll do a container approach for consistency:
    const headerMatch = processedSection.match(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i);
    const header = headerMatch ? headerMatch[0] : "";
    const contentWithoutHeader = processedSection
      .replace(/<h[1-2]\b[^>]*>(.*?)<\/h[1-2]>/i, "")
      .trim();

    const sectionHTML = `
      <div class="section-container">
        <div class="typed-image">
          <img src="https://progwebinar.blob.core.windows.net/pics/BGimg.png" alt="Typed section image"/>
        </div>
        <div>
          <div class="section-header">${header}</div>
          <div class="section-content">${contentWithoutHeader}</div>
        </div>
      </div>
    `;

    // Decide if there's a button
    const shouldHaveButton = index >= sections.length - 3;
    return { content: sectionHTML, shouldHaveButton };
  });

  return processedSections;
};

export default TypedContent;
