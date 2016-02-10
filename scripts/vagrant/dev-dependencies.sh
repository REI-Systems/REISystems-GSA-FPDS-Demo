#!/bin/bash

#echo "Updating Centos ..."
yum -y update

#echo "Install some dependencies..."
#yum -y install yum-utils bzip2 bzip2-devel wget curl tar gcc gcc-c++ fontconfig make http-parser libuv

echo "Enable EPEL Repo ..."
yum -y install epel-release

#echo "Install Develpment Tools ..."
#yum -y groupinstall "Development tools"

echo "Install PostgreSQL ..."
rpm -Uvh http://yum.postgresql.org/9.4/redhat/rhel-6-x86_64/pgdg-centos94-9.4-1.noarch.rpm
yum -y install postgresql94-server postgresql94-contrib

service postgresql-9.4 initdb
service postgresql-9.4 start
chkconfig postgresql-9.4 on

echo "Install Ruby & SASS ..."
yum -y install rubygems
gem install sass

echo "Install latest NodeJS ..."
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum -y install nodejs

echo "Install Bower..."
npm install -g bower

echo "Install Grunt ..."
npm install -g grunt-cli

echo "Install SailsJS ..."
npm install sails -g

if ! type "docker" > /dev/null
then
    echo "Install docker ..."
    curl -sSL https://get.docker.com/ | sh

    echo "Start the docker daemon at boot ..."
    chkconfig docker on
fi

if [ ! -f /etc/sysconfig/docker ] 
then
    echo "Setting docker to use DOCKER_OPTS within daemon (start)..."
    echo "OPTIONS='--exec-opt native.cgroupdriver=cgroupfs'" > /etc/sysconfig/docker
    echo "DOCKER_STORAGE_OPTIONS=''" > /etc/sysconfig/docker-storage
    echo "DOCKER_NETWORK_OPTIONS=''" > /etc/sysconfig/docker-network
fi

echo "Install all dev dependencies Bower & NPM"
cd /var/www/fpds/app
su vagrant -c "npm install"
su vagrant -c "bower install"


#echo "Opening port for dev ..."
/sbin/iptables -I INPUT -p tcp -m tcp --dport 1337 -j ACCEPT
#/sbin/iptables -I INPUT -p tcp -m tcp --dport 35729 -j ACCEPT



#### DATABASE #####
#su postgres
#psql
#create database fpds_demo;

# http://www.unixmen.com/postgresql-9-4-released-install-centos-7/
#vim /var/lib/pgsql/9.4/data/pg_hba.conf
# "local" is for Unix domain socket connections only
#local   all             all                                     md5 #peer
# IPv4 local connections:
#host    all             all             127.0.0.1/32            md5 #ident
#host    all             all             192.168.56.108/24       md5
# IPv6 local connections:
#host    all             all             ::1/128                 md5 #ident

#service postgresql-9.4 restart