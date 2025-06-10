// types/react-syntax-highlighter.d.ts

declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export const oneDark: any;
  export const vsDark: any;
  export const atomDark: any;
}

declare module "react-syntax-highlighter/dist/cjs/prism" {
  import * as React from "react";

  interface SyntaxHighlighterProps {
    language: string;
    style?: any;
    children: string;
    wrapLines?: boolean;
    showLineNumbers?: boolean;
    customStyle?: React.CSSProperties;
    codeTagProps?: any;
    PreTag?: string;
  }

  const SyntaxHighlighter: React.FC<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}
