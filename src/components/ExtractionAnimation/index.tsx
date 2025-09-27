import React from 'react';
import styles from './index.module.less';

interface Student {
  id: string;
  name: string;
  class?: string;
}

interface ExtractionAnimationProps {
  students: Student[];
}

/**
 * 抽取动画组件
 * 负责展示抽取过程中的动画效果
 */
const ExtractionAnimation: React.FC<ExtractionAnimationProps> = ({ students }) => {
  return (
    <div className={styles.fullscreenExtractionOverlay}>
      <div className={styles.particlesContainer}></div>
      <div className={styles.extractingAnimation}>
        <span className={styles.spinnerLarge}></span>
        <span className={styles.extractingTextLarge}>抽取中...</span>
        {students.length > 0 && (
          <div className={styles.flashingStudentsNames}>
            {students.map((student, index) => (
              <span
                key={index}
                className={styles.flashingStudentName}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {student.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractionAnimation;