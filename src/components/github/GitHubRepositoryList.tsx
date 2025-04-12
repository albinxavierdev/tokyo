import { useState } from "react";
import { GitHubRepository } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LinkRepositoryDialog } from "./LinkRepositoryDialog";

interface GitHubRepositoryListProps {
  repositories: GitHubRepository[];
}

export default function GitHubRepositoryList({ repositories }: GitHubRepositoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  
  // Filter repositories based on search term
  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLinkClick = (repo: GitHubRepository) => {
    setSelectedRepo(repo);
    setIsLinkDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search repositories..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[400px] rounded-md">
        <div className="space-y-3">
          {filteredRepositories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `No repositories matching "${searchTerm}"`
                : "No repositories found"
              }
            </div>
          ) : (
            filteredRepositories.map(repo => (
              <Card key={repo.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{repo.full_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {repo.description || "No description"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {repo.stargazers_count} stars
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {repo.open_issues_count} issues
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-2 text-xs text-muted-foreground flex justify-between">
                  <span>Updated {formatDate(repo.updated_at)}</span>
                  <Button size="sm" onClick={() => handleLinkClick(repo)}>
                    Link to Project
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      {selectedRepo && (
        <LinkRepositoryDialog
          repository={selectedRepo}
          open={isLinkDialogOpen}
          onOpenChange={setIsLinkDialogOpen}
        />
      )}
    </div>
  );
} 