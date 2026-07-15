(function () {
  function isEnglishSite() {
    var p = window.location.pathname || "/";
    return p.indexOf('/en/') !== -1 || p === '/en' || p.endsWith('/en');
  }

  function mapLabel(text) {
    var dict = {
      '首页': 'Home',
      '项目背景': 'Project Background',
      '系统总览': 'System Overview',
      '总体架构': 'System Architecture',
      '机械设计': 'Mechanical Design',
      '概览': 'Overview',
      '构型设计': 'Robot Configuration Design',
      '电机选型': 'Motor Selection',
      '结构件设计': 'Structural Component Design',
      '材料与加工': 'Materials and Manufacturing',
      '装配顺序': 'Assembly Sequence',
      '电气系统': 'Electrical System',
      '电路设计及PCB制作': 'Circuit Design and PCB Production',
      '通信系统': 'Communication System',
      '电机通讯': 'Motor CAN Communication Driver',
      '进程间通讯': 'Inter-Process Communication',
      'Robot IPC实现': 'Robot-IPC Framework Design and Implementation',
      '仿真模型与数据': 'Simulation, Models, and Data',
      'XML和USD': 'XML and USD Models',
      '运动重定向': 'Motion Retargeting',
      '运动控制': 'Motion Control',
      '电机系统辨识': 'Motor System Identification',
      '开发指南': 'Development Guide',
      '环境配置与测试': 'Environment Setup and Testing',
      '结语': 'Conclusion'
    };
    return dict[text] || text;
  }

  function localizeDocumentTitle() {
    if (!isEnglishSite()) return;

    var path = window.location.pathname || '/';
    var siteSuffix = ' - MOS-9';
    var byPath = {
      '/en/': 'MOS-9 Open Documentation',
      '/en/index.html': 'MOS-9 Open Documentation',
      '/en/robocup_intro/': 'Project Background',
      '/en/overview/architecture/': 'System Architecture',
      '/en/mechanical/': 'Mechanical Design Overview',
      '/en/mechanical/body-structure/': 'Robot Configuration Design',
      '/en/mechanical/motor_selection/': 'Motor Selection',
      '/en/mechanical/link_design/': 'Structural Component Design',
      '/en/mechanical/materials/': 'Materials and Manufacturing',
      '/en/mechanical/assembly_sequence/': 'Assembly Sequence',
      '/en/electronics/': 'Electrical System Overview',
      '/en/electronics/circuit_design/': 'Circuit Design and PCB Production',
      '/en/communication/': 'Communication Framework Overview',
      '/en/communication/motor_communication/': 'Motor CAN Communication Driver',
      '/en/communication/robot_ipc/': 'Inter-Process Communication',
      '/en/communication/robot_ipc_framework/': 'Robot-IPC Framework Design and Implementation',
      '/en/simulation/': 'Simulation, Models, and Data',
      '/en/simulation/urdf/': 'URDF',
      '/en/simulation/xml_usd/': 'XML and USD Models',
      '/en/simulation/retarget/': 'Motion Retargeting',
      '/en/control/': 'Motion Control Overview',
      '/en/control/amp/': 'Adversarial Motion Priors (AMP)',
      '/en/control/mimic/': 'Mimic Imitation Learning',
      '/en/control/system_identification/': 'Motor System Identification',
      '/en/control/sim2real/': 'Sim2Real',
      '/en/development/setup/': 'Environment Setup and Testing',
      '/en/conclusion/': 'Conclusion',
      '/en/faq/': 'FAQ Overview'
    };

    var normalizedPath = path.endsWith('index.html') ? path.slice(0, -'index.html'.length) : path;
    var mapped = byPath[normalizedPath] || byPath[path];
    if (!mapped) return;

    document.title = mapped + siteSuffix;
  }

  function localizeNav() {
    if (!isEnglishSite()) return;

    var selectors = [
      '.md-nav__link',
      '.md-nav__title',
      '.md-tabs__link',
      '.md-ellipsis'
    ];

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var raw = (el.textContent || '').trim();
        if (!raw) return;
        var mapped = mapLabel(raw);
        if (mapped !== raw) {
          el.textContent = mapped;
        }
      });
    });
  }

  function run() {
    localizeNav();
    localizeDocumentTitle();
    setTimeout(localizeNav, 100);
    setTimeout(localizeDocumentTitle, 100);
    setTimeout(localizeNav, 600);
    setTimeout(localizeDocumentTitle, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
