// 粒子效果管理器

/**
 * 粒子效果管理器类
 */
class ParticleManager {
  private container: HTMLElement | null = null;
  private particleInterval: number | null = null;

  /**
   * 设置粒子效果容器
   * @param container 粒子效果容器元素
   */
  setContainer(container: HTMLElement | null): void {
    this.container = container;
  }

  /**
   * 创建单个粒子
   */
  private createParticle(): void {
    if (!this.container) return;

    const particle = document.createElement('div');
    const size = Math.random() * 10 + 2;

    // 设置基本样式
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = '0';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.willChange = 'transform, opacity';

    // 添加到DOM
    this.container.appendChild(particle);

    // 强制重绘
    void particle.offsetHeight;

    // 动画
    setTimeout(() => {
      if (particle.parentNode) {
        particle.style.transition = `all ${Math.random() * 3 + 2}s ease-out`;
        particle.style.transform = `translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 40 - 20}px)`;
        particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
      }
    }, 10);

    // 移除粒子
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 5000);
  }

  /**
   * 启动粒子效果
   */
  start(): void {
    if (!this.container || this.particleInterval !== null) return;

    // 立即创建一批粒子
    for (let i = 0; i < 20; i++) {
      setTimeout(() => this.createParticle(), i * 50);
    }

    // 持续创建粒子
    this.particleInterval = window.setInterval(() => this.createParticle(), 100);
  }

  /**
   * 停止粒子效果
   */
  stop(): void {
    if (this.particleInterval !== null) {
      clearInterval(this.particleInterval);
      this.particleInterval = null;
    }
    
    // 清理所有粒子
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * 检查粒子效果是否正在运行
   */
  isRunning(): boolean {
    return this.particleInterval !== null;
  }
}

export default new ParticleManager();