import React, { useState } from 'react';
import Button from '../ui/Button';
import { Upload } from 'lucide-react';
import FileUpload from '../ui/FileUpload';
import FormInput from '../ui/Input';
import FormTextarea from '../ui/TextArea';

interface KubeconfigFormProps {
  onSubmit: (kubeconfigData: { file?: File; text?: string; name: string }) => void;
  isLoading?: boolean;
}

const KubeconfigForm: React.FC<KubeconfigFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [kubeconfigFile, setKubeconfigFile] = useState<File | null>(null);
  const [kubeconfigText, setKubeconfigText] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'paste'>('file');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Cluster name is required';
    }
    
    if (uploadType === 'file' && !kubeconfigFile) {
      newErrors.file = 'Please upload a kubeconfig file';
    }
    
    if (uploadType === 'paste' && !kubeconfigText.trim()) {
      newErrors.text = 'Please paste your kubeconfig content';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      file: uploadType === 'file' ? kubeconfigFile || undefined : undefined,
      text: uploadType === 'paste' ? kubeconfigText : undefined,
      name,
    });
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <FormInput
          id="cluster-name"
          name="name"
          label="Cluster Name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="production-eks"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setUploadType('file')}
            className={`
              flex-1 py-2 px-3 text-sm font-medium rounded-md border 
              ${uploadType === 'file'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
            `}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadType('paste')}
            className={`
              flex-1 py-2 px-3 text-sm font-medium rounded-md border 
              ${uploadType === 'paste'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
            `}
          >
            Paste Content
          </button>
        </div>
        
        {uploadType === 'file' ? (
          <FileUpload
            onFileSelect={setKubeconfigFile}
            accept=".yaml,.yml"
            helperText="Upload your kubeconfig file (YAML format, max 5MB)"
            errorText={errors.file}
          />
        ) : (
          <div>
            <FormTextarea
              id="cluster-kubeconfig"
              name="kubeconfigText"
              label="Kubeconfig Content"
              value={kubeconfigText}
              onChange={(e) => setKubeconfigText(e.target.value)}
              error={errors.text}
              placeholder="Paste your kubeconfig content here..."
            />
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Add Cluster
        </Button>
      </div>
    </form>
  );
};

export default KubeconfigForm;