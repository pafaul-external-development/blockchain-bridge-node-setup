FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y openssh-client openssh-server sudo
# RUN ssh-keygen
RUN mkdir /var/run/sshd
# RUN echo 'root:password' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

RUN adduser --disabled-password --gecos "" container
RUN echo "container:password" | chpasswd
RUN usermod -aG sudo container

RUN apt update

RUN apt install -y software-properties-common
RUN add-apt-repository -y universe
RUN sudo add-apt-repository -y ppa:bitcoin/bitcoin
RUN apt update
RUN sudo apt-get install -y libdb4.8-dev libdb4.8++-dev


CMD [ "/usr/sbin/sshd", "-D" ]
EXPOSE 22
EXPOSE 8332
EXPOSE 8333
EXPOSE 18332
EXPOSE 18333
