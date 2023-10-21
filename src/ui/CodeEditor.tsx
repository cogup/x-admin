import React, { useEffect } from 'react';
import UiwCodeEditor from '@uiw/react-textarea-code-editor';
import { theme } from 'antd';

interface CodeEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const CodeEditor = (props: CodeEditorProps): React.ReactElement => {
  const [code, setCode] = React.useState(props.defaultValue ?? '');
  const [language, setLanguage] = React.useState<string | undefined>(undefined);

  const { token } = theme.useToken();

  useEffect(() => {
    if (props.onChange) {
      props.onChange(code);
    }

    const detect = detectLanguage(code);

    if (detect.score > 0.7) {
      setLanguage(detect.language);
    } else {
      setLanguage('markdown');
    }
  }, [code]);

  return (
    <UiwCodeEditor
      value={code}
      language={language}
      onChange={(e: any): void => setCode(e.target.value)}
      padding={15}
      minHeight={200}
      style={{
        fontSize: 12,
        backgroundColor: token.colorBgSpotlight,
        borderRadius: token.borderRadius,
        borderColor: token.colorBorder,
        border: '1px solid',
        fontFamily:
          'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
      }}
    />
  );
};

function detectLanguage(code: string): { language: string; score: number } {
  const languagePatterns: { [language: string]: RegExp[] } = {
    markdown: [/^#\s+.*/i],
    regex: [/\/(.+)\/[gimuy]{0,5}/i],
    html: [
      /<!doctype html>/i,
      /<html/i,
      /<body/i,
      /<div/i,
      /<span/i,
      /<h1/i,
      /<p/i,
      /<a/i,
      /<img/i,
      /<table/i,
      /<form/i,
      /<script/i
    ],
    json: [/^[\{\[]/i],
    yaml: [/^\s*[\-]{3}/i],
    xml: [/^<\?xml/i],
    sql: [/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i],
    bash: [/^#!/i],
    typescript: [
      /\b(import|from|const|let|var|function|interface|class|enum)\b/i
    ],
    javascript: [
      /\b(function|class|const|let|var|if|for|while|switch|try|catch)\b/i,
      /\bconsole\.(log|error|warn|info)\b/i,
      /<script/i
    ]
  };

  let maxScore = 0;
  let detectedLanguage: string | undefined;

  for (const language in languagePatterns) {
    const patterns = languagePatterns[language];
    let languageScore = 0;

    for (const pattern of patterns) {
      const matches = code.match(pattern);
      if (matches && matches.length > 0) {
        languageScore += matches.length;
      }
    }

    if (languageScore > maxScore) {
      maxScore = languageScore;
      detectedLanguage = language;
    }
  }

  if (detectedLanguage) {
    return { language: detectedLanguage, score: maxScore };
  }

  return { language: 'markdown', score: 1 };
}
