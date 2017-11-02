# 逆向

## parse_binwalk.py

在提取固件时，binwalk有时候不能提取镜像，而是显示识别出一些`Zip archive data`或者`LZMA compressed data`。这个脚本会提取出固件中的这部分被识别出来压缩的文件，进行解压。通过这种方式能获取一部分文件。系统需安装7z。

## idaemufindarg0.py

在ida中运行的python， 模拟执行，打印出敏感函数（如system）的第一个参数