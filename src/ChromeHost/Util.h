
#pragma once

#include "stdafx.h"
#include <queue>
#include <mutex>
#include <condition_variable>
#include <stdexcept>

/**
 * Utf8 verification. Returns false if string is invalid.
 */
static bool utf8string_check(unsigned char *s);

/**
* Helper to safely access a propery that may be null/unset in a json object.
*/
template<typename T> T defaultValue(nlohmann::json obj, const typename nlohmann::json::object_t::key_type& key, const T& default_value) {
  if (obj.is_null()) {
    return default_value;
  }

  nlohmann::json v = obj[key];

  if (v.is_null()) {
    return default_value;
  }

  return v;
}

/**
 * Helper that converts device info into json - by coping into a specific json element.
 */
void setDeviceInfo(nlohmann::json& dest, const DeviceInfo& src, const DynamicDeviceInfo& dynSrc);

/**
 * Helper for printing vectors
 */
template <class T>
std::ostream& operator <<(std::ostream& os, const std::vector<T>& v) 
{
    os << "[";
    for (typename std::vector<T>::const_iterator i = v.begin(); i != v.end(); ++i)
    {
        os << " " << *i;
    }
    os << "]";

    return os;
}

/**
 * Thread safe FIFO-queue utility.
 */
template <class T>
class ThreadSafeQueue
{  
  private:
  mutable std::mutex m;
  std::queue<T *> backingQueue;
  std::condition_variable cond;
  bool _closed;

  public:
  ThreadSafeQueue()
    : backingQueue(), m(), cond(), _closed(false) {}

  ~ThreadSafeQueue() {}

  /**
   * Add element to queue. 
   * Ignored if queue has been closed.
   */
  void enqueue(T * const t)
  {
    std::lock_guard<std::mutex> lock(m);
    if (!_closed) {
      backingQueue.push(t);
      cond.notify_one();
    }
  }

  /**
   * Get the first element or wait until available if empty 
   * Returns nullptr if queue has been closed.
   **/
  T* const dequeue()
  {
    std::unique_lock<std::mutex> lock(m);

	do {
		cond.wait_for(lock, std::chrono::milliseconds(500));
		if (_closed) {
			return nullptr;
		}
		else if (!backingQueue.empty()) {
			T* val = backingQueue.front();
			backingQueue.pop();
			return val;
		}
	} while (true);
  }

  /**
   * Get number of elements waiting in queue.
   **/
  std::size_t size() const
  {
    std::unique_lock<std::mutex> lock(m);
    return backingQueue.size();
  }

  /**
  * Check if queue has been closed.
  */
  bool closed() const 
  {
    std::unique_lock<std::mutex> lock(m);
    return _closed;
  }

  /**
   * Close queue - cause and waiting threads to wake up.
   */
  void stop() {
    std::unique_lock<std::mutex> lock(m);
	_closed = true;
    backingQueue = {};
    cond.notify_all();
  }
};
