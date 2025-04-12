import { supabase } from './supabase';
import type { Project, Task } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get authenticated user
const getAuthUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting auth user:', error);
    throw error;
  }
  return session?.user;
};

// Projects API
export const fetchProjects = async (userId?: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
};

export const fetchProjectById = async (projectId: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }

  return data;
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>, userId?: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      id: uuidv4(),
      title: project.title,
      description: project.description,
      status: project.status,
      priority: project.priority,
      tech_stack: project.techStack,
      github_url: project.githubUrl || null,
      deployment_url: project.deploymentUrl || null,
      created_at: now,
      updated_at: now,
      user_id: authUser.id // Use the authenticated user's ID
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
};

export const updateProject = async (projectId: string, updates: Partial<Project>, userId?: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  const updateData = {
    title: updates.title,
    description: updates.description,
    status: updates.status,
    priority: updates.priority,
    tech_stack: updates.techStack,
    github_url: updates.githubUrl,
    deployment_url: updates.deploymentUrl,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
};

export const deleteProject = async (projectId: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  try {
    // First delete all tasks associated with the project
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId);
    
    if (tasksError) {
      console.error('Error deleting associated tasks:', tasksError);
      throw tasksError;
    }

    // Then delete the project
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (projectError) {
      console.error('Error deleting project:', projectError);
      throw projectError;
    }

    return true;
  } catch (error) {
    console.error('Error in delete project operation:', error);
    throw error;
  }
};

// Tasks API
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>, projectId: string, userId?: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  try {
    if (!projectId) {
      throw new Error('Project ID is required to create a task');
    }
    
    if (!task.title || task.title.trim() === '') {
      throw new Error('Task title is required');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: uuidv4(),
        title: task.title,
        description: task.description || null,
        completed: task.completed || false,
        due_date: task.dueDate || null,
        created_at: new Date().toISOString(),
        project_id: projectId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in create task operation:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>, userId?: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  try {
    const updateData = {
      title: updates.title,
      description: updates.description,
      completed: updates.completed,
      due_date: updates.dueDate
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in update task operation:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  // Get the authenticated user
  const authUser = await getAuthUser();
  
  if (!authUser) {
    console.error('No authenticated user found');
    throw new Error('Authentication required');
  }
  
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in delete task operation:', error);
    throw error;
  }
}; 