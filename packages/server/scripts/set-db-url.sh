#!/bin/sh

if [ -z $DATABASE_URL ]
then
  echo Db is not set, setting
  DATABASE_URL=$(cat .env | grep DATABASE_URL | awk -F '\"' '{print $2}')
  echo $DATABASE_URL
else
  echo db is set
  echo $DATABASE_URL
fi
