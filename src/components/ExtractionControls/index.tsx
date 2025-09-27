import React from 'react';
import styles from './index.module.less';

interface ExtractionControlsProps {
  isExtracting: boolean;
  hasStudents: boolean;
  onStart: () => void;
  onStop: () => void;
}

/**
 * 抽取控制按钮组件
 * 负责抽取过程的控制
 */
const ExtractionControls: React.FC<ExtractionControlsProps> = ({
  isExtracting,
  hasStudents,
  onStart,
  onStop
}) => {
  return <div className={styles.floatingControls}>
    {
      !isExtracting ? (
        <button
          onClick={onStart}
          disabled={isExtracting || !hasStudents}
          className={styles.startBtnLarge}
          title={hasStudents ? '点击开始抽取学生' : '请先导入学生数据'}
        >
          <span className="btnIcon">🎯</span>
          <span className="btnText">开始抽取</span>
        </button>
      ) : (
        <button
          onClick={onStop}
          disabled={!isExtracting}
          className={styles.stopBtnLarge}
        >
          <span className="btnIcon">🛑</span>
          <span className="btnText">停止抽取</span>
        </button>
      )
    }
  </div>

};

export default ExtractionControls;