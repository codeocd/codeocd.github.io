export type Language = 'en' | 'zh';

export type LocalizedText = Record<Language, string>;

export type Link = {
  label: LocalizedText;
  href: string;
};

export type AcceptedPublication = {
  key: string;
  shortName: string;
  title: string;
  authors: string;
  venueLabel: string;
  venue: string;
  description: LocalizedText;
  image: string | null;
  imageAlt: LocalizedText;
  preprintUrl: string | null;
  codeUrl: string | null;
};

export type PublicationPresentation = {
  shortName: string;
  title: string;
  venueLabel: string;
  image: string | null;
  imageAlt: LocalizedText;
  description: LocalizedText | null;
  extraLinks: Link[];
};

export type TimelineEntry = {
  period: string;
  organization?: LocalizedText;
  institution?: LocalizedText;
  role?: LocalizedText;
  degree?: LocalizedText;
  note?: LocalizedText;
  description?: LocalizedText;
  logo: string | null;
  logoAlt: string;
  secondaryLogo?: string | null;
  secondaryLogoAlt?: string | null;
  href: string | null;
};

export type IntellectualPropertyEntry = {
  key: string;
  kind: 'patent' | 'copyright';
  year: LocalizedText;
  type: LocalizedText;
  title: LocalizedText;
  number: string;
  detail: LocalizedText;
  image: string | null;
  imageAlt: LocalizedText;
};

export const profile = {
  name: {
    en: 'Haibiao Zhang',
    zh: '张海彪'
  },
  role: {
    en: 'Ph.D. Candidate · Computer Technology',
    zh: '计算机技术专业博士研究生'
  },
  headline: {
    en: 'Data-driven AI for gyrotron and fusion engineering systems.',
    zh: '面向回旋管与聚变工程系统的数据驱动人工智能。'
  },
  statement: {
    en: 'I work on artificial intelligence for large engineering systems, with a focus on data-driven modeling, fault prediction, Transformer-based time-series analysis, and practical AI systems for nuclear-fusion engineering.',
    zh: '我的研究面向大型工程系统中的人工智能，聚焦数据驱动建模、故障预测、基于 Transformer 的时间序列分析，以及核聚变工程中的人工智能应用。'
  },
  location: {
    en: 'Hefei, China',
    zh: '中国 · 合肥'
  },
  portrait: '/images/profile/haibiao-zhang.jpg',
  scholarId: '_liHsuEAAAAJ',
  email: 'haibiaozhang@mail.ustc.edu.cn',
  links: {
    github: 'https://github.com/codeocd',
    scholar: 'https://scholar.google.com/citations?user=_liHsuEAAAAJ&hl=zh-CN',
    supervisor: 'http://www.ipp.cas.cn/bm/wb/rcdw/dsjj/202009/t20200907_365792.html',
    wechat: '/images/contact/wechat-haibiao-zhang.png'
  }
} as const;

export const about = {
  eyebrow: { en: 'About', zh: '关于我' },
  title: {
    en: 'AI that respects physics, operations, and the people who rely on them.',
    zh: '让人工智能真正服务于物理规律、工程运行与可靠决策。'
  },
  body: {
    en: 'I am a Ph.D. candidate in Computer Technology at the University of Science and Technology of China (USTC). My research connects machine learning with gyrotron-based electron cyclotron resonance heating (ECRH) systems, turning experimental and simulation data into safer operating boundaries, fault predictions, and engineering decisions.',
    zh: '我是中国科学技术大学（USTC）计算机技术专业博士研究生。我的研究将机器学习与回旋管电子回旋共振加热（ECRH）系统相结合，把实验与仿真数据转化为更安全的运行边界、故障预测结果和工程决策依据。'
  },
  advisor: {
    en: 'Advisor: Researcher Xiaojie Wang · Institute of Plasma Physics, Chinese Academy of Sciences',
    zh: '导师：王晓洁研究员 · 中国科学院等离子体物理研究所'
  }
} as const;

export const researchThemes = [
  {
    index: '01',
    title: { en: 'Data-driven Engineering AI', zh: '数据驱动工程智能' },
    description: {
      en: 'Learning useful operating knowledge from expensive simulations and real experimental data.',
      zh: '从高成本仿真与真实实验数据中学习可用于工程运行的知识。'
    }
  },
  {
    index: '02',
    title: { en: 'Fault Diagnosis & Prediction', zh: '故障诊断与预测' },
    description: {
      en: 'Estimating equipment health and identifying abnormal RF oscillation under complex parameter interactions.',
      zh: '在复杂参数交互下评估设备健康状态并识别异常射频振荡。'
    }
  },
  {
    index: '03',
    title: { en: 'Time-series Representation', zh: '时间序列表征' },
    description: {
      en: 'Using Transformer and ensemble models to capture temporal structure in operational signals.',
      zh: '利用 Transformer 与集成模型刻画运行信号中的时间结构。'
    }
  },
  {
    index: '04',
    title: { en: 'Tolerance-aware Design', zh: '公差感知设计' },
    description: {
      en: 'Translating uncertainty and transport validity into actionable design and screening rules.',
      zh: '将不确定性与输运有效性转化为可执行的设计和筛选规则。'
    }
  }
] as const;

