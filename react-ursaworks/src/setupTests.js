import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver (used by Home.jsx).
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub;
