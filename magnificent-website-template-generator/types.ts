
export interface GeneratedTemplate {
  name: string;
  html: string;
  css: string;
  description: string; 
}

export type AppView = 'input' | 'preview' | 'cart' | 'checkout' | 'download';
