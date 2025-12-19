/**
 * HTML Sanitization Utility
 * 
 * Защита от XSS атак через очистку HTML контента
 * перед отображением в dangerouslySetInnerHTML
 * 
 * @module sanitize
 */

import DOMPurify from 'dompurify';

/**
 * Настройки санитизации по умолчанию
 */
const DEFAULT_CONFIG = {
  // Разрешенные HTML теги
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ],
  
  // Разрешенные атрибуты для тегов
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'width', 'height', 'target', 'rel'
  ],
  
  // Запрет data-* атрибутов (могут использоваться для XSS)
  ALLOW_DATA_ATTR: false,
  
  // Регулярное выражение для безопасных URI
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  
  // Удалить небезопасные элементы вместо экранирования
  SAFE_FOR_TEMPLATES: true,
};

/**
 * Очищает HTML от потенциально опасного контента
 * 
 * @param {string|undefined|null} dirty - HTML строка которую нужно очистить
 * @param {object} config - Опциональная кастомная конфигурация DOMPurify
 * @returns {string} Безопасная HTML строка
 * 
 * @example
 * const userInput = '<p>Hello</p><script>alert("XSS")</script>';
 * const safe = sanitizeHTML(userInput);
 * // Result: '<p>Hello</p>' (script удален)
 * 
 * @example
 * // Использование в компоненте:
 * import { sanitizeHTML } from '../utils/sanitize';
 * 
 * function NewsDetail({ content }) {
 *   return (
 *     <div 
 *       dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
 *     />
 *   );
 * }
 */
export const sanitizeHTML = (dirty, config = null) => {
  // Handle null/undefined
  if (!dirty) {
    return '';
  }
  
  // Handle non-string input
  if (typeof dirty !== 'string') {
    console.warn('sanitizeHTML: Input is not a string, converting...', typeof dirty);
    dirty = String(dirty);
  }
  
  // Merge custom config with defaults
  const finalConfig = config ? { ...DEFAULT_CONFIG, ...config } : DEFAULT_CONFIG;
  
  // Sanitize and return
  return DOMPurify.sanitize(dirty, finalConfig);
};

/**
 * Strict санитизация - разрешает только самые базовые теги
 * Используйте для пользовательских комментариев, отзывов
 * 
 * @param {string|undefined|null} dirty - HTML строка для очистки
 * @returns {string} Безопасная HTML строка с минимальным форматированием
 */
export const sanitizeStrict = (dirty) => {
  return sanitizeHTML(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Plain text - удаляет ВСЕ HTML теги
 * Используйте для title, meta descriptions
 * 
 * @param {string|undefined|null} dirty - HTML строка для очистки
 * @returns {string} Чистый текст без HTML
 */
export const stripHTML = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Санитизация URL для безопасного использования в href/src
 * 
 * @param {string|undefined|null} url - URL для проверки
 * @returns {string} Безопасный URL или пустая строка
 */
export const sanitizeURL = (url) => {
  if (!url) return '';
  
  const sanitized = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  // Проверка на javascript: и data: протоколы
  const dangerous = /^(javascript|data|vbscript):/i;
  if (dangerous.test(sanitized)) {
    console.warn('Dangerous URL detected and blocked:', url);
    return '';
  }
  
  return sanitized;
};

export default {
  sanitizeHTML,
  sanitizeStrict,
  stripHTML,
  sanitizeURL,
};
