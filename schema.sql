create table users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    hash VARCHAR(12) NOT NULL,
    birthday DATE,
    signUpDate TIMESTAMP DEFAULT NOW()
);

INSERT INTO users(username, hash, birthday) VALUES ('sho', 'super', '11-11-2020');
INSERT INTO users(username, hash, birthday) VALUES ('liya', 'super123', '02-11-1990');exit
