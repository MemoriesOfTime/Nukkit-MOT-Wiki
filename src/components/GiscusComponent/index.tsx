import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();
  const { i18n: { currentLocale } } = useDocusaurusContext();

  return (
    <Giscus    
      repo="MemoriesOfTime/Nukkit-MOT-Wiki"
      repoId="R_kgDOLuXZqQ"
      category="General"
      categoryId="DIC_kwDOLuXZqc4CtuuV"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={colorMode}
      lang={currentLocale === 'zh' ? 'zh-CN' : 'en'}
      loading="lazy"
    />
  );
}