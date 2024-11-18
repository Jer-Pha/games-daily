export const sanitizeId = (text) => {
  let sanitizedId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (/^[^a-z]/.test(sanitizedId)) {
    // Add a prefix if it starts with a non-letter
    sanitizedId = "section-" + sanitizedId;
  }
  return sanitizedId;
};
