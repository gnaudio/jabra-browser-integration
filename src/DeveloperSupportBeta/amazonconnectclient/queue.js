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

    // Lookup the first element (without poping)
    peekFront() {
      return this.backingArray.length>0 ? this.backingArray[0] : undefined;
    }

    // Lookup the last pushed element (without poping)
    peekBack() {
        return this.backingArray.length>0 ? this.backingArray[this.backingArray.length - 1] : undefined;
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