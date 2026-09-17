---
title: "Upload Data"
description: "Read a local document :::note[Parameters]"
---

## Use Document 


Read a local document
:::note[Parameters]

- **name**: The document name
:::

![dropdown](/img/maistro/ntl/upload-data/dropdown.png)

    

---

## Upload Document 



Uploading a document works in two steps. When you click the `Upload Document` button, you are presented with a file selector to select a local document for upload. Some supported files are .docx, .doc, .pdf, .txt, .csv, .json, and .xlsx.

mAIstro will automatically run OCR processing if a PDF is uploaded, but returns no text contents.

After the document is successfully uploaded, it is available in the `Upload Document` pane:

![upload_document](/img/maistro/ntl/upload-data/ntl_1.png)

The uploaded document can then be used with the following syntax:

```
{{ doc|name:output.csv }}
```


:::note[Parameters]
- **File Upload**: The file to be processed.
:::

---



---

## Upload & OCR 



**mAIstro’s** OCR feature automatically processes image-based PDFs and images, converting them into searchable, editable text.

OCR'ing a document works in two steps. When you click the `Upload & OCR` button, you are presented with a file selector to select a local document for upload. Some supported files are .pdf, .png, .jpeg.

After the document is successfully uploaded, it is available in the `Upload Document` pane:

![ocr_screenshot](/img/maistro/ntl/upload-data/ocr-image.png)

The uploaded document or image can then be used with the following syntax:

```
{{ doc|name:resume.pdf }}
```

:::note[Parameters]
- **File Upload**: PDF or image file to be processed with OCR.
:::

<details>
<summary>Example 1: Using OCR with PDF Files</summary>


1. Go to **Upload Data** in mAIstro.

2. Select **Upload Document** or **Upload & OCR** and choose your PDF file.

3. OCR will be automatically applied, transforming the document into searchable text.

**NTL Snippet:**
  ```python
  {{ doc | name: "example.pdf" }}
  {{ LLM | prompt: "List names in this document:" | cache: "true" }}
  ```

</details>

<details>
<summary>Example 2: Using OCR with Image Files</summary>


1. Go to **Upload Data** in mAIstro.

2. Select **Upload & OCR** to upload an image file.

3. OCR processing starts automatically, converting the image into searchable text.

**NTL Snippet:**
  ```python
  {{ doc  | name: "image.png" }}
  {{ LLM | prompt: "List names in this document:" | cache: "true" }}
  ```

</details>

---



---


## Delete Document 


Delete a local file.
:::note[Parameters]

- **file**: The filename
:::

![deletion](/img/maistro/ntl/upload-data/deletion.png)
