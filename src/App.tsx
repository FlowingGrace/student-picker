import React, { useState, useRef, useEffect } from 'react';
import styles from './GlobalStyles.module.less';
import dbManager from './utils/dbManager';
import fullscreenManager from './features/FullscreenManager';
import particleManager from './utils/particleManager';
import excelImporter from './features/ExcelImporter';
import extractionManager from './features/ExtractionManager';
import classManager from './features/ClassManager';
import ExtractionAnimation from './components/ExtractionAnimation';
import ExtractionResult from './components/ExtractionResult';
import StudentList from './components/StudentList';
import ExtractionControls from './components/ExtractionControls';
import Toolbar from './components/Toolbar';
import DragOverlay from './components/DragOverlay';
import EmptyStateContainer from './components/EmptyStatauContainer';

interface Student {
  id: string;
  name: string;
  class?: string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedStudent, setExtractedStudent] = useState<Student | null>(null);
  const [extractedStudents, setExtractedStudents] = useState<Student[]>([]);
  const [extractionCount, setExtractionCount] = useState<number>(1);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [classList, setClassList] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = async () => {
    try {
      await fullscreenManager.requestFullscreen();
    } catch (error) {
      console.error('Error attempting to enable full-screen mode:', error);
    }
  };

  const handleExitFullScreen = async () => {
    try {
      await fullscreenManager.exitFullscreen();
    } catch (error) {
      console.error('Error attempting to exit full-screen mode:', error);
    }
  };

  useEffect(() => {
    fullscreenManager.startListening(setIsFullScreen);
    return () => {
      fullscreenManager.stopListening();
    };
  }, []);

  const processExcelFile = async (file: File) => {
    try {
      const newStudents = await excelImporter.processExcelFile(file);
      setStudents(newStudents);
      setExtractedStudent(null);
      alert(`成功导入 ${newStudents.length} 名学生（数据仅展示，需要点击"保存"按钮才能保存到数据库）`);
    } catch (error) {
      console.error('Excel导入错误:', error);
      alert('Excel文件解析失败，请检查文件格式是否正确');
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processExcelFile(file);
    if (e.target instanceof HTMLInputElement) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (excelImporter.isValidExcelFile(file)) {
      processExcelFile(file);
    } else {
      alert('请上传.xlsx或.xls格式的Excel文件');
    }
  };

  const startExtraction = () => {
    const filteredStudents = extractionManager.getFilteredStudents(students, selectedClass);
    if (filteredStudents.length === 0) {
      alert('当前选择的班级中没有学生，请检查或选择其他班级');
      return;
    }
    setIsExtracting(true);
    setExtractedStudent(null);
    setExtractedStudents([]);
    extractionManager.startExtraction(filteredStudents, extractionCount, (selectedStudents) => {
      setExtractedStudents(selectedStudents);
      if (selectedStudents.length > 0) {
        setExtractedStudent(selectedStudents[0]);
      }
    });
  };

  const stopExtraction = () => {
    extractionManager.stopExtraction();
    setIsExtracting(false);
  };

  useEffect(() => {
    return () => {
      extractionManager.stopExtraction();
    };
  }, []);

  const loadAllStudents = async () => {
    try {
      const allStudents = await dbManager.getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error('加载学生数据失败:', error);
    }
  };

  const deleteClass = async () => {
    if (selectedClass === 'all') {
      alert('不能删除"全部班级"选项');
      return;
    }
    if (window.confirm(`确定要删除班级 "${selectedClass}" 及其所有学生吗？`)) {
      try {
        await dbManager.deleteClass(selectedClass);
        const updatedStudents = classManager.deleteClassAndStudents(students, selectedClass);
        setStudents(updatedStudents);
        setSelectedClass('all');
        const allClasses = await dbManager.getAllClasses();
        const classNames = allClasses.map(classData => classData.name);
        setClassList(classNames);
        console.log(`班级 "${selectedClass}" 已成功删除`);
      } catch (error) {
        console.error('删除班级失败:', error);
        alert('删除班级失败，请重试');
      }
    }
  };

  const setSelectedStudentsClass = (className: string) => {
    if (!className.trim()) {
      alert('班级名称不能为空');
      return;
    }
    const updatedStudents = classManager.updateStudentsClass(students, className);
    setStudents(updatedStudents);
    dbManager.saveStudents(updatedStudents);
    setSelectedClass(className);
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const allStudents = await dbManager.getAllStudents();
        if (allStudents.length > 0) {
          setStudents(allStudents);
          console.log('已从数据库加载学生数据');
        }
        const allClasses = await dbManager.getAllClasses();
        const classNames = allClasses.map(classData => classData.name);
        setClassList(classNames);
      } catch (error) {
        console.error('加载学生数据失败:', error);
      }
    };
    loadStudents();
    return () => {
      dbManager.close();
    };
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const classNames = classManager.getClassList(students);
      setClassList(classNames);
    } else {
      setClassList([]);
    }
  }, [students]);

  useEffect(() => {
    particleManager.setContainer(particlesRef.current);
  }, []);

  useEffect(() => {
    if (isExtracting) {
      particleManager.start();
    } else {
      particleManager.stop();
    }
  }, [isExtracting]);

  return (
    <div
      className={`${styles.appContainer} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Toolbar
        students={students}
        classList={classList}
        selectedClass={selectedClass}
        isExtracting={isExtracting}
        isFullScreen={isFullScreen}
        onExcelImport={handleExcelImport}
        onClassChange={(e) => setSelectedClass(e.target.value)}
        onDeleteClass={deleteClass}
        onSaveToClass={setSelectedStudentsClass}
        onFullScreen={handleFullScreen}
        onExitFullScreen={handleExitFullScreen}
      />

      <DragOverlay isDragging={isDragging} />

      <div className={styles.topSection}>
        <div className={styles.headerContainer}>
          <h1>点名系统</h1>
        </div>
        {students.length > 0 && (
          <div className={styles.extractionSettings}>
            <label htmlFor="extraction-count">抽取人数:</label>
            <input
              type="number"
              id="extraction-count"
              min="1"
              max={students.length}
              value={extractionCount}
              onChange={(e) => setExtractionCount(Number(e.target.value))}
              disabled={isExtracting}
            />
          </div>
        )}
      </div>

      {students.length > 0 ? (
        <>

          <StudentList students={students} selectedClass={selectedClass} />
        </>
      ) : (
        <EmptyStateContainer handleExcelImport={handleExcelImport} />
      )}

      {isExtracting && (
        <div className={styles.fullscreenExtractionOverlay}>
          <div className={styles.particlesContainer} ref={particlesRef}></div>
          <ExtractionAnimation students={extractedStudents} />
        </div>
      )}

      {(extractedStudent || extractedStudents.length > 0) && !isExtracting && (
        <ExtractionResult
          students={extractedStudents.length > 0 ? extractedStudents : (extractedStudent ? [extractedStudent] : [])}
          onClose={() => {
            setExtractedStudent(null);
            setExtractedStudents([]);
          }}
        />
      )}

      <ExtractionControls
        isExtracting={isExtracting}
        hasStudents={students.length > 0}
        onStart={startExtraction}
        onStop={stopExtraction}
      />
      <div className={styles.importHintSmall}>
        支持.xlsx和.xls格式，也可直接拖拽文件到页面任意位置
      </div>
    </div>
  );
}

export default App;