import React from 'react';
import styles from './index.module.less';

interface Student {
  id: string;
  name: string;
  class?: string;
}

interface StudentListProps {
  students: Student[];
  selectedClass: string;
}

/**
 * 学生列表组件
 * 负责展示学生列表
 */
const StudentList: React.FC<StudentListProps> = ({ students, selectedClass }) => {
  // 根据选择的班级筛选学生
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(student => student.class === selectedClass);

  // 为了提升性能，对学生列表进行分组显示
  const groupedStudents = React.useMemo(() => {
    if (selectedClass === 'all' && filteredStudents.length > 0) {
      const groups: Record<string, Student[]> = {};
      filteredStudents.forEach(student => {
        const className = student.class || '未分类';
        if (!groups[className]) {
          groups[className] = [];
        }
        groups[className].push(student);
      });
      return groups;
    }
    return { [selectedClass === 'all' ? '全部学生' : selectedClass]: filteredStudents };
  }, [filteredStudents, selectedClass]);

  if (students.length === 0) {
    return (
      <div className={styles.studentsSection}>
        <h2>学生列表 (0人)</h2>
        <div className={styles.studentsContainer}>
          <p className={styles.emptyMessage}>暂无学生数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studentsSection}>
      <h2>{selectedClass === 'all' ? '学生列表' : selectedClass} ({students.length}人)</h2>
      <div className={styles.studentsContainer}>
        {Object.entries(groupedStudents).map(([className, classStudents]) => (
          <>
            {selectedClass === 'all' && (
              <div className="classLabel">
                <strong>{className} ({classStudents.length}人)</strong>
              </div>
            )}
            {classStudents.map((student) => (
              <div 
                key={student.id} 
                className={styles.studentItem}
                data-class={student.class || '未分类'}
                title={`${student.name} - ${student.class || '未分类'}`}
              >
                {student.name}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default StudentList;