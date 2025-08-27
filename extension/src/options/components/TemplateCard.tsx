import React from 'react';

interface Template {
  id: string;
  title: string;
  instruction: string;
  description?: string;
  variables?: string[];
  tags?: string[];
  createdAt: any;
  updatedAt?: any;
}

interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
}

export function TemplateCard({ template, onEdit, onDelete, onDuplicate, onExport }: TemplateCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="template-card">
      <div className="template-card-header">
        <h3 className="template-title">{template.title}</h3>
        <div className="template-actions">
          <button className="action-btn" onClick={onEdit} title="Edit">
            ✏️
          </button>
          <button className="action-btn" onClick={onDuplicate} title="Duplicate">
            📋
          </button>
          <button className="action-btn" onClick={onExport} title="Export to Slash Commands">
            ⬆️
          </button>
          <button className="action-btn delete" onClick={onDelete} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      {template.description && (
        <p className="template-description">{template.description}</p>
      )}

      <div className="template-instruction">
        <div className="instruction-label">Instruction:</div>
        <div className="instruction-text">
          {truncateText(template.instruction, 200)}
        </div>
      </div>

      {template.variables && template.variables.length > 0 && (
        <div className="template-variables">
          <span className="variables-label">Variables:</span>
          {template.variables.map(variable => (
            <span key={variable} className="variable-tag">{`{{${variable}}}`}</span>
          ))}
        </div>
      )}

      {template.tags && template.tags.length > 0 && (
        <div className="template-tags">
          {template.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="template-footer">
        <span className="template-date">
          {template.updatedAt 
            ? `Updated ${formatDate(template.updatedAt)}`
            : `Created ${formatDate(template.createdAt)}`
          }
        </span>
      </div>
    </div>
  );
}
