import React, { useState } from 'react';
import Button from '../ui/Button';
import { Cloud } from 'lucide-react';
import FormInput from '../ui/Input';

interface AzureAksFormProps {
  onSubmit: (data: {
    name: string;
    tenantId: string;
    subscriptionId: string;
    clientId: string;
    clientSecret: string;
    resourceGroupName: string;
    clusterName: string;
  }) => void;
  isLoading?: boolean;
}

const AzureAksForm: React.FC<AzureAksFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    tenantId: '',
    subscriptionId: '',
    clientId: '',
    clientSecret: '',
    resourceGroupName: '',
    clusterName: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Connection name is required';
    }
    
    if (!formData.tenantId.trim()) {
      newErrors.tenantId = 'Tenant ID is required';
    }
    
    if (!formData.subscriptionId.trim()) {
      newErrors.subscriptionId = 'Subscription ID is required';
    }
    
    if (!formData.clientId.trim()) {
      newErrors.clientId = 'Client ID is required';
    }
    
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secret is required';
    }
    
    if (!formData.resourceGroupName.trim()) {
      newErrors.resourceGroupName = 'Resource Group is required';
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
    
    onSubmit(formData);
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit} className="space-y-6">
      <div>
        <FormInput
          id="azure-name"
          name="name"
          label="Connection Name"
          type="text"
          autoComplete="off"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="production-aks"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormInput
            id="azure-tenant-id"
            name="tenantId"
            label="Azure Tenant ID"
            type="text"
            autoComplete="off"
            value={formData.tenantId}
            onChange={handleChange}
            error={errors.tenantId}
            placeholder="00000000-0000-0000-0000-000000000000"
          />
        </div>
        
        <div>
          <FormInput
            id="azure-subscription-id"
            name="subscriptionId"
            label="Azure Tenant ID"
            type="text"
            autoComplete="off"
            value={formData.subscriptionId}
            onChange={handleChange}
            error={errors.subscriptionId}
            placeholder="00000000-0000-0000-0000-000000000000"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormInput
            id="azure-client-id"
            name="clientId"
            label="Client ID (App ID)"
            type="text"
            autoComplete="off"
            value={formData.clientId}
            onChange={handleChange}
            error={errors.clientId}
            placeholder="00000000-0000-0000-0000-000000000000"
          />
        </div>
        
        <div>
          <FormInput
            id="azure-client-secret"
            name="clientSecret"
            label="Client Secret"
            type="password"
            autoComplete="off"
            value={formData.clientSecret}
            onChange={handleChange}
            error={errors.clientSecret}
            placeholder="••••••••••••••••"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormInput
            id="azure-resource-group"
            name="resourceGroupName"
            label="Resource Groupt"
            type="text"
            autoComplete="off"
            value={formData.resourceGroupName}
            onChange={handleChange}
            error={errors.resourceGroupName}
            placeholder="my-resource-group"
          />
        </div>
        
        <div>
          <FormInput
            id="azure-cluster-name"
            name="clusterName"
            label="AKS Cluster Name"
            type="text"
            autoComplete="off"
            value={formData.clusterName}
            onChange={handleChange}
            error={errors.clusterName}
            placeholder="my-aks-cluster"
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Cloud className="w-4 h-4" />}
        >
          Connect to AKS Cluster
        </Button>
      </div>
    </form>
  );
};

export default AzureAksForm;