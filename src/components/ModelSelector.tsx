import React, { useState, ChangeEvent, useCallback } from "react";
import { styles } from "./CMSLink.sytles";
import { ModelInstance } from "../types";
import { builder } from "@builder.io/react";
import { settings } from "../settings";
interface ModelSelectorProps {
  href: string;
  referenceId: string;
  onModelSelect: (instance: ModelInstance) => void;
}

const MODEL_TYPES = {
  PAGE: "page",
  BLOG: "blog",
} as const;

const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "19ea4309187745989c31be6f73da25f8";



const ModelSelector: React.FC<ModelSelectorProps> = ({
  href,
  referenceId,
  onModelSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState<string>("");
  const [instances, setInstances] = useState<ModelInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInstances = useCallback(async (type: string) => {
    setIsLoading(true);
    try {
      console.log('Fetching instances for:', type);
      const content = await builder.getAll(type, {
        fields: "id,data.url,name",
        options: { 
          noTargeting: true,
          apiKey:  "19ea4309187745989c31be6f73da25f8"
         }
      });
      console.log('Fetched instances:', content);
      setInstances(
        content.map((item: any) => ({
          id: item.id || "",
          name: item.name || "",
          href: item?.data?.url || `/${type}/${item.name || ""}`,
          type,
        }))
      );
    } catch (error) {
      console.error(`Error fetching ${type} instances:`, error);
      setInstances([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModelTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedModelType(type);
    if (type) fetchInstances(type);
  };

  const handleInstanceSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const instance = instances.find((i) => i.id === e.target.value);
    if (instance) {
      onModelSelect(instance);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div style={styles.formRow}>
        <label htmlFor="modelSelector">Selected Model:</label>
        <div style={styles.modelInputGroup}>
          <input
            id="modelSelector"
            type="text"
            value={href}
            readOnly
            className="complex-link-input"
            placeholder="No model selected..."
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="complex-link-button"
          >
            Select Model
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <header style={styles.modalHeader}>
              <h2>Select Model</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </header>

            <div style={styles.modalForm}>
              <select
                style={styles.modelSelect}
                value={selectedModelType}
                onChange={handleModelTypeChange}
              >
                <option value="">Select a model type...</option>
                {settings.models.map((model) => (
                  <option key={model} value={model}>
                    {model.charAt(0).toUpperCase() + model.slice(1)}
                  </option>
                ))}
              </select>

              {selectedModelType && (
                <select
                  style={styles.modelSelect}
                  onChange={handleInstanceSelect}
                  value={referenceId}
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Loading..." : "Select an instance..."}
                  </option>
                  {instances.map((instance) => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelSelector;
