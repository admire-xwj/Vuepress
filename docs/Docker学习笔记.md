# Docker学习笔记（狂神说Java 基础+进阶）

## 视频源

【狂神说Java】Docker最新超详细版教程通俗易懂 https://www.bilibili.com/video/BV1og4y1q7M4/
【狂神说Java】Docker进阶篇超详细版教程通俗易懂 https://www.bilibili.com/video/BV1kv411q7Qc/

## Docker概述

> 聊聊Docker

Docker基于Go语言开发

Docker官网：https://www.docker.com/

文档地址：https://docs.docker.com/

仓库地址：https://hub.docker.com/

> DevOps（开发、运维）

#### **应用更快速的交付和部署**

 传统：一堆帮助文档，安装程序

Docker：打包镜像发布测试，一键运行

#### **更便捷的升级和扩容**

使用了Docker之后，我们部署应用就像搭积木一样！

项目打包为一个镜像。扩展 服务器A！ 服务器B

#### **更简单的系统运维**

在容器化之后，我们的开发，测试环境都是高度一致的。

#### **更高效的计算资源利用：**

Docker是内核j级别的虚拟化吗，可以在一个物理机上运行很多容器实例，服务器性能可以被压榨到极致



只要学不死，就往死里学！

## Docker安装

#### Docker的基本组成

<img src="https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210607223549.webp" alt="u=1327091424,3483581477&fm=26&fmt=auto&gp=0"  />

**镜像（image）：**

Docker镜像就好比是一个模板，可以通过这个模板来创建容器服务，tomcat镜像===>run==>tomcat01容器（作为服务器使用），通过这个镜像可以创建多个容器（最终服务它运行或者项目运行就是在容器中）

**容器（container）：**

Docker利用容器技术，独立运行一个或者一组应用，通过镜像来创建的。

启动，停止，删除，基本命令！

目前就可以把这个容器理解为就是一个简单的linux系统

**仓库（repository）：**

仓库是寻访镜像的地方！

分为公有仓库和私有仓库

Docker Hub（默认是国外的）

阿里云。。。都有容器服务器（配置镜像加速！）

#### 安装Docker

> 环境准备

1、需要会一点点linux基础

2、Centos 8

3、使用Xshell连接远程服务器操作！

> 环境查看（我使用的是阿里云）

```shell
# 系统内核是3.10以上的
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# uname -r
4.18.0-240.22.1.el8_3.x86_64
```

```shell
# 系统版本
[root@iZ2zeebk9qd965c3j7ezr2Z /]# cat /etc/os-release 
NAME="CentOS Linux"
VERSION="8"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="8"
PLATFORM_ID="platform:el8"
PRETTY_NAME="CentOS Linux 8"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:8"
HOME_URL="https://centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"
CENTOS_MANTISBT_PROJECT="CentOS-8"
CENTOS_MANTISBT_PROJECT_VERSION="8"

```

> 安装

帮助文档（用于阅读官方文档）：

```shell
# 1、卸载旧的版本
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
                  
# 2、需要的安装包
yum install -y yum-utils

# 3、设置镜像的仓库
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo	  # 默认是国外的(不使用它)
# aliyun仓库地址    
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo  # 推荐使用aliyun
    
# 更新yum软件包索引
# yum update
yum makecache fast (Centos 7)
yum makecache (Centos 8)
	
# 4、安装docker(最新版) docker-ce 社区版  ee 企业版
yum install docker-ce docker-ce-cli containerd.io

# 5、 查看docker版本，验证是否验证成功
docker version
docker -v

# 6、启动docker
systemctl start docker

# 7、hello-world(本地没有，自动拉取)
docker run hello-world

# 8、查看下载的hello-word镜像
docker images
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d1165f221234   3 months ago   13.3kB

```

> 卸载Docker

```shell
# 1、卸载依赖
yum remove docker-ce docker-ce-cli containerd.io

# 2、删除资源
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
# /var/lib/docker docker默认工作路径
```

## 阿里云镜像加速

#### 1、登录阿里云，打开控制台

#### 2、容器镜像服务

![1623159512(1)](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210608214109.png)

#### 3、配置使用

您可以通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xn2u8sgi.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### 4、底层原理

Docker是怎么工作的？

Docker是一个C/S(Client-Server)结构的系统,Docker的守护进程运行在主机上.通过Socket从客户端访问!

DockerServer接收到Docker-Client的指令,就会执行这个命令!

![20200619182647757](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210608220023.png)

Docker为什么比VM快?

​		1、Docker有着比虚拟机更少的抽象层

​		2、Docker利用的是宿主机的内核,vm需要的是Guest OS

![aHR0cHM6Ly9zczEuYmRzdGF0aWMuY29tLzcwY0Z1WFNoX1ExWW54R2twb1dLMUhGNmhoeS9pdC91PTE0ODQyNDAxNzIsMTcwMjc1MjA3MSZmbT0yNiZncD0wLmpwZw](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210608220350.png)

所以说,新建一个容器的时候,docker不需要像虚拟机一样重新安装一个操作系统内核,虚拟机是加载Guest OS,分钟级别的,而docker是利用宿主机的操作系统,省略了这个复杂的过程，秒级。

## Docker的常用命令

#### 帮助命令

```shell
docker version # docker版本 
docker info # 显示docker的系统信息,包括镜像和容器的数量
docker [命令] --help  # 查看某个具体的命令

```

帮助文档地址（官网）：https://docs.docker.com/engine/reference/commandline/docker/

#### 镜像命令

**docker images 查看下载的所有镜像**

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d1165f221234   3 months ago   13.3kB

#解释
REPOSITORY 镜像的仓库名
TAG        镜像的标签
IMAGE ID   镜像ID
CREATED    镜像创建时间
SIZE       镜像的大小

#可选项
Options:
  -a, --all             # 列出所有镜像
  -q, --quiet           # 只显示镜像ID
```

**docker search 搜索镜像**

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker search mysql
NAME         DESCRIPTION                                      STARS     OFFICIAL   AUTOMATED
mysql        MySQL is a widely used, open-source relation…    10966     [OK]       
mariadb      MariaDB Server is a high performing open sou…    4147      [OK]    

# 可选项,通过收藏来过滤
--filter=stars=3000 # 搜索出来的镜像收藏就是大于3000的
```

**docker pull 下载镜像**

```shell
# 下载镜像  docker pull 镜像名[:tag]
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker pull mysql
Using default tag: latest 	 # 如果不写tag 默认使用最新版本
latest: Pulling from library/mysql
69692152171a: Pull complete 	# 分层下载,docker image核心 联合文件系统
1651b0be3df3: Pull complete 
951da7386bc8: Pull complete 
0f86c95aa242: Pull complete 
37ba2d8bd4fe: Pull complete 
6d278bb05e94: Pull complete 
497efbd93a3e: Pull complete 
f7fddf10c2c2: Pull complete 
16415d159dfb: Pull complete 
0e530ffc6b73: Pull complete 
b0a4a1a77178: Pull complete 
cd90f92aa9ef: Pull complete 
Digest: sha256:d50098d7fcb25b1fcb24e2d3247cae3fc55815d64fec640dc395840f8fa80969 # 签名
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest  # 真实地址

# docker pull mysql 等价于 dicker pull docker.io/library/mysql:latest

#指定版本下载
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker pull mysql:5.7
5.7: Pulling from library/mysql
69692152171a: Already exists 	# 已经存在的部门,分层下载,docker image核心 联合文件系统
1651b0be3df3: Already exists 
951da7386bc8: Already exists 
0f86c95aa242: Already exists 
37ba2d8bd4fe: Already exists 
6d278bb05e94: Already exists 
497efbd93a3e: Already exists 
a023ae82eef5: Pull complete 
e76c35f20ee7: Pull complete 
e887524d2ef9: Pull complete 
ccb65627e1c3: Pull complete 
Digest: sha256:a682e3c78fc5bd941e9db080b4796c75f69a28a8cad65677c23f7a9f18ba21fa
Status: Downloaded newer image for mysql:5.7
docker.io/library/mysql:5.7

```

