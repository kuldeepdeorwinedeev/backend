import sanitizeHtml from "sanitize-html";

function sanitizeRequestBodyData(body) {
  const sanitizedData = {};
  for (const key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      sanitizedData[key] = sanitizeHtml(body[key]);
    }
  }
  return sanitizedData;
}

export default sanitizeRequestBodyData;
