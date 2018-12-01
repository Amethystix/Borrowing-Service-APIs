--User table
CREATE TABLE user(
	userId INT NOT NULL PRIMARY KEY
	,email VARCHAR(100)
	,username VARCHAR(100)
	,password VARCHAR(255)
	,firstName VARCHAR(100)
	,lastName VARCHAR(100)
	,joinedOn DATETIME
);

CREATE TABLE friend(
	friend1Id INT REFERENCES user(userId)
	,friend2Id INT REFERENCES user(userId)
	,PRIMARY KEY (friend1Id, friend2Id)
);

CREATE TABLE object(
	objectId INT NOT NULL PRIMARY KEY
	,ownerId INT NOT NULL REFERENCES user(userId)
	,ownerName VARCHAR(255)
	,name VARCHAR(100)
	,picture VARCHAR(255) 
	,price DECIMAL(20, 4)
	,latitude DECIMAL(30, 15)
	,longitude DECIMAL(30, 15)
	,isReserved TINYINT

);

CREATE TABLE loan(
	objectId INT REFERENCES object(objectId)
	,loanedBy INT REFERENCES user(userId)
	,loanedOn DATE
	,returnedOn DATE
	,eventId INT UNIQUE
);

CREATE TABLE eventType(
	eventTypeId INT AUTO INCREMENT NOT NULL PRIMARY KEY
	,eventDesc VARCHAR(255)
);

CREATE TABLE feed(
	userId INT REFERENCES user(userId) -- will be the main userId, who posted or who rented the object

);