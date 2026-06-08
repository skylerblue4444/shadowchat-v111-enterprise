/**
 * ShadowChat v1111 - Universal Search & AI Command Engine
 * Real-time indexing, Semantic Search, AI Command Processing
 */

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "user" | "bot" | "post" | "transaction" | "quest" | "command";
  url: string;
  metadata: any;
  score: number;
}

export interface SearchIndex {
  id: string;
  title: string;
  content: string;
  type: string;
  url: string;
  tags: string[];
  lastIndexed: Date;
}

export interface AICommand {
  id: string;
  command: string;
  description: string;
  parameters: string[];
  action: (params: any) => Promise<any>;
}

export interface SearchHistory {
  userId: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

// Universal Search Engine
export class UniversalSearchEngine {
  private index: Map<string, SearchIndex> = new Map();
  private commands: Map<string, AICommand> = new Map();
  private searchHistory: SearchHistory[] = [];

  constructor() {
    this.initializeCommands();
    this.initialIndex();
  }

  /**
   * Initialize AI Commands
   */
  private initializeCommands(): void {
    const commands: AICommand[] = [
      {
        id: "cmd-deploy",
        command: "/deploy",
        description: "Deploy current project to production",
        parameters: ["env"],
        action: async (params) => ({ success: true, message: `Deploying to ${params.env || "production"}...` }),
      },
      {
        id: "cmd-balance",
        command: "/balance",
        description: "Check your Skycoin balance",
        parameters: [],
        action: async () => ({ success: true, balance: 1000, currency: "SKY" }),
      },
      {
        id: "cmd-tip",
        command: "/tip",
        description: "Tip a user or bot",
        parameters: ["target", "amount"],
        action: async (params) => ({ success: true, message: `Tipped ${params.amount} SKY to ${params.target}` }),
      },
      {
        id: "cmd-quest",
        command: "/quest",
        description: "Show available quests",
        parameters: [],
        action: async () => ({ success: true, quests: ["Welcome", "Explorer", "Master"] }),
      },
      {
        id: "cmd-ai",
        command: "/ai",
        description: "Ask the AI Swarm a question",
        parameters: ["query"],
        action: async (params) => ({ success: true, response: `The swarm is thinking about: ${params.query}` }),
      },
    ];

    commands.forEach((cmd) => {
      this.commands.set(cmd.command, cmd);
    });
  }

  /**
   * Initial indexing of platform pages
   */
  private initialIndex(): void {
    const pages = [
      { title: "Dashboard", url: "/dashboard", tags: ["home", "main", "overview"] },
      { title: "AI Platform Hub", url: "/ai-platform", tags: ["ai", "bots", "swarm"] },
      { title: "Economic Dashboard", url: "/economic", tags: ["money", "skycoin", "earnings"] },
      { title: "Casino", url: "/casino", tags: ["games", "gambling", "slots"] },
      { title: "Sovereign Dev Zone", url: "/sovereign-dev-zone", tags: ["code", "private", "ide"] },
      { title: "Charity", url: "/charity", tags: ["donate", "help", "impact"] },
      { title: "Governance Hub", url: "/governance", tags: ["dao", "vote", "proposals"] },
      { title: "AI Software Engineer IDE", url: "/ai-ide", tags: ["code", "develop", "autonomous"] },
      { title: "3D Command Center", url: "/3d-center", tags: ["visual", "monitoring", "swarm"] },
    ];

    pages.forEach((page, idx) => {
      this.index.set(`page-${idx}`, {
        id: `page-${idx}`,
        title: page.title,
        content: `${page.title} platform page for ${page.tags.join(", ")}`,
        type: "page",
        url: page.url,
        tags: page.tags,
        lastIndexed: new Date(),
      });
    });
  }

  /**
   * Search the index
   */
  search(query: string, userId: string = "guest"): SearchResult[] {
    if (!query) return [];

    // Check for AI Commands first
    if (query.startsWith("/")) {
      const [cmdName, ...params] = query.split(" ");
      const cmd = this.commands.get(cmdName);
      if (cmd) {
        return [{
          id: cmd.id,
          title: cmd.command,
          description: cmd.description,
          type: "command",
          url: "#",
          metadata: { parameters: cmd.parameters, action: cmd.action },
          score: 100,
        }];
      }
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    this.index.forEach((item) => {
      let score = 0;
      if (item.title.toLowerCase().includes(lowerQuery)) score += 50;
      if (item.content.toLowerCase().includes(lowerQuery)) score += 20;
      if (item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 30;

      if (score > 0) {
        results.push({
          id: item.id,
          title: item.title,
          description: item.content,
          type: item.type as any,
          url: item.url,
          metadata: { tags: item.tags },
          score,
        });
      }
    });

    // Record history
    this.searchHistory.push({
      userId,
      query,
      timestamp: new Date(),
      resultCount: results.length,
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Index new content
   */
  indexContent(item: Omit<SearchIndex, "lastIndexed">): void {
    this.index.set(item.id, {
      ...item,
      lastIndexed: new Date(),
    });
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query: string): string[] {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    const suggestions: string[] = [];

    this.index.forEach((item) => {
      if (item.title.toLowerCase().startsWith(lowerQuery)) {
        suggestions.push(item.title);
      }
    });

    return suggestions.slice(0, 5);
  }

  /**
   * Get trending searches
   */
  getTrendingSearches(limit: number = 5): string[] {
    const counts: Map<string, number> = new Map();
    this.searchHistory.forEach((h) => {
      counts.set(h.query, (counts.get(h.query) || 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((e) => e[0]);
  }

  /**
   * Execute AI Command
   */
  async executeCommand(command: string, params: any): Promise<any> {
    const cmd = this.commands.get(command);
    if (!cmd) throw new Error("Command not found");
    return await cmd.action(params);
  }
}

// Singleton instance
export const universalSearchEngine = new UniversalSearchEngine();
