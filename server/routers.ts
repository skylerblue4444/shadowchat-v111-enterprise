import { miniAppEngineRouter } from "./routers/miniAppEngine";
import { miniAppStoreRouter } from "./routers/miniAppStore";
import { miniAppPaymentsRouter } from "./routers/miniAppPayments";
import { qrCodeEngineRouter } from "./routers/qrCodeEngine";
import { momentsFeedRouter } from "./routers/momentsFeed";
import { officialAccountsRouter } from "./routers/officialAccounts";
import { channelsLiveRouter } from "./routers/channelsLive";
import { redPacketsRouter } from "./routers/redPackets";
import { cityServicesRouter } from "./routers/cityServices";
import { healthCodeRouter } from "./routers/healthCode";
import { transitPassRouter } from "./routers/transitPass";
import { foodOrderingRouter } from "./routers/foodOrdering";
import { groceryDeliveryRouter } from "./routers/groceryDelivery";
import { rideHailingRouter } from "./routers/rideHailing";
import { hotelBookingRouter } from "./routers/hotelBooking";
import { flightBookingRouter } from "./routers/flightBooking";
import { movieTicketsRouter } from "./routers/movieTickets";
import { billPaymentsRouter } from "./routers/billPayments";
import { moneyTransferRouter } from "./routers/moneyTransfer";
import { creditScoreRouter } from "./routers/creditScore";
import { loanEngineRouter } from "./routers/loanEngine";
import { insuranceEngineRouter } from "./routers/insuranceEngine";
import { investmentEngineRouter } from "./routers/investmentEngine";
import { wealthManagementRouter } from "./routers/wealthManagement";
import { merchantServicesRouter } from "./routers/merchantServices";
import { deliveryNetworkRouter } from "./routers/deliveryNetwork";
import { socialCommerceRouter } from "./routers/socialCommerce";
import { auctionHouseRouter } from "./routers/auctionHouse";
import { rentalPlatformRouter } from "./routers/rentalPlatform";
import { freelanceMarketRouter } from "./routers/freelanceMarket";
import { appointmentBookRouter } from "./routers/appointmentBook";
import { eventTicketingRouter } from "./routers/eventTicketing";
import { donationEngineRouter } from "./routers/donationEngine";
import { petitionEngineRouter } from "./routers/petitionEngine";
import { votingSystemRouter } from "./routers/votingSystem";
import { communityForumsRouter } from "./routers/communityForums";
import { groupChatRouter } from "./routers/groupChat";
import { voiceRoomsRouter } from "./routers/voiceRooms";
import { karaokeRouter } from "./routers/karaoke";
import { fitnessTrackerRouter } from "./routers/fitnessTracker";
import { meditationAppRouter } from "./routers/meditationApp";
import { languageLearningRouter } from "./routers/languageLearning";
import { newsAggregatorRouter } from "./routers/newsAggregator";
import { podcastEngineRouter } from "./routers/podcastEngine";
import { musicStreamingRouter } from "./routers/musicStreaming";
import { videoShortsRouter } from "./routers/videoShorts";
import { photoEditorRouter } from "./routers/photoEditor";
import { documentScannerRouter } from "./routers/documentScanner";
import { translatorEngineRouter } from "./routers/translatorEngine";
import { weatherServiceRouter } from "./routers/weatherService";
import { mapNavigationRouter } from "./routers/mapNavigation";
import { parkingFinderRouter } from "./routers/parkingFinder";
import { carPoolingRouter } from "./routers/carPooling";
import { petServicesRouter } from "./routers/petServices";
import { homeServicesRouter } from "./routers/homeServices";
import { beautyBookingRouter } from "./routers/beautyBooking";
import { tutoringRouter } from "./routers/tutoring";
import { jobBoardRouter } from "./routers/jobBoard";
import { resumeBuilderRouter } from "./routers/resumeBuilder";
import { networkingAppRouter } from "./routers/networkingApp";
import { businessCardsRouter } from "./routers/businessCards";
import { expenseTrackerRouter } from "./routers/expenseTracker";
import { taxFilingRouter } from "./routers/taxFiling";
import { legalDocsRouter } from "./routers/legalDocs";
import { willEstateRouter } from "./routers/willEstate";
import { passwordManagerRouter } from "./routers/passwordManager";
import { vpnServiceRouter } from "./routers/vpnService";
import { cloudStorageRouter } from "./routers/cloudStorage";
import { emailClientRouter } from "./routers/emailClient";
import { calendarAppRouter } from "./routers/calendarApp";
import { todoAppRouter } from "./routers/todoApp";
import { notesAppRouter } from "./routers/notesApp";
import { habitTrackerRouter } from "./routers/habitTracker";
import { budgetPlannerRouter } from "./routers/budgetPlanner";
import { recipeAppRouter } from "./routers/recipeApp";
import { gardenPlannerRouter } from "./routers/gardenPlanner";
import { travelPlannerRouter } from "./routers/travelPlanner";
import { carMaintenanceRouter } from "./routers/carMaintenance";
import { smartHomeRouter } from "./routers/smartHome";
import { babyTrackerRouter } from "./routers/babyTracker";
import { seniorCareRouter } from "./routers/seniorCare";
import { volunteerHubRouter } from "./routers/volunteerHub";
import { recyclingGuideRouter } from "./routers/recyclingGuide";
import { emergencyAlertRouter } from "./routers/emergencyAlert";
import { neighborhoodAppRouter } from "./routers/neighborhoodApp";
import { schoolPortalRouter } from "./routers/schoolPortal";
import { churchAppRouter } from "./routers/churchApp";
import { sportsLeagueRouter } from "./routers/sportsLeague";
import { bookClubRouter } from "./routers/bookClub";
import { artGalleryRouter } from "./routers/artGallery";
import { craftMarketRouter } from "./routers/craftMarket";
import { garagesSaleRouter } from "./routers/garagesSale";
import { lostFoundRouter } from "./routers/lostFound";
import { carpoolKidsRouter } from "./routers/carpoolKids";
import { mealSharingRouter } from "./routers/mealSharing";
import { toolLibraryRouter } from "./routers/toolLibrary";
import { skillSwapRouter } from "./routers/skillSwap";
import { timeBankRouter } from "./routers/timeBank";
import { coworkingSpaceRouter } from "./routers/coworkingSpace";
import { parkingShareRouter } from "./routers/parkingShare";
import { storageShareRouter } from "./routers/storageShare";

