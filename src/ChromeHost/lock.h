#pragma once

#include <mutex>

// A class with implements RAII
class lock
{
  std::mutex &m_;

public:
  lock(std::mutex &m)
    : m_(m)
  {
    m.lock();
  }

  ~lock()
  {
    m_.unlock();
  }
};
