export interface LiveCase {
  id: string;
  title?: string;
  links: string[];
}

export const liveCases: LiveCase[] = [
  {
    id: '1',
    title: '示例直播案例 1',
    links: [
      'https://www.bilibili.com/video/BV1GJ411x7h7',
      'https://example.com/live1'
    ]
  },
  {
    id: '2',
    title: '6天赔光90万！小白深陷骗局还不自知！',
    links: [
      'https://www.bilibili.com/video/BV1Rieoz9E93'
    ]
  },
    {
    id: '3',
    title: '普通人看不懂的商业模式 震撼首发 你觉得咋样？（完整版）',
    links: [
      'https://www.bilibili.com/video/BV1hnzFBjEpe'
    ]
  }
];
