import React, { useState, useEffect } from 'react';

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

interface TemplateEditorProps {
  template: Template | null;
  onSave: (data: Omit<Template, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [description, setDescription] = useState('');
  const [variablesText, setVariablesText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);

  useEffect(() => {
    if (template) {
      setTitle(template.title || '');
      setInstruction(template.instruction || '');
      setDescription(template.description || '');
      setVariablesText(template.variables?.join(', ') || '');
      setTagsText(template.tags?.join(', ') || '');
    }
  }, [template]);

  useEffect(() => {
    // Auto-detect variables in instruction (format: {{variableName}})
    const regex = /\{\{(\w+)\}\}/g;
    const matches = instruction.matchAll(regex);
    const vars = Array.from(new Set(Array.from(matches, m => m[1])));
    setDetectedVariables(vars);
  }, [instruction]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!instruction.trim()) {
      newErrors.instruction = 'Instruction is required';
    } else if (instruction.length > 2000) {
      newErrors.instruction = 'Instruction must be less than 2000 characters';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const variables = variablesText
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      title: title.trim(),
      instruction: instruction.trim(),
      description: description.trim() || undefined,
      variables: variables.length > 0 ? variables : undefined,
      tags: tags.length > 0 ? tags : undefined,
      updatedAt: new Date()
    });
  };

  const insertVariable = (variable: string) => {
    const cursorPosition = (document.getElementById('instruction') as HTMLTextAreaElement)?.selectionStart || instruction.length;
    const before = instruction.substring(0, cursorPosition);
    const after = instruction.substring(cursorPosition);
    setInstruction(before + `{{${variable}}}` + after);
  };

  return (
    <div className="template-editor">
      <div className="editor-header">
        <h2>{template ? 'Edit Template' : 'Create New Template'}</h2>
        <button className="btn btn-text" onClick={onCancel}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Summarize for executives"
            maxLength={100}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          <span className="char-count">{title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this template does..."
            rows={2}
            maxLength={500}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <span className="char-count">{description.length}/500</span>
        </div>

        <div className="form-group">
          <label htmlFor="instruction">
            Instruction <span className="required">*</span>
          </label>
          <div className="instruction-helper">
            <span>Use {'{{variableName}}'} syntax to add variables that can be replaced when using the template.</span>
          </div>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Summarize the following text for an executive audience, focusing on key insights and action items: {{text}}"
            rows={6}
            maxLength={2000}
            className={errors.instruction ? 'error' : ''}
          />
          {errors.instruction && <span className="error-message">{errors.instruction}</span>}
          <span className="char-count">{instruction.length}/2000</span>

          {detectedVariables.length > 0 && (
            <div className="detected-variables">
              <span className="label">Detected variables:</span>
              {detectedVariables.map(v => (
                <span key={v} className="variable-chip">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="variables">
            Variables
            <span className="help-text">(comma-separated, optional)</span>
          </label>
          <input
            type="text"
            id="variables"
            value={variablesText}
            onChange={(e) => setVariablesText(e.target.value)}
            placeholder="e.g., text, audience, tone"
          />
          <div className="quick-variables">
            <span className="label">Quick add:</span>
            {['text', 'selection', 'audience', 'tone', 'length', 'style'].map(v => (
              <button
                key={v}
                type="button"
                className="variable-btn"
                onClick={() => insertVariable(v)}
              >
                +{v}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            Tags
            <span className="help-text">(comma-separated, optional)</span>
          </label>
          <input
            type="text"
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="e.g., summary, business, email"
          />
          <div className="suggested-tags">
            <span className="label">Suggestions:</span>
            {['summary', 'rewrite', 'translate', 'email', 'business', 'technical', 'creative'].map(tag => (
              <button
                key={tag}
                type="button"
                className="tag-suggestion"
                onClick={() => {
                  const tags = tagsText.split(',').map(t => t.trim()).filter(t => t);
                  if (!tags.includes(tag)) {
                    setTagsText(tags.concat(tag).join(', '));
                  }
                }}
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
}
