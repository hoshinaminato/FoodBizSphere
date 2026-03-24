/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, LayoutDashboard, MapPin, Store, Play, Upload } from 'lucide-react';
import { useProjects } from './hooks/useProjects';
import { ProjectCard } from './components/ProjectCard';
import { ProjectHeader } from './components/ProjectHeader';
import { EvaluationItem } from './components/EvaluationItem';
import { EvaluationDetail } from './components/EvaluationDetail';
import { DistrictManager } from './components/DistrictManager';
import { LiveCases } from './components/LiveCases';
import { cn } from './lib/utils';

export default function App() {
  const {
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
    exportProject,
    importProject
  } = useProjects();

  const [activeTab, setActiveTab] = useState<'evaluations' | 'districts'>('evaluations');
  const [currentView, setCurrentView] = useState<'projects' | 'liveCases'>('projects');

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importProject(file);
      if (success) {
        alert("项目导入成功！");
      } else {
        alert("项目导入失败，请检查文件格式。");
      }
    }
  };

  if (currentView === 'liveCases') {
    return <LiveCases onBack={() => setCurrentView('projects')} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-orange-100">
      {!activeProjectId ? (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">FoodBizSphere</h1>
              <p className="text-neutral-500 font-medium">餐饮经营评估与选址决策系统</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
              <button 
                onClick={() => setCurrentView('liveCases')}
                className="flex-1 md:flex-none bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 md:px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm text-sm md:text-base"
              >
                <Play size={18} className="text-orange-600" />
                直播案例
              </button>
              <label className="flex-1 md:flex-none bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 md:px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer text-sm md:text-base">
                <Upload size={18} className="text-orange-600" />
                导入项目
                <input type="file" accept=".fbs" className="hidden" onChange={handleImport} />
              </label>
              <button 
                onClick={createProject}
                className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 text-sm md:text-base"
              >
                <Plus size={20} />
                创建新空间
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
                onClick={() => setActiveProjectId(project.id)}
                onDelete={deleteProject}
                onRename={updateProjectName}
                onExport={exportProject}
              />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
                <p className="text-neutral-400 font-medium">还没有项目空间，点击右上角开始创建</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[100dvh]">
          <ProjectHeader 
            project={activeProject!}
            onBack={() => { setActiveProjectId(null); setActiveEvalId(null); }}
            onUpdateName={(name) => updateProjectName(activeProjectId, name)}
            onCreateEvaluation={() => createEvaluation(activeProjectId)}
          />

          {/* Tab Navigation */}
          <div className="bg-white px-6 border-b border-neutral-200 flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('evaluations')}
              className={cn(
                "py-4 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap",
                activeTab === 'evaluations' ? "border-orange-600 text-orange-600" : "border-transparent text-neutral-400 hover:text-neutral-600"
              )}
            >
              方案评估
            </button>
            <button 
              onClick={() => setActiveTab('districts')}
              className={cn(
                "py-4 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap",
                activeTab === 'districts' ? "border-orange-600 text-orange-600" : "border-transparent text-neutral-400 hover:text-neutral-600"
              )}
            >
              商圈与商家
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {activeTab === 'evaluations' ? (
              <>
                {/* Evaluation List (Left Sidebar) - Hidden on mobile */}
                <aside className="w-56 lg:w-64 xl:w-80 border-r border-neutral-200 bg-white overflow-y-auto hidden md:block">
                  <div className="p-4 space-y-3">
                    {activeProject?.evaluations.map(e => (
                      <EvaluationItem 
                        key={e.id}
                        evaluation={e}
                        isActive={activeEvalId === e.id}
                        onClick={() => setActiveEvalId(e.id)}
                        onDuplicate={(item) => duplicateEvaluation(activeProjectId, item)}
                        onDelete={(id) => deleteEvaluation(activeProjectId, id)}
                      />
                    ))}
                    {activeProject?.evaluations.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-neutral-400">还没有评估项</p>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Main Content (Evaluation Detail or Mobile List) */}
                <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 lg:p-8">
                  {!activeEvalId ? (
                    <div className="h-full">
                      {/* Mobile List View */}
                      <div className="md:hidden space-y-3">
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">评估方案列表</h3>
                        {activeProject?.evaluations.map(e => (
                          <EvaluationItem 
                            key={e.id}
                            evaluation={e}
                            isActive={false}
                            onClick={() => setActiveEvalId(e.id)}
                            onDuplicate={(item) => duplicateEvaluation(activeProjectId, item)}
                            onDelete={(id) => deleteEvaluation(activeProjectId, id)}
                          />
                        ))}
                        {activeProject?.evaluations.length === 0 && (
                          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200">
                            <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">暂无评估方案</p>
                            <button 
                              onClick={() => createEvaluation(activeProjectId)}
                              className="mt-4 text-orange-600 font-bold text-xs uppercase tracking-widest"
                            >
                              立即创建
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Desktop Placeholder */}
                      <div className="hidden md:flex h-full flex-col items-center justify-center text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                          <LayoutDashboard size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">选择或创建一个评估项</h3>
                        <p className="text-neutral-500 mb-8">您可以为同一个项目创建多个选址或选品方案进行对比分析。</p>
                        <button 
                          onClick={() => createEvaluation(activeProjectId)}
                          className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100"
                        >
                          立即创建第一个评估
                        </button>
                      </div>
                    </div>
                  ) : (
                    <EvaluationDetail 
                      activeEval={activeEval}
                      districts={activeProject?.districts || []}
                      onUpdate={(updates) => updateEvaluation(activeProjectId, activeEval.id, updates)}
                      onBack={() => setActiveEvalId(null)}
                    />
                  )}
                </main>
              </>
            ) : (
              <div className="flex-1">
                {activeProject && (
                  <DistrictManager 
                    project={activeProject}
                    onUpdateDistrict={(id, updates) => updateDistrict(activeProject.id, id, updates)}
                    onDeleteDistrict={(id) => deleteDistrict(activeProject.id, id)}
                    onCreateDistrict={(name) => createDistrict(activeProject.id, name)}
                    onUpdateMerchant={(id, updates) => updateMerchant(activeProject.id, id, updates)}
                    onDeleteMerchant={(id) => deleteMerchant(activeProject.id, id)}
                    onCreateMerchant={(name) => createMerchant(activeProject.id, name)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

