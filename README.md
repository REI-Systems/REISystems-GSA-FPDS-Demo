# GSA FPDS Demo


## Install Environment:
####Requirements
You need to have vagrant installed https://www.vagrantup.com/downloads.html, and VirtualBox then install these following tools:

<pre>
$ vagrant plugin install vagrant-vbguest
</pre>

#### Install project locally
Run command lines in order to set up the project in your machine :

<pre>
$ git clone https://github.com/REI-Systems/REISystems-GSA-FPDS-Demo.git
$ cd REISystems-GSA-FPDS-Demo/conf/vagrant
$ vagrant up    #Proceed to next command even this command returns error messages
$ vagrant provision --provision-with shell   #sync your local environment with updated dev dependencies
$ vagrant ssh
$ cd /var/www/fpds
</pre>

After the VM is up and running, these are the following command to use for vagrant to start, shutdown, delete your current VM:

<pre>
$ vagrant up        # Install/Run the VM
$ vagrant halt      # shutdown the VM
$ vagrant destroy   # remove the VM
$ vagrant ssh       # access to your VM (SSH)
</pre>

######Note: the IP address allocated to this new VM Box is 192.168.56.108 and if you have used this IP Address, you can change it in `conf/vagrant/puphpet/config.yaml`

#####Run the application without docker

Inside your vagrant VM, run the following command

<pre>
$ cd /var/www/fpds/app
$ sails lift
</pre>

Browse URL: http://192.168.56.108:1337/


Visit: http://gsa-fpds.reisys.com/
