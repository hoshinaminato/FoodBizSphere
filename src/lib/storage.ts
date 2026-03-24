import { get, set, del, keys } from 'idb-keyval';
import { Project } from '../types';

const PROJECTS_KEY = 'foodbiz_projects';

export async function saveProjects(projects: Project[]) {
  await set(PROJECTS_KEY, projects);
}

export async function loadProjects(): Promise<Project[]> {
  const projects = await get<Project[]>(PROJECTS_KEY);
  return projects || [];
}

// For images, we store them separately in IndexedDB to avoid bloating the main projects object
export async function saveImage(id: string, blob: Blob): Promise<string> {
  const key = `img_${id}_${Date.now()}`;
  await set(key, blob);
  return key;
}

export async function loadImage(key: string): Promise<string | null> {
  const blob = await get<Blob>(key);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function deleteImage(key: string) {
  await del(key);
}
