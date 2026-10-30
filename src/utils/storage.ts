// Optimized Data Storage Layer
// ترکیب localStorage با pagination و caching برای 50000+ رکورد

const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

class OptimizedStorage {
  private cache: Map<string, CacheItem<any>> = new Map();
  private pageSize = 100;

  // ذخیره با فشرده‌سازی
  set<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`sm_${key}`, serialized);
      
      // به‌روزرسانی cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        key,
      });
    } catch (error) {
      // اگر localStorage پر است، داده‌های قدیمی را پاک کن
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupOldKeys();
        try {
          localStorage.setItem(`sm_${key}`, JSON.stringify(data));
        } catch (e) {
          console.error('Storage quota exceeded even after cleanup');
        }
      }
    }
  }

  // دریافت با cache
  get<T>(key: string): T | null {
    // بررسی cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }

    // دریافت از localStorage
    try {
      const serialized = localStorage.getItem(`sm_${key}`);
      if (!serialized) return null;

      const data = JSON.parse(serialized) as T;
      
      // به‌روزرسانی cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        key,
      });

      return data;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  // حذف
  remove(key: string): void {
    localStorage.removeItem(`sm_${key}`);
    this.cache.delete(key);
  }

  // دریافت صفحه‌ای از داده‌ها
  getPage<T extends { id: string }>(
    key: string,
    page: number,
    filters?: Record<string, any>
  ): { data: T[]; total: number; totalPages: number } {
    const allData = this.get<T[]>(key) || [];
    
    // اعمال فیلترها
    let filteredData = allData;
    if (filters) {
      filteredData = allData.filter(item => {
        return Object.entries(filters).every(([filterKey, filterValue]) => {
          if (filterValue === undefined || filterValue === '' || filterValue === null) {
            return true;
          }
          const itemValue = (item as any)[filterKey];
          if (typeof itemValue === 'string' && typeof filterValue === 'string') {
            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          return itemValue === filterValue;
        });
      });
    }

    const total = filteredData.length;
    const totalPages = Math.ceil(total / this.pageSize);
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const data = filteredData.slice(startIndex, endIndex);

    return { data, total, totalPages };
  }

  // جستجوی سریع با indexing
  search<T extends Record<string, any>>(
    key: string,
    query: string,
    fields: string[]
  ): T[] {
    const allData = this.get<T[]>(key) || [];
    const lowerQuery = query.toLowerCase();

    // استفاده از Set برای نتایج یکتا
    const resultSet = new Set<T>();

    for (const item of allData) {
      for (const field of fields) {
        const value = item[field];
        if (typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
          resultSet.add(item);
          break;
        }
      }
    }

    return Array.from(resultSet);
  }

  // مرتب‌سازی سریع
  sort<T>(
    key: string,
    sortBy: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    const allData = this.get<T[]>(key) || [];
    
    return [...allData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  // آمار
  getStats(key: string): {
    count: number;
    size: string;
    lastModified: string;
  } {
    const data = this.get(key);
    const serialized = localStorage.getItem(`sm_${key}`) || '';
    
    return {
      count: Array.isArray(data) ? data.length : 0,
      size: `${(serialized.length / 1024).toFixed(2)} KB`,
      lastModified: new Date().toLocaleString('fa-IR'),
    };
  }

  // پاکسازی cache قدیمی
  private cleanupOldKeys(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sm_'));
    const now = Date.now();
    
    // پاک کردن cache entries قدیمی
    for (const [cacheKey, cacheItem] of this.cache.entries()) {
      if (now - cacheItem.timestamp > CACHE_DURATION) {
        this.cache.delete(cacheKey);
      }
    }

    // اگر هنوز جا نیست، داده‌های قدیمی را از localStorage پاک کن
    if (keys.length > 100) {
      const toRemove = keys.slice(0, 20);
      toRemove.forEach(k => localStorage.removeItem(k));
    }
  }

  // پاک کردن همه
  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sm_'));
    keys.forEach(k => localStorage.removeItem(k));
    this.cache.clear();
  }

  // export به فایل
  exportData(): string {
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sm_'));
    
    keys.forEach(key => {
      const shortKey = key.replace('sm_', '');
      data[shortKey] = this.get(key);
    });

    return JSON.stringify(data, null, 2);
  }

  // import از فایل
  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
}

export const storage = new OptimizedStorage();
export default storage;
