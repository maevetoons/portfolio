import ShuksanImage from '/Shuksan.jpg'
import Caravan from '/caravan.png'
import Kintsugi from './assets/kintsugi.png'
import MBTA from './assets/mbta.png'
import CKC from './assets/ckc.png'
import YoutubeIcon from './assets/youtube.png'
import LinkedinIcon from './assets/linkedin.png'
import GithubIcon from './assets/github.png'
import EmailIcon from './assets/email.webp'
import PythonIcon from './assets/python.png'
import JavaScriptIcon from './assets/javascript.png'
import CIcon from './assets/c.png'
import CppIcon from './assets/cpp.png'
import JuliaIcon from './assets/Julia.png'
import MatlabIcon from './assets/Matlab.png'
import HtmlIcon from './assets/html.png'
import CssIcon from './assets/css.png'
import ReactIcon from './assets/react.webp'
import NodeIcon from './assets/node.svg'
import AwsIcon from './assets/aws.png'
import VscodeIcon from './assets/vscode.png'
import FigmaIcon from './assets/figma.png'
import TableauIcon from './assets/tableau.png'
import AutocadIcon from './assets/autocad.webp'
import RevitIcon from './assets/revit.webp'
import ArduinoIcon from './assets/arduino.png'
import EspIcon from './assets/esp.png'
import SkillGraph from './components/SkillGraph'
import Background from './components/Background'
import Footer from './components/Footer'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Project data configuration
const projectConfig = [
    { id: 'caravan', image: Caravan, alt: 'Caravan Project' },
    { id: 'kintsugi', image: Kintsugi, alt: 'Kintsugi Project' },
    { id: 'portfolio', image: ShuksanImage, alt: 'Portfolio Project' }
];

const videoProjectConfig = [
    { id: 'fastest-t-rider', image: MBTA, alt: 'Fastest T Rider Video' },
    { id: 'enriching-cuisine', image: CKC, alt: 'Enriching Cuisine Video' }
];

function Home() {
    const [projectData, setProjectData] = useState({});
    const [videoProjectData, setVideoProjectData] = useState({});

    // Load project data from JSON files
    useEffect(() => {
        const loadProjectData = async () => {
            const data = {};
            for (const project of projectConfig) {
                try {
                    const response = await fetch(`/projects/${project.id}.json`);
                    const projectJson = await response.json();
                    data[project.id] = projectJson;
                } catch (error) {
                    console.error(`Error loading project data for ${project.id}:`, error);
                }
            }
            setProjectData(data);
        };

        const loadVideoProjectData = async () => {
            const data = {};
            for (const project of videoProjectConfig) {
                try {
                    const response = await fetch(`/projects/${project.id}.json`);
                    const projectJson = await response.json();
                    data[project.id] = projectJson;
                } catch (error) {
                    console.error(`Error loading video project data for ${project.id}:`, error);
                }
            }
            setVideoProjectData(data);
        };

        loadProjectData();
        loadVideoProjectData();
    }, []);

    const skills = [
        { id: 1, name: 'Python', icon: PythonIcon },
        { id: 2, name: 'JavaScript', icon: JavaScriptIcon },
        { id: 3, name: 'C', icon: CIcon },
        { id: 4, name: 'C++', icon: CppIcon },
        { id: 5, name: 'Julia', icon: JuliaIcon },
        { id: 6, name: 'MATLAB', icon: MatlabIcon },
        { id: 7, name: 'HTML', icon: HtmlIcon },
        { id: 8, name: 'CSS', icon: CssIcon },
        { id: 9, name: 'React', icon: ReactIcon },
        { id: 10, name: 'Node.js', icon: NodeIcon },
        { id: 11, name: 'AWS', icon: AwsIcon },
        { id: 12, name: 'VS Code', icon: VscodeIcon },
        { id: 13, name: 'GitHub', icon: GithubIcon },
        { id: 14, name: 'Figma', icon: FigmaIcon },
        { id: 15, name: 'Tableau', icon: TableauIcon },
        { id: 16, name: 'AutoCAD', icon: AutocadIcon },
        { id: 17, name: 'Revit', icon: RevitIcon },
        { id: 18, name: 'Arduino', icon: ArduinoIcon },
        { id: 19, name: 'ESP32', icon: EspIcon }
    ];

    return (
        <Background>
            <div className="content-wrapper">
            <div className="bg-style">
                <div className="oval1"></div>
                <div className="oval2"></div>
            </div>
            <div className="hero">
                <div className="hero-title">
                    <div className="hero-title-text">
                        <h1>Maeve Chen</h1>
                            <h4>Software developer and hardware engineer</h4>
                        <p>I aim to solve complex problems with a strong user focus.</p>
                    </div>
                    <div className="hero-links">
                            <a href="https://youtube.com/@maevetoons" target="_blank" rel="noopener noreferrer" style={{"--icon-url": `url(${YoutubeIcon})`}}>
                                <img src={YoutubeIcon} alt="YouTube" />
                            </a>
                            <a href="https://linkedin.com/in/maevechen" target="_blank" rel="noopener noreferrer" style={{"--icon-url": `url(${LinkedinIcon})`}}>
                                <img src={LinkedinIcon} alt="LinkedIn" />
                            </a>
                            <a href="https://github.com/maevetoons" target="_blank" rel="noopener noreferrer" style={{"--icon-url": `url(${GithubIcon})`}}>
                                <img src={GithubIcon} alt="GitHub" />
                            </a>
                            <a href="mailto:maevechn@mit.edu" style={{"--icon-url": `url(${EmailIcon})`}}>
                                <img src={EmailIcon} alt="Email" />
                            </a>
                        </div>
                </div>
                <div className="hero-description">
                    <p>I'm Maeve, an EECS undergraduate student at MIT and a hardware infrastructure intern at AMD.
                        I'm strongly interested in software, hardware, and electronics. I also have a passion for design, environmental sustainability, and linguistics.
                    </p>
                </div>
            </div>
                <div className="br"></div>
            <div className="projects">
                <div className="my-digital-playground">
                        <h2>My Digital Playground</h2>
                        <div className="project-list">
                            {projectConfig.map(project => (
                                <Link key={project.id} to={`/project/${project.id}`} className="project-link">
                                    <div className="project-card">
                                        <img src={project.image} alt={project.alt} />
                                        <h3>{projectData[project.id]?.title || 'Loading...'}</h3>
                                        <p>{projectData[project.id]?.briefDescription || 'Loading description...'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="video-projects">
                    <div className="life-through-a-camera-lens">
                        <h2>Life Through a Camera Lens</h2>
                        <div className="project-list">
                            {videoProjectConfig.map(project => (
                                <Link key={project.id} to={`/project/${project.id}`} className="project-link">
                                    <div className="project-card">
                                        <img src={project.image} alt={project.alt} />
                                        <h3>{videoProjectData[project.id]?.title || 'Loading...'}</h3>
                                        <p>{videoProjectData[project.id]?.briefDescription || 'Loading description...'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="br"></div>
                <div className="experience-section">
                    <div className="experience-timeline">
                        <h2>Experience</h2>
                        <ol className="timeline">
                            <li>
                                <div className="timeline-dot"></div>
                                <p className="timeline-date">May 2025 - Now</p>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>AMD</h4>
                                        <span className="timeline-badge">present</span>
                                    </div>
                                    <p>Hardware Infrastructure Intern</p>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <p className="timeline-date">Feb 2025 - Now</p>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>Source Cooperative</h4>
                                        <span className="timeline-badge">present</span>
                                    </div>
                                    <p>Cloud Software Engineer</p>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <p className="timeline-date">Sep 2024 - Jan 2025</p>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>Julia Lab (MIT CSAIL)</h4>
                                    </div>
                                    <p>Machine Learning Engineer</p>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <p className="timeline-date">Jan 2024 - Feb 2024</p>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>MIT Concrete Sustainability Hub</h4>
                                    </div>
                                    <p>Urban Science Researcher</p>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <p className="timeline-date">Nov 2021 - Aug 2022</p>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>NYU Center for Urban Science and Progress</h4>
                                    </div>
                                    <p>Urban Science Researcher</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="skill-graph">
                        <SkillGraph skills={skills} />
                    </div>
                </div>

                <Footer />
            </div>
        </Background>
    )
}

export default Home