**docker rmi 删除镜像**

```shell
# docker rmi -f 镜像id
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker rmi -f 2c9028880e58	# 删除指定镜像
# docker rmi -f 容器id 容器id
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker rmi -f c0cdc95609f1 d1165f221234 	# 删除多个容器
# docker rmi -f $(docker images -aq)
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker rmi -f $(docker images -aq)	# 删除全部容器
```

#### 容器命令

**说明 : 有了镜像才可以创建容器，llinux，下载一个centos镜像来测试学习**

```shell
docker pull centos
```

**新建容器并启动**

```shell
docker run [可选参数] [镜像名/镜像id]

#参数说明
--name=""  容器名字 用于区分容器
-d         后台方式运行
-it        使用交互方式运行,进入容器查看内容
-p	       指定容器的端口 -p 8080:8080  
	-p  ip:主机端口:容器端口
	-p  主机端口:容器端口 (常用)
	-p  容器端口
-P(大写)    随机指定端口

#测试,启动并进入容器
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -it centos /bin/bash

# 从容器中退回主机
[root@1085d25733b3 /]# exit

```

**列出所有运行的容器**

```shell
docker ps	# 查看当前正在运行的容器
-a	# 列出当前正在运行的容器+历史运行过的容器
-n=?# 显示最近创建的容器
-q	# 只显示容器的编号
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps -a
CONTAINER ID  IMAGE         COMMAND     CREATED       STATUS           PORTS   NAMES
1085d25733b3  centos        "/bin/bash" 4 minutes ago 3 minutes ago            happy_leavitt
c9f121979492  d1165f221234  "/hello"    2 hours ago   2 hours ago              relaxed_poincare

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps -a -n=1 #只显示一个
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS          PORTS   NAMES
1085d25733b3   centos    "/bin/bash"   8 minutes ago   7 minutes ago           happy_leavitt

```

**退出容器**

```shell
exit #直接容器停止并退出
ctrl + p + q # 容器不停止退出
```

**删除容器**

```shell
docker rm 容器id		# 删除指定容器,不能删除正在运行的容器，如果强制删除 rm -f
docker rm -f $(docker ps -aq) # 递归删除所有的容器
docker ps -a -q|xargs docker rm # 递归删除所有的容器(linux命令)
```

**启动和停止容器的操作**

```shell
docker start 容器id    # 启动容器
docker restart 容器id  # 重启容器
docker stop 容器id	 # 停止当前正在运行的容器
docker kill 容器id 	 # 强制停止当前容器
```

#### 常用的其他命令

**后台启动容器**

```shell
# docker run -d 镜像名
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -d centos
2deef8edd375a1c777c62fa5be105794ca07510092c5a3c0b14e339a1fb8d834
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

# 问题 docker ps 发现 centos 停止了

# 常见的坑: docker容器后台运行,就必须要有一个前台进程,docker发现没有应用,就会自动停止
# nginx, 容器启动后,发现自己没有提供服务,就会立刻停止,就是没有程序了
```

**查看日志**

```shell
docker logs -f -t [容器id]

# 显示日志
-tf [容器id]			  # 显示日志
--tail number [容器id]  # 显示指定条数的日志

```

**查看容器中进程信息**

```	shell
# docker top [容器id] 
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker top 09d66f423e39
UID       PID          PPID        C         STIME        TTY         TIME            CMD
root      35960        35939       0         23:16        pts/0       00:00:00        /bin/bash

```

**查看镜像元数据**

```shell
# 命令
docker inspect [容器id]

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker inspect 09d66f423e39
[
    {
        "Id": "09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e",
        "Created": "2021-06-08T15:16:57.487123864Z",
        "Path": "/bin/bash",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 35960,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2021-06-08T15:16:58.015253591Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:300e315adb2f96afe5f0b2780b87f28ae95231fe3bdd1e16b9ba606307728f55",
        "ResolvConfPath": "/var/lib/docker/containers/09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e/hostname",
        "HostsPath": "/var/lib/docker/containers/09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e/hosts",
        "LogPath": "/var/lib/docker/containers/09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e/09d66f423e39747774273740d504c15fafbf3b0e6f55cc37df64fa1343babc3e-json.log",
        "Name": "/recursing_zhukovsky",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "host",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/4ac829aacc377225ffd72fdc2dcff44e34c1a3dd6977fa8ecb1f866946a65286-init/diff:/var/lib/docker/overlay2/ee38f46cf1497877513398d76df712f5bfcf473a200000e2fab2877e07570a8d/diff",
                "MergedDir": "/var/lib/docker/overlay2/4ac829aacc377225ffd72fdc2dcff44e34c1a3dd6977fa8ecb1f866946a65286/merged",
                "UpperDir": "/var/lib/docker/overlay2/4ac829aacc377225ffd72fdc2dcff44e34c1a3dd6977fa8ecb1f866946a65286/diff",
                "WorkDir": "/var/lib/docker/overlay2/4ac829aacc377225ffd72fdc2dcff44e34c1a3dd6977fa8ecb1f866946a65286/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "09d66f423e39",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "centos",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20201204",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "f8c9c064ec2231ce76893d983e9f52988b4c95adf1d8634bdb25d426b8f9d596",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {},
            "SandboxKey": "/var/run/docker/netns/f8c9c064ec22",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "8e2cdc10dc27dc58959b4c3bfa9b489cb10261fbc41183a8fcc4f323523bb658",
            "Gateway": "172.18.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.18.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:12:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "37839c64aa1c8b3af5de42be6f0b75e48b69491245e47bedb6b8ccf01137ccb7",
                    "EndpointID": "8e2cdc10dc27dc58959b4c3bfa9b489cb10261fbc41183a8fcc4f323523bb658",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:12:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]

```

**进入当前正在运行的容器**

```shell
# 我们通常容器都是使用后台方式运行的,需要进入容器,修改一些配置

#命令
docker exec -it [容器id] [bashshell]

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker exec -it 09d66f423e39 /bin/bash
[root@09d66f423e39 /]# ls
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
[root@09d66f423e39 /]# 

# 方式二
docker attach 容器id

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker attach 09d66f423e39
[root@09d66f423e39 /]# 

# docker exec   # 进入容器后开启一个新的终端,可以在里面操作(常用)
# docker attach # 进入容器正在执行的终端,不会启动新的进程

```

**从容器内拷贝文件到主机上**

