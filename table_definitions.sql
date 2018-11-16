--User table
CREATE TABLE user(
	userId INT NOT NULL PRIMARY KEY
	,email VARCHAR(100)
	,username VARCHAR(100)
	,password VARCHAR(255)
	,firstName VARCHAR(100)
	,lastNAme VARCHAR(100)
	,dob DATE
);

CREATE TABLE friend(
	friend1Id INT REFERENCES user(userId)
	,friend2Id INT REFERENCES user(userId)
	,PRIMARY KEY (friend1Id, friend2Id)
);

CREATE TABLE object(
	objectId INT NOT NULL PRIMARY KEY
	,ownerId INT NOT NULL REFERENCES user(userId)
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
);