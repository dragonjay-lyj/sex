import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 
                        border border-red-500/30 transform transition-all
                        animate-[fadeIn_0.5s_ease-out,slideUp_0.5s_ease-out]">
            <div className="flex flex-col items-center space-y-6">
              {/* 动态错误图标 */}
              <div className="animate-pulse">
                <svg
                  className="w-20 h-20 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* 错误内容 */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-red-400 
                             bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
                  游戏遇到异常
                </h2>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  发生意外错误，请尝试刷新页面。
                  如果问题持续存在，请联系我们的支持团队。
                </p>

                {/* 错误详情（开发模式显示） */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg max-h-40 overflow-auto">
                    <code className="text-xs text-red-300 break-words">
                      {this.state.error.toString()}
                    </code>
                  </div>
                )}
              </div>

              {/* 操作按钮组 */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <button
                  onClick={this.handleRefresh}
                  className="flex-1 flex items-center justify-center gap-2
                           bg-red-600 hover:bg-red-700 text-white font-semibold
                           py-3 px-6 rounded-xl transition-all duration-300
                           transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="刷新页面">
                  <svg
                    className="w-5 h-5 animate-spin-once"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>立即刷新</span>
                </button>

                <a
                  href="mailto:support@controlgame.com"
                  className="flex-1 flex items-center justify-center gap-2
                           border border-red-500/50 hover:border-red-400 text-red-400
                           hover:text-red-300 font-semibold py-3 px-6 rounded-xl
                           transition-all duration-300 transform hover:scale-105
                           active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>联系支持</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;