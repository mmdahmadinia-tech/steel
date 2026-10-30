// IndexedDB Storage Layer - بهینه برای 50000+ رکورد
// با fallback به localStorage

const DB_NAME = 'steelmetrics_db';
const DB_VERSION = 1;
const STORES = {
  HEATS: 'heats',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
};

let dbInstance: IDBDatabase | null = null;

// باز کردن دیتابیس
export function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // ایجاد store ها
      Object.values(STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'id' });
          
          // ایجاد index ها برای جستجوی سریع
          if (storeName === STORES.HEATS) {
            store.createIndex('heatId', 'heatId', { unique: true });
            store.createIndex('date', 'date', { unique: false });
            store.createIndex('shift', 'shift', { unique: false });
            store.createIndex('steelGrade', 'steelGrade', { unique: false });
            store.createIndex('eafStatus', 'eafStatus', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          } else if (storeName === STORES.USERS) {
            store.createIndex('username', 'username', { unique: true });
            store.createIndex('role', 'role', { unique: false });
          } else if (storeName === STORES.NOTIFICATIONS) {
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('read', 'read', { unique: false });
          }
        }
      });
    };
  });
}

// عملیات عمومی
async function dbOperation<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// دریافت همه رکوردها
export async function getAll<T>(storeName: string): Promise<T[]> {
  try {
    return await dbOperation<T[]>(storeName, 'readonly', store => store.getAll());
  } catch (error) {
    console.error(`Error getting all from ${storeName}:`, error);
    // Fallback به localStorage
    const saved = localStorage.getItem(`steelmetrics_${storeName}`);
    return saved ? JSON.parse(saved) : [];
  }
}

// دریافت یک رکورد
export async function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  try {
    return await dbOperation<T | undefined>(storeName, 'readonly', store => store.get(id));
  } catch (error) {
    console.error(`Error getting ${id} from ${storeName}:`, error);
    return undefined;
  }
}

// دریافت با index
export async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error(`Error getting by index from ${storeName}:`, error);
    return [];
  }
}

// دریافت با range (برای فیلتر تاریخ)
export async function getByRange<T>(
  storeName: string,
  indexName: string,
  lower: any,
  upper: any
): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const range = IDBKeyRange.bound(lower, upper);
      const request = index.getAll(range);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error(`Error getting by range from ${storeName}:`, error);
    return [];
  }
}

// افزودن رکورد
export async function add<T>(storeName: string, item: T): Promise<void> {
  try {
    await dbOperation(storeName, 'readwrite', store => store.add(item));
  } catch (error) {
    console.error(`Error adding to ${storeName}:`, error);
    throw error;
  }
}

// به‌روزرسانی رکورد
export async function update<T>(storeName: string, item: T): Promise<void> {
  try {
    await dbOperation(storeName, 'readwrite', store => store.put(item));
  } catch (error) {
    console.error(`Error updating in ${storeName}:`, error);
    throw error;
  }
}

// حذف رکورد
export async function remove(storeName: string, id: string): Promise<void> {
  try {
    await dbOperation(storeName, 'readwrite', store => store.delete(id));
  } catch (error) {
    console.error(`Error removing from ${storeName}:`, error);
    throw error;
  }
}

// حذف همه رکوردها
export async function clearAll(storeName: string): Promise<void> {
  try {
    await dbOperation(storeName, 'readwrite', store => store.clear());
  } catch (error) {
    console.error(`Error clearing ${storeName}:`, error);
    throw error;
  }
}

// شمارش رکوردها
export async function count(storeName: string): Promise<number> {
  try {
    return await dbOperation<number>(storeName, 'readonly', store => store.count());
  } catch (error) {
    console.error(`Error counting ${storeName}:`, error);
    return 0;
  }
}

// دریافت صفحه‌ای از رکوردها (pagination)
export async function getPage<T>(
  storeName: string,
  page: number,
  pageSize: number,
  orderBy: string = 'id',
  direction: 'next' | 'prev' = 'prev'
): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(orderBy);
      const range = IDBKeyRange.lowerBound(0);
      
      const request = direction === 'prev' 
        ? index.openCursor(range, 'prev')
        : index.openCursor(range, 'next');
      
      const results: T[] = [];
      let skipped = 0;
      const skipCount = (page - 1) * pageSize;
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          if (skipped < skipCount) {
            skipped++;
            cursor.continue();
          } else if (results.length < pageSize) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error getting page from ${storeName}:`, error);
    return [];
  }
}

// جستجوی سریع با fuzzy match
export async function search<T>(
  storeName: string,
  field: string,
  query: string
): Promise<T[]> {
  const allItems = await getAll<T>(storeName);
  const lowerQuery = query.toLowerCase();
  
  return allItems.filter((item: any) => {
    const value = item[field];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(lowerQuery);
    }
    return false;
  });
}

// جستجوی چند فیلدی
export async function multiSearch<T>(
  storeName: string,
  fields: string[],
  query: string
): Promise<T[]> {
  const allItems = await getAll<T>(storeName);
  const lowerQuery = query.toLowerCase();
  
  return allItems.filter((item: any) => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery);
      }
      return false;
    });
  });
}

// آمار دیتابیس
export async function getDBStats(): Promise<{
  heats: number;
  users: number;
  notifications: number;
  totalSize: string;
}> {
  const heatsCount = await count(STORES.HEATS);
  const usersCount = await count(STORES.USERS);
  const notificationsCount = await count(STORES.NOTIFICATIONS);
  
  // تخمین حجم
  const estimatedSize = (heatsCount * 2048 + usersCount * 512 + notificationsCount * 256) / (1024 * 1024);
  
  return {
    heats: heatsCount,
    users: usersCount,
    notifications: notificationsCount,
    totalSize: `${estimatedSize.toFixed(2)} MB`,
  };
}

// پاکسازی داده‌های قدیمی (cleanup)
export async function cleanup(olderThanDays: number = 365): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  const cutoffStr = cutoffDate.toISOString();
  
  const oldHeats = await getByRange('heats', 'createdAt', '0', cutoffStr);
  
  for (const heat of oldHeats) {
    await remove('heats', (heat as any).id);
  }
  
  return oldHeats.length;
}

// Migration از localStorage به IndexedDB
export async function migrateFromLocalStorage(): Promise<void> {
  const keys = ['steelmetrics_heats', 'steelmetrics_users', 'steelmetrics_notifications'];
  
  for (const key of keys) {
    const data = localStorage.getItem(key);
    if (data) {
      const items = JSON.parse(data);
      const storeName = key.replace('steelmetrics_', '');
      
      for (const item of items) {
        try {
          await add(storeName, item);
        } catch (e) {
          // اگر تکراری است، به‌روزرسانی کن
          await update(storeName, item);
        }
      }
      
      console.log(`Migrated ${items.length} items from ${key} to IndexedDB`);
    }
  }
}

export const DB_STORES = STORES;
