#!/bin/bash
#Ask the user to add or remove the cron job

PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cron|grep "install ok installed")
echo "Checking for cron: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Cron not installed. Setting up cron"
  sudo apt-get --force-yes --yes install cron
fi


echo "Press 1 to add a new cron job, 2 to delete existing or 3 te view all cron jobs"
read op
if [ $op -eq 1 ];then 
  read -p "Enter time in hh mm format " h m
  crontab -l | { cat; echo "$m $h * * *  /usr/local/bin/node $PWD/index.js"; } | crontab -
  crontab -l
elif [ $op -eq 2 ];then
  crontab -l | grep -v "node $PWD/index.js"  | crontab -
  echo "Cron job deleted successfully"
elif [ $op -eq 3 ];then
  crontab -l
fi
