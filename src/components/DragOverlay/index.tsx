import React from 'react';
import styles from './index.module.less';

interface DragOverlayProps {
  isDragging: boolean;
}

/**
 * 拖拽覆盖层组件
 * 负责显示文件拖拽上传的UI
 */
const DragOverlay: React.FC<DragOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className={styles.fullscreenDragOverlay}>
      <div className={styles.dragOverlayContent}>
        <span className={styles.dropIcon}>📁</span>
        <h2>释放文件以导入</h2>
        <p>支持.xlsx和.xls格式的Excel文件</p>
        <p className="fileFormatHint">包含学生名单的表格将被自动识别</p>
      </div>
    </div>
  );
};

export default DragOverlay;