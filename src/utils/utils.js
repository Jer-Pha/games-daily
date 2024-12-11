export const sanitizeId = (text) => {
  let sanitizedId = text.replace(/[^a-z0-9]+/gi, "-");
  if (/^[^a-z]/gi.test(sanitizedId)) {
    // Add a prefix if it starts with a non-letter
    sanitizedId = "section-" + sanitizedId;
  }
  return sanitizedId;
};