```shell
docker cp [容器id]:[容器内路径] [目的主机路径]

# 进入docker容器
[root@iZ2zeebk9qd965c3j7ezr2Z home]# docker attach 09d66f423e39
[root@09d66f423e39 /]# cd /home
[root@09d66f423e39 home]# ls
# 在容器新建一个文件
[root@09d66f423e39 home]# touch test.java
[root@09d66f423e39 home]# ls
test.java
[root@09d66f423e39 home]# exit
exit
[root@iZ2zeebk9qd965c3j7ezr2Z home]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# 拷贝文件到主机
[root@iZ2zeebk9qd965c3j7ezr2Z home]# docker cp 09d66f423e39:/home/test.java /home
[root@iZ2zeebk9qd965c3j7ezr2Z home]# ls
ershier.java  test.java
[root@iZ2zeebk9qd965c3j7ezr2Z home]# 

```

#### **小结**

```shell
    attach      Attach local standard input, output, and error streams to a running container
  #当前shell下 attach连接指定运行的镜像
  build       Build an image from a Dockerfile # 通过Dockerfile定制镜像
  commit      Create a new image from a container's changes #提交当前容器为新的镜像
  cp          Copy files/folders between a container and the local filesystem #拷贝文件
  create      Create a new container #创建一个新的容器
  diff        Inspect changes to files or directories on a container's filesystem #查看docker容器的变化
  events      Get real time events from the server # 从服务获取容器实时时间
  exec        Run a command in a running container # 在运行中的容器上运行命令
  export      Export a container's filesystem as a tar archive #导出容器文件系统作为一个tar归档文件[对应import]
  history     Show the history of an image # 展示一个镜像形成历史
  images      List images #列出系统当前的镜像
  import      Import the contents from a tarball to create a filesystem image #从tar包中导入内容创建一个文件系统镜像
  info        Display system-wide information # 显示全系统信息
  inspect     Return low-level information on Docker objects #查看容器详细信息
  kill        Kill one or more running containers # kill指定docker容器
  load        Load an image from a tar archive or STDIN #从一个tar包或标准输入中加载一个镜像[对应save]
  login       Log in to a Docker registry #
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

```

#### 作业练习

> **Docker 安装Nginx**

```shell
#1. 搜索镜像 search 建议大家去docker搜索，可以看到帮助文档
#2. 拉取镜像 pull
#3、运行测试
# -d 后台运行
# --name 给容器命名
# -p 宿主机端口：容器内部端口
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -d --name nginx00 -p 3344:80 nginx
292c94a83d66274bf930134539d99f671a1ad16802f65589f31068cb4ef7c85a

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps
CONTAINER ID   IMAGE   COMMAND                  CREATED         STATUS         PORTS                                   NAMES
292c94a83d66   nginx   "/docker-entrypoint.…"   5 seconds ago   Up 3 seconds   0.0.0.0:3344->80/tcp, :::3344->80/tcp   nginx00

[root@iZ2zeebk9qd965c3j7ezr2Z /]# curl localhost:3344
<!DOCTYPE html>
<html>


```

思考问题：我们每次改动nginx配置文件，都需要进入容器内部？十分的麻烦，要是可以在容器外部提供一个映射路径，达到在容器修改文件名，容器内部就可以自动修改？√数据卷！

<img src="https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210610223322.png" alt="aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2NoZW5nY29kZXgvY2xvdWRpbWcvbWFzdGVyL2ltZy9pbWFnZS0yMDIwMDUxNDIxNTkxNTY1MC5wbmc" style="zoom:80%;" />

> **作业：docker 来装一个tomcat**

```shell
# 官方的使用
docker run -it --rm tomcat:9.0

# 之前的启动都是后台，停止了容器，容器还是可以查到， docker run -it --rm image 一般是用来测试，用完就删除
--rm       Automatically remove the container when it exits

# 下载
docker pull tomcat

# 启动运行
docker run -d -p 8080:8080 --name tomcat01 tomcat
# 内部测试访问没有问题
curl localhost:8080

# google访问404，由于阿里云镜像的原因，会把不必要的都剔除
# 保证最小环境

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker exec -it tomcat00 /bin/bash
root@c0ca6ae8b465:/usr/local/tomcat# ll
bash: ll: command not found
root@c0ca6ae8b465:/usr/local/tomcat# ls
BUILDING.txt  CONTRIBUTING.md  LICENSE	NOTICE	README.md  RELEASE-NOTES  RUNNING.txt  bin  conf  lib  logs  native-jni-lib  temp  webapps  webapps.dist  work
root@c0ca6ae8b465:/usr/local/tomcat# 

# 默认页面在webapps.dist下
```

思考问题：我们以后要部署项目，如果每次都要进入容器是不是十分麻烦？要是可以在容器外部提供一个映射路径，webapps，我们在外部放置项目，就自动同步内部就好了！

> **作业：部署es+kibana**

```shell
# es 暴露的端口很多！
# es 的数据一般需要放置到安全目录！挂载
# --net somenetwork ? 网络配置
# -e 环境配置修改

# 启动elasticsearch
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.6.2
# 测试一下es是否成功启动
➜  ~ curl localhost:9200
{
  "name" : "d73ad2f22dd3",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "atFKgANxS8CzgIyCB8PGxA",
  "version" : {
    "number" : "7.6.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "ef48eb35cf30adf4db14086e8aabd07ef6fb113f",
    "build_date" : "2020-03-26T06:34:37.794943Z",
    "build_snapshot" : false,
    "lucene_version" : "8.4.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
➜  ~ docker stats [容器id] # 查看docker容器使用内存情况

CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT   MEM %               NET I/O             BLOCK I/O           PIDS
bd4094db247f        elasticsearch       1.57%               1.226GiB / 3.7GiB   33.13%              0B / 0B             0B / 0B             42
94b00b6f6172        tomcat              0.18%               78.58MiB / 3.7GiB   2.07%               1.69kB / 2.47kB     0B / 0B             37
d458bc50a808        nginx01             0.00%               1.883MiB / 3.7GiB   0.05%               5.22kB / 6.32kB     0B / 0B             3
63d4c4115212        redis               0.14%               9.637MiB / 3.7GiB   0.25%               10.8kB / 14.2kB     0B / 0B             7


# elasticsearch十分占用内存,需要修改配置文件 -e 环境配置修改，限制其启动的内存
docker run -d --name elasticsearch00 -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms64m -Xmx 512m" elasticsearch:7.6.2

CONTAINER ID   NAME            CPU %     MEM USAGE / LIMIT   MEM %     NET I/O   BLOCK I/O   PIDS
10672a287b73   elasticsearch   0.00%     0B / 0B             0.00%     0B / 0B   0B / 0B     0

```

> docker和kibana如何连接

#### 可视化

portainer(先用这个)

```shell
docker run -d -p 8080:9000 \
--restart=always -v /var/run/docker.sock:/var/run/docker.sock --privileged=true portainer/portainer

```

**什么是portainer?**

Docker图形化界面管理工具! 提供一个后台面板供我们操作

访问测试: 外网: 8088 http://外网ip:8088/

![20200619182828579](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210610231952.png)

## Docker镜像讲解

#### 镜像是什么

镜像就是一个轻量级的,可执行的独立软件包,用来打包软件运行环境和基于运行环境开发的软件,它包含运行某个软件所需的所有内容,包括代码,运行时,库,环境变量和配置文件。

所有的应用,直接打包docker镜像,就可以直接跑起来!

**如何得到镜像:**

- 从远程仓库下载
- 朋友拷贝给你
- 自己制作一个镜像 DockerFile

#### Docker镜像加载原理

> UnionFs(联合文件系统查询)

我们下载的时候看到的一层一层就是这个

