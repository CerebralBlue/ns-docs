---
title: "AWS S3"
description: "Read and write files in an Amazon S3 bucket."
---
The AWS S3 integration allows you to read files from and write files to an Amazon S3 bucket.
## S3 Read File 


Connect to AWS s3 and read a file
:::note[Parameters]

- **key**: The filename in S3 to read

- **bucket**: The bucket name

- **region**: The provider's region

- **accessKeyId**: Access Key or ID

- **secretAccessKey**: Access Key Secret

- **Override S3 endpoint**: Override s3 endpoint

- **fileName**: Optional - save the file locally with this name
:::

---


## S3 Write File 


Connect to AWS s3 and write a file
:::note[Parameters]

- **data**: The data to write (or leave blank to use chain input)

- **key**: The filename in S3 to write

- **bucket**: The bucket name

- **region**: The provider's region

- **accessKeyId**: Access Key or ID

- **secretAccessKey**: Access Key Secret

- **s3Endpoint**: Override S3 endpoint

- **fileName**: Optional - read and upload this local file instead of data
:::

## S3 List Objects


Connect to AWS s3 and list objects
:::note[Parameters]

- **bucket**: The bucket name

- **keys**: Optional prefix to filter keys

- **region**: The provider's region

- **accessKeyId**: Access Key or ID

- **secretAccessKey**: Access Key Secret

- **s3Endpoint**: Override S3 endpoint

- **maxNumber**: Maximum number of objects to return (optional)
:::

## S3 Delete File


Connect to AWS s3 and delete a file
:::note[Parameters]

- **fileName**: The filename in S3 to delete

- **bucket**: The bucket name

- **region**: The provider's region

- **accessKeyId**: Access Key or ID

- **secretAccessKey**: Access Key Secret

- **s3Endpoint**: Override S3 endpoint

:::
---