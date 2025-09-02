'use client';

import React from 'react';

interface KeyboardListenerProps {
  increaseFocusedMilestoneFn: () => void;
  selectNextTrackFn: () => void;
  decreaseFocusedMilestoneFn: () => void;
  selectPrevTrackFn: () => void;
}

class KeyboardListener extends React.Component<KeyboardListenerProps> {
  componentDidMount() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e)); // TK unlisten
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'ArrowUp':
        this.props.increaseFocusedMilestoneFn();
        e.preventDefault();
        break;
      case 'ArrowRight':
        this.props.selectNextTrackFn();
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.props.decreaseFocusedMilestoneFn();
        e.preventDefault();
        break;
      case 'ArrowLeft':
        this.props.selectPrevTrackFn();
        e.preventDefault();
        break;
    }
  }

  render() {
    return null;
  }
}

export default KeyboardListener;
