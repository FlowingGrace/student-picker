import React from 'react';
import styles from './index.module.less';

interface Student {
  id: string;
  name: string;
  class?: string;
}

interface ExtractionResultProps {
  students: Student[];
  onClose: () => void;
}

/**
 * 抽取名单组件
 * 负责显示抽取结果
 */
const ExtractionResult: React.FC<ExtractionResultProps> = ({ students, onClose }) => {
  // 如果没有抽取到学生
  if (students.length === 0) {
    return (
      <div className={styles.fullscreenResultOverlay} onClick={onClose} style={{ cursor: 'pointer' }}>
        <div className={styles.extractedResultFullscreen}>
          <h3>抽取结果</h3>
          <div>
            <h4>抽取完成</h4>
            <p>请再次点击开始抽取</p>
          </div>
          <p className={styles.clickToClose}>点击任意位置继续</p>
        </div>
      </div>
    );
  }

  // 如果只抽取了一名学生（保持向后兼容）
  if (students.length === 1) {
    const [student] = students;
    return (
      <div className={styles.fullscreenResultOverlay} onClick={onClose} style={{ cursor: 'pointer' }}>
        <div className={styles.extractedResultFullscreen}>
          <h3>抽取结果</h3>
          <div>
            <h4>恭喜 {student.name}</h4>
            {student.class && <p>来自 {student.class}</p>}
          </div>
          <p className={styles.clickToClose}>点击任意位置继续</p>
        </div>
      </div>
    );
  }

  // 多名学生的情况
  return (
    <div className={styles.fullscreenResultOverlay} onClick={onClose} style={{ cursor: 'pointer' }}>
      <div className={styles.extractedResultFullscreen}>
        <h3>抽取结果</h3>
        <div className={styles.extractedStudentsList}>
          {students.map((student, index) => (
            <div key={student.id} className={styles.extractedStudentItem}>
              <span className={styles.rank}>{index + 1}.</span>
              <span className={styles.name}>{student.name}</span>
              {student.class && <span className={styles.class}>({student.class})</span>}
            </div>
          ))}
        </div>
        <p className={styles.clickToClose}>点击任意位置继续</p>
      </div>
    </div>
  );
};

export default ExtractionResult;