import React, { useState, useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { TemplateEditor } from './TemplateEditor';

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

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const STORAGE_KEY = 'desainr.templates';

  function generateId() {
    try {
      // Prefer Web Crypto if available
      return crypto?.randomUUID?.() || `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    } catch {
      return `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
  }

  async function loadTemplatesFromStorage(): Promise<Template[]> {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const arr = Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : [];
    return arr as Template[];
  }

  async function saveTemplatesToStorage(next: Template[]) {
    await chrome.storage.sync.set({ [STORAGE_KEY]: next });
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadTemplatesFromStorage();
        if (!mounted) return;
        setTemplates(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'sync') return;
      if (STORAGE_KEY in changes) {
        const next = Array.isArray(changes[STORAGE_KEY].newValue) ? changes[STORAGE_KEY].newValue : [];
        setTemplates(next as Template[]);
      }
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => {
      mounted = false;
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  const handleCreate = async (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    try {
      const now = Date.now();
      const newTemplate: Template = {
        id: generateId(),
        createdAt: now,
        ...templateData,
        updatedAt: now,
      };
      const next = [newTemplate, ...templates];
      setTemplates(next);
      await saveTemplatesToStorage(next);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    }
  };

  const handleUpdate = async (templateId: string, templateData: Partial<Template>) => {
    try {
      const now = Date.now();
      const next = templates.map(t =>
        t.id === templateId ? { ...t, ...templateData, updatedAt: now } : t
      );
      setTemplates(next);
      await saveTemplatesToStorage(next);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template. Please try again.');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const next = templates.filter(t => t.id !== templateId);
      setTemplates(next);
      await saveTemplatesToStorage(next);
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleDuplicate = async (template: Template) => {
    try {
      const now = Date.now();
      const dup: Template = {
        id: generateId(),
        title: `${template.title} (Copy)`,
        instruction: template.instruction,
        description: template.description,
        variables: template.variables,
        tags: template.tags,
        createdAt: now,
        updatedAt: now,
      };
      const next = [dup, ...templates];
      setTemplates(next);
      await saveTemplatesToStorage(next);
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('Failed to duplicate template. Please try again.');
    }
  };

  const handleExportToStorage = async (template: Template) => {
    try {
      // Get existing slash prompts from chrome.storage.sync
      const result = await chrome.storage.sync.get(['slashPrompts']);
      const existingPrompts = result.slashPrompts || [];
      
      // Add the template to slash prompts
      const newPrompt = {
        id: template.id,
        title: template.title,
        instruction: template.instruction
      };
      
      // Check if it already exists
      const exists = existingPrompts.some((p: any) => p.id === template.id);
      if (!exists) {
        existingPrompts.push(newPrompt);
        await chrome.storage.sync.set({ slashPrompts: existingPrompts });
        alert('Template exported to slash prompts successfully!');
      } else {
        alert('Template already exists in slash prompts.');
      }
    } catch (error) {
      console.error('Error exporting to storage:', error);
      alert('Failed to export template. Please try again.');
    }
  };

  // Filter templates based on search and tags
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => template.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Get all unique tags from templates
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags || [])));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading templates...</p>
      </div>
    );
  }

  if (isCreating || editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onSave={(data) => {
          if (editingTemplate) {
            handleUpdate(editingTemplate.id, data);
          } else {
            handleCreate(data);
          }
        }}
        onCancel={() => {
          setIsCreating(false);
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="template-manager">
      <div className="template-header">
        <div className="header-content">
          <h2>Prompt Templates</h2>
          <p className="subtitle">Create and manage reusable prompt templates for custom actions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          + New Template
        </button>
      </div>

      <div className="template-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {allTags.length > 0 && (
          <div className="tag-filters">
            <span className="filter-label">Filter by tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button className="clear-btn" onClick={() => setSelectedTags([])}>
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No templates found</h3>
          <p>
            {templates.length === 0 
              ? "Create your first template to get started"
              : "Try adjusting your search or filters"}
          </p>
          {templates.length === 0 && (
            <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
              Create Template
            </button>
          )}
        </div>
      ) : (
        <div className="template-grid">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => setEditingTemplate(template)}
              onDelete={() => handleDelete(template.id)}
              onDuplicate={() => handleDuplicate(template)}
              onExport={() => handleExportToStorage(template)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
