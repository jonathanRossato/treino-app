CREATE TABLE `templateExercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sets` int NOT NULL,
	`reps` int NOT NULL,
	`weight` int NOT NULL,
	`notes` text,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templateExercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workoutTemplates_id` PRIMARY KEY(`id`)
);
