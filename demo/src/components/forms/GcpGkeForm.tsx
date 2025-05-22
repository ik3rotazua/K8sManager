import React, { useState } from 'react';
import Button from '../ui/Button';
import { Cloud } from 'lucide-react';
import FileUpload from '../ui/FileUpload';
import FormInput from '../ui/Input';

interface GcpGkeFormProps {
  onSubmit: (data: {
    name: string;
    serviceAccountKey: File | null;
    projectId: string;
    location: string;
    clusterName: string;
  }) => void;
  isLoading?: boolean;
}

const GcpGkeForm: React.FC<GcpGkeFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    location: '',
    clusterName: '',
  });
  
  const [serviceAccountKey, setServiceAccountKey] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Connection name is required';
    }
    
    if (!serviceAccountKey) {
      newErrors.serviceAccountKey = 'Service account key file is required';
    }
    
    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project ID is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.clusterName.trim()) {
      newErrors.clusterName = 'Cluster name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      ...formData,
      serviceAccountKey,
    });
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit} className="space-y-6">
      <div>
        <FormInput
          id="gcp-name"
          name="name"
          label="Connection Name"
          type="text"
          autoComplete="off"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="production-gke"
        />
      </div>
      
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">
          Service Account Key (JSON)
        </p>
        <FileUpload
          onFileSelect={setServiceAccountKey}
          accept=".json"
          helperText="Upload your GCP service account key JSON file"
          errorText={errors.serviceAccountKey}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormInput
            id="gcp-project-id"
            name="projectId"
            label="GCP Project ID"
            type="text"
            autoComplete="off"
            value={formData.projectId}
            onChange={handleChange}
            error={errors.projectId}
            placeholder="production-gke"
          />
        </div>
        
        <div>
          <FormInput
            id="gcp-location"
            name="location"
            label="Location (Region/Zone)"
            type="text"
            autoComplete="off"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            placeholder="us-central1"
          />
        </div>
      </div>
      
      <div>
        <FormInput
          id="gcp-cluster-name"
          name="clusterName"
          label="GKE Cluster Name"
          type="text"
          autoComplete="off"
          value={formData.clusterName}
          onChange={handleChange}
          error={errors.clusterName}
          placeholder="my-gke-cluster"
        />
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Cloud className="w-4 h-4" />}
        >
          Connect to GKE Cluster
        </Button>
      </div>
    </form>
  );
};

export default GcpGkeForm;