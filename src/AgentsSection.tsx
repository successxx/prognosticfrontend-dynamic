import React from "react";
import "./AgentsSection.css"; // We'll create this CSS file next

interface Agent {
  name: string;
  description: string;
  seeLink: string;
  learnMoreLink: string;
}

const AgentsSection: React.FC = () => {
  // Define the agents data
  const agents: Agent[] = [
    {
      name: "Intake Agent",
      description:
        "Most leads never buy because you never learn what they actually want. The second they opt-in, your intake agent scans their socials, uncovers unique buying triggers, and hands them to your copy operator.",
      seeLink: "https://z.clients.ai",
      learnMoreLink: "https://analyst.clients.ai",
    },
    {
      name: "Copy Operator",
      description:
        "Most marketing talks at leads. Yours will talk to them. Your Copy Operator rewrites every thank-you page, lead magnet, email, and offer--so personal, leads feel you wrote them by hand. That’s how you get real responses.",
      seeLink: "https://z.clients.ai",
      learnMoreLink: "https://copywriter.clients.ai",
    },
    {
      name: "Launch Architect",
      description:
        "Emails that cement relationships and close deals. Every follow-up, every offer--strategically placed, automatically customized--driving leads straight to checkout, primed to buy. No guesswork, no pain points missed, no revenue lost.",
      seeLink: "https://z.clients.ai",
      learnMoreLink: "https://campaign.clients.ai",
    },
    {
      name: "Content Strategist",
      description:
        "Your offer is only as strong as what comes before it. So your content strategist reworks every guide, every resource--expertly crafted, perfectly positioned, effortlessly delivered--guiding leads to the sale at every turn.",
      seeLink: "https://z.clients.ai",
      learnMoreLink: "https://content.clients.ai",
    },
  ];

  return (
    <div className="agents-section-bg">
      <div className="agents-inner-container">
        {/* Header and subheader */}
        <div className="agents-header-block">
          <h1>
            Hire your first team of marketing agents—Your AI team for client
            acquisition
          </h1>
          <p>
            You don’t need more traffic. You need more clients. But generic
            messaging is a proven conversion killer. Clients.ai supercharges
            your funnels with Agents that customize copy for every
            prospect—turning your marketing into a client-getting powerhouse.
          </p>
        </div>

        {/* Grid of agent boxes */}
        <div className="agents-boxes-grid">
          {agents.map((agent, index) => (
            <div className="agents-box" key={index}>
              <div className="agents-box-top">
                <div className="agents-combo">
                  <span>{agent.name}</span>
                  <span className="agents-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </span>
                </div>
              </div>
              <p className="agents-text-desc">{agent.description}</p>
              <div className="agents-action-row">
                <a href={agent.seeLink} className="agents-demo-link">
                  See
                </a>
                <a href={agent.learnMoreLink} className="agents-info-link">
                  Learn more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsSection;
