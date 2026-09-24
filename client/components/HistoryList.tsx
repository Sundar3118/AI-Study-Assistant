import React, { useState } from 'react';
import { Search, Filter, Trash2, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { StudyItem } from '../services/api';
import { AnswerCard } from './AnswerCard';

interface HistoryListProps {
  items: StudyItem[];
  onDelete: (id: string) => Promise<void>;
  onNavigateHome: () => void;
  isLoading?: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  onDelete,
  onNavigateHome,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const subjects = ['All', 'Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks'];

  // Filter items based on search and subject
  const filteredItems = items.filter((item) => {
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this question from MongoDB?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await onDelete(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete question.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header and Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <div>
              <h4 className="fw-bold mb-1">Study History & Notes</h4>
              <p className="text-muted small mb-0">
                All questions saved in MongoDB. Review, search concepts, or delete obsolete queries.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary fs-6 px-3 py-2">
                {items.length} {items.length === 1 ? 'Question' : 'Questions'} Saved
              </span>
            </div>
          </div>

          <div className="row g-2">
            {/* Search Input */}
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 shadow-none ps-0"
                  placeholder="Search questions, explanations, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-2 overflow-auto pb-1">
                <Filter size={16} className="text-muted flex-shrink-0" />
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    className={`btn btn-sm text-nowrap rounded-pill ${
                      selectedSubject === subj ? 'btn-dark' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedSubject(subj)}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <div className="card shadow-sm border-0 text-center p-5">
          <div className="card-body">
            <div className="text-muted mb-3">
              <BookOpen size={48} className="stroke-1 opacity-50" />
            </div>
            <h5 className="fw-bold">No Questions Found</h5>
            <p className="text-muted mb-4">
              {items.length === 0
                ? "You haven't asked any questions yet! Start asking questions to build your study library."
                : 'No saved questions match your current search or filter criteria.'}
            </p>
            {items.length === 0 ? (
              <button className="btn btn-primary px-4" onClick={onNavigateHome}>
                Ask Your First Question
              </button>
            ) : (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {filteredItems.map((item) => (
            <div key={item._id} className="position-relative">
              {deletingId === item._id && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-1 rounded"
                  style={{ backdropFilter: 'blur(2px)' }}
                >
                  <div className="spinner-border text-danger" role="status"></div>
                  <span className="ms-2 fw-semibold text-danger">Deleting from MongoDB...</span>
                </div>
              )}
              <AnswerCard item={item} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
