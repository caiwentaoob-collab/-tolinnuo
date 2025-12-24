// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Experience from './components/Experience';

// 修复点4：React 入口必须写在 TSX 文件中，由 Vite 编译
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Experience />);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
