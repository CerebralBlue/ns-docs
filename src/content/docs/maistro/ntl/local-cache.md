---
title: "Local Cache"
description: "Read from local cache :::note[Parameters]"
---

## Read Cache 


Read from local cache
:::note[Parameters]

- **index**: The index

- **key**: The key
:::

```text
{{ readCacheKey  | index: "specificIndex" | key: "specificKey" }}
```



    

---


## Write Cache 


Write a key to local cache. Pass a single string, an array, or values separated by comma or newline
:::note[Parameters]

- **index**: The index

- **key**: The key

- **value**: The Value
:::

```text
{{ writeCacheKey  | index: "specificIndex" | key: "specificKey" | value: "specificValue" }}
```

    

---


## Delete Cache Key 


Delete a key from local cache
:::note[Parameters]

- **index**: The index

- **key**: The key
:::

```text
{{ deleteCacheKey  | index: "specificIndex" | key: "specificKey" }}
```

    

---


## Delete Cache Index 


Delete an index from local cache
:::note[Parameters]

- **index**: The index
:::

```text
{{ deleteCacheIndex  | index: "specificIndex" }}
```

    

---


## Search Cache 


Search an index in local cache
:::note[Parameters]

- **index**: The index

- **value**: The search value
:::

```text
{{ searchCacheIndex  | index: "specificIndex" | value: "specificValue" }}
```


---


## Phonetic Search Cache 


Phonetic search an index in local cache
:::note[Parameters]

- **index**: The index

- **value**: The search value
:::

```text
{{ phoneticSearchCacheIndex  | index: "specificIndex" | value: "specificValue"  }}
```


    

---


## Write Phonetic Cache 


Write a value to local cache with automatic phonetic keying. Takes either node input or defined value. Pass a single string, an array, or values separated by comma or newline
:::note[Parameters]

- **index**: The index

- **value**: The Value
:::

```text
{{ writePhoneticCacheKey  | index: "specificIndex" | value: "specificValue" }}
```
