import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import { Cloud } from "lucide-react";
import ReactDOM from "react-dom";
import FormInput from "../ui/Input";

interface AwsEksFormProps {
  onSubmit: (data: {
    name: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    clusterName: string;
  }) => void;
  isLoading?: boolean;
}

const AWS_REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-south-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-southeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-south-1",
  "eu-north-1",
  "me-south-1",
  "sa-east-1",
];

const PAGE_SIZE = 5;

const AwsEksForm: React.FC<AwsEksFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",
    clusterName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [regionFilter, setRegionFilter] = useState("");
  const [regionPage, setRegionPage] = useState(0);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const regionButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{left: number, top: number, width: number}>({left: 0, top: 0, width: 0});


  const filteredRegions = AWS_REGIONS.filter((region) =>
    region.toLowerCase().includes(regionFilter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRegions.length / PAGE_SIZE);
  const paginatedRegions = filteredRegions.slice(
    regionPage * PAGE_SIZE,
    (regionPage + 1) * PAGE_SIZE
  );

  useEffect(() => {
    if (!regionDropdownOpen) return;
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        regionButtonRef.current &&
        !regionButtonRef.current.contains(target)
      ) {
        setRegionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [regionDropdownOpen]);

  useLayoutEffect(() => {
    if (regionDropdownOpen && regionButtonRef.current) {
      const rect = regionButtonRef.current.getBoundingClientRect();
      setDropdownPos({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width,
      });
    }
  }, [regionDropdownOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionSelect = (region: string) => {
    setFormData((prev) => ({ ...prev, region }));
    setRegionDropdownOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Connection name is required";
    }

    if (!formData.region) {
      newErrors.region = "Region is required";
    }

    if (!formData.accessKeyId.trim()) {
      newErrors.accessKeyId = "Access Key ID is required";
    }

    if (!formData.secretAccessKey.trim()) {
      newErrors.secretAccessKey = "Secret Access Key is required";
    }

    if (!formData.clusterName.trim()) {
      newErrors.clusterName = "Cluster name is required";
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
    <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <FormInput
          id="aws-name"
          name="name"
          label="Connection Name"
          type="text"
          autoComplete="off"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="production-eks"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="aws-region"
            className="block text-sm font-medium text-gray-700"
          >
            AWS Region
          </label>
          <div className="relative">
            <button
              type="button"
              ref={regionButtonRef}
              className={`
                mt-1 block w-full rounded border bg-white bg-opacity-50 px-3 py-2 shadow-sm sm:text-sm text-left
                ${errors.region
                  ? "border-red-200 focus:border-red-400 focus:ring-red-200"
                  : `
                    border-gray-200
                    ${regionDropdownOpen ? "border-blue-200 ring-2 ring-blue-100" : ""}
                    ${!regionDropdownOpen ? "focus:border-blue-200 focus:ring-2 focus:ring-blue-100" : ""}
                  `}
                focus:outline-none
              `}
              onClick={() => setRegionDropdownOpen((v) => !v)}
            >
              {formData.region}
            </button>
            {regionDropdownOpen &&
              ReactDOM.createPortal(
                <div
                  ref={dropdownRef}
                  className="z-50 bg-white border rounded shadow-lg max-h-60 overflow-auto"
                  style={{
                    position: "absolute",
                    left: dropdownPos.left,
                    top: dropdownPos.top,
                    width: dropdownPos.width,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Filter regions..."
                    className="w-full px-2 py-1 border-b outline-none"
                    value={regionFilter}
                    onChange={(e) => {
                      setRegionFilter(e.target.value);
                      setRegionPage(0);
                    }}
                    autoFocus
                  />
                  <ul>
                    {paginatedRegions.length === 0 && (
                      <li className="px-3 py-2 text-gray-400">
                        No regions found
                      </li>
                    )}
                    {paginatedRegions.map((region) => (
                      <li
                        key={region}
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                          formData.region === region ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleRegionSelect(region)}
                      >
                        {region}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center px-2 py-1 border-t bg-gray-50">
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => setRegionPage((p) => Math.max(0, p - 1))}
                      disabled={regionPage === 0}
                    >
                      Prev
                    </button>
                    <span className="text-xs">
                      {regionPage + 1} / {totalPages || 1}
                    </span>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded disabled:opacity-50"
                      onClick={() =>
                        setRegionPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={regionPage >= totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>,
                document.body
              )}
          </div>
          {errors.region && (
            <p className="mt-2 text-sm text-red-600">{errors.region}</p>
          )}
        </div>

        <div>
          <FormInput
            id="aws-cluster-name"
            name="clusterName"
            label="EKS Cluster Name"
            type="text"
            autoComplete="off"
            value={formData.clusterName}
            onChange={handleChange}
            error={errors.clusterName}
            placeholder="my-eks-cluster"
          />
        </div>
      </div>

      <div>
        <FormInput
          id="aws-access-key"
          name="accessKeyId"
          label="AWS Access Key ID"
          type="text"
          autoComplete="off"
          value={formData.accessKeyId}
          onChange={handleChange}
          error={errors.accessKeyId}
          placeholder="AKIAIOSFODNN7EXAMPLE"
        />
      </div>

      <div>
        <FormInput
          id="aws-secret-key"
          name="secretAccessKey"
          label="AWS Secret Access Key"
          type="password"
          autoComplete="off"
          value={formData.secretAccessKey}
          onChange={handleChange}
          error={errors.secretAccessKey}
          placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Cloud className="w-4 h-4" />}
        >
          Connect to EKS Cluster
        </Button>
      </div>
    </form>
  );
};

export default AwsEksForm;