export const news = [
  {
    date: '2026',
    text: {
      en: 'TWCS, a tolerance-aware workflow for conformal screening of gyrotron electron-gun designs, is under review at AAAI 2027.',
      zh: '公差感知回旋管电子枪设计筛选框架 TWCS 正在参加 AAAI 2027 审稿。'
    },
    href: null
  },
  {
    date: '2025.10',
    text: {
      en: 'Research on electron cyclotron wave absorption and current drive in the CFEDR H-mode scenario appeared in Plasma Science and Technology.',
      zh: '关于 CFEDR 常规 H 模等离子体中电子回旋波吸收与电流驱动的研究发表于《Plasma Science and Technology》。'
    },
    href: 'https://doi.org/10.1088/2058-6272/ade423'
  },
  {
    date: '2025.03',
    text: {
      en: 'A robust learning-based fault prediction method for gyrotron systems appeared in AIP Advances.',
      zh: '关于回旋管系统的鲁棒学习故障预测方法发表于《AIP Advances》。'
    },
    href: 'https://doi.org/10.1063/5.0257521'
  },
  {
    date: '2024.04',
    text: {
      en: 'Our data-driven diagnosis method for abnormal RF oscillation of gyrotrons appeared in AIP Advances.',
      zh: '关于回旋管异常射频振荡的数据驱动故障诊断方法发表于《AIP Advances》。'
    },
    href: 'https://doi.org/10.1063/5.0195400'
  }
] as const;

export const acceptedPublications: AcceptedPublication[] = [];

export const publicationPresentation: PublicationPresentation[] = [
  {
    shortName: 'RF Oscillation Diagnosis',
    title: 'Data-driven fault diagnosis method for abnormal RF oscillation of gyrotrons',
    venueLabel: 'AIP Advances · 2024',
    image: '/images/publications/rf-oscillation-diagnosis.jpg',
    imageAlt: {
      en: 'Data-driven fault diagnosis for abnormal RF oscillation of gyrotrons',
      zh: '回旋管异常射频振荡的数据驱动故障诊断'
    },
    description: {
      en: 'A KNN-RForest classification model for identifying abnormal RF oscillation faults and estimating gyrotron state probabilities across power levels.',
      zh: '提出 KNN-RForest 分类模型，用于识别异常射频振荡故障，并估计不同功率水平下的回旋管状态概率。'
    },
    extraLinks: [
      { label: { en: 'DOI', zh: 'DOI' }, href: 'https://doi.org/10.1063/5.0195400' }
    ]
  },
  {
    shortName: 'Robust Fault Prediction',
    title: 'Robust learning-based fault prediction method for gyrotron system',
    venueLabel: 'AIP Advances · 2025',
    image: '/images/publications/robust-fault-prediction.png',
    imageAlt: {
      en: 'Robust learning-based fault prediction for a gyrotron system',
      zh: '回旋管系统的鲁棒学习故障预测'
    },
    description: {
      en: 'A GMM–MLP data-processing framework that identifies noisy experimental records and maintains stable fault-diagnosis performance as noise increases.',
      zh: '提出 GMM–MLP 数据处理框架，识别实验中的噪声记录，并在噪声比例增加时保持稳定的故障诊断性能。'
    },
    extraLinks: [
      { label: { en: 'DOI', zh: 'DOI' }, href: 'https://doi.org/10.1063/5.0257521' }
    ]
  },
  {
    shortName: 'ECRH Launcher',
    title: 'Simulation analysis of the motion accuracy of the ECRH launcher steering mechanism based on ADAMS',
    venueLabel: 'Fusion Engineering and Design · 2025',
    image: '/images/publications/ecrh-launcher.png',
    imageAlt: {
      en: 'ADAMS-based simulation analysis of ECRH launcher steering accuracy',
      zh: '基于 ADAMS 的 ECRH 载荷转向机构运动精度仿真分析'
    },
    description: {
      en: 'An engineering study of how manufacturing errors and rotary-joint clearances affect the motion accuracy of an ECRH launcher steering mechanism.',
      zh: '研究制造误差与转动副间隙对 ECRH 载荷转向机构运动精度的影响。'
    },
    extraLinks: [
      { label: { en: 'DOI', zh: 'DOI' }, href: 'https://doi.org/10.1016/j.fusengdes.2024.114774' }
    ]
  },
  {
    shortName: 'CFEDR ECCD',
    title: 'Investigation of electron cyclotron wave absorption and current drive in CFEDR conventional H-mode scenario',
    venueLabel: 'Plasma Science and Technology · 2025',
    image: '/images/publications/cfedr-eccd.png',
    imageAlt: {
      en: 'Electron cyclotron wave absorption and current drive analysis for CFEDR',
      zh: 'CFEDR 电子回旋波吸收与电流驱动分析'
    },
    description: {
      en: 'A systematic TORAY study of frequency and launching-position effects on electron cyclotron absorption and current-drive efficiency for CFEDR.',
      zh: '利用 TORAY 系统研究频率与发射位置对 CFEDR 电子回旋波吸收和电流驱动效率的影响。'
    },
    extraLinks: [
      { label: { en: 'DOI', zh: 'DOI' }, href: 'https://doi.org/10.1088/2058-6272/ade423' }
    ]
  }
];

