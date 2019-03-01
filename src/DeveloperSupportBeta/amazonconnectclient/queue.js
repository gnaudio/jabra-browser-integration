/**
 * Simple queue with max size.
 */
class BoundedQueue extends Array {
    // Creates the queue
    constructor(maxSize = 1000) {
      super();
      this.maxSize = maxSize;
    }

    // Adds element to back of queue, removing front element if at max size.
    push(element) {
      if (this.length >= this.maxSize) {
        this.shift();
      }
      super.push(element);
      return undefined;
    }

    // Removes front element.
    pop() {
      return this.backingArray.shift();
    }

    // Remove all elements.
    clear() {
      this.backingArray.length = 0;
      return undefined;
    }
 
    // Remove all elements but the back element.
    clearAllButLast() {
        if (this.length > 1) {
          this.splice(0, this.length-1);
        }
        return undefined;
    }
  }