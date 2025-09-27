interface Student {
  id: string;
  name: string;
  class?: string;
}

/**
 * 抽取管理器类
 * 负责随机抽取学生的逻辑
 */
class ExtractionManager {
  private intervalId: number | null = null;

  /**
   * 开始抽取学生
   * @param students 学生列表
   * @param count 抽取人数
   * @param callback 抽取结果回调函数
   */
  startExtraction(
    students: Student[],
    count: number,
    callback: (selectedStudents: Student[]) => void
  ): void {
    // 停止之前可能存在的抽取
    if (this.intervalId !== null) {
      this.stopExtraction();
    }

    // 设置抽取动画间隔
    this.intervalId = window.setInterval(() => {
      // 复制学生数组以避免直接修改状态数组
      const tempStudents = [...students];
      const selectedStudents: Student[] = [];

      // 根据设置的抽取人数随机选择学生
      const actualCount = Math.min(count, students.length);
      for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(Math.random() * tempStudents.length);
        selectedStudents.push(tempStudents[randomIndex]);
        // 从临时数组中移除已选择的学生，避免重复抽取
        tempStudents.splice(randomIndex, 1);
      }

      callback(selectedStudents);
    }, 50);
  }

  /**
   * 停止抽取学生
   */
  stopExtraction(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * 检查是否正在抽取
   */
  isExtracting(): boolean {
    return this.intervalId !== null;
  }

  /**
   * 根据班级筛选学生
   * @param students 学生列表
   * @param selectedClass 选中的班级
   */
  getFilteredStudents(students: Student[], selectedClass: string): Student[] {
    if (selectedClass === 'all') {
      return students;
    }
    return students.filter(student => student.class === selectedClass);
  }
}

export default new ExtractionManager();