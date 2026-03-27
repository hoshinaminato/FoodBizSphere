import { useState, useEffect, useCallback } from 'react';
import { Project, Evaluation, Merchant, BusinessDistrict } from '../types';
import { loadProjects, saveProjects } from '../lib/storage';
import { formatDate } from '../lib/utils';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeEvalId, setActiveEvalId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects().then(loadedProjects => {
      const migrated = loadedProjects.map(p => ({
        ...p,
        evaluations: p.evaluations || [],
        districts: (p.districts || []).map(d => ({
          ...d,
          images: d.images || [],
          consumerGroups: d.consumerGroups || []
        })),
        merchants: (p.merchants || []).map(m => ({
          ...m,
          records: (m.records || []).map(r => ({
            ...r,
            dineInCustomerInflow: r.dineInCustomerInflow ?? (r as any).customerInflow ?? 0,
            takeoutCustomerInflow: r.takeoutCustomerInflow ?? 0
          })),
          dineInCustomerInflow: m.dineInCustomerInflow ?? (m as any).customerInflow ?? 0,
          takeoutCustomerInflow: m.takeoutCustomerInflow ?? 0
        }))
      }));
      setProjects(migrated);
    });
  }, []);

  // Auto-save whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  const createProject = () => {
    const now = Date.now();
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: `项目 ${formatDate(now)}`,
      createdAt: now,
      evaluations: [],
      districts: [],
      merchants: []
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  // District Management
  const createDistrict = (projectId: string, name: string) => {
    const newDistrict: BusinessDistrict = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      images: [],
      merchantIds: [],
      consumerGroups: [],
      createdAt: Date.now()
    };
    setProjects(prev => prev.map(p => p.id === projectId ? { 
      ...p, 
      districts: [newDistrict, ...(p.districts || [])] 
    } : p));
  };

  const updateDistrict = (projectId: string, districtId: string, updates: Partial<BusinessDistrict>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      districts: (p.districts || []).map(d => d.id === districtId ? { ...d, ...updates } : d)
    } : p));
  };

  const deleteDistrict = (projectId: string, districtId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      districts: (p.districts || []).filter(d => d.id !== districtId),
      evaluations: (p.evaluations || []).map(e => e.districtId === districtId ? { ...e, districtId: undefined } : e)
    } : p));
  };

  // Merchant Management
  const createMerchant = (projectId: string, name: string) => {
    const merchantId = Math.random().toString(36).substr(2, 9);
    const newMerchant: Merchant = {
      id: merchantId,
      name,
      images: [],
      averageTransactionValue: 0,
      employeeCount: 0,
      dineInCustomerInflow: 0,
      takeoutCustomerInflow: 0,
      isRealData: true,
      isBrushing: false,
      isFakeCustomers: false,
      isModifiedPOS: false,
      notes: '',
      projectId,
      records: []
    };
    setProjects(prev => prev.map(p => p.id === projectId ? { 
      ...p, 
      merchants: [newMerchant, ...(p.merchants || [])] 
    } : p));
    return merchantId;
  };

  const updateMerchant = (projectId: string, merchantId: string, updates: Partial<Merchant>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      merchants: (p.merchants || []).map(m => m.id === merchantId ? { ...m, ...updates } : m)
    } : p));
  };

  const deleteMerchant = (projectId: string, merchantId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      merchants: (p.merchants || []).filter(m => m.id !== merchantId),
      districts: (p.districts || []).map(d => ({ ...d, merchantIds: (d.merchantIds || []).filter(id => id !== merchantId) }))
    } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const updateProjectName = (id: string, name: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const createEvaluation = (projectId: string) => {
    setProjects(prev => {
      const project = prev.find(p => p.id === projectId);
      if (!project) return prev;

      const newEval: Evaluation = {
        id: Math.random().toString(36).substr(2, 9),
        name: `评估 ${project.evaluations.length + 1}`,
        createdAt: Date.now(),
        area: 0,
        rent: 0,
        paymentMethod: 1,
        deposit: 0,
        transferFee: 0,
        franchiseFee: 0,
        renovationFee: 0,
        equipmentFee: 0,
        initialMaterialFee: 0,
        monthlyLabor: 0,
        monthlyUtilities: 0,
        grossMargin: 0,
        estimatedDailyRevenue: 0,
        images: { dish: [], menu: [], interior: [], exterior: [], reviews: [] }
      };

      const next = prev.map(p => 
        p.id === projectId ? { ...p, evaluations: [newEval, ...p.evaluations] } : p
      );
      setActiveEvalId(newEval.id);
      return next;
    });
  };

  const duplicateEvaluation = (projectId: string, evalItem: Evaluation) => {
    const newEval = { ...evalItem, id: Math.random().toString(36).substr(2, 9), name: `${evalItem.name} (副本)`, createdAt: Date.now() };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, evaluations: [newEval, ...p.evaluations] } : p
    ));
  };

  const updateEvaluation = (projectId: string, evalId: string, updates: Partial<Evaluation>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      evaluations: p.evaluations.map(e => e.id === evalId ? { ...e, ...updates } : e)
    } : p));
  };

  const deleteEvaluation = (projectId: string, evalId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, evaluations: p.evaluations.filter(e => e.id !== evalId) } : p));
    if (activeEvalId === evalId) setActiveEvalId(null);
  };

  const clearEvaluationData = (projectId: string, evalId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      evaluations: p.evaluations.map(e => e.id === evalId ? {
        ...e,
        area: 0,
        rent: 0,
        paymentMethod: 1,
        deposit: 0,
        transferFee: 0,
        franchiseFee: 0,
        renovationFee: 0,
        equipmentFee: 0,
        initialMaterialFee: 0,
        monthlyLabor: 0,
        monthlyUtilities: 0,
        grossMargin: 0,
        estimatedDailyRevenue: 0,
        images: { dish: [], menu: [], interior: [], exterior: [], reviews: [] }
      } : e)
    } : p));
  };

  const exportProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const zip = new JSZip();
    
    // Collect all image keys
    const imageKeys = new Set<string>();
    project.districts.forEach(d => d.images?.forEach(img => imageKeys.add(img)));
    project.merchants.forEach(m => m.images?.forEach(img => imageKeys.add(img)));
    project.evaluations.forEach(e => {
      (Object.values(e.images) as string[][]).forEach(imgList => imgList.forEach(img => imageKeys.add(img)));
    });

    // Fetch blobs and add to zip
    const imagesFolder = zip.folder("images");
    for (const key of imageKeys) {
      const blob = await get<Blob>(key);
      if (blob) {
        imagesFolder?.file(key, blob);
      }
    }

    // Add project JSON
    zip.file("project.json", JSON.stringify(project));

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name}.fbs`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProject = async (file: File) => {
    try {
      const zip = await JSZip.loadAsync(file);
      const projectJson = await zip.file("project.json")?.async("string");
      if (!projectJson) throw new Error("Invalid project file");

      const project: Project = JSON.parse(projectJson);
      
      // Import images
      const imagesFolder = zip.folder("images");
      if (imagesFolder) {
        const imageFiles = imagesFolder.filter((path, file) => !file.dir);
        for (const imgFile of imageFiles) {
          const blob = await imgFile.async("blob");
          await set(imgFile.name, blob);
        }
      }

      // Ensure unique ID to avoid collisions
      project.id = Math.random().toString(36).substr(2, 9);
      project.name = `${project.name} (导入)`;

      setProjects(prev => [project, ...prev]);
      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeEval = activeProject?.evaluations.find(e => e.id === activeEvalId);

  return {
    projects,
    activeProjectId,
    activeEvalId,
    activeProject,
    activeEval,
    setActiveProjectId,
    setActiveEvalId,
    createProject,
    deleteProject,
    updateProjectName,
    createEvaluation,
    duplicateEvaluation,
    updateEvaluation,
    deleteEvaluation,
    createDistrict,
    updateDistrict,
    deleteDistrict,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    clearEvaluationData,
    exportProject,
    importProject
  };
}
