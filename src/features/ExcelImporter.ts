import * as XLSX from 'xlsx';

interface Student {
  id: string;
  name: string;
  class?: string;
}

/**
 * Excel导入管理器类
 */
class ExcelImporter {
  /**
   * 处理Excel文件
   * @param file 要处理的Excel文件
   * @returns Promise<Student[]> 解析后的学生数组
   */
  async processExcelFile(file: File): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // 处理Excel数据，假设第一列为姓名，第二列为班级
          interface ExcelRow {
            [key: string]: unknown;
            0?: unknown;
            1?: unknown;
            '姓名'?: unknown;
            '班级'?: unknown;
            'name'?: unknown;
            'class'?: unknown;
            'NAME'?: unknown;
            'CLASS'?: unknown;
          }
          
          const students = (jsonData as ExcelRow[]).map((row: ExcelRow, index: number) => {
            // 尝试从不同格式的Excel数据中提取信息
            const name = row[0] || row['姓名'] || row['name'] || row['NAME'] || `学生${index + 1}`;
            const className = row[1] || row['班级'] || row['class'] || row['CLASS'] || undefined;

            return {
              id: `student_${Date.now()}_${index}`,
              name: String(name).trim(),
              class: className ? String(className).trim() : undefined
            };
          });

          resolve(students);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 检查文件是否为有效的Excel文件
   * @param file 要检查的文件
   * @returns boolean 是否为有效Excel文件
   */
  isValidExcelFile(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           file.type === 'application/vnd.ms-excel' ||
           file.name.endsWith('.xlsx') || 
           file.name.endsWith('.xls');
  }
}

export default new ExcelImporter();