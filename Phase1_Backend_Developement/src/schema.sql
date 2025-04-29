-- 1. Departments table
CREATE TABLE departments (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- 2. Employees table
CREATE TABLE employees (
  id              SERIAL       PRIMARY KEY,
  first_name      VARCHAR(50)   NOT NULL,
  last_name       VARCHAR(50)   NOT NULL,
  email           VARCHAR(150)  NOT NULL UNIQUE,
  phone           VARCHAR(20),
  role_title      VARCHAR(100)  NOT NULL,
  department_id   INT           NOT NULL
    REFERENCES departments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  bio             TEXT,
  profile_pic_url VARCHAR(255),
  join_date       DATE          NOT NULL,
  status          VARCHAR(20)   NOT NULL DEFAULT 'working',  -- 'working' or 'not working'
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);


-- 3. Users table
CREATE TABLE users (
  id            SERIAL       PRIMARY KEY,
  employee_id   INT          NOT NULL UNIQUE
    REFERENCES employees(id)
    ON DELETE CASCADE,
  username      VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL
    CHECK (role IN ('admin','employee')),
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
