import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '首页',
    link: '/introduction',
    activeMatch: '/introduction'
  },
  {
    text: '项目文档',
    link: '/my_project/01-project/01-项目1/01-介绍.md',
    activeMatch: '/my_project/'
  },
  {
    text: '前沿 & 工作',
    items: [
      { text: 'Bug万象集', link: '/categories/issues/index', activeMatch: '/categories/issues/' },
      { text: 'ChatGPT', link: '/categories/chatgpt/01-ChatGPT开源项目/01-GPT项目', activeMatch: '/categories/chatgpt/' },
      // { text: '"杂碎"逆袭史', link: '/categories/fragments/index', activeMatch: '/categories/fragments/' },
      // { text: '工具四海谈', link: '/categories/tools/index', activeMatch: '/categories/tools/' },
      // { text: '方案春秋志', link: '/categories/solutions/index', activeMatch: '/categories/solutions/' }
    ],
    activeMatch: '/categories/'
  },
  {
    text: '学习笔记',
    items: [
      { text: 'C语言基础快速入门', link: '/courses/c/index', activeMatch: '/courses/c/' },
      { text: 'C++基础快速入门', link: '/courses/c_plus/01-C++的基础/01-c++对c的扩展', activeMatch: '/courses/c_plus/' },
      { text: 'Python基础快速入门', link: '/courses/python/01-python基础篇/01-python基础', activeMatch: '/courses/python/' },
      { text: '唐宇迪AI课程', link: '/courses/tangyudi/02-机器学习篇/01-线性回归', activeMatch: '/courses/tangyudi/' },
      { text: '正点原子Linux课程', link: '/courses/yuanzi/03-QT应用开发和部署/01-linux安装qt.md', activeMatch: '/courses/yuanzi/' },
    ],
    activeMatch: '/courses/'
  },
  {
    text: '我的标签',
    link: '/tags',
    activeMatch: '/tags'
  },
  // {
  //   text: '我的归档',
  //   link: '/archives',
  //   activeMatch: '/archives'
  // },
  {
    text: '关于',
    items: [
      { text: '关于知识库', link: '/about/index', activeMatch: '/about/index' },
      { text: '关于我', link: '/about/me', activeMatch: '/about/me' },
      { text: '赞助', link: '/about/donate', activeMatch: '/about/donate'},
      { text: '在线体验', link: '/about/see', activeMatch: '/about/see'},
      { text: '我的归档', link: '/archives', activeMatch: '/archives'}
    ],
    activeMatch: '/about/' // // 当前页面处于匹配路径下时, 对应导航菜单将突出显示
  },
];