/**
 * Simple queue with max size.
 */
class BoundedQueue {
    // Creates the queue
    constructor(maxSize = 1000) {
      this.maxSize = maxSize;
      this.backingArray = [];
    }

    // Adds element to back of queue, removing front element if at max size.
    push(element) {
      if (this.backingArray.length >= this.maxSize) {
        this.backingArray.shift();
      }
      this.backingArray.push(element);
      return undefined;
    }

    // Removes front element.
    pop() {
      return this.backingArray.shift();
    }

    // Empty queue.
    clear() {
      this.backingArray.length = 0;
      return undefined;
    }

    // Return array with all elements in queue in order.
    getAll() {
        return this.backingArray;
    }
  }