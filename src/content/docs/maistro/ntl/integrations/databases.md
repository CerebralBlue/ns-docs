---
title: "Databases"
description: ""
---

## DB2 Database 


Connect to a DB2 database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The DB2 query

- **DATABASE**: The Database name

- **HOSTNAME**: The DB hostname

- **UID**: The user Id

- **PWD**: The password

- **PORT**: The port number

- **SECURE**: Use SSL

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## Postgres 


Connect to a Postgres database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The Postgres query

- **uri**: A connection string in the format:  user:pass@example.com:5432/dbname

- **sentences**: Return in sentences (true) or as CSV (false)

- **rds**: Is this connection using an RDS Proxy?

- **ssl**: Use a secure connection (SSL)
:::

---


## MariaDB 


Connect to a MariaDB database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The MariaDB query

- **uri**: A connection string in the format:  user:pass@example.com:3306/dbname

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## MySQL 


Connect to a MySQL database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The MySQL query

- **uri**: A connection string in the format:  user:pass@example.com:3306/dbname

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## MS SQL 


Connect to a MS SQL database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The MS SQL query

- **uri**: A connection string in the format:  user:pass@example.com:1433/dbname

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## Oracle 


Connect to a Oracle database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The Oracle query

- **uri**: A connection string in the format:  user:pass@example.com:1521/dbname

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## Redshift 


Connect to a Redshift database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The redshift query

- **uri**: A connection string in the format:  user:pass@example.com:5432/dbname

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## BigQuery 


Connect to a BigQuery database and run a sql query, returning the data.
:::note[Parameters]

- **query**: The BigQuery query

- **projectId**: The Project Id

- **credentials**: Your credentials (JSON)

- **location**: The dataset location

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## Snowflake 


Connect to Snowflake and run a sql query, returning the data.
:::note[Parameters]

- **query**: The Snowflake query

- **accessUrl**: The account URL to use, from Admin/Accounts/Manage URLs.  EG: https://abcd-hijk.snowflakecomputing.com

- **username**: The username to use

- **password**: The password to use

- **database**: The database to use

- **sentences**: Return in sentences (true) or as CSV (false)
:::

---


## Neo4j 


Connect to Neo4j and run a cypher query, returning the data.
:::note[Parameters]

- **query**: The cypher query

- **boltURI**: The bolt URI to use

- **username**: The username to use

- **password**: The password to use

- **sentences**: Return in sentences (true) or as CSV (false)
:::
