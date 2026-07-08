function toDateOnly(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error("Invalid date");
    error.status = 400;
    throw error;
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateKey(value = new Date()) {
  return toDateOnly(value).toISOString().slice(0, 10);
}

module.exports = { dateKey, toDateOnly };
