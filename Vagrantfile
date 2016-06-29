# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.boot_timeout = 200
  config.vm.network "private_network", ip: "192.168.10.10"
  config.vm.network "public_network"
  config.vm.hostname = "mvshop.loc"

  config.vm.synced_folder '.', '/var/www/mvshop', nfs: true
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider "virtualbox" do |v|
    v.gui = false

    v.cpus = "2"
    v.name = "mvshop.box"
    v.customize ["modifyvm", :id, "--memory",               "1024"]
    v.customize ["modifyvm", :id, "--cpuexecutioncap",      "95"]
    v.customize ["modifyvm", :id, "--natdnshostresolver1",  "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1",         "on"]
  end

  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  config.vm.provision :shell, path: "vagrant/php.sh"
  config.vm.provision :shell, path: "vagrant/nginx.sh"
  config.vm.provision :shell, path: "vagrant/mongodb.sh"
  config.vm.provision :shell, path: "vagrant/nodejs.sh"

  config.vm.provision :shell, :inline => <<-EOT
       echo 'LC_ALL="en_US.UTF-8"'  >  /etc/default/locale
  EOT
  #RUN SERVER
  config.vm.provision :shell, path: "vagrant/app.sh", run: "always", privileged: false
end
