import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

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
      lang="zh-CN"
      loading="lazy"
    />
  );
}