import { useState, useEffect } from 'react';
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
    const [gallerySize, setGallerySize] = useState({ width: 0, height: 0 });

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

    useEffect(() => {
        if (projectData && projectData.galleryImages && projectData.galleryImages.length > 0) {
            let loaded = 0;
            let maxWidth = 0;
            let maxHeight = 0;
            const images = [];
            projectData.galleryImages.forEach((src, i) => {
                const img = new window.Image();
                img.onload = function () {
                    maxWidth = Math.max(maxWidth, img.naturalWidth);
                    maxHeight = Math.max(maxHeight, img.naturalHeight);
                    loaded++;
                    if (loaded === projectData.galleryImages.length) {
                        let width = Math.min(maxWidth, 840);
                        let height = Math.min(maxHeight, 1000);
                        if (maxWidth > 840) {
                            height = Math.round((840 / maxWidth) * maxHeight);
                            if (height > 1000) {
                                height = 1000;
                            }
                            width = 840;
                        }
                        if (height > 1000) {
                            width = Math.round((1000 / height) * width);
                            height = 1000;
                        }
                        setGallerySize({ width, height });
                    }
                };
                img.onerror = function () {
                    loaded++;
                    if (loaded === projectData.galleryImages.length) {
                        setGallerySize({ width: 840, height: 1000 });
                    }
                };
                img.src = src;
                images.push(img);
            });
        }
    }, [projectData]);

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
            <NavBar />
            <div className="project-container">
                <div className="project-header">
                    <div className="project-header-content">
                        <div className="project-main-image">
                            <img
                                src={projectData.mainImage}
                                alt={projectData.title}
                                onError={(e) => {
                                    e.target.src = '/Shuksan.jpg';
                                }}
                            />
                        </div>
                        <div className="project-info">
                            <h1 className="project-title">{projectData.title}</h1>
                            <p className="project-description">{projectData.longDescription}</p>
                            <div className="project-meta">
                                <a className="project-ref" href={projectData.ref}><h3>{projectData.type}</h3></a>
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

                <div className="project-body">
                    {projectData.galleryImages && projectData.galleryImages.length > 0 && (
                        <div className="project-gallery" style={{ width: gallerySize.width || 840, height: gallerySize.height || 1000 }}>
                            <div className="gallery-container" style={{ width: '100%', height: '100%' }}>
                                <img
                                    src={projectData.galleryImages[currentGalleryIndex]}
                                    alt={`${projectData.title} gallery ${currentGalleryIndex + 1}`}
                                    className="gallery-image"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                                    onError={(e) => {
                                        e.target.src = '/Shuksan.jpg';
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
