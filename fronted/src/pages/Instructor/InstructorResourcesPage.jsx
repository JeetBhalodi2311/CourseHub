import React from 'react';
import { BookOpen, Video, Users, HelpCircle, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import './InstructorResources.css';

const InstructorResourcesPage = () => {
    const resources = [
        {
            title: "Instructor Handbook",
            description: "A comprehensive guide to creating engaging courses, managing students, and maximizing your impact on CourseHub.",
            icon: <BookOpen size={24} />,
            link: "#",
            linkText: "Read Handbook"
        },
        {
            title: "Video Tutorials",
            description: "Watch step-by-step video tutorials on how to use the instructor dashboard, record high-quality lectures, and more.",
            icon: <Video size={24} />,
            link: "#",
            linkText: "Watch Tutorials"
        },
        {
            title: "Instructor Community",
            description: "Join our vibrant community of instructors. Share tips, ask questions, and network with fellow educators.",
            icon: <Users size={24} />,
            link: "#",
            linkText: "Join Community"
        },
        {
            title: "Course Creation Guidelines",
            description: "Best practices and requirements for course content, audio/video quality, and curriculum structure.",
            icon: <FileText size={24} />,
            link: "#",
            linkText: "View Guidelines"
        },
        {
            title: "Teaching & Pedagogy",
            description: "Learn about effective teaching methods, student engagement strategies, and how to structure your content.",
            icon: <ExternalLink size={24} />,
            link: "#",
            linkText: "Learn More"
        },
        {
            title: "Support Center",
            description: "Need help? Visit our support center for FAQs, troubleshooting guides, or to contact our support team.",
            icon: <HelpCircle size={24} />,
            link: "#",
            linkText: "Get Support"
        }
    ];

    return (
        <div className="instructor-resources-page">
            <header className="resources-header">
                <h1>Instructor Resources</h1>
                <p>Everything you need to succeed as a CourseHub instructor</p>
            </header>

            <div className="resources-grid">
                {resources.map((resource, index) => (
                    <div key={index} className="resource-card">
                        <div className="resource-icon">
                            {resource.icon}
                        </div>
                        <div className="resource-content">
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <a href={resource.link} className="resource-link">
                                {resource.linkText} <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstructorResourcesPage;
