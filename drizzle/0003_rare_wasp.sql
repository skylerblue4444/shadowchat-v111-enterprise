CREATE TABLE `burns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coin` enum('DOGE','XMR','USDT','SHADOW','TRUMP','SKY444') NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`reason` enum('deflationary','burn_to_earn','governance','event','voluntary') DEFAULT 'voluntary',
	`rewardEarned` decimal(20,8) DEFAULT '0',
	`txHash` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `burns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `minerPositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`poolId` int NOT NULL,
	`hashRate` decimal(20,4) DEFAULT '0',
	`totalMined` decimal(20,8) DEFAULT '0',
	`pendingRewards` decimal(20,8) DEFAULT '0',
	`isActive` boolean DEFAULT true,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`lastPayoutAt` timestamp,
	CONSTRAINT `minerPositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `miningPools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`coin` enum('DOGE','XMR','USDT','SHADOW','TRUMP','SKY444') NOT NULL,
	`algorithm` varchar(64) DEFAULT 'RandomX',
	`totalHashRate` decimal(20,4) DEFAULT '0',
	`totalMiners` int DEFAULT 0,
	`blockReward` decimal(20,8) DEFAULT '0',
	`difficulty` decimal(20,4) DEFAULT '1',
	`status` enum('active','maintenance','offline') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `miningPools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priceAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coin` enum('DOGE','XMR','USDT','SHADOW','TRUMP','SKY444') NOT NULL,
	`targetPrice` decimal(20,8) NOT NULL,
	`direction` enum('above','below') NOT NULL,
	`isTriggered` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `priceAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`coin` enum('DOGE','XMR','USDT','SHADOW','TRUMP','SKY444') NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`message` text,
	`context` enum('post','stream','chat','profile','content') DEFAULT 'post',
	`contextId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tips_id` PRIMARY KEY(`id`)
);
