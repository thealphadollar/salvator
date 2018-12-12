#!/bin/bash
#Ask the user to add or remove the cron job

#Check if the cron package is installed and if not install it
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cron|grep "install ok installed")
echo "Checking for cron: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Cron not installed. Setting up cron"
  sudo apt-get --force-yes --yes install cron
fi

#Locate install path of node
nodel=$(which node)

echo "Press 1 to add a new cron job, 2 to delete existing or 3 te view all cron jobs"
#reads user operation from terminal
read op
if [ $op -eq 1 ];then 
  read -p "Enter time in hh mm format " h m

#The following line writes into the crontab
#crontab-l lists the current cron jobs, cat prints it,
#echo prints the new command and crontab - adds all the printed stuff into crontab file

  crontab -l | { cat; echo "$m $h * * *  $nodel $PWD/index.js"; } | crontab -
  crontab -l
elif [ $op -eq 2 ];then

#This reads any crontab entries for the script (uses grep on the crontab file) and effectively
#overwrites it to delete the corresponding cron jobs.

  crontab -l | grep -v "$nodel $PWD/index.js"  | crontab -
  echo "Cron job deleted successfully"
elif [ $op -eq 3 ];then
  crontab -l
fi