UnionFs(联合文件系统): Union文件系统(UnionFS)是一种分层,轻量级并且高性能的文件系统,它支持对文件系统的修改作为一次提交来一层层的叠加,同时可以将不同目录挂载到同一个虚拟文件系统下,Union文件系统是Docker镜像的基础,镜像可以通过分层来进行继承,基于基础镜像(没有父镜像),可以制作各种具体的应用镜像

**特性:** 一次同时加载多个文件系统,但从外面看起来,只能看到一个文件系统,联合加载会把各层文件系统叠加起来,这样最终的文件系统会包含所有底层的文件和目录结构.

> Docker镜像加载原理

docker的镜像实际上由一层一层的文件系统组成,这种层级的文件系统UnionFS

bootfs(boot file system)主要包含bootlloader和kernel,bootfs主要是引导加载kernel,Linux刚启动时会加载bootfs文件系统,在docker镜像的最底层是bootfs,这一层与我们典型的Linux/Unix系统是一样的,包含boot加载器和内核,当boot加载完成之后整个内核就在内存中了,此时内存的使用权已由bootfa转交给内核,此时系统也会卸载bootfs

rootfs(root file system),在bootfs之上,包含的就是典型Linux系统中的/dev, /proc,/bin, /etc等标准目录和文件,rootfs就是各种不同的操作系统发行版,比如Ubuntu, CentOS等等
![20200619182900538](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612063540.png)

平时我们安装进虚拟机的CentOS都是好几个G,为什么Docker这里才200M?

对于一个精简的OS,rootfs可以很小,只需要包含基本的命令,工具和程序库就可以了,因为底层直接用Host的kernel,自己只需要提供rootFS就可以了。由此可见对于不同的linux发行版,bootfs基本是一致的,rootfs会有差别,因此不同的发行版可以共用bootfs

#### 分层理解

> 分层的镜像

我们可以去下载一个镜像,注意观察下载的日志输出,可以看到是一层一层的在下载!

![20200619182926659](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070110.png)

**思考:** 为什么Docker镜像要采用这种分层的结构呢?

最大好处,我觉得莫过于资源共享了!比如有多个镜像都从相同的Base镜像构建而来,那么宿主机

只需在磁盘上保留一份base镜像,同时内存中也只需要加载一份base镜像,这样就可以为所有的容器服务了,而且镜像的每一层都可以被共享

查看镜像分层的方式可以通过 docker image inspect 命令!

```shell
[root@CZP ~]# docker images
REPOSITORY            TAG                 IMAGE ID            CREATED             SIZE
nginx                 latest              2622e6cca7eb        32 hours ago        132MB
portainer/portainer   latest              cd645f5a4769        9 days ago          79.1MB
redis                 latest              36304d3b4540        13 days ago         104MB
mysql                 latest              30f937e841c8        2 weeks ago         541MB
tomcat                9.0                 1b6b1fe7261e        3 weeks ago         647MB
elasticsearch         7.6.2               f29a1ee41030        2 months ago        791MB
elasticsearch         latest              5acf0e8da90b        20 months ago       486MB
[root@CZP ~]# docker image inspect redis
[
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:ffc9b21953f4cd7956cdf532a5db04ff0a2daa7475ad796f1bad58cfbaf77a07",
                "sha256:d4e681f320297add0ede0554524eb9106d8c3eb3a43e6e99d79db6f76f020248",
                "sha256:59bd5a888296b623ae5a9efc8f18285c8ac1a8662e5d3775a0d2d736c66ba825",
                "sha256:c112794a20c5eda6a791cbec8700fb98eab30671a2248ac7e2059b475c46c45f",
                "sha256:bf8b736583f08c02b92f8a75ac5ea181e4d74107876177caa80ddad8b6b57a72",
                "sha256:6ef422d19214800243b28017d346c7ab9bfe63cb198a39312d1714394b232449"
            ]
    }
]

```

**理解:**

所有的镜像都起始于一个基础镜像层,当进行修改或增加新的内容时,就会在当前镜像层之上,创建一个新的镜像层,

举一个简单的例子,假如基于Ubuntu Linux 16.64创建一个新的镜像,这就是新镜像的第一层,如果在该镜像中添加python包,就会在该镜像之上创建第二个镜像层; 如果继续添加一个安全补丁,就会创建第三个镜像层

该镜像已经包含3个镜像层,如下图所示(这只是一个简单的例子)
![202006191829432](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070257.png)

在添加额外的镜像层的同时,镜像始终保持是当前所有镜像的组合,理解这一点非常重要,下图举了一个简单的例子,每个镜像层包含3个文件,而镜像包含了两个镜像层的6个文件

![2020061918295560](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070330.png)

上图中的镜像层跟之前图中的略有区别,主要是便于展示文件

下图中展示了一个稍微复杂的三层镜像,在外部看来整个镜像只有6个文件,这是因为最上层的文件7是文件5的一个更新版本

![20200619183009764](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070400.png)

这种情况下,上层镜像层中的文件覆盖了底层镜像层中的文件,这样就使得文件的更新版本作为一个新镜像层添加到镜像当中

Docker通过存储引擎(新版本采用快照机制)的方式来实现镜像层堆栈,并保证多层镜像层对外展示为统一的文件系统

Lunux上可用的存储引擎有AUFS,Overlay2,Device Mapper,Btrfs以及ZFS,顾名思义,每种存储引擎都是基于Linux对应的文件系统或者块设备技术,并且每种存储引擎都有其独有的性能特点

Docker在Windows上仅支持windosfilter一种存储引擎,该引擎基于NTFS文件系统之上实现了分层和CoW[1]

下图展示了与系统显示相同的三层镜像,所有的镜像层堆叠合并,对外提供统一的视图层
![20200619183024727](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070427.png)

> 特点

Docker镜像都是只读的,当容器启动时,一个新的可写层被加载到镜像的顶部!

这一层就是我们通常所说的容器层,容器之下的都叫镜像层

![20200619183036853](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612070503.png)

如何提交一个自己的镜像

#### commit镜像

```shell
docker commit 提交容器成为一个新的镜像

#命令和git原理类似
docker commit -m="提交的描述信息" -a="作者" 容器ID 目标镜像名:[tag]

```

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker ps
CONTAINER ID   IMAGE     COMMAND             CREATED        STATUS         PORTS                                       NAMES
c0ca6ae8b465   tomcat    "catalina.sh run"   32 hours ago   Up 7 minutes   0.0.0.0:3355->8080/tcp, :::3355->8080/tcp   tomcat00
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker commit -m="add basic webapps app" -a="xiewenjie" c0ca6ae8b465 tomcat01:1.0
sha256:4bd2524ff142c8de89c773cff40af992319397808e59d2a2cbb0d2579fc64672
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
tomcat01        1.0       4bd2524ff142   5 seconds ago   672MB		# 自己提交的镜像
nginx           latest    d1a364dc548d   2 weeks ago     133MB
tomcat          latest    c43a65faae57   4 weeks ago     667MB
centos          latest    300e315adb2f   6 months ago    209MB
elasticsearch   7.6.2     f29a1ee41030   14 months ago   791MB

```

## 容器数据卷

### 什么是容器数据卷

**docker的理念回顾**

将应用和环境打包成一个镜像!

如果数据都在容器中,那么我们容器删除,数据就会丢失! 

**需求: 数据可以持久化**

MYSQL, 容器删了,删库跑路! 需求: mysql数据可以存储在本地!

容器之间可以有一个数据共享的技术! Docker 容器中产生的数据,同步到本地!

这就是卷技术! 目录的挂载,将容器内的目录挂载到Linux上面!
![20200619183052229](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612072528.png)

**总结一句话: 容器的持久化和同步操作! 容器间也可以数据共享的!**

#### 使用数据卷

> **方式一: 直接使用命令来挂载 -v**

```shell
docker run -it -v [主机目录]:[容器内目录]  -p [主机端口]:[容器端口]

