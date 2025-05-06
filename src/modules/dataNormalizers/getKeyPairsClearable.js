export default (key, type) => {
  const keyName = type === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE';
  return key
    .replace(`-----BEGIN ${keyName} KEY-----`, '')
    .replace(`-----END ${keyName} KEY-----`, '')
    .trim();
};
