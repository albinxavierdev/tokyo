import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubRepository } from "@/lib/types";
import { fetchUserRepositories } from "@/lib/github-service";
import { Loader2, Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GitHubRepositoryList from "./GitHubRepositoryList";

export default function GitHubIntegrationSection() {
  const { user, session, signInWithGitHub } = useAuth();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const isGitHubConnected = !!session?.provider_token && session?.provider_refresh_token;
  
  // Fetch repositories when the component mounts if user is connected to GitHub
  useEffect(() => {
    if (isGitHubConnected) {
      loadRepositories();
    }
  }, [isGitHubConnected]);
  
  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const repos = await fetchUserRepositories(1, 20);
      setRepositories(repos);
    } catch (err) {
      console.error("Error fetching GitHub repositories:", err);
      setError("Failed to load your GitHub repositories. Please reconnect your account.");
      toast({
        title: "Error loading repositories",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectGitHub = async () => {
    try {
      await signInWithGitHub();
    } catch (err) {
      console.error("Error connecting to GitHub:", err);
      toast({
        title: "Error connecting to GitHub",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <CardDescription>
          Connect your GitHub account to import repositories and sync issues with your projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isGitHubConnected ? (
          <div className="flex flex-col items-center p-6 text-center">
            <Github className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Connect Your GitHub Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link your GitHub account to import repositories, sync issues, and more.
            </p>
            <Button onClick={handleConnectGitHub}>
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Your GitHub Repositories</h3>
                <p className="text-sm text-muted-foreground">
                  Select a repository to link to a project
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadRepositories} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : "Refresh"}
              </Button>
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading repositories...</span>
              </div>
            ) : repositories.length > 0 ? (
              <GitHubRepositoryList repositories={repositories} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No repositories found. Create repositories on GitHub to see them here.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 