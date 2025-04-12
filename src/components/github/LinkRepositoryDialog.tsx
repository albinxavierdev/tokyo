import { useState, useEffect } from "react";
import { GitHubRepository, Project } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchProjects, updateProject } from "@/lib/api";
import { createRepositoryWebhook } from "@/lib/github-service";

interface LinkRepositoryDialogProps {
  repository: GitHubRepository;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkRepositoryDialog({ repository, open, onOpenChange }: LinkRepositoryDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [syncIssues, setSyncIssues] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  const { toast } = useToast();
  
  // Fetch projects when the dialog opens
  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);
  
  const loadProjects = async () => {
    try {
      setIsFetchingProjects(true);
      const projectsData = await fetchProjects();
      // Filter out projects that are already linked to this repo
      const filteredProjects = projectsData.filter(project => 
        !(project.githubRepoOwner === repository.owner.login && 
          project.githubRepoName === repository.name)
      );
      setProjects(filteredProjects);
      
      // Pre-select a project if there's a match with repository name
      const matchingProject = filteredProjects.find(
        project => project.title.toLowerCase() === repository.name.toLowerCase()
      );
      if (matchingProject) {
        setSelectedProjectId(matchingProject.id);
      } else if (filteredProjects.length > 0) {
        setSelectedProjectId(filteredProjects[0].id);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingProjects(false);
    }
  };
  
  const handleLinkRepository = async () => {
    if (!selectedProjectId) {
      toast({
        title: "No project selected",
        description: "Please select a project to link with this repository.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if we have permission to create webhook
      const canCreateWebhook = repository.permissions?.admin;
      let webhookId = null;
      
      // Create webhook if we have permission and sync is enabled
      if (canCreateWebhook && syncIssues) {
        try {
          // In a real app, you'd need a server endpoint to handle GitHub webhooks
          const webhookUrl = `${window.location.origin}/api/github/webhook`;
          const webhook = await createRepositoryWebhook(
            repository.owner.login,
            repository.name,
            webhookUrl
          );
          webhookId = webhook.id;
        } catch (webhookError) {
          console.error("Error creating webhook:", webhookError);
          // Continue even if webhook creation fails - just won't have auto-sync
          toast({
            title: "Warning",
            description: "Could not create GitHub webhook for automatic sync. Manual sync will still work.",
            variant: "default",
          });
        }
      }
      
      // Update the project with GitHub info
      await updateProject(selectedProjectId, {
        githubUrl: repository.html_url,
        githubRepoOwner: repository.owner.login,
        githubRepoName: repository.name,
        githubWebhookId: webhookId,
        githubSyncEnabled: syncIssues,
      });
      
      toast({
        title: "Repository linked",
        description: `Successfully linked ${repository.full_name} to your project.`,
      });
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error linking repository:", error);
      toast({
        title: "Error linking repository",
        description: "Failed to link repository to project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link GitHub Repository</DialogTitle>
          <DialogDescription>
            Link {repository.full_name} to one of your projects to sync issues and track development progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">
              Project
            </Label>
            {isFetchingProjects ? (
              <div className="col-span-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-3 text-sm text-muted-foreground">
                No available projects to link. Create a project first.
              </div>
            ) : (
              <Select 
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={isFetchingProjects}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sync" className="text-right">
              Sync Issues
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                id="sync"
                checked={syncIssues}
                onCheckedChange={setSyncIssues}
                disabled={!repository.permissions?.admin}
              />
              <span className="text-sm text-muted-foreground">
                {repository.permissions?.admin 
                  ? "Automatically sync GitHub issues with project tasks" 
                  : "Requires admin access to repository"}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleLinkRepository} 
            disabled={isLoading || isFetchingProjects || !selectedProjectId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Linking...
              </>
            ) : "Link Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 