# 启动起来我们可以使用 docker inspect 容器id

```

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED          SIZE
tomcat01        1.0       4bd2524ff142   14 minutes ago   672MB
nginx           latest    d1a364dc548d   2 weeks ago      133MB
tomcat          latest    c43a65faae57   4 weeks ago      667MB
centos          latest    300e315adb2f   6 months ago     209MB
elasticsearch   7.6.2     f29a1ee41030   14 months ago    791MB
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -it -v /home/ceshi:/home centos /bin/bash

#进入容器内部
#在home目录创建test.java
[root@ea3d449d7990 home]# touch test.java

```

![20200619183107741 (1)](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612074454.png)

#### 实战: 安装Mysql

**思考:** mysql的数据持久化的问题, data目录

```shell
# 获取镜像
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker pull mysql:5.7

# 运行容器,需要做数据挂载! 
# 安装启动mysql,需要配置密码,这是官方的
# 官方测试: docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=密码 -d mysql:tag

#启mysql
-d  后台运行
-p  端口映射
-v  端口映射
-e  环境配置
--name 容器名
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -d -p 3306:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root --name mysql mysql:5.7

# 启动成功之后,我们在本地使用sqlyog来连接测试一下

# navicat-连接到服务器的端口 ---服务器端口和容器端口映射,这个时候我们就可以连接上了

```

假设我们将容器删除

![20200619183120835](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210612080122.png)

发现,我们挂载到本地的数据卷依旧没有丢失,这就实现了容器数据持久化功能

#### 具名挂载和匿名挂载

```shell
# 匿名挂载
-v 容器内路径 # 不指定
docker run -P --name nginx01 -v /etc/nginx nginx

# 查看所有的卷的情况
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker volume ls
DRIVER    VOLUME NAME
local     5f4c17efb619832632b4236a67fdcede6a3a862267f3bdcca622a50b65dbe414

#这里发现,这种就是匿名挂载, 我们在 -v只写了容器内的路径,没有写容器外的路径


#具名挂载
# 通过 -v 卷名:容器内路径
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker run -d -p 9099:80 -v nginxConfig:/etc/nginx d1a364dc548d
02a2916ab2d016890189a1ee2f937d5f544305db6b714c9af48c47765d386fde
# 查看一下这个卷
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker volume ls
DRIVER    VOLUME NAME
local     nginxConfig

# 查看卷位置
# docker volume inspect [卷名]
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker volume inspect nginxConfig
[
    {
        "CreatedAt": "2021-06-14T18:25:55+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginxConfig/_data",
        "Name": "nginxConfig",
        "Options": null,
        "Scope": "local"
    }
]

```

所有的docker容器内的卷,没有指定目录的情况下都是在/var/lib/docker/volumes/卷名/_data

我们通过具名挂载可以方便的找到一个卷,大多数情况在使用的’具名挂载’

```shell
# 如何确定是具名挂载还是匿名挂载,还是指定路径挂载
-v 容器内路径 # 匿名挂载
-v 卷名:容器内路径 # 具名挂载
-v 宿主机路径 : 容器内路径 # 指定路径挂载
```

扩展:

```shell
# 通过 -v  容器内路径: ro/rw 改变读写权限
ro: read only  # 只读
rw: read and write # 可读可写

# 一旦设置了容器权限,容器对挂载出来的内容就有限定了!
docker -run -P -name nginx01 -v /etc/nginx:ro nginx
docker -run -P -name nginx01 -v /etc/nginx:rw nginx

# ro : 只要看到ro就说明这个路径只能通过宿主机来改变,容器内部无法操作
```

#### 初识Dockerfile

Dockerfile就是用来构建Dockerfile镜像的文件! 命令脚本! 先体验一下！

> 通过这个脚本可以生成镜像，镜像是一层一层的，脚本是一个个的命令，每个命令都是一层！

```shell
# 创建一个dockerfile文件,名字可以随机 建议 dockerfile
# 文件中的内容

FROM centos

VOLUME ["volume01","volume02"]

CMD echo "---end---"
CMD /bin/hash
# 这里的每个命令，就是镜像的一层！
```

```shell
# 构建新镜像
# -f dockerfile路径
# -t tag版本标签
docker build -f /home/docker-test-volume/dockerfile -t kuangshen/centos:1.0
```

![20200619183147416](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212020.png)

![20200619183159322](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212052.png)

这个卷和外部一定有一个同步的目录（匿名挂载）

![20200619183210681](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212121.png)

查看一下卷挂载的路径

![20200619183221422](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212143.png)

测试一下刚才的文件是否同步出去了

这种方式我们未来使用的十分多,因为我们通常会构建自己的镜像!

假设构建镜像时没有挂载卷,要手动镜像挂载 -v 卷名: 容器内路径

#### **数据卷容器**

两个Mysql同步数据!

```shell
# --volumes-from 相当于java的继承关系，共享文件
docker run -it --name docker03 --volumes-from docker01 kuangshen/centos:1.0
```



![20200619183235195](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212820.png)

```shell
# 启动三个容器,通过我们刚才自己的镜像启动
```

![20200619183249590](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614212955.png)

![20200619183300521](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614213030.png)

```shell
# 测试: 可以删除docker01,查看一下docker02和docker03是否还可以访问这个文件
# 测试依旧可以访问
```

![20200619183313165](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614213321.png)

**多个mysql实现数据共享**

```shell
docker run -d -p 3306:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7 

docker run -d -p 3307:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql02 --volumes-from mysql01  mysql:5.7
# 这个时候，可以实现两个容器数据同步！

```

**结论:**

容器之间配置信息的传递,数据卷容器的生命周期一直持续到没有人使用为止

但是一旦你持久化到了本地,这个时候,本地的数据是不会删除的

## Dockerfile

DockerFile是用来构建docker镜像的文件!命令参数脚本!

构建步骤:

1. 编写一个dockerfile脚本
2. docker build 构建成为一个镜像
3. docker run 运行镜像
4. docker push发布镜像(Docker hub , 阿里云镜像仓库! )

![20200619183412937](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614213416.png)


很多官方镜像都是基础包, 很多功能没有,我们通常会自己搭建自己的镜像!

官方可以制作镜像,那么我们也可以!

#### Dockerfile构建过程

很多指令:

1. 每个保留关键字(指令)都是必须要大写
2. 执行从上到下顺序执行
3. '#' 表示注释
4. 每一个指令都会创建提交一个新的镜像层,并提交 !

![20200619183442209](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614213603.png)

dockerfile是面向开发的,我们以后要发布项目,做镜像就需要编写dockerfile文件,这个文件十分简单

Docker镜像 逐渐成为了一个企业交付的标准,必须要掌握 !

步骤: 开发,部署,上线,运维…缺一不可

**DockerFIle:** 构建文件,定义了一切的步骤 ,源代码

**DockerImages:** 通过DockerFile构建生成的镜像,最终发布运行的产品,原来是一个jar,war

**Docker容器:** 容器就是镜像运行起来提供服务的

#### DockerFile的指令

以前的话我们是使用的别人的,现在我们知道了这些指令后,我们来练习自己写一个镜像!

