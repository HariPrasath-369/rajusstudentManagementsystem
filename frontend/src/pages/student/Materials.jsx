import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Eye, Search, Filter, FileText, Video, Link, Calendar, User } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';

const Materials = () => {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchMaterials();
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const data = await studentService.getSubjects();
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0]);
    } catch (error) {
      setSubjects(getMockSubjects());
      setSelectedSubject(getMockSubjects()[0]);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await studentService.getMaterials(selectedSubject.id);
      setMaterials(data);
    } catch (error) {
      setMaterials(getMockMaterials());
    } finally {
      setLoading(false);
    }
  };

  const getMockSubjects = () => [
    { id: 1, name: 'Data Structures', code: 'CS201' },
    { id: 2, name: 'Algorithms', code: 'CS202' },
    { id: 3, name: 'Database Systems', code: 'CS301' }
  ];

  const getMockMaterials = () => [
    { id: 1, title: 'Introduction to Data Structures', type: 'NOTES', description: 'Basic concepts of data structures with examples', fileUrl: '/files/ds-intro.pdf', uploadedAt: '2024-03-01', downloads: 45, teacher: 'Dr. Smith', size: '2.4 MB' },
    { id: 2, title: 'Algorithm Analysis Assignment', type: 'ASSIGNMENT', description: 'Submit by March 15th', fileUrl: '/files/assignment.pdf', uploadedAt: '2024-03-05', downloads: 32, teacher: 'Prof. Johnson', size: '1.2 MB' },
    { id: 3, title: 'Video Lecture - Sorting Algorithms', type: 'VIDEO', description: 'Watch the video tutorial', link: 'https://youtube.com/watch?v=123', uploadedAt: '2024-03-10', views: 120, teacher: 'Dr. Smith' }
  ];

  const handleDownload = (material) => {
    toast.success(`Downloading ${material.title}`);
  };

  const handlePreview = (material) => {
    setSelectedMaterial(material);
    setPreviewModalOpen(true);
  };

  const materialTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'NOTES', label: '📝 Notes' },
    { value: 'ASSIGNMENT', label: '📋 Assignment' },
    { value: 'SYLLABUS', label: '📚 Syllabus' },
    { value: 'REFERENCE', label: '🔗 Reference' },
    { value: 'VIDEO', label: '🎥 Video' }
  ];

  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const typeOptions = materialTypes.map(t => ({ value: t.value, label: t.label }));

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'NOTES': return FileText;
      case 'ASSIGNMENT': return FileText;
      case 'SYLLABUS': return BookOpen;
      case 'VIDEO': return Video;
      case 'REFERENCE': return Link;
      default: return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'NOTES': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ASSIGNMENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'SYLLABUS': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'VIDEO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Study Materials
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Access course materials uploaded by your teachers
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Select Subject"
          options={subjectOptions}
          value={selectedSubject?.id}
          onChange={(e) => setSelectedSubject(subjects.find(s => s.id === parseInt(e.target.value)))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <Select
          label="Filter by Type"
          options={typeOptions}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="text-center py-12">Loading materials...</div>
      ) : filteredMaterials.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No materials found for this subject</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material, index) => {
            const TypeIcon = getTypeIcon(material.type);
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer" onClick={() => handlePreview(material)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                      <TypeIcon size={20} />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(material); }}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {material.description}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{material.uploadedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{material.teacher}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>{material.downloads || material.views || 0} {material.type === 'VIDEO' ? 'views' : 'downloads'}</span>
                      {material.size && <span>{material.size}</span>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedMaterial(null);
        }}
        title={selectedMaterial?.title || 'Material Preview'}
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getTypeColor(selectedMaterial.type)}`}>
                {React.createElement(getTypeIcon(selectedMaterial.type), { size: 20 })}
              </div>
              <span className="text-sm text-gray-500">Uploaded by {selectedMaterial.teacher} on {selectedMaterial.uploadedAt}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedMaterial.description}</p>
            {selectedMaterial.link && (
              <a
                href={selectedMaterial.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:underline"
              >
                <Link size={16} />
                Open Link
              </a>
            )}
            {selectedMaterial.fileUrl && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                <Button variant="primary" onClick={() => handleDownload(selectedMaterial)}>
                  <Download size={18} className="mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Materials;