import { vectorSearchRouter } from "./routers/vectorSearch";
import { aiOrchestratorRouter } from "./routers/aiOrchestrator";
import { dataWarehouseRouter } from "./routers/dataWarehouse";
import { streamProcessingRouter } from "./routers/streamProcessing";
import { serviceMeshRouter } from "./routers/serviceMesh";
import { secretsVaultRouter } from "./routers/secretsVault";
import { policyEngineRouter } from "./routers/policyEngine";
import { featureFlagsRouter } from "./routers/featureFlags";
import { costOptimizerRouter } from "./routers/costOptimizer";
import { incidentMgmtRouter } from "./routers/incidentMgmt";
import { chaosEngineeringRouter } from "./routers/chaosEngineering";
import { edgeComputingRouter } from "./routers/edgeComputing";
import { quantumCryptoRouter } from "./routers/quantumCrypto";
import { carbonTrackingRouter } from "./routers/carbonTracking";
import { legalComplianceRouter } from "./routers/legalCompliance";
import { healthPlatformRouter } from "./routers/healthPlatform";
import { edTechRouter } from "./routers/edTech";
import { propTechRouter } from "./routers/propTech";
import { finOpsRouter } from "./routers/finOps";
import { marketDataRouter } from "./routers/marketData";
import { supplyChainV2Router } from "./routers/supplyChainV2";
import { roboticsAPIRouter } from "./routers/roboticsAPI";
import { gameEngineRouter } from "./routers/gameEngine";
import { spatialComputeRouter } from "./routers/spatialCompute";
import { syntheticMediaRouter } from "./routers/syntheticMedia";
import { federatedMLRouter } from "./routers/federatedML";
import { documentAIRouter } from "./routers/documentAI";
import { voicePlatformRouter } from "./routers/voicePlatform";
import { conversationalAIRouter } from "./routers/conversationalAI";
import { predictiveAnalyticsRouter } from "./routers/predictiveAnalytics";
import { customerDataPlatformRouter } from "./routers/customerDataPlatform";
import { revenueOpsRouter } from "./routers/revenueOps";
import { productAnalyticsRouter } from "./routers/productAnalytics";
import { abTestingRouter } from "./routers/abTesting";
import { contentDeliveryRouter } from "./routers/contentDelivery";
import { webhookEngineRouter } from "./routers/webhookEngine";
import { auditEngineRouter } from "./routers/auditEngine";
import { migrationEngineRouter } from "./routers/migrationEngine";
import { backupRestoreRouter } from "./routers/backupRestore";
import { rateLimiterRouter } from "./routers/rateLimiter";
import { cacheEngineRouter } from "./routers/cacheEngine";
import { queueManagerRouter } from "./routers/queueManager";
import { schedulerEngineRouter } from "./routers/schedulerEngine";
import { notificationEngineRouter } from "./routers/notificationEngine";
import { formBuilderRouter } from "./routers/formBuilder";
import { reportEngineRouter } from "./routers/reportEngine";
import { dashboardEngineRouter } from "./routers/dashboardEngine";
import { integrationHubRouter } from "./routers/integrationHub";
import { aiCodeReviewRouter } from "./routers/aiCodeReview";
import { deploymentEngineRouter } from "./routers/deploymentEngine";

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { socialRouter } from "./routers/social";
import { walletRouter } from "./routers/wallet";
import { exchangeRouter } from "./routers/exchange";
import { aiRouter } from "./routers/ai";
import { governanceRouter } from "./routers/governance";
import { marketplaceRouter } from "./routers/marketplace";
import { messagingRouter } from "./routers/messaging";
import { notificationsRouter } from "./routers/notifications";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { profileRouter } from "./routers/profile";
import { eventBusRouter } from "./routers/eventBus";
import { knowledgeRouter } from "./routers/knowledge";
import { workflowRouter } from "./routers/workflow";
import { searchRouter } from "./routers/search";
import { securityRouter } from "./routers/security";
import { developerRouter } from "./routers/developer";
import { digitalTwinRouter } from "./routers/digitalTwin";
import { observabilityRouter } from "./routers/observability";
import { treasuryRouter } from "./routers/treasury";
import { advancedGovernanceRouter } from "./routers/advancedGovernance";
import { datingRouter } from "./routers/dating";
import { liveVideoRouter } from "./routers/liveVideo";
import { creatorStudioRouter } from "./routers/creatorStudio";
import { paymentsRouter } from "./routers/payments";
import { socialGraphRouter } from "./routers/socialGraph";
import { sandboxRouter } from "./routers/sandbox";
import { moderationRouter } from "./routers/moderation";
import { cryptoRouter } from "./routers/crypto";
import { aiEngineerRouter } from "./routers/aiEngineer";
import { casinoRouter } from "./routers/casino";
import { charityRouter } from "./routers/charity";
import { icoRouter } from "./routers/ico";
import { adultAreaRouter, greyToolsRouter } from "./routers/adultArea";
import { wisePaymentsRouter } from "./routers/wisePayments";
import { knowledgeGraphRouter } from "./routers/knowledgeGraph";
import { aiMemoryRouter } from "./routers/aiMemory";
import { agentOSRouter } from "./routers/agentOS";
import { organizationRouter } from "./routers/organization";
import { revenueEngineRouter } from "./routers/revenueEngine";
import { gamificationRouter } from "./routers/gamification";
import { enterpriseB2BRouter } from "./routers/enterpriseB2B";
import { aiIDERouter } from "./routers/aiIDE";
import { devWorkspaceRouter } from "./routers/devWorkspace";
import { tokenomicsRouter } from "./routers/tokenomics";
import { dataLakeRouter } from "./routers/dataLake";
import { pluginMarketplaceRouter } from "./routers/pluginMarketplace";
import { aiEnterprise } from "./routers/aiEnterprise";
import { recommendationsRouter } from "./routers/recommendations";
import { aiAdvancedRouter } from "./routers/aiAdvanced";
import { securityAdvancedRouter } from "./routers/securityAdvanced";
import { performanceRouter } from "./routers/performance";
import { integrationsRouter } from "./routers/integrations";
import { devWorkspaceEnterpriseRouter } from "./routers/devWorkspaceEnterprise";
import { marketplaceAdvancedRouter } from "./routers/marketplaceAdvanced";
import { talentPlatformRouter } from "./routers/talentPlatform";
import { invoicingContractsRouter } from "./routers/invoicingContracts";
import { webhooksComplianceRouter } from "./routers/webhooksCompliance";
import { tradingBotsRouter } from "./routers/tradingBots";
import { aiSelfImproveRouter } from "./routers/aiSelfImprove";
import { softwareEngineeringRouter } from "./routers/softwareEngineering";
import { growthEngineRouter } from "./routers/growthEngine";
import { apiGatewayRouter } from "./routers/apiGateway";
import { mlPipelineRouter } from "./routers/mlPipeline";
import { realtimeCollabRouter } from "./routers/realtimeCollab";
import { whitelabelRouter } from "./routers/whitelabel";
import { blockchainRouter } from "./routers/blockchain";
import { workflowAutomationRouter } from "./routers/workflowAutomation";
import { multiTenantRouter } from "./routers/multiTenant";
import { notificationCenterRouter } from "./routers/notificationCenter";
import { cmsRouter } from "./routers/cms";
import { knowledgeBaseRouter } from "./routers/knowledgeBase";
import { schedulingRouter } from "./routers/scheduling";
import { elearningRouter } from "./routers/elearning";
import { healthFitnessRouter } from "./routers/healthFitness";
import { projectManagementRouter } from "./routers/projectManagement";
import { iotRouter } from "./routers/iot";
import { travelRouter } from "./routers/travel";
import { musicPodcastRouter } from "./routers/musicPodcast";
import { realEstateRouter } from "./routers/realEstate";
import { crowdfundingRouter } from "./routers/crowdfunding";
import { insuranceRouter } from "./routers/insurance";
import { logisticsRouter } from "./routers/logistics";
import { hrRecruitmentRouter } from "./routers/hrRecruitment";
import { advertisingRouter } from "./routers/advertising";
import { cloudInfraRouter } from "./routers/cloudInfra";
import { supportDeskRouter } from "./routers/supportDesk";
import { videoConferenceRouter } from "./routers/videoConference";
import { documentMgmtRouter } from "./routers/documentMgmt";
import { emailMarketingRouter } from "./routers/emailMarketing";
import { socialMediaMgmtRouter } from "./routers/socialMediaMgmt";
import { crmRouter } from "./routers/crm";
import { accountingRouter } from "./routers/accounting";
import { inventoryRouter } from "./routers/inventory";
import { aiAgentsMarketRouter } from "./routers/aiAgentsMarket";
import { identityRouter } from "./routers/identity";
import { businessIntelRouter } from "./routers/businessIntel";
import { automationHubRouter } from "./routers/automationHub";
import { gamificationV2Router } from "./routers/gamificationV2";
import { searchEngineRouter } from "./routers/searchEngine";
import { streamingRouter } from "./routers/streaming";
import { digitalBankingRouter } from "./routers/digitalBanking";
import { governanceV2Router } from "./routers/governanceV2";
import { aiAutonomousRouter } from "./routers/aiAutonomous";
import { apiEconomyRouter } from "./routers/apiEconomy";
import { complianceRiskRouter } from "./routers/complianceRisk";
import { paymentProcessingRouter } from "./routers/paymentProcessing";
import { aiVisionRouter } from "./routers/aiVision";
import { socialGamingRouter } from "./routers/socialGaming";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ShadowChat feature routers
  social: socialRouter,
  wallet: walletRouter,
  exchange: exchangeRouter,
  ai: aiRouter,
  governance: governanceRouter,
  marketplace: marketplaceRouter,
  messaging: messagingRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
  profile: profileRouter,

  // Enterprise platform routers
  eventBus: eventBusRouter,
  knowledge: knowledgeRouter,
  workflow: workflowRouter,
  search: searchRouter,
  security: securityRouter,
  developer: developerRouter,
  digitalTwin: digitalTwinRouter,
  observability: observabilityRouter,
  treasury: treasuryRouter,
  advancedGovernance: advancedGovernanceRouter,

  // Phase 3 feature recovery routers
  dating: datingRouter,
  liveVideo: liveVideoRouter,
  creatorStudio: creatorStudioRouter,
  payments: paymentsRouter,
  socialGraph: socialGraphRouter,
  sandbox: sandboxRouter,
  moderation: moderationRouter,

  // Enterprise Crypto
  crypto: cryptoRouter,
  aiEngineer: aiEngineerRouter,

  // Casino & Entertainment
  casino: casinoRouter,
  charity: charityRouter,

  // ICO & Investment
  ico: icoRouter,

  // Adult & Grey Area
  adultArea: adultAreaRouter,
  greyTools: greyToolsRouter,

  // International Payments
  wisePayments: wisePaymentsRouter,

  // AI Operating System Layer
  knowledgeGraph: knowledgeGraphRouter,
  aiMemory: aiMemoryRouter,
  agentOS: agentOSRouter,
  organization: organizationRouter,

  // Billion-Dollar Platform Layer
  revenue: revenueEngineRouter,
  gamification: gamificationRouter,
  enterpriseB2B: enterpriseB2BRouter,

  // AI IDE & Developer Workspace
  aiIDE: aiIDERouter,
  devWorkspace: devWorkspaceRouter,

  // Tokenomics — Full Crypto Economy
  tokenomics: tokenomicsRouter,

  // Data Lake — Enterprise Data Management
  dataLake: dataLakeRouter,

  // Plugin Marketplace — Developer Ecosystem
  pluginMarketplace: pluginMarketplaceRouter,

  // Enterprise AI — $2B-Grade Architecture
  aiEnterprise: router(aiEnterprise),

  // Recommendation Engine — Personalized Content & Products
  recommendations: recommendationsRouter,

  // Advanced AI — Multi-Model, RAG, Memory, Context
  aiAdvanced: aiAdvancedRouter,

  // Advanced Security — 2FA, WebAuthn, Audit, Compliance
  securityAdvanced: securityAdvancedRouter,

  // Performance Optimization — Caching, CDN, Bundle Optimization
  performance: performanceRouter,

  // Enterprise Integrations — Stripe, Twilio, SendGrid, Slack, Discord
  integrations: integrationsRouter,

  // Enterprise Dev Workspace — Monaco, AI Pair Programming, Terminal, Git
  devWorkspaceEnterprise: devWorkspaceEnterpriseRouter,

  // Advanced Multi-Layer Marketplace — B2B, B2C, C2C, Vendor Management, Escrow
  marketplaceAdvanced: marketplaceAdvancedRouter,

  // Talent Platform — Freelancer Profiles, Jobs, Bidding, Contracts
  talentPlatform: talentPlatformRouter,

  // Invoicing & Contracts — Professional Invoicing, Contract Management
  invoicingContracts: invoicingContractsRouter,

  // Webhooks & Compliance — Event Webhooks, Compliance, Real-time Notifications
  webhooksCompliance: webhooksComplianceRouter,

  // Automated Trading Bots — AI-Powered Trading Strategies
  tradingBots: tradingBotsRouter,

  // AI Self-Improvement Engine — AI that codes its own upgrades 24/7
  aiSelfImprove: aiSelfImproveRouter,

  // Advanced Software Engineering Suite — Full IDE, CI/CD, Deployment
  softwareEngineering: softwareEngineeringRouter,

  // Growth Engine — Social Proof, A/B Testing, Search, Moderation, Workflows
  growthEngine: growthEngineRouter,
  apiGateway: apiGatewayRouter,
  mlPipeline: mlPipelineRouter,
  realtimeCollab: realtimeCollabRouter,
  whitelabel: whitelabelRouter,
  blockchain: blockchainRouter,
  workflowAutomation: workflowAutomationRouter,
  multiTenant: multiTenantRouter,
  notificationCenter: notificationCenterRouter,
  cms: cmsRouter,
  knowledgeBase: knowledgeBaseRouter,
  scheduling: schedulingRouter,
  elearning: elearningRouter,
  healthFitness: healthFitnessRouter,
  projectManagement: projectManagementRouter,
  socialCommerce: socialCommerceRouter,
  iot: iotRouter,
  travel: travelRouter,
  musicPodcast: musicPodcastRouter,
  // foodDelivery: foodDeliveryRouter,
  realEstate: realEstateRouter,
  crowdfunding: crowdfundingRouter,
  insurance: insuranceRouter,
  logistics: logisticsRouter,
  hrRecruitment: hrRecruitmentRouter,
  advertising: advertisingRouter,
  cloudInfra: cloudInfraRouter,
  supportDesk: supportDeskRouter,
  videoConference: videoConferenceRouter,
  documentMgmt: documentMgmtRouter,
  emailMarketing: emailMarketingRouter,
  socialMediaMgmt: socialMediaMgmtRouter,
  crm: crmRouter,
  accounting: accountingRouter,
  inventory: inventoryRouter,
  aiAgentsMarket: aiAgentsMarketRouter,
  identity: identityRouter,
  businessIntel: businessIntelRouter,
  automationHub: automationHubRouter,
  gamificationV2: gamificationV2Router,
  searchEngine: searchEngineRouter,
  streaming: streamingRouter,
  digitalBanking: digitalBankingRouter,
  governanceV2: governanceV2Router,
  aiAutonomous: aiAutonomousRouter,
  apiEconomy: apiEconomyRouter,
  complianceRisk: complianceRiskRouter,
  paymentProcessing: paymentProcessingRouter,
  aiVision: aiVisionRouter,
  socialGaming: socialGamingRouter,
  vectorSearch: vectorSearchRouter,
  aiOrchestrator: aiOrchestratorRouter,
  dataWarehouse: dataWarehouseRouter,
  streamProcessing: streamProcessingRouter,
  serviceMesh: serviceMeshRouter,
  secretsVault: secretsVaultRouter,
  policyEngine: policyEngineRouter,
  featureFlags: featureFlagsRouter,
  costOptimizer: costOptimizerRouter,
  incidentMgmt: incidentMgmtRouter,
  chaosEngineering: chaosEngineeringRouter,
  edgeComputing: edgeComputingRouter,
  quantumCrypto: quantumCryptoRouter,
  carbonTracking: carbonTrackingRouter,
  legalCompliance: legalComplianceRouter,
  healthPlatform: healthPlatformRouter,
  edTech: edTechRouter,
  propTech: propTechRouter,
  finOps: finOpsRouter,
  marketData: marketDataRouter,
  supplyChainV2: supplyChainV2Router,
  roboticsAPI: roboticsAPIRouter,
  gameEngine: gameEngineRouter,
  spatialCompute: spatialComputeRouter,
  syntheticMedia: syntheticMediaRouter,
  federatedML: federatedMLRouter,
  documentAI: documentAIRouter,
  voicePlatform: voicePlatformRouter,
  conversationalAI: conversationalAIRouter,
  predictiveAnalytics: predictiveAnalyticsRouter,
  customerDataPlatform: customerDataPlatformRouter,
  revenueOps: revenueOpsRouter,
  productAnalytics: productAnalyticsRouter,
  abTesting: abTestingRouter,
  contentDelivery: contentDeliveryRouter,
  webhookEngine: webhookEngineRouter,
  auditEngine: auditEngineRouter,
  migrationEngine: migrationEngineRouter,
  backupRestore: backupRestoreRouter,
  rateLimiter: rateLimiterRouter,
  cacheEngine: cacheEngineRouter,
  queueManager: queueManagerRouter,
  schedulerEngine: schedulerEngineRouter,
  notificationEngine: notificationEngineRouter,
  formBuilder: formBuilderRouter,
  reportEngine: reportEngineRouter,
  dashboardEngine: dashboardEngineRouter,
  integrationHub: integrationHubRouter,
  aiCodeReview: aiCodeReviewRouter,
  deploymentEngine: deploymentEngineRouter,
  miniAppEngine: miniAppEngineRouter,
  miniAppStore: miniAppStoreRouter,
  miniAppPayments: miniAppPaymentsRouter,
  qrCodeEngine: qrCodeEngineRouter,
  momentsFeed: momentsFeedRouter,
  officialAccounts: officialAccountsRouter,
  channelsLive: channelsLiveRouter,
  redPackets: redPacketsRouter,
  cityServices: cityServicesRouter,
  healthCode: healthCodeRouter,
  transitPass: transitPassRouter,
  foodOrdering: foodOrderingRouter,
  groceryDelivery: groceryDeliveryRouter,
  rideHailing: rideHailingRouter,
  hotelBooking: hotelBookingRouter,
  flightBooking: flightBookingRouter,
  movieTickets: movieTicketsRouter,
  billPayments: billPaymentsRouter,
  moneyTransfer: moneyTransferRouter,
  creditScore: creditScoreRouter,
  loanEngine: loanEngineRouter,
  insuranceEngine: insuranceEngineRouter,
  investmentEngine: investmentEngineRouter,
  wealthManagement: wealthManagementRouter,
  merchantServices: merchantServicesRouter,
  deliveryNetwork: deliveryNetworkRouter,
  auctionHouse: auctionHouseRouter,
  rentalPlatform: rentalPlatformRouter,
  freelanceMarket: freelanceMarketRouter,
  appointmentBook: appointmentBookRouter,
  eventTicketing: eventTicketingRouter,
  donationEngine: donationEngineRouter,
  petitionEngine: petitionEngineRouter,
  votingSystem: votingSystemRouter,
  communityForums: communityForumsRouter,
  groupChat: groupChatRouter,
  voiceRooms: voiceRoomsRouter,
  karaoke: karaokeRouter,
  fitnessTracker: fitnessTrackerRouter,
  meditationApp: meditationAppRouter,
  languageLearning: languageLearningRouter,
  newsAggregator: newsAggregatorRouter,
  podcastEngine: podcastEngineRouter,
  musicStreaming: musicStreamingRouter,
  videoShorts: videoShortsRouter,
  photoEditor: photoEditorRouter,
  documentScanner: documentScannerRouter,
  translatorEngine: translatorEngineRouter,
  weatherService: weatherServiceRouter,
  mapNavigation: mapNavigationRouter,
  parkingFinder: parkingFinderRouter,
  carPooling: carPoolingRouter,
  petServices: petServicesRouter,
  homeServices: homeServicesRouter,
  beautyBooking: beautyBookingRouter,
  tutoring: tutoringRouter,
  jobBoard: jobBoardRouter,
  resumeBuilder: resumeBuilderRouter,
  networkingApp: networkingAppRouter,
  businessCards: businessCardsRouter,
  expenseTracker: expenseTrackerRouter,
  taxFiling: taxFilingRouter,
  legalDocs: legalDocsRouter,
  willEstate: willEstateRouter,
  passwordManager: passwordManagerRouter,
  vpnService: vpnServiceRouter,
  cloudStorage: cloudStorageRouter,
  emailClient: emailClientRouter,
  calendarApp: calendarAppRouter,
  todoApp: todoAppRouter,
  notesApp: notesAppRouter,
  habitTracker: habitTrackerRouter,
  budgetPlanner: budgetPlannerRouter,
  recipeApp: recipeAppRouter,
  gardenPlanner: gardenPlannerRouter,
  travelPlanner: travelPlannerRouter,
  carMaintenance: carMaintenanceRouter,
  smartHome: smartHomeRouter,
  babyTracker: babyTrackerRouter,
  seniorCare: seniorCareRouter,
  volunteerHub: volunteerHubRouter,
  recyclingGuide: recyclingGuideRouter,
  emergencyAlert: emergencyAlertRouter,
  neighborhoodApp: neighborhoodAppRouter,
  schoolPortal: schoolPortalRouter,
  churchApp: churchAppRouter,
  sportsLeague: sportsLeagueRouter,
  bookClub: bookClubRouter,
  artGallery: artGalleryRouter,
  craftMarket: craftMarketRouter,
  garagesSale: garagesSaleRouter,
  lostFound: lostFoundRouter,
  carpoolKids: carpoolKidsRouter,
  mealSharing: mealSharingRouter,
  toolLibrary: toolLibraryRouter,
  skillSwap: skillSwapRouter,
  timeBank: timeBankRouter,
  coworkingSpace: coworkingSpaceRouter,
  parkingShare: parkingShareRouter,
  storageShare: storageShareRouter,
});

export type AppRouter = typeof appRouter;
