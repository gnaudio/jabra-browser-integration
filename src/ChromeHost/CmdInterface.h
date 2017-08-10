#pragma once

#include <string>

class CmdInterface
{
public:
  virtual bool CanExecute(std::string cmd) = 0;
  virtual void Execute(std::string cmd) = 0;

};