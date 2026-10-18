import React from 'react';
import { Music, MapPin, Lamp, Sparkles } from 'lucide-react';
import WindowPanel from './WindowPanel';
import { playClickSound } from '../utils/audio';

const iconMap = {
  '01': Music,
  '02': MapPin,
  '03': Lamp,
};

export default function ProjectCard({ project, onInteract }) {
  const IconComponent = iconMap[project.num] || Sparkles;

  const handleAction = () => {
    playClickSound();
    if (onInteract) {
      onInteract(project.interactiveTarget);
    }
  };

  return (
    <WindowPanel
      title={`PROJECT ${project.num} — ${project.title}`}
      icon={<IconComponent size={14} color="var(--pip-berry)" />}
      statusText={`SYS_STATE: ${project.meta.status || 'ONLINE'}`}
      className="project-window"
    >
      <div className="project-card-content">
        <div className="project-card-header">
          <div className="project-badge-row">
            <span className="pip-tag font-pixel">PROJECT {project.num}</span>
            <span className="project-status-dot font-mono">● READY</span>
          </div>
          <h3 className="project-card-title font-retro">{project.title}</h3>
          <p className="project-tagline font-body italic">
            "{project.tagline}"
          </p>
        </div>

        <p className="project-description font-body">{project.description}</p>

        <div className="project-pip-note">
          <span className="font-pixel note-label">Pip's Blueprint Note:</span>
          <p className="note-text font-body">{project.pipNote}</p>
        </div>

        <div className="project-meta-box">
          {Object.entries(project.meta || {}).map(([key, val]) => (
            <div key={key} className="meta-pair">
              <span className="meta-key font-mono">{key.toUpperCase()}:</span>
              <span className="meta-val font-pixel">{val}</span>
            </div>
          ))}
        </div>

        <div className="project-tags">
          {(project.tags || []).map((tag, idx) => (
            <span key={idx} className="project-chip font-mono">
              #{tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="pip-button pip-button-primary project-action-btn"
          onClick={handleAction}
          aria-label={`Open interactive ${project.title}`}
        >
          <Sparkles size={13} />
          <span>[ {project.actionLabel} ]</span>
        </button>
      </div>
    </WindowPanel>
  );
}
