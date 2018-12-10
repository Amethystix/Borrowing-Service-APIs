--User table
CREATE TABLE user(
	userId VARCHAR(255) NOT NULL PRIMARY KEY
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
	objectId VARCHAR(255) NOT NULL PRIMARY KEY
	,ownerId VARCHAR(255) NOT NULL REFERENCES user(userId)
	,ownerUsername VARCHAR(255)
	,name VARCHAR(100)
	,description LONGTEXT
	,pictureURL VARCHAR(255) 
	,zipCode INT
	,isReserved TINYINT

);

CREATE TABLE loan(
	loanId INT auto_increment NOT NULL PRIMARY KEY
	,objectId VARCHAR(255) REFERENCES object(objectId)
	,objectName VARCHAR(100)
	,ownerId VARCHAR(255) REFERENCES object(ownerId)
	,ownerUsername VARCHAR(255)
	,loanedById VARCHAR(255) REFERENCES user(userId)
	,loanedByUsername VARCHAR(255)
	,reservedOn DATE
	,returnedOn DATE
);


CREATE TABLE feed(
	feedId INT auto_increment NOT NULL PRIMARY KEY
	,mainPersonUsername VARCHAR(255)
	,mainPersonId VARCHAR(255) REFERENCES user(userId)
	,secondaryPersonUsername VARCHAR(255)
	,secondaryPersonId VARCHAR(255) REFERENCES user(userId)
	,objectName VARCHAR(100)
	,objectId VARCHAR(255) REFERENCES 
	,action VARCHAR(100)
	,timestamp DATETIME
);

/***********************************
	Triggers
************************************/

-- trigger to set an object to reserved when it's loaned
CREATE TRIGGER after_loaned_insert
	AFTER INSERT ON loaned
	FOR EACH ROW
	UPDATE object
		SET reserved = 1
	WHERE objectId = NEW.objectId

-- trigger to set an object to unreserved when it's returned

CREATE TRIGGER before_loaned_update
BEFORE UPDATE ON loaned
FOR EACH ROW
    IF type_name(type_id(NEW.returnedOn)) =="datetime" AND OLD.returnedOn IS NULL
        UPDATE object
            SET isReserved = 0 
        WHERE objectId = NEW.objectId
    END;


--trigger to insert a new listing into the feed table

CREATE TRIGGER after_object_insert
AFTER INSERT ON object
FOR EACH ROW
INSERT INTO feed
    SET mainPersonName = NEW.ownername
    ,mainPersonId = NEW.ownerId
    , secondaryPersonName = NULL
    , secondaryPersonID = NULL
    , objectName = NEW.objectName
    , objectId = NEW.objectId
    , action = "listed"
    ,timestamp = curdatetime()

--trigger to insert a new loaned object into the feed 
CREATE TRIGGER after_loaned_insert_feed
AFTER INSERT ON loaned
FOR EACH ROW FOLLOWS after_loaned_insert
INSERT INTO feed
     SET mainPersonName = NEW.ownername
    , mainPersonId = NEW.ownerId
    , secondaryPersonName = NEW.loaningName
    , secondaryPersonId = NEW.loaningId
    , objectName = NEW.objectName
    , action = "borrowed"
    ,timestamp = curdatetime()

