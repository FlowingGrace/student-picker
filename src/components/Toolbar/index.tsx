import React from 'react';
import styles from './index.module.less';

interface ToolbarProps {
  students: Array<{ id: string; name: string; class?: string }>;
  classList: string[];
  selectedClass: string;
  isExtracting: boolean;
  isFullScreen: boolean;
  onExcelImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeleteClass: () => void;
  onSaveToClass: (className: string) => void;
  onFullScreen: () => void;
  onExitFullScreen: () => void;
}

/**
 * 工具栏组件
 * 负责顶部工具栏的展示和交互
 */
const Toolbar: React.FC<ToolbarProps> = ({
  students,
  classList,
  selectedClass,
  isExtracting,
  isFullScreen,
  onExcelImport,
  onClassChange,
  onDeleteClass,
  onSaveToClass,
  onFullScreen,
  onExitFullScreen
}) => {
  // 处理文件上传按钮点击
  const handleFileUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const fileInput = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && !isExtracting) {
      fileInput.click();
    }
  };

  return (
    <>
      {/* 顶部触发区域 - 用于检测鼠标是否移动到页面顶端 */}
      <div className={styles.topTriggerArea}></div>
      
      {/* 可隐藏的顶部工具栏 */}
      <div className={styles.hiddenTopToolbar}>
        {/* 左侧标题 */}
        <div className={styles.toolbarContent}>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>点名系统</h1>
        </div>
        
        {/* 右侧工具按钮 */}
        <div className={styles.toolbarButtons}>
          {/* 导入Excel按钮 */}
          <label className={styles.fileUploadLabel}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={onExcelImport}
              disabled={isExtracting}
              style={{ display: 'none' }}
            />
            <button type="button" disabled={isExtracting} className={styles.fileUploadBtnSmall} onClick={handleFileUploadClick}>
              📁
            </button>
          </label>
          
          {students.length > 0 && (
            <>
              {/* 班级选择 */}
              <select 
                id="class-select"
                value={selectedClass} 
                onChange={onClassChange}
                disabled={isExtracting}
                className={styles.classList}
                style={{ minWidth: '100px', height: '42px' }}
              >
                <option value="all">所有班级</option>
                {classList.map((className) => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
              
              {/* 删除班级按钮 */}
              {selectedClass !== 'all' && (
                <button 
                  onClick={onDeleteClass} 
                  disabled={isExtracting}
                  className={styles.deleteClassBtn}
                  title="删除当前选中的班级"
                >
                  🗑️
                </button>
              )}
              
              {/* 保存到班级按钮 */}
              <button 
                onClick={() => {
                  const className = prompt('请输入班级名称:');
                  if (className !== null) {
                    onSaveToClass(className);
                  }
                }} 
                disabled={isExtracting}
                className={styles.saveToClassBtn}
                title="点击保存学生数据到指定班级"
              >
                💾
              </button>
            </>
          )}
          
          {/* 全屏控制按钮 */}
          {!isFullScreen ? (
            <button 
              onClick={onFullScreen}
              disabled={isExtracting}
              className={styles.fullscreenBtn}
              title="进入全屏"
            >
              ⛶
            </button>
          ) : (
            <button 
              onClick={onExitFullScreen}
              className={styles.exitFullscreenBtn}
              title="退出全屏"
            >
              ⬜
            </button>
          )}
        </div>
      </div>
      
      {/* 工具栏提示 */}
      <div className={styles.toolbarHint}>
        将鼠标移动到顶部边缘显示操作工具栏
      </div>
    </>
  );
};

export default Toolbar;