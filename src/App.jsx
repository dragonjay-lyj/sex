import React from 'react';
import pkg from 'react-router-dom';
const { BrowserRouter, Routes, Route } = pkg;
import GameOptions from './components/GameOptions';
import GameScreen from './components/GameScreen';

/**
 * App 组件 - 配置 React Router 路由
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameOptions />} />
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;