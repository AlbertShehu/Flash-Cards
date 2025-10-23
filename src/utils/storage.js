// Utility functions for localStorage management
const SETTINGS_KEY = 'flash-math-settings';

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export function loadSettings(defaultSettings) {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default settings to ensure all properties exist
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
}

export function clearSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing settings:', error);
    return false;
  }
}