```shell
FROM 		# 基础镜像, 一切从这里开始构建
MANTAINER 	# 镜像是谁写的, 姓名+邮箱
RUN 		# 镜像构建的时候需要运行的命令
ADD 		# 步骤, tomcat镜像,压缩包! 添加内容
WORKDIR 	# 镜像的工作目录
VOLUME 		# 挂载的目录
EXPOSE 		# 暴露端口配置
RUN 		# 运行
CMD 		# 指定这个容器启动的时候要运行的命令,只有最后一个会生效,可被替代
ENTRYPOINT 	# 指定这个容器启动的时候要运行的命令,可以追加命令
ONBUILD 	# 当构建一个被继承 DockerFile 这个时候就会运行ONBUILD的指令,触发指令
COPY		# 类似ADD,将我们文件拷贝到镜像中
ENV 		# 构建的时候设置环境变量! 
```

![aHR0cHM6Ly9zczAuYmRzdGF0aWMuY29tLzcwY0Z1SFNoX1ExWW54R2twb1dLMUhGNmhoeS9pdC91PTI2ODk3NDY0OSwyNjA3MDE5OTExJmZtPTI2JmdwPTAuanBn](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614213753.png)



#### 实战测试

Docker Hub 中99%镜像都是从centos基础镜像过来的,然后配置需要的软件

> 创建一个自己的centos

####  编写一个DOckerfile的文件

```shell
# 1.编写Dockerfile的文件
FROM centos
MAINTAINER dainel<dlgnjupt@qq.com>

ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo $MYPATH
CMD echo "-----end----"
CMD /bin/bash

# 2.通过这个文件构建镜像
# 命令 docker build -f 文件路径 -t 镜像名:[tag] .
docker build -f mydockerfile-centos -t mycentos:0.1 .

Successfully built 4af56313b71a
Successfully tagged mycentos:0.1

# 3.测试运行

```

增强之后的镜像

![20200619184405292](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614214659.png)

我们可以列出本地进程的历史

![20200619184416447](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614214717.png)

我们平时拿到一个镜像,可以研究一下它是怎么做的

> CMD 和ENTRYPOINT的区别

```shell
CMD 		# 指定这个容器启动的时候要运行的命令,只有最后一个会生效,可被替代
ENTRYPOINT 	# 指定这个容器启动的时候要运行的命令,可以追加命令
```


测试cmd命令

```shell
# 编写
[root@iZ2zeebk9qd965c3j7ezr2Z dockerfile]# cat dockerfile-centos-test 
FROM centos
CMD ["ls","-a"]


# 构建镜像
[root@iZ2zeebk9qd965c3j7ezr2Z dockerfile]# docker build -f dockerfile-centos-test -t centostest .

# 想要追加一个命令 -l  ls -al
docker: Error response from daemon: OCI runtime create failed: container_linux.go:349: starting container process caused "exec: \"-l\": executable file not found in $PATH": unknown.
ERRO[0000] error waiting for container: context canceled 

# cmd的情况下 替换了CMD["ls","-a"]命令,-不是命令追加

```

ENTRYPOINT是往命令之后追加

#### 实战:Tomcat镜像

1. 准备镜像文件. tomcat压缩包, jdk压缩包!
2. ![20200619184436678](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614215113.png)
3. 编写Dockerfile文件, 官方命名 Dockerfile, build会自动寻找这个文件,就不需要 -f 指定了!

```shell
FROM centos #
MAINTAINER cheng<1204598429@qq.com>
COPY README /usr/local/README #复制文件
ADD jdk-8u231-linux-x64.tar.gz /usr/local/ #复制解压
ADD apache-tomcat-9.0.35.tar.gz /usr/local/ #复制解压
RUN yum -y install vim
ENV MYPATH /usr/local #设置环境变量
WORKDIR $MYPATH #设置工作目录
ENV JAVA_HOME /usr/local/jdk1.8.0_231 #设置环境变量
ENV CATALINA_HOME /usr/local/apache-tomcat-9.0.35 #设置环境变量
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib #设置环境变量 分隔符是：
EXPOSE 8080 #设置暴露的端口
CMD /usr/local/apache-tomcat-9.0.35/bin/startup.sh && tail -F /usr/local/apache-tomcat-9.0.35/logs/catalina.out # 设置默认命令
```

​	4.构建镜像

```shell
# 因为dockerfile命名使用默认命名 因此不用使用-f 指定文件
docker build -t diytomcat .
```

​	5.本地测试

> curl localhost:9090

#### 发布自己的镜像

> DockerHub

1. 地址hub.docker.com 注册自己的账号!

2. 确定这个账号可以登录

3. 在服务器上提交自己的镜像

   ```shell
   [root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker login --help
   
   Usage:	docker login [OPTIONS] [SERVER]
   
   Log in to a Docker registry.
   If no server is specified, the default is defined by the daemon.
   
   Options:
     -p, --password string   Password
         --password-stdin    Take the password from stdin
     -u, --username string   Username
   
   
   ```

4. 登录完毕就可以提交镜像了,就是一步 docker push

   ```shell
   # push自己的镜像到服务器上一定要带上版本号
   [root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker push czp/centos:1.0
   
   
   # 会发现push不上去，因为如果没有前缀的话默认是push到 官方的library
   # 解决方法
   # 第一种 build的时候添加你的dockerhub用户名，然后在push就可以放到自己的仓库了
   $ docker build -t chengcoder/mytomcat:0.1 .
   # 第二种 使用docker tag #然后再次push
   $ docker tag 容器id chengcoder/mytomcat:1.0 #然后再次push
   
   ```
   
   

>提交到阿里云镜像仓库

看官网 很详细https://cr.console.aliyun.com/repository/

```shell
$ sudo docker login --username=zchengx registry.cn-shenzhen.aliyuncs.com
$ sudo docker tag [ImageId] registry.cn-shenzhen.aliyuncs.com/dsadxzc/cheng:[镜像版本号]
# 修改id 和 版本
sudo docker tag a5ef1f32aaae registry.cn-shenzhen.aliyuncs.com/dsadxzc/cheng:1.0
# 修改版本
$ sudo docker push registry.cn-shenzhen.aliyuncs.com/dsadxzc/cheng:[镜像版本号]

```



1. 登录阿里云

2. 找到容器镜像服务

3. 创建命名空间

   ![20200619184533739](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220022.png)

4. 创建容器镜像

   ![20200619184546684](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220042.png)

5. 浏览阿里云

   ![2020061918455938](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220110.png)

**小结**

![20200619184610970](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220134.png)

## Docker网络

理解docker0

> 测试

![20200619184654885](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220212.png)

三个网络

```shell
# 问题: docker 是如何处理容器网络访问的?
```

```shell
# [root@AlibabaECS ~]# docker run -d -P --name tomcat01 tomcat

# 查看容器的内部网络地址 ip addr , 发现容器启动的时候会得到一个 eth0@if83 ip地址，docker分配的

[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker exec -it tomcat01 ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
82: eth0@if83: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
[root@iZ2zeebk9qd965c3j7ezr2Z /]# 

# 思考：linux能不能 ping 通容器内部
[root@iZ2zeebk9qd965c3j7ezr2Z /]# ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2) 56(84) bytes of data.
64 bytes from 172.17.0.2: icmp_seq=1 ttl=64 time=0.086 ms
64 bytes from 172.17.0.2: icmp_seq=2 ttl=64 time=0.068 ms
64 bytes from 172.17.0.2: icmp_seq=3 ttl=64 time=0.064 ms

# linux可以 ping 通 docker 容器内部

```

