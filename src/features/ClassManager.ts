interface Student {
  id: string;
  name: string;
  class?: string;
}

/**
 * 班级管理器类
 * 负责班级相关的管理逻辑
 */
class ClassManager {
  /**
   * 从学生列表中提取班级列表
   * @param students 学生列表
   */
  getClassList(students: Student[]): string[] {
    const classNames = new Set<string>();
    students.forEach(student => {
      if (student.class && student.class.trim()) {
        classNames.add(student.class);
      }
    });
    return Array.from(classNames).sort();
  }

  /**
   * 获取包含所有选项的完整班级列表
   * @param students 学生列表
   */
  getFullClassList(students: Student[]): { value: string; label: string }[] {
    const classList = this.getClassList(students);
    const fullList: { value: string; label: string }[] = [
      { value: 'all', label: '全部班级' }
    ];
    
    classList.forEach(className => {
      // 计算每个班级的学生数量
      const studentCount = students.filter(s => s.class === className).length;
      fullList.push({
        value: className,
        label: `${className} (${studentCount}人)`
      });
    });
    
    return fullList;
  }

  /**
   * 根据班级名过滤学生
   * @param students 学生列表
   * @param className 班级名，'all'表示全部班级
   */
  filterStudentsByClass(students: Student[], className: string): Student[] {
    if (className === 'all') {
      return students;
    }
    return students.filter(student => student.class === className);
  }

  /**
   * 批量更新学生的班级信息
   * @param students 学生列表
   * @param targetClass 目标班级名
   */
  updateStudentsClass(students: Student[], targetClass: string): Student[] {
    return students.map(student => ({
      ...student,
      class: targetClass
    }));
  }

  /**
   * 删除指定班级及其学生
   * @param students 学生列表
   * @param className 要删除的班级名
   */
  deleteClassAndStudents(students: Student[], className: string): Student[] {
    return students.filter(student => student.class !== className);
  }
}

export default new ClassManager();