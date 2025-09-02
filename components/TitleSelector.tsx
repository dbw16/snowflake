'use client';

import React from 'react';
import { eligibleTitles, MilestoneMap } from '../constants';
import Select from './Select';

interface TitleSelectorProps {
  milestoneByTrack: MilestoneMap;
  currentTitle: string;
  setTitleFn: (title: string) => void;
}

const TitleSelector: React.FC<TitleSelectorProps> = ({
  milestoneByTrack,
  currentTitle,
  setTitleFn,
}) => {
  const titles = eligibleTitles(milestoneByTrack);
  const options = titles.map((title) => ({
    value: title,
    label: title,
  }));

  return (
    <Select
      name="title"
      value={currentTitle}
      onValueChange={(value) => {
        if (value) {
          setTitleFn(value);
        }
      }}
      options={options}
    />
  );
};

export default TitleSelector;
