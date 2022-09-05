-- create database
create table user(
id int not null auto_increment,
image blob,
name varchar(50) not null,
bio varchar(450) ,
phone varchar(15) ,
email varchar(100) not null,
password varchar(100) not null,
primary key(id)
);