>
> 原理

1. 我们每启动一个docker容器,docker就会给docker容器分配一个ip,我们只要安装了docker,就会有一个网卡docker0,桥接模式,使用的技术是evth-pair技术!

   再次测试 ip addr

![2020061918485148](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220542.png)

​	2.再启动一个容器测试，发现又多了一对网络

![20200619184905708](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220620.png)

```shell
# 我们发现这个容器带来网卡, 都是一对对的
# evth-pair 就是一对虚拟机设备接口,他们都是成对出现的,一端连着协议,一端彼此相连
# 正因为有这个特性,veth-pair 充当桥梁,连接各种虚拟网络设备的
# openStac,Docker容器之间的连接,OVS的连接,都是使用 evth-pair 技术

```

​	3.我们来测试一下  tomcat1 和 tomcat2 是否可以ping 通

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker exec -it tomcat02 ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3) 56(84) bytes of data.
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.049 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.055 ms

# 结论：容器和容器之间是可以ping通的

```



**结论:**

1.  tomcat01和tomcat02是共用的一个路由器,docker0

2. 所有的容器不指定网络的情况下,都是docker0路由的,docker会给我们的容器分配一个默认的可用IP

   ![20200619184934900](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220837.png)

> 小结

Docker 使用的是Linux的桥接,宿主机中是一个Docker容器的网桥,docker0

![20200619184949651](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220901.png)

Docker中所有的网络接口都是虚拟的,虚拟的转发效率高

只要容器删除,对应网桥的一对就没了

![20200619185002288](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614220933.png)

#### **–link**

> 思考一个场景,我们编写了一个微服务,database url=ip: 项目不重启,数据库IP换掉了,我们希望可以通过名字来访问服务

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z /]# docker exec -it tomcat02 ping tomcat01 # ping不通
ping: tomcat01: Name or service not known

# 如何可以解决呢?


# 通过 --link 就可以解决网络问题
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker exec -it tomcat03 ping tomcat02
PING tomcat02 (172.18.0.4) 56(84) bytes of data.
64 bytes from tomcat02 (172.18.0.4): icmp_seq=1 ttl=64 time=0.128 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=2 ttl=64 time=0.097 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=3 ttl=64 time=0.091 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=4 ttl=64 time=0.109 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=5 ttl=64 time=0.097 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=6 ttl=64 time=0.096 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=7 ttl=64 time=0.092 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=8 ttl=64 time=0.094 ms
64 bytes from tomcat02 (172.18.0.4): icmp_seq=9 ttl=64 time=0.102 ms
^C
--- tomcat02 ping statistics ---
9 packets transmitted, 9 received, 0% packet loss, time 1007ms
rtt min/avg/max/mdev = 0.091/0.100/0.128/0.015 ms


# 反向是否可以ping通吗
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker exec -it tomcat02 ping tomcat03

```

```shell
/etc/hosts  配置端口和域名的绑定
```

查看tomcat03就是在在本地配置了tomcat02的配置

```shell
# 查看hosts 配置，在这里原理发现
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker exec -it tomcat03 cat /etc/hosts
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.3      tomcat02 c2e5a8a29151
172.17.0.4      50b163f99e32

```


本地探究 – link 就是我们在host配置中增加了一个172.18.0.3 tomcat02 312857784cd4

我们现在玩Docker已经不建议使用–link了!

自定义网络,不使用docker0!

docker0问题: 它不支持容器名连接访问!

#### 自定义网络

> 查看所有的docker网络

![20200619185041987](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614221348.png)

**网络模式**

详情见**Docker容器原理剖析**：https://blog.csdn.net/qq_41822345/article/details/115229833

**bridge :** 桥接 docker 大桥

**none:** 不配置网络

**host:** 和宿主机共享网络

**container:** 容器内网络联通!

**测试**

```shell
# 直接启动的命令 --net brodge,默认docker0
# 我们直接启动的命令
docker run -d -P --name tomcat01 tomcat
docker run -d -P --name tomcat01 --net bridge tomcat

# docker0特点：默认，域名不能访问，--link可以打通连接

# 我们可以自定义一个网络
# --driver bridge 
# --subnet 192.168.0.0/16    子网
# --gateway 192.168.0.1      网关
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet
dd7c8522864cb87c332d355ccd837d94433f8f10d58695ecf278f8bcfc88c1fc
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
04038c2f1d64        bridge              bridge              local
81476375c43d        host                host                local
dd7c8522864c        mynet               bridge              local
64ba38c2cb2b        none                null                local

```

