// 数据库配置
interface DBConfig {
  name: string;
  version: number;
  stores: { [key: string]: IDBObjectStoreParameters };
}

// 学生接口
export interface Student {
  id: string;
  name: string;
  class?: string;
}

// 班级接口
export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

class DBManager {
  private dbName = 'StudentDatabase';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private storeName = 'classes';
  private config: DBConfig;

  constructor() {
    this.config = {
      name: this.dbName,
      version: this.dbVersion,
      stores: {
        [this.storeName]: {
          keyPath: 'id',
          autoIncrement: false
        }
      }
    };
  }

  // 初始化数据库
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建存储对象
        Object.entries(this.config.stores).forEach(([name, options]) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, options);
          }
        });
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  // 获取事务
  private async getTransaction(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<{ transaction: IDBTransaction; store: IDBObjectStore }> {
    const db = await this.initDB();
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    return { transaction, store };
  }

  // 保存学生数据到指定班级（不覆盖现有数据）
  async saveStudentsByClass(students: Student[]): Promise<void> {
    if (!students || students.length === 0) {
      return;
    }

    // 按班级分组
    const classGroups = students.reduce<{ [key: string]: Student[] }>((acc, student) => {
      const className = student.class || '未分班';
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});

    const { transaction, store } = await this.getTransaction(this.storeName, 'readwrite');

    // 处理每个班级的数据
    for (const [className, newStudents] of Object.entries(classGroups)) {
      const classId = `class_${className.replace(/\s+/g, '_')}`;
      
      // 获取现有班级数据
      let existingStudents: Student[] = [];
      try {
        const existingClassData = await this.getStudentsByClass(className);
        existingStudents = existingClassData;
      } catch {
        // 如果班级不存在，使用空数组
        console.log(`班级 ${className} 不存在，将创建新班级`);
      }

      // 合并学生数据，只添加新学生，不覆盖现有学生
      const mergedStudentsMap = new Map<string, Student>();
      
      // 先添加现有学生
      existingStudents.forEach(student => {
        mergedStudentsMap.set(student.id, student);
      });
      
      // 再添加新学生（仅当ID不存在时添加，不覆盖现有数据）
      newStudents.forEach(student => {
        if (!mergedStudentsMap.has(student.id)) {
          mergedStudentsMap.set(student.id, student);
        }
      });
      
      // 转换为数组
      const mergedStudents = Array.from(mergedStudentsMap.values());
      
      // 保存合并后的数据
      const classData: ClassData = {
        id: classId,
        name: className,
        students: mergedStudents
      };
      
      store.put(classData);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 获取所有班级
  async getAllClasses(): Promise<ClassData[]> {
    const { store } = await this.getTransaction(this.storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取指定班级的学生
  async getStudentsByClass(className: string): Promise<Student[]> {
    const { store } = await this.getTransaction(this.storeName);
    const request = store.get(`class_${className.replace(/\s+/g, '_')}`);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const classData = request.result as ClassData | undefined;
        resolve(classData ? classData.students : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除指定班级
  async deleteClass(className: string): Promise<void> {
    const { transaction, store } = await this.getTransaction(this.storeName, 'readwrite');
    store.delete(`class_${className.replace(/\s+/g, '_')}`);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 将学生保存到指定班级名称
  async saveStudentsToSpecificClass(students: Student[], className: string): Promise<void> {
    if (!students || students.length === 0 || !className) {
      return;
    }

    // 更新学生的班级信息
    const studentsWithClass = students.map(student => ({
      ...student,
      class: className
    }));

    // 获取该班级现有的学生
    const existingStudents = await this.getStudentsByClass(className);
    
    // 合并学生列表，避免重复
    const mergedStudents = [...existingStudents];
    studentsWithClass.forEach(newStudent => {
      const existingIndex = mergedStudents.findIndex(s => s.id === newStudent.id);
      if (existingIndex >= 0) {
        mergedStudents[existingIndex] = newStudent;
      } else {
        mergedStudents.push(newStudent);
      }
    });

    // 创建班级数据
    const classData: ClassData = {
      id: `class_${className.replace(/\s+/g, '_')}`,
      name: className,
      students: mergedStudents
    };

    const { transaction, store } = await this.getTransaction(this.storeName, 'readwrite');
    store.put(classData);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 获取所有学生
  async getAllStudents(): Promise<Student[]> {
    const classes = await this.getAllClasses();
    return classes.flatMap(classData => classData.students);
  }

  // 清空所有数据
  async clearAllData(): Promise<void> {
    const { transaction, store } = await this.getTransaction(this.storeName, 'readwrite');
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 保存所有学生数据（覆盖模式）
  async saveStudents(students: Student[]): Promise<void> {
    if (!students || students.length === 0) {
      return;
    }

    // 清空现有数据
    await this.clearAllData();
    
    // 按班级分组
    const classGroups = students.reduce<{ [key: string]: Student[] }>((acc, student) => {
      const className = student.class || '未分班';
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});

    // 保存每个班级的数据
    for (const [className, classStudents] of Object.entries(classGroups)) {
      await this.saveStudentsToSpecificClass(classStudents, className);
    }
  }
  
  // 关闭数据库连接
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// 导出单例
export default new DBManager();