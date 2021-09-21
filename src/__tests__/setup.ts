import { noop } from 'lodash';

const DOCUMENT_MOCK_SIZE = 1000;

// hook 所有 HTMLElement 的 scrollIntoView 方法
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  get() {
    return noop;
  }
});

// hook getBoundingClientRect 方法
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  get() {
    const targetElement = this;
    return function() {
      const KEYS = [
        'height', 'bottom', 'left', 'right', 'top', 'width'
      ];
      const res = {};
      for (const key of KEYS) {
        const v: string = targetElement.style[key];
        if (!v && !v.endsWith('px')) {
          res[key] = 0;
        } else {
          res[key] = parseInt(v.slice(0, -2), 10);
        }
      }
      return res;
    };
  }
});

// hook document 的相关参数, 例如视口的宽度
Object.defineProperties(document.documentElement, {
  scrollHeight: {
    get(): any {
      return DOCUMENT_MOCK_SIZE;
    }
  },
  scrollWidth: {
    get(): any {
      return DOCUMENT_MOCK_SIZE;
    }
  },
  scrollTop: {
    get(): any {
      return 0;
    }
  },
  scrollLeft: {
    get(): any {
      return 0;
    }
  }
});
