create table users
(
    id    TEXT not null primary key,
    username TEXT not null unique,
    hashed_password TEXT
);
create table sessions
(
    id         TEXT    not null primary key,
    expires_at INTEGER not null,
    user_id    TEXT    not null
);
