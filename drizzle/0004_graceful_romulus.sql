CREATE TABLE `exerciseLibrary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`muscleGroup` varchar(100) NOT NULL,
	`equipment` varchar(100),
	`difficulty` enum('iniciante','intermediario','avancado') DEFAULT 'intermediario',
	`mediaUrl` text NOT NULL,
	`mediaType` enum('gif','image') DEFAULT 'gif',
	`description` text,
	`isGlobal` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exerciseLibrary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userCustomExercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`muscleGroup` varchar(100) NOT NULL,
	`equipment` varchar(100),
	`difficulty` enum('iniciante','intermediario','avancado') DEFAULT 'intermediario',
	`mediaUrl` text,
	`mediaType` enum('gif','image') DEFAULT 'image',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userCustomExercises_id` PRIMARY KEY(`id`)
);
