import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './components/NavBar';
import Background from './components/Background';
import Footer from './components/Footer';
import './Project.css';

const Project = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

    useEffect(() => {
        const loadProjectData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/projects/${projectId}.json`);
                if (!response.ok) {
                    throw new Error('Project not found');
                }
                const data = await response.json();
                setProjectData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadProjectData();
        }
    }, [projectId]);

    const nextImage = () => {
        if (projectData?.galleryImages) {
            setCurrentGalleryIndex((prev) =>
                (prev + 1) % projectData.galleryImages.length
            );
        }
    };

    const prevImage = () => {
        if (projectData?.galleryImages) {
            setCurrentGalleryIndex((prev) =>
                prev === 0 ? projectData.galleryImages.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return (
            <Background>
                <NavBar />
                <div className="project-container">
                    <div className="loading">Loading project...</div>
                </div>
                <Footer />
            </Background>
        );
    }

    if (error) {
        return (
            <Background>
                <NavBar />
                <div className="project-container">
                    <div className="error">Error: {error}</div>
                </div>
                <Footer />
            </Background>
        );
    }

    if (!projectData) {
        return (
            <Background>
                <NavBar />
                <div className="project-container">
                    <div className="error">Project not found</div>
                </div>
                <Footer />
            </Background>
        );
    }

    return (
        <Background>
            <NavBar />            <div className="project-container">
                {/* Project Header */}
                <div className="project-header">
                    <div className="project-header-content">
                        <div className="project-main-image">
                            <img
                                src={projectData.mainImage}
                                alt={projectData.title}
                                onError={(e) => {
                                    e.target.src = '/src/assets/Shuksan.jpg'; // Use Shuksan as fallback
                                }}
                            />
                        </div>
                        <div className="project-info">
                            <h1 className="project-title">{projectData.title}</h1>
                            <p className="project-description">{projectData.longDescription}</p>
                            <div className="project-meta">
                                <a className="project-ref" href={projectData.ref}>{projectData.type}</a>
                                <div className="project-tags">
                                    <div className='gradient'>
                                        {projectData.tags.map((tag, index) => (
                                            <span key={index} className="project-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className="project-date">{projectData.creationDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Body */}
                <div className="project-body">
                    {/* Gallery Section */}
                    {projectData.galleryImages && projectData.galleryImages.length > 0 && (
                        <div className="project-gallery">
                            <div className="gallery-container">                                <img
                                    src={projectData.galleryImages[currentGalleryIndex]}
                                    alt={`${projectData.title} gallery ${currentGalleryIndex + 1}`}
                                    className="gallery-image"
                                    onError={(e) => {
                                        e.target.src = '/src/assets/Shuksan.jpg'; // Use Shuksan as fallback
                                    }}
                                />
                                {projectData.galleryImages.length > 1 && (
                                    <>
                                        <button className="gallery-nav prev" onClick={prevImage}>
                                            ‹
                                        </button>
                                        <button className="gallery-nav next" onClick={nextImage}>
                                            ›
                                        </button>
                                        <div className="gallery-indicators">
                                            {projectData.galleryImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`gallery-indicator ${index === currentGalleryIndex ? 'active' : ''}`}
                                                    onClick={() => setCurrentGalleryIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Body Text */}
                    <div className="project-text">
                        {projectData.bodyText.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </Background>
    );
};

export default Project;
