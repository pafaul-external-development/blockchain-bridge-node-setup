# blockchain-bridge-node-setup

## Description
  This repository is for nodes setup for BitcoinVault and Gleecs using Bash scripts and Ansible

## Required setup
  To use existing scripts you should modify two files: \
  1. ansible/hosts
  2. ansible/download_links
  
### ansible/download_links
  This file stores two variables:
  ```bash
  BTCV_LINK=        #BitcoinVault source download link
  GLEECS_LINK=      #Gleecs binaries download link
  ```
  You must copy/paste two links after equals sign:
  ```bash
  BTCV_LINK=https://github.com/etc/etc/etc
  GLEECS_LINK=https://github.com/etc/etc/etc
  ```
  
### ansible/hosts
  This file is used for Ansible playbooks\
  It contains 6 sections (marked with []):
  ```
  [Host]
  ip_address
  [gleecs]
  ip_address
  [btcv]
  ip_address
  
  [Host:vars]
  ansible_user=
  ansible_password=
  ansible_sudo_pass=
  ansible_python_interpreter=/usr/bin/python3
  
  [gleecs:vars]
  ansible_user=
  ansible_password=
  ansible_sudo_pass=
  ansible_python_interpreter=/usr/bin/python3
  
  [btcv:vars]
  ansible_user=
  ansible_password=
  ansible_sudo_pass=
  ansible_python_interpreter=/usr/bin/python3
  ```
  
  Sections description: \
    ```[Host]``` and ```[Host:vars]``` : for storing ip and variables required for Host setup \
    ```[gleecs]``` and ```[gleecs:vars]``` : for storing ip and variables required for Gleecs setup \
    ```[btcv]``` and ```[btcv:vars]``` : for storing ip and variables required for BitcoinVault setup \
  
  vars section description: \
    ```ansible_user``` : user which will be used for setup \
    ```ansible_password``` : password of ```ansible_user``` \
    ```ansible_sudo_pass``` : password for becoming sudo (may be the same as ```ansible_password``` if ```ansible_user``` is in ```sudoers``` group) \
    
After finishing setup, we can continue.

## Encrypting ansible/hosts
### Using new password

To encrypt ansible/hosts file which contains passwords:
```bash
cd ansible/
bash store_passwords.sh -f hosts
```

You will be asked to input Vault password. This password will be used later to run setup scripts.

### Using password file
To encrypt ansible/hosts file using existing vault password file:
```bash
cd ansible/
bash store_passwords.sh -f hosts -p tag@/path/to/file
```

### No encryption
This step can be skipped if this is not needed.

## Nodes setup

After previous step are completed, you can start nodes configuration. \
Script ```ansible/run_setup.sh``` is used. \
It accepts following options: \
    ```-b, --btcv```           Run btcv installation \
    ```-g, --glecs```          Run gleecs installation \
    ```-p, --passwd-file```    File with password for vault. Format: tag@filename \
    ```--no-encryption```      Disables encryption options \
    ```--host```               Run host setup \
    ```-h, --help```           Show this message and exit \

If there was no ecnryption of ansible/hosts file parameter ```--no-encryption``` must be passed. \
Otherwise you will be asked for Ansible vault password.

To run setup of BitcoinValut and Gleecs nodes with no encryption of ansible/hosts:
```bash
cd ansible/
bash run_setup.sh -g -b --no-encryption
```
