CREATE TABLE `cardioSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workoutId` int,
	`userId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`duration` int NOT NULL,
	`distance` int,
	`avgHeartRate` int,
	`pace` int,
	`caloriesBurned` int,
	`date` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cardioSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `workouts` ADD `duration` int;--> statement-breakpoint
ALTER TABLE `workouts` ADD `sleepHours` int;--> statement-breakpoint
ALTER TABLE `workouts` ADD `avgHeartRate` int;--> statement-breakpoint
ALTER TABLE `workouts` ADD `caloriesBurned` int;