import { User, Class, USERS_STORAGE_KEY, CLASSES_STORAGE_KEY } from './types';

// Default data
const defaultUsers: User[] = [
  { userId: "admin", name: "Administrator", password: "lol", role: "admin" },
  { userId: "teacher1", name: "John Doe", password: "lol", role: "teacher" },
  { userId: "anjali", name: "Anjali Rai", password: "lol", role: "student" },
  { userId: "aryan", name: "Aryan Kumar", password: "lol", role: "student" },
  { userId: "subhashree", name: "Subhashree Patra", password: "lol", role: "student" },
];

const defaultClasses: Class[] = [
  {
    id: "class1",
    name: "Introduction to Computer Science",
    teacherId: "teacher1",
    studentIds: ["anjali", "aryan" , "subhashree"],
    isActive: false,
    attendanceRecords: [],
  },
];

// Initialize or load data from localStorage
export const initializeData = () => {
  // Load users or use defaults
  const storedUsersJSON = localStorage.getItem(USERS_STORAGE_KEY);
  let users: User[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : defaultUsers;
  
  // Load classes or use defaults
  const storedClassesJSON = localStorage.getItem(CLASSES_STORAGE_KEY);
  let classes: Class[] = [];
  
  if (storedClassesJSON) {
    // Need to restore Date objects which are serialized as strings in JSON
    const parsedClasses = JSON.parse(storedClassesJSON);
    classes = parsedClasses.map((cls: any) => ({
      ...cls,
      attendanceRecords: cls.attendanceRecords.map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }))
    }));
  } else {
    classes = defaultClasses;
  }
  
  return { users, classes };
};

// Helper function to save users to localStorage
export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Helper function to save classes to localStorage
export const saveClasses = (classes: Class[]) => {
  localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
};

// Setup storage event listener
export const setupStorageListeners = (
  setUsers: (users: User[]) => void,
  setClasses: (classes: Class[]) => void
) => {
  window.addEventListener('storage', (event) => {
    if (event.key === USERS_STORAGE_KEY) {
      // Update users from another tab/window
      const newUsers = JSON.parse(event.newValue || '[]');
      setUsers(newUsers);
    } else if (event.key === CLASSES_STORAGE_KEY) {
      // Update classes from another tab/window
      const parsedClasses = JSON.parse(event.newValue || '[]');
      const updatedClasses = parsedClasses.map((cls: any) => ({
        ...cls,
        attendanceRecords: cls.attendanceRecords.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
      }));
      setClasses(updatedClasses);
    }
  });
};