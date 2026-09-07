(() => {
  function parse(key, fallback) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;

    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  window.appStorage = {
    readObject(key) {
      const value = parse(key, {});
      return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
    },

    readArray(key) {
      const value = parse(key, []);
      return Array.isArray(value) ? value : [];
    },

    writeObject(key, value) {
      localStorage.setItem(key, JSON.stringify(value || {}));
    }
  };
})();
