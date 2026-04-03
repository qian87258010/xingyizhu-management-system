export type ThemeType = 'cyber' | 'gold' | 'dark' | 'light';

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'cyber',
    name: '赛博风格',
    description: '未来科技感，霓虹光效',
    preview: {
      primary: '#00ffff',
      secondary: '#8a2be2',
      background: '#0a0e27'
    }
  },
  {
    id: 'gold',
    name: '黑金风格',
    description: '奢华大气，商务精英',
    preview: {
      primary: '#d4af37',
      secondary: '#ffd700',
      background: '#1a1a1a'
    }
  },
  {
    id: 'dark',
    name: '极简黑风格',
    description: '简约现代，专注高效',
    preview: {
      primary: '#ffffff',
      secondary: '#666666',
      background: '#0d0d0d'
    }
  },
  {
    id: 'light',
    name: '简约白风格',
    description: '清新明亮，舒适护眼',
    preview: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff'
    }
  }
];
