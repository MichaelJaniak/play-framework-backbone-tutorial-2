# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table contact (
  id                        varchar(255) not null,
  first_name                varchar(255),
  last_name                 varchar(255),
  email_address             varchar(255),
  description               varchar(255),
  constraint pk_contact primary key (id))
;

create sequence contact_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists contact;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists contact_seq;

