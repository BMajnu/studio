import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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

interface TemplateManagerProps {
  userId: string;
}

export function TemplateManager({ userId }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const templatesRef = collection(db, 'users', userId, 'prompts');
    const q = query(templatesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData: Template[] = [];
      snapshot.forEach((doc) => {
        templatesData.push({
          id: doc.id,
          ...doc.data()
        } as Template);
      });
      setTemplates(templatesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleCreate = async (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    try {
      const templatesRef = collection(db, 'users', userId, 'prompts');
      await addDoc(templatesRef, {
        ...templateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    }
  };

  const handleUpdate = async (templateId: string, templateData: Partial<Template>) => {
    try {
      const templateRef = doc(db, 'users', userId, 'prompts', templateId);
      await updateDoc(templateRef, {
        ...templateData,
        updatedAt: serverTimestamp()
      });
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template. Please try again.');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const templateRef = doc(db, 'users', userId, 'prompts', templateId);
      await deleteDoc(templateRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleDuplicate = async (template: Template) => {
    try {
      const templatesRef = collection(db, 'users', userId, 'prompts');
      await addDoc(templatesRef, {
        title: `${template.title} (Copy)`,
        instruction: template.instruction,
        description: template.description,
        variables: template.variables,
        tags: template.tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
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
