---
title: "Database Connections"
description: "The Database Connections allow us to use SQL queries to retrieve data, and subsequently use that data for natural language processing with TableUnderstanding…"
---

## Overview

The Database Connections allow us to use SQL queries to retrieve data, and subsequently use that data for natural language processing with `TableUnderstanding` or `TablePrep`.

## IBM DB2

```text
{{ db2|query:"your db2 query" | DATABASE: "" | HOSTNAME: "" | UID: "" | PWD: "" | PORT: "" | SECURE: "true" | sentences: "true"}}
```

:::note[Parameters]
- **Query**: The SQL query to pass to DB2. Double quotes must be escaped \" \" to pass through to DB2.
- **DATABASE**: The database name.
- **HOSTNAME**: The hostname of the DB2 instance.
- **UID**: The user ID to use for authentication.
- **PWD**: The user password for authentication.
- **PORT**: The port number.
- **SECURE**: Set to true or false depending on the use of SSL.
- **Sentences**: To return the query response in tabular format, set this to false. To return the response in natural language, set this to true.
:::

---

## BigQuery

```text
{{ bigquery  | query: "" | sentences: "true" | projectId: "" | location: "" | credentials: "" }}
```

:::note[Parameters]
- **Query**: The SQL query to use. Double quotes must be escaped \" \" to pass through.
- **Project ID**: The ID of the project.
- **Credentials**: The JSON credentials object for this project.
- **Location**: The location of the dataset.
- **Sentences**: To return the query response in tabular format, set this to false. To return the response in natural language, set this to true.
:::

---

## Snowflake

```text
{{ snowflake  | query: "" | sentences: "true" | accessUrl: "" | username: "" | password: "" | database: "" }}
```

:::note[Parameters]
- **Query**: The SQL query to use. Double quotes must be escaped \" \" to pass through.
- **Access URL**: The account URL to use, from Admin/Accounts/Manage URLs. EG: https://abcd-hijk.snowflakecomputing.com
- **Username**: The username for the database.
- **Password**: The password for the database.
- **Database**: The database to use.
- **Sentences**: To return the query response in tabular format, set this to false. To return the response in natural language, set this to true.
:::

---

## Neo4j

```text
{{ neo4j  | query: "" | boltURI: "" | username: "" | password: "" | sentences: "true" }}
```

:::note[Parameters]
- **Query**: The cypher query to use. Double quotes must be escaped \" \" to pass through.
- **Bolt URI**: The bolt URI. EG bolt+s://example.com:7687
- **Username**: The username for the database.
- **Password**: The password for the database.
- **Sentences**: To return the query response in tabular format, set this to false. To return the response in natural language, set this to true.
:::

---

## MySQL
## MariaDB
## MsSQL
## Oracle
## Postgres
## RedShift


```text
{{ postgres | query:"" | uri: "" | sentences: "true" | rds: "false"}}
{{ mariadb | query:"" | uri: "" | sentences: "true"}}
{{ mysql | query:"" | uri: "" | sentences: "true"}}
{{ mssql | query:"" | uri: "" | sentences: "true"}}
{{ oracle | query:"" | uri: "" | sentences: "true"}}
{{ redshift | query:"" | uri: "" | sentences: "true"}}
```

:::note[Parameters]
- **Query**: The SQL query to use. Double quotes must be escaped \" \" to pass through.
- **URI**: The connection URI. The preceding "mysql://" is not required.
- **Sentences**: To return the query response in tabular format, set this to false. To return the response in natural language, set this to true.
- **RDS**: For Postgres only - Only enable this if using RDS Proxy in front of Postgres.
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - The IBM DB2 node is documented but no such node appears in the product — verify before publishing
-->
