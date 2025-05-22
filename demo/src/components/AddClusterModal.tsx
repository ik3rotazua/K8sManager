import React, { useState } from 'react';
import { Cloud, Upload, CheckCircle2 } from 'lucide-react';
import KubeconfigForm from './forms/KubeconfigForm';
import AwsEksForm from './forms/AwsEksForm';
import AzureAksForm from './forms/AzureAksForm';
import GcpGkeForm from './forms/GcpGkeForm';
import Modal from './ui/Modal';
import Tabs from './ui/Tabs';

interface AddClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClusterModal: React.FC<AddClusterModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handlers for each form submission
  const handleKubeconfigSubmit = async (data: { file?: File; text?: string; name: string }) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Kubeconfig submitted:', data);
      setSuccessMessage(`Cluster "${data.name}" added successfully`);
      setIsSuccess(true);
      
      // Reset and close after 2 seconds
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding cluster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface AwseFormData {
    clusterName: string;
    [key: string]: unknown;
  }

  const handleAwsSubmit = async (data: AwseFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('AWS EKS submitted:', data);
      setSuccessMessage(`EKS cluster "${data.clusterName}" added successfully`);
      setIsSuccess(true);
      
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding EKS cluster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface AzureAksFormData {
    clusterName: string;
    [key: string]: unknown;
  }

  const handleAzureSubmit = async (data: AzureAksFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Azure AKS submitted:', data);
      setSuccessMessage(`AKS cluster "${data.clusterName}" added successfully`);
      setIsSuccess(true);
      
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding AKS cluster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface GcpGkeFormData {
    clusterName: string;
    [key: string]: unknown;
  }

  const handleGcpSubmit = async (data: GcpGkeFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('GCP GKE submitted:', data);
      setSuccessMessage(`GKE cluster "${data.clusterName}" added successfully`);
      setIsSuccess(true);
      
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding GKE cluster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setSuccessMessage('');
    onClose();
  };

  const tabItems = [
    {
      id: 'kubeconfig',
      label: (
        <div className="flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Kubeconfig</span>
        </div>
      ),
      content: <KubeconfigForm onSubmit={handleKubeconfigSubmit} isLoading={isSubmitting} />
    },
    {
      id: 'aws',
      label: (
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4" />
          <span>AWS EKS</span>
        </div>
      ),
      content: <AwsEksForm onSubmit={handleAwsSubmit} isLoading={isSubmitting} />
    },
    {
      id: 'azure',
      label: (
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4" />
          <span>Azure AKS</span>
        </div>
      ),
      content: <AzureAksForm onSubmit={handleAzureSubmit} isLoading={isSubmitting} />
    },
    {
      id: 'gcp',
      label: (
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4" />
          <span>GCP GKE</span>
        </div>
      ),
      content: <GcpGkeForm onSubmit={handleGcpSubmit} isLoading={isSubmitting} />
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Add Kubernetes Cluster"
      description="Connect to your Kubernetes cluster using one of the methods below."
      size="xl"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 text-green-500 animate-[appear_0.3s_ease-out]">
            <CheckCircle2 size={64} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-500">{successMessage}</p>
        </div>
      ) : (
        <Tabs 
          tabs={tabItems}
        />
      )}
    </Modal>
  );
};

export default AddClusterModal;