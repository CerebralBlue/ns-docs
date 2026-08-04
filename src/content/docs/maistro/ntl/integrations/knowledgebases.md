---
title: "Knowledge Bases"
description: ""
---

## Elastic 


Run an exists, index, get, search, update, or delete operation on ElasticSearch
:::note[Parameters]

- **operation**: The Elastic operation

- **payload**: The JSON to send to elastic

- **credentials**: The elastic credentials JSON object. Leave blank if you have configured ElasticSearch as your Seek KB and want to use those. EG:<br>{<br>'node': 'https://fd109b3.us-west-2.aws.found.io',<br> 'auth': {<br>'apiKey': 'cTRlNUZKRUJYncGtN01tUQ=='},<br> 'tls':{<br>'rejectUnauthorized': false<br> }<br> }
:::

---


## Elastic 


Run an exists, index, get, search, update, or delete operation on ElasticSearch
:::note[Parameters]

- **operation**: The Elastic operation

- **payload**: The JSON to send to elastic

- **credentials**: The elastic credentials JSON object. Leave blank if you have configured ElasticSearch as your Seek KB and want to use those. EG:<br>{<br>'node': 'https://fd109b3.us-west-2.aws.found.io',<br> 'auth': {<br>'apiKey': 'cTRlNUZKRUJYncGtN01tUQ=='},<br> 'tls':{<br>'rejectUnauthorized': false<br> }<br> }
:::

---


## Watson Discovery 


Connect to the Watson Discovery api
:::note[Parameters]

- **operation**: The Discovery operation

- **payload**: The JSON to send to Discovery

- **url**: The url. Leave blank if you have configured Discovery as your Seek KB and want to use that url.

- **apiKey**: The apiKey. Leave blank if you have configured Discovery as your Seek KB and want to use that apiKey.
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - ES KB Add Document — chunk, embed and index a document into Elasticsearch (not in the node menu)
-->
