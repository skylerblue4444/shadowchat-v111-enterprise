import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppShell from "./components/AppShell";
import VoiceDeck from "./components/VoiceDeck";
import CommandPalette from "./components/CommandPalette";
import SovereignHUD from "./components/SovereignHUD";
import BetaReporter from "./components/BetaReporter";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// ── All 32 modules — lazy loaded ─────────────────────────────────────────────
const Dashboard       = lazy(() => import("./pages/Dashboard"));
const SocialFeed      = lazy(() => import("./pages/SocialFeed"));
const Dating          = lazy(() => import("./pages/Dating"));
const Marketplace     = lazy(() => import("./pages/Marketplace"));
const Wallet          = lazy(() => import("./pages/Wallet"));
const AICore          = lazy(() => import("./pages/AICore"));
const Profile         = lazy(() => import("./pages/Profile"));
const Notifications   = lazy(() => import("./pages/Notifications"));
const AdminPanel      = lazy(() => import("./pages/AdminPanel"));
const Explore         = lazy(() => import("./pages/Explore"));
const Analytics       = lazy(() => import("./pages/Analytics"));
const Governance      = lazy(() => import("./pages/Governance"));
const CreatorStudio   = lazy(() => import("./pages/CreatorStudio"));
const AIAgentMarket   = lazy(() => import("./pages/AIAgentMarket"));
const SecurityCenter  = lazy(() => import("./pages/SecurityCenter"));
const DigitalTwin     = lazy(() => import("./pages/DigitalTwin"));
const Exchange        = lazy(() => import("./pages/Exchange"));
const NFTGallery      = lazy(() => import("./pages/NFTGallery"));
const Messaging       = lazy(() => import("./pages/Messaging"));
const Settings        = lazy(() => import("./pages/Settings"));
const Reputation      = lazy(() => import("./pages/Reputation"));
const Referrals       = lazy(() => import("./pages/Referrals"));
const Leaderboard     = lazy(() => import("./pages/Leaderboard"));
const Events          = lazy(() => import("./pages/Events"));
const Subscriptions   = lazy(() => import("./pages/Subscriptions"));
const ModerationLayer = lazy(() => import("./pages/ModerationLayer"));
const APIEcosystem    = lazy(() => import("./pages/APIEcosystem"));
const NavigationSystem= lazy(() => import("./pages/NavigationSystem"));
const FeatureFlags    = lazy(() => import("./pages/FeatureFlags"));
const Blackjack       = lazy(() => import("./pages/Blackjack"));
const LiveVideo       = lazy(() => import("./pages/LiveVideo"));
const SocialGraph     = lazy(() => import("./pages/SocialGraph"));
const PaymentsHub     = lazy(() => import("./pages/PaymentsHub"));
const SandboxZone     = lazy(() => import("./pages/SandboxZone"));
const AIEngineerIDE   = lazy(() => import("./pages/AIEngineerIDE"));
const DevWorkspace    = lazy(() => import("./pages/DevWorkspace"));
const Casino          = lazy(() => import("./pages/Casino"));
const Gamification    = lazy(() => import("./pages/Gamification"));
const CryptoSuite     = lazy(() => import("./pages/CryptoSuite"));
const InvoicingPage   = lazy(() => import("./pages/InvoicingPage"));
const TalentPlatform  = lazy(() => import("./pages/TalentPlatformPage"));
const Tokenomics      = lazy(() => import("./pages/Tokenomics"));
const Charity         = lazy(() => import("./pages/Charity"));
const ICOPortal       = lazy(() => import("./pages/ICOPortal"));
const AdultArea       = lazy(() => import("./pages/AdultArea"));
const WisePayments    = lazy(() => import("./pages/WisePayments"));
const SkyWorld        = lazy(() => import("./pages/SkyWorld"));
const PluginMarket    = lazy(() => import("./pages/PluginMarketplace"));
const DataLakePage = lazy(() => import("./pages/DataLakePage"));
const DevWorkspaceEnterprise = lazy(() => import("./pages/DevWorkspaceEnterprise"));
const HackingTools    = lazy(() => import("./pages/HackingTools"));
const LegalTools      = lazy(() => import("./pages/LegalTools"));
const AIEnterprise    = lazy(() => import("./pages/AIEnterprise"));
const FeaturesLevels = lazy(() => import("./pages/FeaturesLevels"));
const CorporateIdentity = lazy(() => import("./pages/CorporateIdentityHub"));
const GlobalIntelligence = lazy(() => import("./pages/GlobalIntelligenceCenter"));
const AIContentCreation = lazy(() => import("./pages/AIContentCreationSuite"));
const ProductEvolution = lazy(() => import("./pages/ProductEvolutionEngine"));
const LegalComplianceEngine = lazy(() => import("./pages/LegalComplianceEngine"));
const SupplyChainHub = lazy(() => import("./pages/SupplyChainHub"));
const TalentMarketplace = lazy(() => import("./pages/TalentMarketplace"));
const QuantumSecurityVault = lazy(() => import("./pages/QuantumSecurityVault"));
const FinancialIntelligenceHub = lazy(() => import("./pages/FinancialIntelligenceHub"));
const ResearchLabPage = lazy(() => import("./pages/ResearchLabPage"));
const GeopoliticalIntelligenceCenter = lazy(() => import("./pages/GeopoliticalIntelligenceCenter"));
const WorkforceManagementHub = lazy(() => import("./pages/WorkforceManagementHub"));
const SustainabilityHub = lazy(() => import("./pages/SustainabilityHub"));
const HealthcareWellnessHub = lazy(() => import("./pages/HealthcareWellnessHub"));
const EducationAcademy = lazy(() => import("./pages/EducationAcademy"));
const GamingPuzzleHub = lazy(() => import("./pages/GamingPuzzleHub"));
const EventsHub = lazy(() => import("./pages/EventsHub"));
const NeuralNavigationHub = lazy(() => import("./pages/NeuralNavigationHub"));
const EnterpriseLogin = lazy(() => import("./pages/EnterpriseLogin"));
const AdminControlCenter = lazy(() => import("./pages/AdminControlCenter"));
const JudicialArbitrationHub = lazy(() => import("./pages/JudicialArbitrationHub"));
const DisasterRecoveryHub = lazy(() => import("./pages/DisasterRecoveryHub"));
const EliteClubHub = lazy(() => import("./pages/EliteClubHub"));
const EliteAuctionHouse = lazy(() => import("./pages/EliteAuctionHouse"));
const ManusTreasuryHub = lazy(() => import("./pages/ManusTreasuryHub"));
const UpgradeMatrix = lazy(() => import("./pages/UpgradeMatrix"));
const EconomicProfitHub = lazy(() => import("./pages/EconomicProfitHub"));
const CharityTransparencyHub = lazy(() => import("./pages/CharityTransparencyHub"));
const GamificationHub = lazy(() => import("./pages/GamificationHub"));
const DeFiTerminal = lazy(() => import("./pages/DeFiTerminal"));
const GovernanceVotingHub = lazy(() => import("./pages/GovernanceVotingHub"));
const SovereignMap = lazy(() => import("./pages/SovereignMap"));
const CyberDefenseCenter = lazy(() => import("./pages/CyberDefenseCenter"));
const PersonalityMatrixHub = lazy(() => import("./pages/PersonalityMatrixHub"));
const UnhingedTradingHub = lazy(() => import("./pages/UnhingedTradingHub"));
const HackerFeedHub = lazy(() => import("./pages/HackerFeedHub"));
const SovereignAudioHub = lazy(() => import("./pages/SovereignAudioHub"));
const AIEvolutionLab = lazy(() => import("./pages/AIEvolutionLab"));
const SovereignExpansionHub = lazy(() => import("./pages/SovereignExpansionHub"));
const NeuralMarketplace = lazy(() => import("./pages/NeuralMarketplace"));
const SovereignIntelligenceAgency = lazy(() => import("./pages/SovereignIntelligenceAgency"));
const FeatureFactoryHub = lazy(() => import("./pages/FeatureFactoryHub"));
const SovereignIdentityVault = lazy(() => import("./pages/SovereignIdentityVault"));
const SovereignArtifactForge = lazy(() => import("./pages/SovereignArtifactForge"));
const SovereignCentralBank = lazy(() => import("./pages/SovereignCentralBank"));
const EliteVIPConcierge = lazy(() => import("./pages/EliteVIPConcierge"));
const ShadowOS = lazy(() => import("./pages/ShadowOS"));
const ResourceExtractorHub = lazy(() => import("./pages/ResourceExtractorHub"));
const GlobalTradeTerminal = lazy(() => import("./pages/GlobalTradeTerminal"));
const ElitePatentLab = lazy(() => import("./pages/ElitePatentLab"));
const PhilanthropyHub = lazy(() => import("./pages/PhilanthropyHub"));
const AutonomousAgentHub = lazy(() => import("./pages/AutonomousAgentHub"));
const UnifiedMarketplace = lazy(() => import("./pages/UnifiedMarketplace"));
const NotFound        = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Loading Module...</span>
      </div>
    </div>
  );
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/"               component={Dashboard} />
          <Route path="/feed"           component={SocialFeed} />
          <Route path="/dating"         component={Dating} />
          <Route path="/marketplace"    component={Marketplace} />
          <Route path="/wallet"         component={Wallet} />
          <Route path="/ai-core"        component={AICore} />
          <Route path="/profile"        component={Profile} />
          <Route path="/notifications"  component={Notifications} />
          <Route path="/admin"          component={AdminPanel} />
          <Route path="/explore"        component={Explore} />
          <Route path="/analytics"      component={Analytics} />
          <Route path="/governance"     component={Governance} />
          <Route path="/creator-studio" component={CreatorStudio} />
          <Route path="/ai-agents"      component={AIAgentMarket} />
          <Route path="/security"       component={SecurityCenter} />
          <Route path="/digital-twin"   component={DigitalTwin} />
          <Route path="/exchange"       component={Exchange} />
          <Route path="/nft"            component={NFTGallery} />
          <Route path="/messages"       component={Messaging} />
          <Route path="/settings"       component={Settings} />
          <Route path="/reputation"     component={Reputation} />
          <Route path="/referrals"      component={Referrals} />
          <Route path="/leaderboard"    component={Leaderboard} />
          <Route path="/events"         component={Events} />
          <Route path="/subscriptions"  component={Subscriptions} />
          <Route path="/moderation"     component={ModerationLayer} />
          <Route path="/api"            component={APIEcosystem} />
          <Route path="/api-ecosystem"  component={APIEcosystem} />
          <Route path="/navigation"     component={NavigationSystem} />
          <Route path="/features"       component={FeatureFlags} />
          <Route path="/feature-flags"  component={FeatureFlags} />
          <Route path="/blackjack"      component={Blackjack} />
          <Route path="/live"           component={LiveVideo} />
          <Route path="/social-graph"   component={SocialGraph} />
          <Route path="/payments"       component={PaymentsHub} />
          <Route path="/sandbox"        component={SandboxZone} />
          <Route path="/ai-ide"         component={AIEngineerIDE} />
          <Route path="/dev"            component={DevWorkspace} />
          <Route path="/casino"         component={Casino} />
          <Route path="/gamification"   component={Gamification} />
          <Route path="/crypto"         component={CryptoSuite} />
          <Route path="/tokenomics"     component={Tokenomics} />
          <Route path="/charity"        component={Charity} />
          <Route path="/ico"            component={ICOPortal} />
          <Route path="/adult"          component={AdultArea} />
          <Route path="/wise-payments"  component={WisePayments} />
          <Route path="/skyworld"       component={SkyWorld} />
          <Route path="/plugins"        component={PluginMarket} />
          <Route path="/data-lake" component={DataLakePage} />
          <Route path="/dev-workspace-enterprise" component={DevWorkspaceEnterprise} />
          <Route path="/hacking" component={HackingTools} />
          <Route path="/legal" component={LegalTools} />
          <Route path="/ai-enterprise" component={AIEnterprise} />
          <Route path="/features" component={FeaturesLevels} />
          <Route path="/invoicing" component={InvoicingPage} />
          <Route path="/talent" component={TalentPlatform} />
          <Route path="/corporate" component={CorporateIdentity} />
          <Route path="/intelligence" component={GlobalIntelligence} />
          <Route path="/creation-suite" component={AIContentCreation} />
          <Route path="/evolution" component={ProductEvolution} />
          <Route path="/legal-compliance" component={LegalComplianceEngine} />
          <Route path="/supply-chain" component={SupplyChainHub} />
          <Route path="/talent-market" component={TalentMarketplace} />
          <Route path="/quantum-security" component={QuantumSecurityVault} />
          <Route path="/financial" component={FinancialIntelligenceHub} />
          <Route path="/research" component={ResearchLabPage} />
          <Route path="/geopolitical" component={GeopoliticalIntelligenceCenter} />
          <Route path="/workforce" component={WorkforceManagementHub} />
          <Route path="/sustainability" component={SustainabilityHub} />
          <Route path="/healthcare" component={HealthcareWellnessHub} />
          <Route path="/academy" component={EducationAcademy} />
          <Route path="/gaming" component={GamingPuzzleHub} />
          <Route path="/events-hub" component={EventsHub} />
          <Route path="/neural-nav" component={NeuralNavigationHub} />
          <Route path="/login" component={EnterpriseLogin} />
          <Route path="/admin-control" component={AdminControlCenter} />
          <Route path="/judicial" component={JudicialArbitrationHub} />
          <Route path="/recovery" component={DisasterRecoveryHub} />
          <Route path="/elite-club" component={EliteClubHub} />
          <Route path="/auction-house" component={EliteAuctionHouse} />
          <Route path="/treasury" component={ManusTreasuryHub} />
          <Route path="/upgrade-matrix" component={UpgradeMatrix} />
          <Route path="/profit-models" component={EconomicProfitHub} />
          <Route path="/charity-hub" component={CharityTransparencyHub} />
          <Route path="/neural-xp" component={GamificationHub} />
          <Route path="/defi" component={DeFiTerminal} />
          <Route path="/governance-voting" component={GovernanceVotingHub} />
          <Route path="/map" component={SovereignMap} />
          <Route path="/cyber-defense" component={CyberDefenseCenter} />
          <Route path="/personality-matrix" component={PersonalityMatrixHub} />
          <Route path="/unhinged-trading" component={UnhingedTradingHub} />
          <Route path="/hacker-feed" component={HackerFeedHub} />
          <Route path="/audio-hub" component={SovereignAudioHub} />
          <Route path="/ai-evolution" component={AIEvolutionLab} />
          <Route path="/expansion" component={SovereignExpansionHub} />
          <Route path="/neural-market" component={NeuralMarketplace} />
          <Route path="/intel-agency" component={SovereignIntelligenceAgency} />
          <Route path="/feature-factory" component={FeatureFactoryHub} />
          <Route path="/identity-vault" component={SovereignIdentityVault} />
          <Route path="/artifact-forge" component={SovereignArtifactForge} />
          <Route path="/central-bank" component={SovereignCentralBank} />
          <Route path="/vip-concierge" component={EliteVIPConcierge} />
          <Route path="/os" component={ShadowOS} />
          <Route path="/extractor" component={ResourceExtractorHub} />
          <Route path="/trade-terminal" component={GlobalTradeTerminal} />
          <Route path="/patent-lab" component={ElitePatentLab} />
          <Route path="/philanthropy" component={PhilanthropyHub} />
          <Route path="/agents" component={AutonomousAgentHub} />
          <Route path="/unified-market" component={UnifiedMarketplace} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
      {/* Global Voice Deck — always visible */}
      <VoiceDeck />
      <CommandPalette />
      <SovereignHUD />
      <BetaReporter />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