我们自己的网络就创建好了

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker run -d -P --name tomcat-net-01 --net mynet tomcat
1de6f5994a480160d932de239b104b366ebd5b954e740a5ab8c0d5aeea8f5ba5
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker run -d -P --name tomcat-net-02 --net mynet tomcat
f26916a49e5ee239aee23584020e0d23d53d2e644d5cb5155d831edc0803d957
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker network inspect mynet
[
    {
        "Name": "mynet",
        "Id": "dd7c8522864cb87c332d355ccd837d94433f8f10d58695ecf278f8bcfc88c1fc",
        "Created": "2020-09-05T12:43:54.847233062+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.0.0/16",
                    "Gateway": "192.168.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "1de6f5994a480160d932de239b104b366ebd5b954e740a5ab8c0d5aeea8f5ba5": {
                "Name": "tomcat-net-01",
                "EndpointID": "c308999d4e51ed9e5975f3b4f3c1d468bfb08d93de7561d55062db055f44ef18",
                "MacAddress": "02:42:c0:a8:00:02",
                "IPv4Address": "192.168.0.2/16",
                "IPv6Address": ""
            },
            "f26916a49e5ee239aee23584020e0d23d53d2e644d5cb5155d831edc0803d957": {
                "Name": "tomcat-net-02",
                "EndpointID": "8d9dbdd6ca119559ef4f1dd82a36e0d279c0b8284fe19f36c6d992047937a764",
                "MacAddress": "02:42:c0:a8:00:03",
                "IPv4Address": "192.168.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]

# 再次测试ping连接 ， 现在不使用 --link 也可以ping名字了
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker exec -it tomcat-net-01 ping tomcat-net-02
PING tomcat-net-02 (192.168.0.3) 56(84) bytes of data.
64 bytes from tomcat-net-02.mynet (192.168.0.3): icmp_seq=1 ttl=64 time=0.094 ms
64 bytes from tomcat-net-02.mynet (192.168.0.3): icmp_seq=2 ttl=64 time=0.067 ms

```

现在不使用–link也可以ping名字了,推荐使用这种网络

```shell
[root@iZ2zeebk9qd965c3j7ezr2Z ~]# docker exec tomcat-net-01 ping tomcat-net-02
PING tomcat-net-02 (192.168.0.3) 56(84) bytes of data.
64 bytes from tomcat-net-02.mynet (192.168.0.3): icmp_seq=1 ttl=64 time=0.080 ms
64 bytes from tomcat-net-02.mynet (192.168.0.3): icmp_seq=2 ttl=64 time=0.096 ms
64 bytes from tomcat-net-02.mynet (192.168.0.3): icmp_seq=3 ttl=64 time=0.086 ms
```

**好处:**

不同的集群使用不同的网络,保证集群之间是安全和健康的

#### 网络连通

![20200619185116312](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614222004.png)

![2020061918520685](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614222041.png)

```shell
$ docker run -d -P --name tomcat-net-01 --net mynet tomcat
# 测试两个不同的网络连通  再启动两个tomcat 使用默认网络，即docker0
$ docker run -d -P --name tomcat01 tomcat
$ docker run -d -P --name tomcat02 tomcat
# 此时ping不通（两个网络，所以不通）
$ docker exec -it tomcat01 ping tomcat-net-01


# 测试打通 tomcat01到tomcat-net-01
# 连通之后就是将 tomcat01 放到了mynet网络下
# 一个容器两个ip   阿里云: 公网ip 私网ip
```

![20200704151231614](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210615074359.png)

![20200619185223260](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614222219.png)

这样容器之间就可以ping通了

```shell
# 01连通ok
[root@AlibabaECS ~]# docker exec -it tomcat01 ping tomcat-net-01
PING tomcat-net-01 (192.168.0.2) 56(84) bytes of data.
64 bytes from tomcat-net-01.mynet (192.168.0.2): icmp_seq=1 ttl=64 time=0.098 ms
64 bytes from tomcat-net-01.mynet (192.168.0.2): icmp_seq=2 ttl=64 time=0.091 ms

# 02依旧是打不通的
[root@AlibabaECS ~]# docker exec -it tomcat02 ping tomcat-net-01
Error: No such container: tomcat02

```

**结论：**假设要跨网络操作别人，就需要使用docker network connect 连通！

#### 实战 redis集群部署

```shell
# 创建网卡
docker network create --subnet 172.38.0.0/16 redis

# 通过脚本创建六个redis配置
for port in $(seq 1 6);\
do \
mkdir -p /mydata/redis/node-${port}/conf
touch /mydata/redis/node-${port}/conf/redis.conf
cat << EOF >> /mydata/redis/node-${port}/conf/redis.conf
port 6379
bind 0.0.0.0
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 172.38.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes
EOF
done



# 通过脚本运行六个redis
for port in $(seq 1 6);\
do \
docker run -p 637${port}:6379 -p 1637${port}:16379 --name redis-${port} \
-v /mydata/redis/node-${port}/data:/data \
-v /mydata/redis/node-${port}/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.1${port} redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf 
done

#停止redis并删除容器
for port in $(seq 1 6);\
do \
docker stop redis-${port}; \
docker rm redis-${port};
done

docker exec -it redis-1 /bin/sh #redis默认没有bash
redis-cli --cluster create 172.38.0.11:6379 172.38.0.12:6379 172.38.0.13:6379 172.38.0.14:6379 172.38.0.15:6379 172.38.0.16:6379  --cluster-replicas 1

```

集群搭建成功

![20200619185407282](https://ershierimages.oss-cn-beijing.aliyuncs.com/img/20210614222426.png)

## SpringBoot打包Docker镜像

1. 构建springBoot项目

2. 打包应用

   ```shell
   mvn package
   ```

3. 编写dockerfile

   ```shell
   FROM java:8
   COPY *.jar /app.jar
   CMD ["--server.port=8080"]
   EXPOSE 8080
   ENTRYPOINT ["java","-jar","app.jar"]
   ```

4. 构建镜像

   ```shell
   # 1.复制jar和DockerFIle到服务器
   # 2.构建镜像
   $ docker build -t xxxxx:xx  .
   ```

5. 发布运行

   ```shell
   docker run -d --privileged=true --restart=always -p 80:8080 --name springboot-web czpspringboottest
   ```

   

## SpringBoot项目打包Docker镜像（添加）

#### 1.认识docker

- Docker定义：

  Docker 是一个开源的应用容器引擎，它可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制（ 沙箱是一个虚拟系统程序，沙箱提供的环境相对于每一个运行的程序都是独立的，而且不会对现有的系统产生影响 ），相互之间不会有任何接口，更重要的是容器性能开销极低。

- Docker的优点
  Docker 是一个用于开发，交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，从而可以快速交付软件。借助 Docker，您可以与管理应用程序相同的方式来管理基础架构。通过利用 Docker 的方法来快速交付，测试和部署代码，您可以大大减少编写代码和在生产环境中运行代码之间的延迟。

- Docker应用场景


- Web 应用的自动化打包和发布。
- 自动化测试和持续集成、发布。
- 在服务型环境中部署和调整数据库或其他的后台应用。
- 从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

#### 2.Docker容器与虚拟机

容器技术是实现操作系统虚拟化的一种途径，可以让您在资源受到隔离的进程中运行应用程序及其依赖关系。通过使用容器，我们可以轻松打包应用程序的代码、配置和依赖关系，将其变成容易使用的构建块，从而实现环境一致性、运营效率、开发人员生产力和版本控制等诸多目标。容器可以帮助保证应用程序快速、可靠、一致地部署，其间不受部署环境的影响。容器还赋予我们对资源更多的精细化控制能力，让我们的基础设施效率更高。

**Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux容器解决方案。**

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker ，就不用担心环境问题。

总体来说， Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

#### 3.Docker 命令

**1.Docker 容器使用**
获取镜像
启动容器
查看容器
启动已经停止的容器
后台运行
停止一个容器
进入容器
退出容器
导出容器
导入容器
容器快照
删除容器
清理掉所有处于终止状态的容器

**2.Docker Web应用**
运行一个web应用
以端口5000开启端口
关闭web应用
重启web应用
移除web应用

**3.Docker 镜像应用**
列出镜像列表
获取镜像

**4.Dockerfile**
构建镜像
一般来说，我们可以将 Dockerfile 分为四个部分：

- 基础镜像(父镜像)信息指令 FROM
- 维护者信息指令 MAINTAINER
- 镜像操作指令 RUN 、 EVN 、 ADD 和 WORKDIR 等
- 容器启动指令 CMD 、 ENTRYPOINT 和 USER 等

#### 4.SpringBoot项目容器化步骤

step1：添加Docker的maven的插件，配置Dockerfile的path；

```xml
   <!-- Docker maven plugin -->
            <plugin>
                <groupId>com.spotify</groupId>
                <artifactId>docker-maven-plugin</artifactId>
                <version>0.4.13</version>
                <configuration>
                    <imageName>${docker.image.prefix}/${project.artifactId}</imageName>                   <dockerDirectory>${project.basedir}/src/main/docker</dockerDirectory>
                    <resources>
                        <resource>
                            <targetPath>/</targetPath>
                            <directory>${project.build.directory}</directory>
                            <include>${project.build.finalName}.jar</include>
                        </resource>
                    </resources>
                </configuration>
            </plugin>
```

step2：在配置的Dockerfile的path处添加Dockerfile文件；

Step3：文件中添加配置

```shell
FROM openjdk:8-jdk-alpine
VOLUME /tmp
#把当前项目下dockertest-0.0.1-SNAPSHOT.jar 改名为test.jar 添加到镜像中
ADD web-app-template-1.0.0.jar test.jar
#指定端口,最好写与项目配置的端口
EXPOSE 8080
#在镜像中运行/test.jar包,这样在运行镜像的时候就已经启动好了test.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/test.jar"]

```

Step4：mvn clean package -Dmaven.test.skip=true （表示不执行测试用例，也不编译测试用例类。）

step5：mvn package docker:build 打镜像

step6：docker images 查看镜像

step7：docker run -p 8081:8081 -t springboot/web-app-template 运行

step8：查看运行结果：http://localhost:8081/…

step9：docker push