export const collaborativePublicationTitles = [
  'Robust learning-based fault prediction method for gyrotron system',
  'Simulation analysis of the motion accuracy of the ECRH launcher steering mechanism based on ADAMS',
  'Investigation of electron cyclotron wave absorption and current drive in CFEDR conventional H-mode scenario'
] as const;

export const ongoingResearch = [
  {
    key: 'twcs',
    title: 'TWCS (Trajectory-Witness Conformal Surrogate): A Tolerance-Aware Workflow for Conformal Screening of Gyrotron Electron-Gun Designs in Fusion Heating Systems',
    status: {
      en: 'AAAI 2027 · Under Review',
      zh: 'AAAI 2027 · 在审'
    },
    description: {
      en: 'A validity-aware surrogate workflow that combines transport assessment, conditional beam-output prediction, and conformal screening under declared manufacturing and magnetic-field tolerances.',
      zh: '一种有效性感知的代理建模流程，结合输运评估、束流输出条件预测与保形筛选，在给定制造和磁场公差下支持电子枪设计判断。'
    },
    image: '/images/publications/twcs.png'
  }
] as const;

export const education: TimelineEntry[] = [
  {
    period: 'Sep 2021–Present',
    institution: {
      en: 'University of Science and Technology of China (USTC)',
      zh: '中国科学技术大学（USTC）'
    },
    degree: {
      en: 'Ph.D. Candidate in Computer Technology',
      zh: '计算机技术专业博士研究生'
    },
    note: {
      en: 'Research focus: AI-driven modeling and fault prediction for gyrotron-based heating and current-drive systems · Hefei, China',
      zh: '研究方向：基于人工智能的回旋管加热与电流驱动系统建模及故障预测 · 中国合肥'
    },
    logo: '/images/institutions/ustc.png',
    logoAlt: 'USTC',
    secondaryLogo: null,
    secondaryLogoAlt: null,
    href: 'https://www.ustc.edu.cn/'
  },
  {
    period: 'Sep 2017–Jul 2021',
    institution: {
      en: 'Southwest Forestry University (SWFU)',
      zh: '西南林业大学（SWFU）'
    },
    degree: {
      en: 'B.E. in Communication Engineering',
      zh: '通信工程工学学士'
    },
    note: {
      en: 'GPA 3.79/4.00 · Rank 1/36 · Kunming, China',
      zh: 'GPA 3.79/4.00 · 专业排名 1/36 · 中国昆明'
    },
    logo: '/images/institutions/swfu.png',
    logoAlt: 'SWFU',
    secondaryLogo: null,
    secondaryLogoAlt: null,
    href: 'https://www.swfu.edu.cn/'
  }
];

export const experience: TimelineEntry[] = [
  {
    period: 'Sep 2024–Dec 2025',
    organization: {
      en: 'Data-driven Optimization of Electron Gun Parameters and Operating Boundaries',
      zh: '电子枪参数与运行边界的数据驱动优化'
    },
    role: {
      en: 'Research project · Institute of Plasma Physics, Chinese Academy of Sciences · Advisor: Researcher Xiaojie Wang',
      zh: '科研项目 · 中国科学院等离子体物理研究所 · 导师：王晓洁研究员'
    },
    description: {
      en: 'Developed AI models for safe operating boundaries, combined sensitivity analysis with targeted sampling to improve charged-particle simulation efficiency, and translated predictions into engineering constraints. The work also introduced the TWCS tolerance-aware screening framework.',
      zh: '构建安全运行边界人工智能模型，结合敏感性分析与定向采样提高带电粒子仿真效率，并将模型预测转化为工程约束；同时提出 TWCS 公差感知设计筛选框架。'
    },
    logo: '/images/institutions/ipp-cas.png',
    logoAlt: 'IPP CAS',
    href: null
  },
  {
    period: 'Sep 2022–Jun 2024',
    organization: {
      en: 'Fault Prediction of Gyrotron Operating Parameters',
      zh: '回旋管运行参数故障预测'
    },
    role: {
      en: 'Research project · Institute of Plasma Physics, Chinese Academy of Sciences · Advisor: Researcher Xiaojie Wang',
      zh: '科研项目 · 中国科学院等离子体物理研究所 · 导师：王晓洁研究员'
    },
    description: {
      en: 'Curated gyrotron operational data and designed Transformer-based and ensemble models for time-series prediction and fault-state estimation. The resulting work supported publications in AIP Advances.',
      zh: '整理回旋管运行配置数据，设计基于 Transformer 与集成学习的时间序列预测和故障状态估计模型，相关成果发表于《AIP Advances》。'
    },
    logo: '/images/institutions/ipp-cas.png',
    logoAlt: 'IPP CAS',
    href: null
  },
  {
    period: 'Aug 2025',
    organization: {
      en: 'CCTEG Changzhou Research Institute',
      zh: '中煤科工集团常州研究院'
    },
    role: {
      en: 'Research internship',
      zh: '科研实习'
    },
    description: {
      en: 'Completed safety training and discussed large-model enablement for mine monitoring and control, lightweight inference, edge deployment, and vector encoding for heterogeneous monitoring data.',
      zh: '完成安全教育培训，并围绕矿山监测管控中的大模型赋能、模型轻量化、边缘部署和多源异构监测数据向量化编码开展技术交流。'
    },
    logo: '/images/institutions/ccteg-changzhou.png',
    logoAlt: 'CCTEG Changzhou Research Institute',
    href: null
  },
  {
    period: 'Sep 2022–Present',
    organization: {
      en: 'ECRH System Experimental Operation',
      zh: 'ECRH 系统实验运行'
    },
    role: {
      en: 'Experimental operation and reliability analysis',
      zh: '实验运行与可靠性分析'
    },
    description: {
      en: 'Participated in ECRH installation, commissioning, operation, data collection, fault investigation, and technical test reporting.',
      zh: '参与 ECRH 系统安装、调试、运行、实验数据采集、故障现象分析和技术测试报告编制。'
    },
    logo: '/images/institutions/ipp-cas.png',
    logoAlt: 'IPP CAS',
    href: null
  },
  {
    period: 'Jun–Sep 2023',
    organization: {
      en: 'AI & Nuclear Fusion Science Popularization Volunteer',
      zh: '人工智能与核聚变科普志愿者'
    },
    role: {
      en: 'Science communication and public service',
      zh: '科学传播与志愿服务'
    },
    description: {
      en: 'Organized science activities for more than 1,000 primary and secondary school students, completed 300+ volunteer hours, and received Outstanding Volunteer and USTC One-Star Volunteer recognition.',
      zh: '面向 1,000 余名中小学生组织科普活动，累计志愿服务 300 余小时，获“优秀志愿者”和中国科学技术大学“一星志愿者”荣誉。'
    },
    logo: null,
    logoAlt: 'Volunteer service',
    href: null
  }
];

export const openSource = [
  {
    name: 'senpai-skill',
    href: 'https://github.com/zhang-haichao/senpai-skill',
    language: 'Core Contributor',
    description: {
      en: 'Core Contributor · A reusable skill project for structured AI-assisted workflows.',
      zh: '核心贡献者 · 面向结构化 AI 辅助工作流的可复用技能项目。'
    }
  }
] as const;

