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
    links: [
      'https://www.bilibili.com/video/BV1uT4y1P7vX'
    ]
  }
];
