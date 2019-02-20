# ![](https://raw.githubusercontent.com/yudai/gotty/master/resources/favicon.png) GoTTY

GoTTY是一个用于网页版的终端命令行工具，无需ssh即可实现命令交互。
此版本fork于[https://github.com/yudai/gotty](https://github.com/yudai/gotty)，在功能上做了一些改善和增强。推荐使用chrome浏览器。

![Screenshot](https://raw.githubusercontent.com/lzp9421/gotty/master/screenshot.png)

# 从源码构建二进制文件

**自动构建**
1. 将代码仓库放置$GOPATH/src中，使用`go get`安装依赖并自动构建，执行成功后，可在GOPATH/bin/下找到gotty执行文件。

**手动构建**
1. 修改此代码后重新打包，则需要进行手动构建。
2. 在系统中安装go、nodejs环境，构建过程中会用到make命令，请自行准备。
3. 此程序不能在Windows中使用，如果你需要在Windows下编译此代码，请执行`set GOOS=linux`进行交叉编译。
4. 执行`make tools`安装构建过程中会使用到的命令行工具。注意需要将$GOPATH/bin目录加入到PATH变量中
5. 执行`make all`即可。

# 使用方法

```
Usage: gotty [options] <command> [<arguments...>]
```

示例：执行 `./gotty -w /bin/bash` 会自动监听默认的8080端口。此时使用浏览器访问此计算机的8080端口，即可打开一个可交互的bash终端。

更多细节请参考 `yudai/gotty`

# License

The MIT License
