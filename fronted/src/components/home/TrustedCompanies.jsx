import React from 'react';
import './TrustedCompanies.css';

const TrustedCompanies = () => {
    const companies = [
        { name: "Udemy", color: "#1a1f71" },
        { name: "Google", color: "#1428a0" },
        { name: "Coursera", color: "#049fd9" },
        { name: "LinkedIn", color: "#1ab7ea" },
        { name: "Microsoft", color: "#003cae" },
        { name: "GitHub", color: "#003b70" }
    ];

    return (
        <section className="trusted-section">
            <div className="trusted-container">
                <p className="trusted-label">
                    Trusted by over <span>17,000</span> companies and millions of learners around the world
                </p>
                <div className="companies-row">
                    {companies.map((company, i) => (
                        <div
                            key={i}
                            className="company-logo"
                            style={{ '--brand-color': company.color }}
                        >
                            <span>{company.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;
