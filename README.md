# MOS-9 开源文档

MOS-9 是面向 RoboCup 人形足球场景的开源机器人项目。
本仓库用于维护 MOS-9 的技术文档，覆盖机械、电气、通信、仿真、控制与开发测试流程。

在线文档地址：
https://wegg111.github.io/mos9-website/

## 文档内容

- 项目背景与系统总览
- 机械设计与电气系统
- 电机通信与进程间通信（Robot IPC）
- 仿真模型、动作数据与重定向
- 运动控制、系统辨识与 Sim2Real
- 环境配置、测试工具与 FAQ

## 本地预览

```bash
pip install -r requirements-docs.txt
python -m mkdocs serve
```

默认访问地址：
http://127.0.0.1:8000/

## 构建静态站点

```bash
python -m mkdocs build
```

构建产物默认输出到 `site/` 目录。

## 目录结构

- `docs/`: 文档正文
- `mkdocs.yml`: 站点配置与导航
- `stylesheets/` 与 `javascripts/`: 主题样式与脚本扩展

## 贡献说明

欢迎通过 Issue 或 Pull Request 提交内容修订、错字修复和结构优化建议。