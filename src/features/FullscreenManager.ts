// 全屏管理模块

// 扩展类型定义
interface DocumentWithFullscreen extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * 全屏管理器类
 */
class FullscreenManager {
  private onFullscreenChange?: (isFullscreen: boolean) => void;
  private changeHandler?: () => void;

  /**
   * 请求进入全屏
   */
  async requestFullscreen(): Promise<void> {
    try {
      const docEl = document.documentElement as HTMLElementWithFullscreen;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error attempting to enable full-screen mode:', error);
      throw error;
    }
  }

  /**
   * 退出全屏
   */
  async exitFullscreen(): Promise<void> {
    try {
      const doc = document as DocumentWithFullscreen;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error('Error attempting to exit full-screen mode:', error);
      throw error;
    }
  }

  /**
   * 检查当前是否处于全屏状态
   */
  isFullscreen(): boolean {
    const doc = document as DocumentWithFullscreen;
    return !!(doc.fullscreenElement || 
              doc.webkitFullscreenElement || 
              doc.msFullscreenElement);
  }

  /**
   * 监听全屏状态变化
   * @param callback 状态变化时的回调函数
   */
  startListening(callback: (isFullscreen: boolean) => void): void {
    this.onFullscreenChange = callback;
    this.changeHandler = () => {
      if (this.onFullscreenChange) {
        this.onFullscreenChange(this.isFullscreen());
      }
    };

    document.addEventListener('fullscreenchange', this.changeHandler);
    document.addEventListener('webkitfullscreenchange', this.changeHandler);
    document.addEventListener('MSFullscreenChange', this.changeHandler);
  }

  /**
   * 停止监听全屏状态变化
   */
  stopListening(): void {
    if (this.changeHandler) {
      document.removeEventListener('fullscreenchange', this.changeHandler);
      document.removeEventListener('webkitfullscreenchange', this.changeHandler);
      document.removeEventListener('MSFullscreenChange', this.changeHandler);
      this.changeHandler = undefined;
    }
    this.onFullscreenChange = undefined;
  }
}

export default new FullscreenManager();