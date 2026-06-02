CREATE TABLE `aiMemory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentId` int,
	`scope` enum('user','agent','team','organization','global') DEFAULT 'user',
	`key` varchar(256) NOT NULL,
	`value` text NOT NULL,
	`embedding` json,
	`importance` decimal(5,2) DEFAULT '0.50',
	`accessCount` int DEFAULT 0,
	`lastAccessedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiMemory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `apiKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`keyHash` varchar(256) NOT NULL,
	`keyPrefix` varchar(12) NOT NULL,
	`scopes` json,
	`rateLimit` int DEFAULT 1000,
	`usageCount` int DEFAULT 0,
	`lastUsedAt` timestamp,
	`expiresAt` timestamp,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apiKeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `domainEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(128) NOT NULL,
	`source` varchar(64) NOT NULL,
	`actorId` int,
	`entityType` varchar(64),
	`entityId` int,
	`payload` json,
	`metadata` json,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domainEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `errorReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`module` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`stack` text,
	`severity` enum('info','warning','error','fatal') DEFAULT 'error',
	`count` int DEFAULT 1,
	`lastOccurredAt` timestamp DEFAULT (now()),
	`isResolved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `errorReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriberId` varchar(128) NOT NULL,
	`eventType` varchar(128) NOT NULL,
	`webhookUrl` text,
	`isActive` boolean DEFAULT true,
	`lastTriggeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eventSubscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledgeChunks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`content` text NOT NULL,
	`embedding` json,
	`chunkIndex` int DEFAULT 0,
	`tokenCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledgeChunks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledgeDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`content` text NOT NULL,
	`sourceUrl` text,
	`docType` enum('document','webpage','api_doc','faq','policy','manual') DEFAULT 'document',
	`tags` json,
	`chunkCount` int DEFAULT 0,
	`isIndexed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledgeDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metric` varchar(128) NOT NULL,
	`value` decimal(20,4) NOT NULL,
	`tags` json,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platformMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plugins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`developerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`description` text,
	`version` varchar(32) DEFAULT '1.0.0',
	`category` enum('ai','trading','social','analytics','security','utility') DEFAULT 'utility',
	`iconUrl` text,
	`installCount` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0',
	`isPublished` boolean DEFAULT false,
	`isVerified` boolean DEFAULT false,
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plugins_id` PRIMARY KEY(`id`),
	CONSTRAINT `plugins_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `revenueEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('trading_fees','subscriptions','nft_royalties','marketplace','ai_services','staking','ads') NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`currency` varchar(16) DEFAULT 'SKY',
	`userId` int,
	`metadata` json,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revenueEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchIndex` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`content` text,
	`tags` json,
	`authorId` int,
	`score` decimal(10,4) DEFAULT '0',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchIndex_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `threatEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`type` enum('brute_force','suspicious_login','api_abuse','data_exfil','privilege_escalation','anomaly') NOT NULL,
	`severity` enum('low','medium','high','critical') DEFAULT 'medium',
	`description` text,
	`sourceIp` varchar(64),
	`isResolved` boolean DEFAULT false,
	`resolvedBy` int,
	`resolvedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `threatEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `treasuryAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`type` enum('operating','reserve','staking','grants','development') DEFAULT 'operating',
	`balance` decimal(20,8) DEFAULT '0',
	`currency` varchar(16) DEFAULT 'SKY',
	`lastAuditAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `treasuryAccounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceName` varchar(128),
	`deviceType` varchar(32),
	`browser` varchar(64),
	`os` varchar(64),
	`ipAddress` varchar(64),
	`location` varchar(128),
	`isCurrent` boolean DEFAULT false,
	`lastActiveAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `userSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`url` text NOT NULL,
	`events` json,
	`secret` varchar(256),
	`isActive` boolean DEFAULT true,
	`failCount` int DEFAULT 0,
	`lastTriggeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflowRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`status` enum('running','completed','failed','cancelled') DEFAULT 'running',
	`triggeredBy` varchar(128),
	`input` json,
	`output` json,
	`error` text,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `workflowRuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`trigger` enum('manual','event','schedule','webhook','ai') DEFAULT 'manual',
	`triggerConfig` json,
	`steps` json,
	`isActive` boolean DEFAULT false,
	`lastRunAt` timestamp,
	`runCount` int DEFAULT 0,
	`successCount` int DEFAULT 0,
	`failCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `memory_userId_idx` ON `aiMemory` (`userId`);--> statement-breakpoint
CREATE INDEX `events_type_idx` ON `domainEvents` (`type`);--> statement-breakpoint
CREATE INDEX `events_source_idx` ON `domainEvents` (`source`);--> statement-breakpoint
CREATE INDEX `chunks_docId_idx` ON `knowledgeChunks` (`documentId`);--> statement-breakpoint
CREATE INDEX `search_entity_idx` ON `searchIndex` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `threats_userId_idx` ON `threatEvents` (`userId`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `userSessions` (`userId`);--> statement-breakpoint
CREATE INDEX `runs_workflowId_idx` ON `workflowRuns` (`workflowId`);