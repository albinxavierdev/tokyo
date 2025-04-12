import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GitHubIssue, Project } from "@/lib/types";
import { fetchRepositoryIssues, importIssuesAsTasks } from "@/lib/github-service";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Github, RefreshCw, Download } from "lucide-react";

interface GitHubIssuesListProps {
  project: Project;
  onIssuesImported: () => void;
}

export default function GitHubIssuesList({ project, onIssuesImported }: GitHubIssuesListProps) {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<number[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const hasGitHubRepo = !!(project.githubRepoOwner && project.githubRepoName);
  
  useEffect(() => {
    if (hasGitHubRepo) {
      loadIssues();
    }
  }, [project.id]);
  
  const loadIssues = async () => {
    if (!hasGitHubRepo) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const issuesData = await fetchRepositoryIssues(
        project.githubRepoOwner!,
        project.githubRepoName!,
        "open"
      );
      
      setIssues(issuesData);
      // Clear selection when issues are refreshed
      setSelectedIssues([]);
    } catch (err) {
      console.error("Error fetching GitHub issues:", err);
      setError("Failed to load issues from GitHub. Please check your connection and try again.");
      toast({
        title: "Error loading issues",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleIssueSelection = (issueNumber: number) => {
    setSelectedIssues(prev => {
      if (prev.includes(issueNumber)) {
        return prev.filter(num => num !== issueNumber);
      } else {
        return [...prev, issueNumber];
      }
    });
  };
  
  const handleImportIssues = async () => {
    if (selectedIssues.length === 0) {
      toast({
        title: "No issues selected",
        description: "Please select at least one issue to import.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsImporting(true);
      
      await importIssuesAsTasks(
        project.id,
        project.githubRepoOwner!,
        project.githubRepoName!,
        selectedIssues
      );
      
      toast({
        title: "Issues imported",
        description: `Successfully imported ${selectedIssues.length} issues as tasks.`,
      });
      
      // Clear selection after import
      setSelectedIssues([]);
      
      // Callback to refresh tasks in parent component
      onIssuesImported();
    } catch (err) {
      console.error("Error importing issues:", err);
      toast({
        title: "Error importing issues",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  if (!hasGitHubRepo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Issues
          </CardTitle>
          <CardDescription>
            Connect this project to a GitHub repository to manage issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">
            This project is not linked to a GitHub repository yet.
          </p>
          <Button variant="outline">
            Link GitHub Repository
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Issues
            </CardTitle>
            <CardDescription>
              Import and manage issues from {project.githubRepoOwner}/{project.githubRepoName}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadIssues}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="open">
          <TabsList className="mb-4">
            <TabsTrigger value="open">Open Issues</TabsTrigger>
            <TabsTrigger value="imported">Imported</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading issues...</span>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
                {error}
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No open issues found in this repository.
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map(issue => (
                  <div 
                    key={issue.id} 
                    className="flex items-start gap-3 p-3 border rounded-md hover:bg-accent/5 transition-colors"
                  >
                    <Checkbox 
                      checked={selectedIssues.includes(issue.number)}
                      onCheckedChange={() => handleIssueSelection(issue.number)}
                      id={`issue-${issue.number}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label 
                          htmlFor={`issue-${issue.number}`}
                          className="font-medium cursor-pointer hover:underline"
                        >
                          {issue.title}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          #{issue.number}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {issue.body || "No description"}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {issue.labels.map(label => (
                          <Badge 
                            key={label.name} 
                            variant="outline" 
                            style={{ backgroundColor: `#${label.color}20`, borderColor: `#${label.color}` }}
                            className="text-xs"
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Opened on {formatDate(issue.created_at)} by {issue.user.login}
                      </div>
                    </div>
                    <a 
                      href={issue.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      View on GitHub
                    </a>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="imported">
            <div className="text-center py-12 text-muted-foreground">
              Imported issues will display here.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {issues.length > 0 && (
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedIssues.length} of {issues.length} issues selected
          </div>
          <Button 
            onClick={handleImportIssues} 
            disabled={selectedIssues.length === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import Selected
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 