export type DatabaseStatus = 1 | 2 | 3;
export type DatabaseEngine = "mysql" | "mariadb" | "postgresql";

export type DatabaseItem = {
  id: number;
  db_name: string;
  db_username: string;
  engine_type: DatabaseEngine;
  size: string;
  tables: number;
  status: DatabaseStatus;
  host: string;
  created_at: string;
  lastBackupAt: string | null;
};

export type DatabaseCreateForm = {
  // db_name: string;
  db_username: string;
  db_password: string;
  engine_type: DatabaseEngine;
};
