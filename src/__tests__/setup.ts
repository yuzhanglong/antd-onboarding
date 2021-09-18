const DOCUMENT_MOCK_SIZE = 1000;

const documentElement = document.documentElement;


// hook 所有 HTMLElement 的 scrollIntoView 方法
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  get: function() {
    return () => {
      console.log('scrollIntoView was called!');
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
      return DOCUMENT_MOCK_SIZE;
    }
  },
  scrollLeft: {
    get(): any {
      return DOCUMENT_MOCK_SIZE;
    }
  }
});


