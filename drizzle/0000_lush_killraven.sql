CREATE TABLE `aiAgents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`persona` varchar(64) NOT NULL,
	`systemPrompt` text,
	`model` varchar(64) DEFAULT 'gpt-4o-mini',
	`isActive` boolean DEFAULT true,
	`isPublic` boolean DEFAULT false,
	`totalEarnings` decimal(20,8) DEFAULT '0',
	`totalTasks` int DEFAULT 0,
	`successRate` decimal(5,2) DEFAULT '100.00',
	`capabilities` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiAgents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentId` int,
	`title` varchar(256),
	`persona` varchar(64) DEFAULT 'oracle',
	`messages` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversationMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('admin','member') DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversationMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128),
	`isGroup` boolean DEFAULT false,
	`isEncrypted` boolean DEFAULT true,
	`avatarUrl` text,
	`lastMessageAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creatorContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`type` enum('video','audio','article','image','course') DEFAULT 'article',
	`contentUrl` text,
	`thumbnailUrl` text,
	`isPremium` boolean DEFAULT false,
	`price` decimal(20,8) DEFAULT '0',
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`earnings` decimal(20,8) DEFAULT '0',
	`isPublished` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatorContent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `digitalTwins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128),
	`personality` json,
	`tradingStyle` varchar(64),
	`riskTolerance` enum('conservative','moderate','aggressive') DEFAULT 'moderate',
	`automatedTrading` boolean DEFAULT false,
	`automatedPosting` boolean DEFAULT false,
	`totalEarnings` decimal(20,8) DEFAULT '0',
	`isActive` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `digitalTwins_id` PRIMARY KEY(`id`),
	CONSTRAINT `digitalTwins_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizerId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`imageUrl` text,
	`category` varchar(64),
	`startAt` timestamp NOT NULL,
	`endAt` timestamp,
	`location` varchar(256),
	`isVirtual` boolean DEFAULT false,
	`streamUrl` text,
	`maxAttendees` int,
	`attendeeCount` int DEFAULT 0,
	`ticketPrice` decimal(20,8) DEFAULT '0',
	`currency` varchar(16) DEFAULT 'SKY',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `featureFlags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`isEnabled` boolean DEFAULT false,
	`rolloutPercentage` int DEFAULT 0,
	`conditions` json,
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `featureFlags_id` PRIMARY KEY(`id`),
	CONSTRAINT `featureFlags_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `follows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboardEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` enum('trading','social','governance','creator','referral','overall') NOT NULL,
	`score` decimal(20,8) DEFAULT '0',
	`rank` int,
	`period` varchar(16) DEFAULT 'weekly',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboardEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` enum('digital','physical','service','nft','subscription') DEFAULT 'digital',
	`price` decimal(20,8) NOT NULL,
	`currency` varchar(16) DEFAULT 'SKY',
	`imageUrls` json,
	`tags` json,
	`stock` int DEFAULT 1,
	`sold` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`mediaUrl` text,
	`mediaType` varchar(32),
	`isRead` boolean DEFAULT false,
	`isDeleted` boolean DEFAULT false,
	`replyToId` int,
	`reactions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nfts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`creatorId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`animationUrl` text,
	`collection` varchar(128),
	`tokenId` varchar(128),
	`contractAddress` varchar(128),
	`network` varchar(32) DEFAULT 'ethereum',
	`rarity` enum('common','uncommon','rare','epic','legendary') DEFAULT 'common',
	`attributes` json,
	`price` decimal(20,8),
	`currency` varchar(16) DEFAULT 'ETH',
	`isListed` boolean DEFAULT false,
	`isMinted` boolean DEFAULT false,
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nfts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('like','comment','follow','mention','trade','governance','reward','system','message') NOT NULL,
	`title` varchar(256) NOT NULL,
	`body` text,
	`data` json,
	`isRead` boolean DEFAULT false,
	`actorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`listingId` int NOT NULL,
	`quantity` int DEFAULT 1,
	`totalPrice` decimal(20,8) NOT NULL,
	`currency` varchar(16) DEFAULT 'SKY',
	`status` enum('pending','paid','shipped','delivered','disputed','refunded') DEFAULT 'pending',
	`txHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `postLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`content` text NOT NULL,
	`mediaUrls` json,
	`tags` json,
	`likes` int DEFAULT 0,
	`reposts` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`views` int DEFAULT 0,
	`aiScore` decimal(5,2) DEFAULT '0',
	`isNFT` boolean DEFAULT false,
	`nftTokenId` varchar(128),
	`isPinned` boolean DEFAULT false,
	`isHidden` boolean DEFAULT false,
	`parentId` int,
	`repostId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`category` enum('protocol','treasury','feature','partnership','emergency') DEFAULT 'feature',
	`status` enum('draft','active','passed','rejected','executed') DEFAULT 'active',
	`votesFor` int DEFAULT 0,
	`votesAgainst` int DEFAULT 0,
	`votesAbstain` int DEFAULT 0,
	`quorum` int DEFAULT 1000,
	`requiredApproval` decimal(5,2) DEFAULT '51.00',
	`endsAt` timestamp NOT NULL,
	`executedAt` timestamp,
	`onChainId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredId` int NOT NULL,
	`reward` decimal(20,8) DEFAULT '0',
	`status` enum('pending','active','rewarded') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `securityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`event` varchar(128) NOT NULL,
	`severity` enum('info','warning','critical') DEFAULT 'info',
	`ipAddress` varchar(64),
	`userAgent` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `securityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stakingPositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`lockPeriodDays` int DEFAULT 30,
	`apy` decimal(5,2) NOT NULL,
	`rewards` decimal(20,8) DEFAULT '0',
	`status` enum('active','unlocking','completed') DEFAULT 'active',
	`stakedAt` timestamp NOT NULL DEFAULT (now()),
	`unlocksAt` timestamp NOT NULL,
	`claimedAt` timestamp,
	CONSTRAINT `stakingPositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriberId` int NOT NULL,
	`creatorId` int NOT NULL,
	`tier` enum('basic','supporter','vip') DEFAULT 'basic',
	`price` decimal(20,8) NOT NULL,
	`currency` varchar(16) DEFAULT 'SKY',
	`status` enum('active','cancelled','expired') DEFAULT 'active',
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pair` varchar(32) NOT NULL,
	`side` enum('buy','sell') NOT NULL,
	`orderType` enum('market','limit','stop') DEFAULT 'market',
	`amount` decimal(20,8) NOT NULL,
	`price` decimal(20,8) NOT NULL,
	`total` decimal(20,8) NOT NULL,
	`fee` decimal(20,8),
	`status` enum('open','filled','cancelled','partial') DEFAULT 'open',
	`filledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('send','receive','buy','sell','stake','unstake','reward','fee','swap') NOT NULL,
	`asset` varchar(16) NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`amountUsd` decimal(20,2),
	`toAddress` varchar(128),
	`fromAddress` varchar(128),
	`txHash` varchar(128),
	`status` enum('pending','confirmed','failed') DEFAULT 'pending',
	`network` varchar(32),
	`fee` decimal(20,8),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin','creator','moderator') NOT NULL DEFAULT 'user',
	`username` varchar(64),
	`bio` text,
	`avatarUrl` text,
	`bannerUrl` text,
	`walletAddress` varchar(128),
	`solanaAddress` varchar(64),
	`skyBalance` decimal(20,8) DEFAULT '0',
	`reputationScore` int DEFAULT 0,
	`level` int DEFAULT 1,
	`xp` int DEFAULT 0,
	`isVerified` boolean DEFAULT false,
	`isOnline` boolean DEFAULT false,
	`referralCode` varchar(16),
	`referredBy` int,
	`subscriptionTier` enum('free','pro','elite','founder') DEFAULT 'free',
	`subscriptionExpiresAt` timestamp,
	`twoFactorEnabled` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`userId` int NOT NULL,
	`choice` enum('for','against','abstain') NOT NULL,
	`votingPower` decimal(20,8) NOT NULL,
	`txHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skyBalance` decimal(20,8) DEFAULT '0',
	`ethBalance` decimal(20,8) DEFAULT '0',
	`solBalance` decimal(20,8) DEFAULT '0',
	`usdcBalance` decimal(20,8) DEFAULT '0',
	`btcBalance` decimal(20,8) DEFAULT '0',
	`stakedSky` decimal(20,8) DEFAULT '0',
	`stakingRewards` decimal(20,8) DEFAULT '0',
	`totalValueUsd` decimal(20,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `messages_convId_idx` ON `messages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `nfts_ownerId_idx` ON `nfts` (`ownerId`);--> statement-breakpoint
CREATE INDEX `notif_userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `posts_authorId_idx` ON `posts` (`authorId`);--> statement-breakpoint
CREATE INDEX `sec_userId_idx` ON `securityLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `trades_userId_idx` ON `trades` (`userId`);--> statement-breakpoint
CREATE INDEX `tx_userId_idx` ON `transactions` (`userId`);