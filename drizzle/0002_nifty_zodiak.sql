CREATE TABLE `circleMemberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`circleId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('member','moderator','admin') DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `circleMemberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creatorProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(128),
	`category` enum('influencer','artist','educator','musician','developer','other') DEFAULT 'other',
	`totalEarnings` decimal(14,2) DEFAULT '0.00',
	`subscriberCount` int DEFAULT 0,
	`monthlyRevenue` decimal(12,2) DEFAULT '0.00',
	`payoutAddress` varchar(256),
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatorProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datingProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` text,
	`interests` json,
	`lookingFor` enum('friendship','dating','networking','all') DEFAULT 'all',
	`ageRange` varchar(20) DEFAULT '18-99',
	`location` varchar(128),
	`photos` json,
	`isActive` boolean DEFAULT true,
	`compatibilityVector` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `datingProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
	`description` text,
	`dueDate` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liveStreams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hostId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` enum('gaming','music','talk','education','creative','other') DEFAULT 'other',
	`status` enum('scheduled','live','ended','archived') DEFAULT 'scheduled',
	`viewerCount` int DEFAULT 0,
	`peakViewers` int DEFAULT 0,
	`thumbnailUrl` varchar(512),
	`streamKey` varchar(128),
	`startedAt` timestamp,
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `liveStreams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetId` int NOT NULL,
	`action` enum('like','pass','superlike') NOT NULL,
	`isMatch` boolean DEFAULT false,
	`compatibilityScore` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderationReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`targetType` enum('user','post','listing','message','stream') NOT NULL,
	`targetId` int NOT NULL,
	`reason` enum('spam','harassment','fraud','inappropriate','copyright','other') NOT NULL,
	`description` text,
	`status` enum('pending','reviewing','resolved','dismissed') DEFAULT 'pending',
	`resolvedBy` int,
	`resolution` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderationReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`method` enum('crypto','bank','paypal','stripe') DEFAULT 'crypto',
	`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`walletAddress` varchar(256),
	`txHash` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sandboxEnvironments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`type` enum('ai_test','trading_sim','feature_preview','behavior_model') DEFAULT 'ai_test',
	`config` json,
	`status` enum('active','paused','archived') DEFAULT 'active',
	`results` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sandboxEnvironments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduledPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`content` text NOT NULL,
	`mediaUrls` json,
	`scheduledFor` timestamp NOT NULL,
	`status` enum('pending','published','failed','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scheduledPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialCircles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`memberCount` int DEFAULT 0,
	`isPublic` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialCircles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streamMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`type` enum('chat','tip','system','mod') DEFAULT 'chat',
	`amount` decimal(12,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `streamMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userRiskScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` decimal(5,2) DEFAULT '0.00',
	`factors` json,
	`lastCalculated` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userRiskScores_id` PRIMARY KEY(`id`)
);
