function notNull(value, name) {
  if(value === null || value === undefined) {
    throw `${name} cannot be null or undefined`;
  }
  return value;
}

const env = {
  WEB3_URL: notNull(process.env.WEB3_URL, "WEB3_URL"),
};

export default env
