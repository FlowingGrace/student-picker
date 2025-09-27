import styles from './index.module.less';



function EmptyStateContainer(porps: {
    handleExcelImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateContent}>
                <div className={styles.emptyStateIcon}>📁</div>
                <h2>请上传学生名单</h2>
                <p><label htmlFor="empty-state-upload" className={styles.uploadButton}>
                    选择Excel文件
                </label>支持.xlsx和.xls格式的Excel文件</p>
                <p>您也可以直接拖拽文件到页面任意位置,包含学生名单的表格将被自动识别</p>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={porps.handleExcelImport}
                    className={styles.hiddenFileInput}
                    id="empty-state-upload"
                />

            </div>
        </div>
    );
}

export default EmptyStateContainer;