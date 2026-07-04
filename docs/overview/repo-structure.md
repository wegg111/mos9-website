# 仓库结构

本页说明文档仓库及后续机器人代码仓库的组织方式。

## 当前文档站结构

```text
docs/
  overview/
  mechanical/
  electronics/
  communication/
  control/
  simulation/
  tutorials/
  reference/
  development/
  faq/
```

## 建议的代码仓库分层

- firmware: 下位机与驱动相关代码
- control: 状态估计、控制器和技能逻辑
- simulation: 模型、场景和训练脚本
- tools: 调试、日志和部署工具
- docs: 项目文档与架构说明

## 维护建议

保持文档目录与实际模块名一致，避免模型文件、控制话题和硬件部件命名脱节。