export const intellectualProperty: IntellectualPropertyEntry[] = [
  {
    key: 'cn120029768b',
    kind: 'patent',
    year: { en: 'Granted 2026-03-10', zh: '2026-03-10 授权' },
    type: { en: 'Granted Invention Patent', zh: '已授权发明专利' },
    title: {
      en: 'Distributed Control and Dynamic Scheduling Method and System for ECRH Systems',
      zh: '一种 ECRH 系统分布式控制及其动态调度方法及系统'
    },
    number: 'CN 120029768 B',
    detail: {
      en: 'Patent holder: Hefei Institutes of Physical Science, Chinese Academy of Sciences.',
      zh: '专利权人：中国科学院合肥物质科学研究院。'
    },
    image: '/images/ip/cn120029768b.png',
    imageAlt: {
      en: 'CN 120029768 B invention patent record',
      zh: 'CN 120029768 B 发明专利记录'
    }
  },
  {
    key: 'cn121619724b',
    kind: 'patent',
    year: { en: 'Granted 2026-03-31', zh: '2026-03-31 授权' },
    type: { en: 'Granted Invention Patent', zh: '已授权发明专利' },
    title: {
      en: 'Fast Voltage Regulation Method and System for Gyrotrons Based on Long-Pulse Power Forbidden-Zone Prediction',
      zh: '一种基于长脉冲功率禁区预判的回旋管快速调压方法及系统'
    },
    number: 'CN 121619724 B',
    detail: {
      en: 'Patent holder: Hefei Institutes of Physical Science, Chinese Academy of Sciences.',
      zh: '专利权人：中国科学院合肥物质科学研究院。'
    },
    image: '/images/ip/cn121619724b.png',
    imageAlt: {
      en: 'CN 121619724 B invention patent record',
      zh: 'CN 121619724 B 发明专利记录'
    }
  },
  {
    key: 'software-2025sr1824848',
    kind: 'copyright',
    year: { en: 'Registered 2025-09-19', zh: '2025-09-19 登记' },
    type: { en: 'Software Copyright', zh: '计算机软件著作权' },
    title: {
      en: 'Gyrotron Operating-State Probability Prediction System V1.0',
      zh: '回旋管运行状态概率预测系统 V1.0'
    },
    number: '2025SR1824848',
    detail: {
      en: 'Copyright holder: Hefei Institutes of Physical Science, Chinese Academy of Sciences.',
      zh: '著作权人：中国科学院合肥物质科学研究院。'
    },
    image: '/images/ip/2025sr1824848.png',
    imageAlt: {
      en: 'Software copyright record 2025SR1824848',
      zh: '软件著作权登记记录 2025SR1824848'
    }
  },
  {
    key: 'software-2020sr0059618',
    kind: 'copyright',
    year: { en: 'Registered 2020-01-13', zh: '2020-01-13 登记' },
    type: { en: 'Software Copyright', zh: '计算机软件著作权' },
    title: {
      en: 'Comprehensive Signal Detection and Analysis Software for Communication Equipment V1.0',
      zh: '通信设备信号综合检测分析软件 V1.0'
    },
    number: '2020SR0059618',
    detail: {
      en: 'Completed and first published on 2019-11-26.',
      zh: '开发完成及首次发表日期：2019-11-26。'
    },
    image: '/images/ip/2020sr0059618.png',
    imageAlt: {
      en: 'Software copyright record 2020SR0059618',
      zh: '软件著作权登记记录 2020SR0059618'
    }
  }
];

export const skills = [
  {
    label: { en: 'Programming & AI', zh: '编程与人工智能' },
    value: { en: 'Python (NumPy, SciPy, scikit-learn), PyTorch, TensorFlow, C', zh: 'Python（NumPy、SciPy、scikit-learn）、PyTorch、TensorFlow、C' }
  },
  {
    label: { en: 'Engineering Tools', zh: '工程工具' },
    value: { en: 'MATLAB, CST Particle Studio, Git, Docker, data visualization', zh: 'MATLAB、CST Particle Studio、Git、Docker、数据可视化' }
  },
  {
    label: { en: 'Instrumentation', zh: '实验仪器' },
    value: { en: 'Spectrum analyzer, vector network analyzer, oscilloscope, thermal imager', zh: '频谱分析仪、矢量网络分析仪、示波器、热成像仪' }
  },
  {
    label: { en: 'Languages', zh: '语言能力' },
    value: { en: 'Chinese (native); English (CET-6, LSCAT Translation Level 1)', zh: '中文（母语）；英语（CET-6、LSCAT 翻译水平一级）' }
  }
] as const;

export const awards = [
  {
    year: '2021–2025',
    title: {
      en: 'First-Class Academic Scholarship, University of Science and Technology of China',
      zh: '中国科学技术大学一等学业奖学金'
    }
  },
  {
    year: 'Jun 2021',
    title: {
      en: 'Yunnan Provincial Outstanding Graduate',
      zh: '云南省优秀毕业生'
    }
  },
  {
    year: 'Dec 2019',
    title: {
      en: 'National Scholarship',
      zh: '国家奖学金'
    }
  },
  {
    year: 'Nov 2019',
    title: {
      en: 'National Second-Class Award, National Undergraduate Mathematical Modeling Competition',
      zh: '全国大学生数学建模竞赛国家二等奖'
    }
  }
] as const;
