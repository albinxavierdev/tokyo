import { supabase } from './supabase';

// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

// Helper function to get the GitHub access token from Supabase session
export const getGitHubToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.provider_token) {
    return null;
  }
  
  return session.provider_token;
};

// Fetch user's GitHub repositories
export const fetchUserRepositories = async (page = 1, perPage = 10) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  const response = await fetch(
    `${GITHUB_API_URL}/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return await response.json();
};

// Fetch a specific repository by owner and repo name
export const fetchRepository = async (owner: string, repo: string) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return await response.json();
};

// Fetch repository issues
export const fetchRepositoryIssues = async (owner: string, repo: string, state = 'all', page = 1, perPage = 10) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return await response.json();
};

// Import GitHub issues as tasks for a project
export const importIssuesAsTasks = async (
  projectId: string, 
  owner: string, 
  repo: string, 
  issueNumbers: number[]
) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  // Fetch each issue
  const issuePromises = issueNumbers.map(issueNumber => 
    fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }).then(res => {
      if (!res.ok) throw new Error(`Error fetching issue #${issueNumber}: ${res.status}`);
      return res.json();
    })
  );
  
  const issues = await Promise.all(issuePromises);
  
  // Convert issues to tasks
  const tasks = issues.map(issue => ({
    title: issue.title,
    description: `${issue.body || ''}\n\nImported from GitHub issue #${issue.number}: ${issue.html_url}`,
    completed: issue.state === 'closed',
    due_date: issue.milestone?.due_on || null,
    project_id: projectId,
    github_issue_url: issue.html_url,
    github_issue_number: issue.number,
  }));
  
  // Save tasks to database
  const { data, error } = await supabase
    .from('tasks')
    .insert(tasks)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Create a GitHub webhook for a repository
export const createRepositoryWebhook = async (
  owner: string, 
  repo: string, 
  webhookUrl: string,
  events = ['issues', 'issue_comment', 'push']
) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/hooks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events,
        config: {
          url: webhookUrl,
          content_type: 'json',
          insecure_ssl: '0',
        },
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return await response.json();
};

// Check if the current user has admin access to a repository
export const checkRepositoryAccess = async (owner: string, repo: string) => {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('No GitHub access token found. Please reconnect your GitHub account.');
  }
  
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (!response.ok) {
      return { hasAccess: false, error: `Error: ${response.status}` };
    }
    
    const repoData = await response.json();
    
    return { 
      hasAccess: true, 
      isAdmin: repoData.permissions?.admin || false,
      isPush: repoData.permissions?.push || false,
      isOwner: repoData.owner.login === owner,
      repoData
    };
  } catch (error) {
    return { hasAccess: false, error: error.message };
  }
}; 